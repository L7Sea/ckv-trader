import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { FirestoreClient, FirestoreWrite } from './firestore';
import { OrderRequestPayload, Portfolio, Position, Transaction } from './types';

type Bindings = {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_API_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Kích hoạt CORS để Frontend React gọi API không bị chặn
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
);

// Helper khởi tạo Firestore Client
function getFirestore(c: any): FirestoreClient {
  const projectId = c.env.FIREBASE_PROJECT_ID || 'ckv-stock-manager';
  const apiKey = c.env.FIREBASE_API_KEY;
  return new FirestoreClient(projectId, apiKey);
}

// -------------------------------------------------------------
// 1. API ĐẶT LỆNH GIAO DỊCH (BUY / SELL) - CORE TRADING ENGINE
// -------------------------------------------------------------
app.post('/api/order', async (c) => {
  try {
    const payload = await c.req.json<OrderRequestPayload>();
    const { type, symbol, price, quantity, fee = 0, tax = 0, notes = '' } = payload;
    const cleanSymbol = symbol ? symbol.trim().toUpperCase() : '';

    // Validate dữ liệu đầu vào
    if (!['BUY', 'SELL'].includes(type)) {
      return c.json({ success: false, message: 'Loại lệnh không hợp lệ (Chỉ chấp nhận BUY hoặc SELL)' }, 400);
    }
    if (!cleanSymbol) {
      return c.json({ success: false, message: 'Mã cổ phiếu không được để trống' }, 400);
    }
    if (!price || price <= 0) {
      return c.json({ success: false, message: 'Giá khớp lệnh phải lớn hơn 0' }, 400);
    }
    if (!quantity || quantity <= 0) {
      return c.json({ success: false, message: 'Khối lượng giao dịch phải lớn hơn 0' }, 400);
    }

    const firestore = getFirestore(c);
    const now = new Date().toISOString();
    const tradeDate = payload.trade_date || now.slice(0, 10);

    // 1. Lấy trạng thái Portfolio hiện tại
    let portfolio = await firestore.getDocument<Portfolio>('portfolios/default');
    if (!portfolio) {
      portfolio = {
        cash: 100000000, // Khởi tạo 100M VND nếu chưa có
        receiving_cash: 0,
        margin_debt: 0,
        total_equity: 100000000,
        total_profit_loss: 0,
        updated_at: now
      };
    }

    // 2. Lấy trạng thái Position (Vị thế cổ phiếu) hiện tại
    let position = await firestore.getDocument<Position>(`positions/${cleanSymbol}`);
    if (!position) {
      position = {
        symbol: cleanSymbol,
        available_quantity: 0,
        t1_quantity: 0,
        t2_quantity: 0,
        total_quantity: 0,
        avg_price: 0,
        market_price: price,
        market_value: 0,
        unrealized_pnl: 0,
        unrealized_pnl_pct: 0,
        updated_at: now
      };
    }

    const tradeAmount = price * quantity;
    let netAmount = 0;
    let realizedPnl = 0;
    const transactionId = crypto.randomUUID();

    // 3. LOGIC XỬ LÝ LỆNH MUA (BUY)
    if (type === 'BUY') {
      const totalBuyCost = tradeAmount + fee;
      netAmount = totalBuyCost;

      // Kiểm tra sức mua
      if (portfolio.cash < totalBuyCost) {
        return c.json(
          {
            success: false,
            message: `Không đủ sức mua! Tổng tiền cần: ${totalBuyCost.toLocaleString()}đ, Tiền mặt hiện có: ${portfolio.cash.toLocaleString()}đ`
          },
          400
        );
      }

      // Tính giá vốn bình quân gia quyền mới (Weighted Average Cost Price)
      const oldTotalQty = (position.available_quantity || 0) + (position.t1_quantity || 0) + (position.t2_quantity || 0);
      const oldCostBasis = oldTotalQty * (position.avg_price || 0);
      const newTotalQty = oldTotalQty + quantity;
      const newAvgPrice = newTotalQty > 0 ? (oldCostBasis + totalBuyCost) / newTotalQty : 0;

      // Cập nhật Danh mục
      portfolio.cash -= totalBuyCost;
      portfolio.updated_at = now;

      // Cập nhật Vị thế (Cổ phiếu mới mua vào rổ T+2)
      position.t2_quantity = (position.t2_quantity || 0) + quantity;
      position.total_quantity = newTotalQty;
      position.avg_price = Math.round(newAvgPrice * 100) / 100;
      position.market_price = price;
      position.market_value = newTotalQty * position.market_price;
      position.unrealized_pnl = (position.market_price - position.avg_price) * newTotalQty;
      position.unrealized_pnl_pct =
        position.avg_price > 0 ? (position.unrealized_pnl / (newTotalQty * position.avg_price)) * 100 : 0;
      position.updated_at = now;
    }

    // 4. LOGIC XỬ LÝ LỆNH BÁN (SELL)
    if (type === 'SELL') {
      const availableQty = position.available_quantity || 0;

      // Kiểm tra số lượng cổ phiếu khả dụng (KHÔNG ĐƯỢC BÁN HÀNG T1, T2)
      if (availableQty < quantity) {
        return c.json(
          {
            success: false,
            message: `Không đủ cổ phiếu khả dụng để bán! Yêu cầu: ${quantity.toLocaleString()}, Khả dụng: ${availableQty.toLocaleString()} (Cổ phiếu T1: ${position.t1_quantity || 0}, T2: ${position.t2_quantity || 0} chưa về)`
          },
          400
        );
      }

      const totalSellReceived = tradeAmount - fee - tax;
      netAmount = totalSellReceived;

      // Tính lãi/lỗ thực hiện (Realized PnL)
      realizedPnl = (price - position.avg_price) * quantity - fee - tax;

      // Cập nhật Vị thế
      position.available_quantity -= quantity;
      const remainingTotalQty =
        position.available_quantity + (position.t1_quantity || 0) + (position.t2_quantity || 0);
      position.total_quantity = remainingTotalQty;
      position.market_price = price;
      position.market_value = remainingTotalQty * position.market_price;
      position.unrealized_pnl =
        remainingTotalQty > 0 ? (position.market_price - position.avg_price) * remainingTotalQty : 0;
      position.unrealized_pnl_pct =
        remainingTotalQty > 0 && position.avg_price > 0
          ? (position.unrealized_pnl / (remainingTotalQty * position.avg_price)) * 100
          : 0;
      position.updated_at = now;

      // Cập nhật Danh mục (Tiền bán vào rổ "Tiền chờ về T+2.5")
      portfolio.receiving_cash = (portfolio.receiving_cash || 0) + totalSellReceived;
      portfolio.total_profit_loss = (portfolio.total_profit_loss || 0) + realizedPnl;
      portfolio.updated_at = now;
    }

    // 5. Tạo bản ghi Nhật ký giao dịch (Transaction)
    const transaction: Transaction = {
      id: transactionId,
      type,
      symbol: cleanSymbol,
      price,
      quantity,
      fee,
      tax,
      total_amount: tradeAmount,
      net_amount: netAmount,
      avg_price_at_trade: position.avg_price,
      realized_pnl: type === 'SELL' ? realizedPnl : undefined,
      timestamp: now,
      trade_date: tradeDate,
      notes
    };

    // 6. ĐÓNG GÓI BATCH WRITE (ATOMIC) LÊN FIRESTORE
    const writes: FirestoreWrite[] = [
      firestore.createUpdateWrite('portfolios', 'default', portfolio),
      firestore.createUpdateWrite('positions', cleanSymbol, position),
      firestore.createUpdateWrite('transactions', transactionId, transaction)
    ];

    await firestore.commitBatch(writes);

    return c.json({
      success: true,
      message: `Khớp lệnh ${type} ${quantity.toLocaleString()} ${cleanSymbol} thành công!`,
      data: {
        transaction,
        position,
        portfolio
      }
    });
  } catch (error: any) {
    console.error('Order error:', error);
    return c.json(
      {
        success: false,
        message: `Lỗi xử lý giao dịch: ${error.message || 'Lỗi không xác định'}`
      },
      500
    );
  }
});

