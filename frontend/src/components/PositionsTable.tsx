import React from 'react';
import { Layers, Edit3 } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { computePositionPnL } from '../services/dealModel';

export const PositionsTable: React.FC = () => {
  const { positions, setSelectedStock, openPriceModal } = useTradingStore();

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-the border border-vien rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-vien">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-tot" />
          <h2 className="text-base font-bold text-chu">Danh Mục Cổ Phiếu Nắm Giữ</h2>
        </div>
        <span className="text-xs text-chu-phu font-mono">
          {positions.length} mã đang sở hữu
        </span>
      </div>

      {positions.length === 0 ? (
        <div className="py-12 text-center text-chu-mo">
          <Layers className="h-10 w-10 mx-auto stroke-1 opacity-40 mb-2" />
          <p className="text-sm">Chưa có cổ phiếu nào trong danh mục.</p>
          <p className="text-xs text-chu-mo mt-1">Hãy đặt lệnh MUA ở bảng bên cạnh để bắt đầu tích luỹ vị thế.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-vien text-chu-phu uppercase tracking-wider font-sans font-semibold">
                <th className="pb-3 px-2">Mã CP</th>
                <th className="pb-3 px-2 text-right">Tổng KL</th>
                <th className="pb-3 px-2 text-right text-tot">Khả Dụng</th>
                <th className="pb-3 px-2 text-right text-canh-bao">T+1</th>
                <th className="pb-3 px-2 text-right text-nhan-chu">T+2</th>
                <th className="pb-3 px-2 text-right text-chu-phu" title="Giá mua bình quân gia quyền ban đầu">Giá Vốn Mua</th>
                <th className="pb-3 px-2 text-right text-canh-bao" title="Giá hòa vốn Deal thực tế (đã bao gồm lãi vay Margin và phí thuế)">Giá Hòa Vốn</th>
                <th className="pb-3 px-2 text-right">Giá Thị Trường</th>
                <th className="pb-3 px-2 text-right">Tổng Giá Trị</th>
                <th className="pb-3 px-2 text-right">Lãi / Lỗ</th>
                <th className="pb-3 px-2 text-center font-sans">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-the2">
              {positions.map((pos) => {
                const isProfit = (pos.unrealized_pnl || 0) >= 0;
                /* Giá hòa vốn lấy từ dealModel (nguồn sự thật), không còn ước lượng
                   bằng hệ số cố định khi thiếu dữ liệu — cách cũ từng khiến app hiện
                   15.982 trong khi giá hòa vốn thật là 15.925. */
                const breakevenVal =
                  pos.breakeven_price ??
                  computePositionPnL(pos.symbol, pos.total_quantity, pos.avg_price, pos.market_price, new Date())
                    .breakevenPrice;
                return (
                  <tr key={pos.symbol} className="hover:bg-the2 transition group">
                    {/* Mã CP */}
                    <td className="py-3.5 px-2 font-bold text-chu text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{pos.symbol}</span>
                      </div>
                    </td>

                    {/* Tổng khối lượng */}
                    <td className="py-3.5 px-2 text-right font-bold text-chu">
                      {formatNumber(pos.total_quantity)}
                    </td>

                    {/* Khả dụng */}
                    <td className="py-3.5 px-2 text-right font-bold text-tot bg-tot-nen rounded">
                      {formatNumber(pos.available_quantity)}
                    </td>

                    {/* T+1 */}
                    <td className="py-3.5 px-2 text-right text-canh-bao">
                      {formatNumber(pos.t1_quantity)}
                    </td>

                    {/* T+2 */}
                    <td className="py-3.5 px-2 text-right text-nhan-chu">
                      {formatNumber(pos.t2_quantity)}
                    </td>

                    {/* Giá vốn mua ban đầu */}
                    <td className="py-3.5 px-2 text-right font-semibold text-chu-phu">
                      {formatNumber(pos.avg_price || pos.market_price)}
                    </td>

                    {/* Giá hòa vốn Deal (bao gồm lãi vay Margin và phí thuế) */}
                    <td className="py-3.5 px-2 text-right font-bold text-canh-bao">
                      <span className="px-1.5 py-0.5 rounded bg-canh-bao-nen border border-vien">
                        {formatNumber(breakevenVal)}
                      </span>
                    </td>

                    {/* Giá thị trường & nút sửa */}
                    <td className="py-3.5 px-2 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end group/edit">
                        <span className="font-bold text-chu">{formatNumber(pos.market_price)}</span>
                        <button
                          onClick={() => openPriceModal(pos.symbol, pos.market_price)}
                          className="p-1 rounded text-chu-mo hover:text-tot hover:bg-the2 transition"
                          title="Cập nhật giá thị trường"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Tổng giá trị */}
                    <td className="py-3.5 px-2 text-right text-chu font-semibold">
                      {formatNumber(pos.market_value)}
                    </td>

                    {/* Lãi / Lỗ */}
                    <td className="py-3.5 px-2 text-right">
                      <div className={`font-bold ${isProfit ? 'text-tot' : 'text-loi'}`}>
                        {isProfit ? '+' : ''}{formatNumber(pos.unrealized_pnl)}
                      </div>
                      <div className={`text-[10px] ${isProfit ? 'text-tot' : 'text-loi'}`}>
                        {isProfit ? '+' : ''}{(pos.unrealized_pnl_pct || 0).toFixed(2)}%
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedStock(pos.symbol, pos.market_price, 'BUY')}
                          className="px-2 py-1 rounded bg-tot-nen hover:bg-tot-nen text-tot text-[11px] font-sans font-semibold border border-vien transition"
                          title="Mua thêm vào form đặt lệnh"
                        >
                          Mua
                        </button>
                        <button
                          onClick={() => setSelectedStock(pos.symbol, pos.market_price, 'SELL')}
                          disabled={pos.available_quantity <= 0}
                          className="px-2 py-1 rounded bg-loi-nen hover:bg-loi-nen text-loi text-[11px] font-sans font-semibold border border-vien transition disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Bán nhanh vào form đặt lệnh"
                        >
                          Bán
                        </button>
                        <button
                          onClick={() => useTradingStore.getState().navigateToStock(pos.symbol, 'DECISION')}
                          className="px-2 py-1 rounded bg-canh-bao-nen hover:bg-canh-bao-nen text-canh-bao text-[11px] font-sans font-semibold border border-vien transition"
                          title="Chuyển sang Quản trị vị thế & Hòa vốn"
                        >
                          Hòa Vốn
                        </button>
                        <button
                          onClick={() => useTradingStore.getState().navigateToStock(pos.symbol, 'MARKET')}
                          className="px-2 py-1 rounded bg-the2 hover:bg-the2 text-nhan-chu text-[11px] font-sans font-semibold border border-vien transition"
                          title="Chuyển sang Bảng giá & Biểu đồ nến"
                        >
                          Nến
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