// -------------------------------------------------------------
// 2. API LẤY TỔNG QUAN TÀI SẢN (PORTFOLIO)
// -------------------------------------------------------------
app.get('/api/portfolio', async (c) => {
  try {
    const firestore = getFirestore(c);
    let portfolio = await firestore.getDocument<Portfolio>('portfolios/default');
    if (!portfolio) {
      portfolio = {
        cash: 100000000,
        receiving_cash: 0,
        margin_debt: 0,
        total_equity: 100000000,
        total_profit_loss: 0,
        updated_at: new Date().toISOString()
      };
    }

    // Tính lại Tổng tài sản ròng = Tiền mặt + Tiền chờ về + Tổng giá trị thị trường CP - Nợ
    const positions = await firestore.getCollection<Position>('positions');
    const totalStockMarketValue = positions.reduce((sum, p) => sum + (p.market_value || 0), 0);
    portfolio.total_equity =
      (portfolio.cash || 0) + (portfolio.receiving_cash || 0) + totalStockMarketValue - (portfolio.margin_debt || 0);

    return c.json({ success: true, data: portfolio });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// -------------------------------------------------------------
// 3. API LẤY DANH SÁCH VỊ THẾ CỔ PHIẾU (POSITIONS)
// -------------------------------------------------------------
app.get('/api/positions', async (c) => {
  try {
    const firestore = getFirestore(c);
    const positions = await firestore.getCollection<Position>('positions');
    // Chỉ lấy các mã còn nắm giữ hoặc vừa giao dịch
    const activePositions = positions.filter((p) => (p.total_quantity || 0) > 0);
    return c.json({ success: true, data: activePositions });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// -------------------------------------------------------------
// 4. API LẤY LỊCH SỬ GIAO DỊCH (TRANSACTIONS)
// -------------------------------------------------------------
app.get('/api/transactions', async (c) => {
  try {
    const firestore = getFirestore(c);
    const transactions = await firestore.getCollection<Transaction>('transactions');
    // Sắp xếp giao dịch mới nhất lên đầu
    transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ success: true, data: transactions });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// -------------------------------------------------------------
// 5. API CẬP NHẬT GIÁ THỊ TRƯỜNG THỦ CÔNG (MARKET PRICE)
// -------------------------------------------------------------
app.post('/api/positions/update-price', async (c) => {
  try {
    const { symbol, market_price } = await c.req.json<{ symbol: string; market_price: number }>();
    if (!symbol || !market_price || market_price <= 0) {
      return c.json({ success: false, message: 'Dữ liệu mã hoặc giá thị trường không hợp lệ' }, 400);
    }
    const cleanSymbol = symbol.trim().toUpperCase();
    const firestore = getFirestore(c);
    const position = await firestore.getDocument<Position>(`positions/${cleanSymbol}`);
    if (!position) {
      return c.json({ success: false, message: `Không tìm thấy vị thế mã ${cleanSymbol}` }, 404);
    }

    position.market_price = market_price;
    position.market_value = (position.total_quantity || 0) * market_price;
    position.unrealized_pnl = (market_price - position.avg_price) * (position.total_quantity || 0);
    position.unrealized_pnl_pct =
      position.avg_price > 0 ? (position.unrealized_pnl / (position.total_quantity * position.avg_price)) * 100 : 0;
    position.updated_at = new Date().toISOString();

    const write = firestore.createUpdateWrite('positions', cleanSymbol, position);
    await firestore.commitBatch([write]);

    return c.json({ success: true, message: `Đã cập nhật giá thị trường ${cleanSymbol} thành ${market_price.toLocaleString()}đ`, data: position });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// -------------------------------------------------------------
// 6. API CHUYỂN TRẠNG THÁI NGÀY MỚI (T+2.5 SETTLEMENT)
// T2 -> T1 -> Sẵn sàng giao dịch; Tiền chờ về -> Tiền mặt khả dụng
// -------------------------------------------------------------
app.post('/api/settle-day', async (c) => {
  try {
    const firestore = getFirestore(c);
    const now = new Date().toISOString();
    const writes: FirestoreWrite[] = [];

    // 1. Chuyển trạng thái tiền
    const portfolio = await firestore.getDocument<Portfolio>('portfolios/default');
    if (portfolio) {
      portfolio.cash = (portfolio.cash || 0) + (portfolio.receiving_cash || 0);
      portfolio.receiving_cash = 0;
      portfolio.updated_at = now;
      writes.push(firestore.createUpdateWrite('portfolios', 'default', portfolio));
    }

    // 2. Chuyển trạng thái cổ phiếu T+2 -> T+1 -> Available
    const positions = await firestore.getCollection<Position>('positions');
    for (const pos of positions) {
      if ((pos.t1_quantity || 0) > 0 || (pos.t2_quantity || 0) > 0) {
        pos.available_quantity = (pos.available_quantity || 0) + (pos.t1_quantity || 0);
        pos.t1_quantity = pos.t2_quantity || 0;
        pos.t2_quantity = 0;
        pos.updated_at = now;
        writes.push(firestore.createUpdateWrite('positions', pos.symbol, pos));
      }
    }

    if (writes.length > 0) {
      await firestore.commitBatch(writes);
    }

    return c.json({
      success: true,
      message: 'Đã hoàn tất thanh toán T+2.5: Cổ phiếu T1 đã về tài khoản khả dụng, Tiền chờ về đã chuyển sang Tiền mặt!'
    });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// -------------------------------------------------------------
// 7. API NẠP / RÚT TIỀN MẶT (DEPOSIT / WITHDRAW)
// -------------------------------------------------------------
app.post('/api/portfolio/cash-adjust', async (c) => {
  try {
    const { amount, action } = await c.req.json<{ amount: number; action: 'DEPOSIT' | 'WITHDRAW' }>();
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Số tiền phải lớn hơn 0' }, 400);
    }
    const firestore = getFirestore(c);
    let portfolio = await firestore.getDocument<Portfolio>('portfolios/default');
    if (!portfolio) {
      portfolio = {
        cash: 0,
        receiving_cash: 0,
        margin_debt: 0,
        total_equity: 0,
        total_profit_loss: 0,
        updated_at: new Date().toISOString()
      };
    }

    if (action === 'WITHDRAW' && (portfolio.cash || 0) < amount) {
      return c.json({ success: false, message: 'Số dư tiền mặt không đủ để rút' }, 400);
    }

    if (action === 'DEPOSIT') {
      portfolio.cash = (portfolio.cash || 0) + amount;
    } else {
      portfolio.cash = (portfolio.cash || 0) - amount;
    }
    portfolio.updated_at = new Date().toISOString();

    const write = firestore.createUpdateWrite('portfolios', 'default', portfolio);
    await firestore.commitBatch([write]);

    return c.json({
      success: true,
      message: `${action === 'DEPOSIT' ? 'Nạp' : 'Rút'} ${amount.toLocaleString()}đ thành công!`,
      data: portfolio
    });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
