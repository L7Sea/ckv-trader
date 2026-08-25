/**
 * CKV PRO TRADER - 300 CỔ PHIẾU ĐẦU NGÀNH (100 HOSE + 100 HNX + 100 UPCOM)
 * Dữ liệu chọn lọc thanh khoản và vốn hóa dẫn đầu 3 sàn chứng khoán Việt Nam.
 */

export interface MarketStock300 {
  symbol: string;
  name: string;
  sector: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM';
  price: number;
  refPrice: number;
  ceilPrice: number;
  floorPrice: number;
  volume: number;
  change: number;
  changePct: number;
  pe: number;
  pb: number;
  roe: number;
  eps: number;
  consensusScore: number; // 0 - 100
  aiSignal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL';
  dcaRecommended?: boolean;
}

// 1. 100 MÃ HOSE ĐẦU NGÀNH
export const HOSE_100: MarketStock300[] = [
  { symbol: 'ACB', name: 'Á Châu ACB', sector: 'Ngân hàng', exchange: 'HOSE', price: 22200, refPrice: 22500, ceilPrice: 24050, floorPrice: 20950, volume: 7780000, change: -300, changePct: -1.33, pe: 6.8, pb: 1.3, roe: 21.5, eps: 3260, consensusScore: 84, aiSignal: 'BUY' },
  { symbol: 'BID', name: 'BIDV', sector: 'Ngân hàng', exchange: 'HOSE', price: 36700, refPrice: 36900, ceilPrice: 39450, floorPrice: 34350, volume: 4031600, change: -200, changePct: -0.54, pe: 11.2, pb: 1.8, roe: 17.8, eps: 3270, consensusScore: 78, aiSignal: 'BUY' },
  { symbol: 'CTG', name: 'VietinBank', sector: 'Ngân hàng', exchange: 'HOSE', price: 31500, refPrice: 31800, ceilPrice: 34000, floorPrice: 29600, volume: 7928400, change: -300, changePct: -0.94, pe: 8.4, pb: 1.4, roe: 16.5, eps: 3750, consensusScore: 82, aiSignal: 'BUY' },
  { symbol: 'TCB', name: 'Techcombank', sector: 'Ngân hàng', exchange: 'HOSE', price: 31300, refPrice: 31450, ceilPrice: 33650, floorPrice: 29250, volume: 14732000, change: -150, changePct: -0.48, pe: 7.2, pb: 1.1, roe: 17.2, eps: 4350, consensusScore: 89, aiSignal: 'STRONG_BUY' },
  { symbol: 'MBB', name: 'Ngân hàng Quân Đội', sector: 'Ngân hàng', exchange: 'HOSE', price: 20650, refPrice: 20750, ceilPrice: 22200, floorPrice: 19300, volume: 10212100, change: -100, changePct: -0.48, pe: 5.9, pb: 1.1, roe: 22.1, eps: 3500, consensusScore: 88, aiSignal: 'STRONG_BUY' },
  { symbol: 'TPB', name: 'Tài chính Tiên Phong', sector: 'Ngân hàng', exchange: 'HOSE', price: 14450, refPrice: 14600, ceilPrice: 15600, floorPrice: 13600, volume: 8450000, change: -150, changePct: -1.03, pe: 7.4, pb: 1.0, roe: 16.2, eps: 1950, consensusScore: 86, aiSignal: 'BUY', dcaRecommended: true },
  { symbol: 'VPB', name: 'VPBank', sector: 'Ngân hàng', exchange: 'HOSE', price: 26400, refPrice: 26350, ceilPrice: 28150, floorPrice: 24550, volume: 16309200, change: 50, changePct: 0.19, pe: 10.5, pb: 1.2, roe: 14.1, eps: 2510, consensusScore: 76, aiSignal: 'BUY' },
  { symbol: 'HDB', name: 'HDBank', sector: 'Ngân hàng', exchange: 'HOSE', price: 27000, refPrice: 27400, ceilPrice: 29300, floorPrice: 25500, volume: 11433300, change: -400, changePct: -1.46, pe: 6.5, pb: 1.3, roe: 23.4, eps: 4150, consensusScore: 85, aiSignal: 'BUY' },
  { symbol: 'STB', name: 'Sacombank', sector: 'Ngân hàng', exchange: 'HOSE', price: 74200, refPrice: 74900, ceilPrice: 80100, floorPrice: 69700, volume: 3352700, change: -700, changePct: -0.93, pe: 8.1, pb: 1.2, roe: 18.3, eps: 9160, consensusScore: 80, aiSignal: 'BUY' },
  { symbol: 'VCB', name: 'Vietcombank', sector: 'Ngân hàng', exchange: 'HOSE', price: 59400, refPrice: 59200, ceilPrice: 63300, floorPrice: 55100, volume: 5577200, change: 200, changePct: 0.34, pe: 14.2, pb: 2.7, roe: 21.0, eps: 4180, consensusScore: 83, aiSignal: 'BUY' },
  { symbol: 'HPG', name: 'Tập đoàn Hòa Phát', sector: 'Thép & Vật liệu', exchange: 'HOSE', price: 21800, refPrice: 22250, ceilPrice: 23800, floorPrice: 20700, volume: 25844100, change: -450, changePct: -2.02, pe: 11.5, pb: 1.4, roe: 14.8, eps: 1890, consensusScore: 91, aiSignal: 'STRONG_BUY' },
  { symbol: 'HSG', name: 'Tập đoàn Hoa Sen', sector: 'Thép & Vật liệu', exchange: 'HOSE', price: 19850, refPrice: 20100, ceilPrice: 21500, floorPrice: 18700, volume: 12400000, change: -250, changePct: -1.24, pe: 13.1, pb: 1.2, roe: 11.2, eps: 1515, consensusScore: 79, aiSignal: 'BUY' },
  { symbol: 'NKG', name: 'Thép Nam Kim', sector: 'Thép & Vật liệu', exchange: 'HOSE', price: 20400, refPrice: 20700, ceilPrice: 22100, floorPrice: 19300, volume: 8900000, change: -300, changePct: -1.45, pe: 12.8, pb: 1.1, roe: 10.8, eps: 1590, consensusScore: 77, aiSignal: 'BUY' },
  { symbol: 'FPT', name: 'Công nghệ FPT', sector: 'Công nghệ & Viễn thông', exchange: 'HOSE', price: 70700, refPrice: 71400, ceilPrice: 76300, floorPrice: 66500, volume: 4690000, change: -700, changePct: -0.98, pe: 22.4, pb: 5.2, roe: 28.5, eps: 3150, consensusScore: 94, aiSignal: 'STRONG_BUY' },
  { symbol: 'MWG', name: 'Thế Giới Di Động', sector: 'Bán lẻ & Tiêu dùng', exchange: 'HOSE', price: 73900, refPrice: 75100, ceilPrice: 80300, floorPrice: 69900, volume: 2556400, change: -1200, changePct: -1.60, pe: 18.2, pb: 3.1, roe: 19.5, eps: 4060, consensusScore: 90, aiSignal: 'STRONG_BUY' },
  { symbol: 'FRT', name: 'Bán lẻ Kỹ thuật số FPT', sector: 'Bán lẻ & Tiêu dùng', exchange: 'HOSE', price: 165000, refPrice: 163000, ceilPrice: 174400, floorPrice: 151600, volume: 1450000, change: 2000, changePct: 1.23, pe: 35.0, pb: 7.2, roe: 24.0, eps: 4710, consensusScore: 87, aiSignal: 'BUY' },
  { symbol: 'DGW', name: 'Digiworld', sector: 'Bán lẻ & Tiêu dùng', exchange: 'HOSE', price: 54200, refPrice: 54500, ceilPrice: 58300, floorPrice: 50700, volume: 2100000, change: -300, changePct: -0.55, pe: 17.5, pb: 2.8, roe: 18.0, eps: 3090, consensusScore: 81, aiSignal: 'BUY' },
  { symbol: 'SSI', name: 'Chứng khoán SSI', sector: 'Chứng khoán', exchange: 'HOSE', price: 21250, refPrice: 21250, ceilPrice: 22700, floorPrice: 19800, volume: 30658300, change: 0, changePct: 0.00, pe: 16.5, pb: 1.8, roe: 14.5, eps: 1280, consensusScore: 89, aiSignal: 'STRONG_BUY' },
  { symbol: 'VCI', name: 'Chứng khoán Vietcap', sector: 'Chứng khoán', exchange: 'HOSE', price: 44600, refPrice: 44200, ceilPrice: 47250, floorPrice: 41150, volume: 5600000, change: 400, changePct: 0.90, pe: 18.0, pb: 2.1, roe: 15.0, eps: 2470, consensusScore: 86, aiSignal: 'BUY' },
  { symbol: 'VND', name: 'Chứng khoán VNDIRECT', sector: 'Chứng khoán', exchange: 'HOSE', price: 16800, refPrice: 17000, ceilPrice: 18150, floorPrice: 15850, volume: 18500000, change: -200, changePct: -1.18, pe: 12.4, pb: 1.2, roe: 12.0, eps: 1350, consensusScore: 75, aiSignal: 'NEUTRAL' },
  { symbol: 'HCM', name: 'Chứng khoán TP.HCM', sector: 'Chứng khoán', exchange: 'HOSE', price: 28500, refPrice: 28600, ceilPrice: 30600, floorPrice: 26600, volume: 7200000, change: -100, changePct: -0.35, pe: 15.8, pb: 1.7, roe: 14.0, eps: 1800, consensusScore: 83, aiSignal: 'BUY' },
  { symbol: 'VHM', name: 'Vinhomes', sector: 'Bất động sản', exchange: 'HOSE', price: 73600, refPrice: 73400, ceilPrice: 78500, floorPrice: 68300, volume: 9252600, change: 200, changePct: 0.27, pe: 8.5, pb: 1.3, roe: 18.2, eps: 8650, consensusScore: 82, aiSignal: 'BUY' },
  { symbol: 'VIC', name: 'Tập đoàn Vingroup', sector: 'Bất động sản', exchange: 'HOSE', price: 220500, refPrice: 214500, ceilPrice: 229500, floorPrice: 199500, volume: 10310200, change: 6000, changePct: 2.80, pe: 28.0, pb: 2.9, roe: 9.5, eps: 7870, consensusScore: 74, aiSignal: 'NEUTRAL' },
  { symbol: 'VRE', name: 'Vincom Retail', sector: 'Bất động sản', exchange: 'HOSE', price: 23100, refPrice: 23300, ceilPrice: 24900, floorPrice: 21700, volume: 6400000, change: -200, changePct: -0.86, pe: 13.0, pb: 1.3, roe: 12.8, eps: 1770, consensusScore: 79, aiSignal: 'BUY' },
  { symbol: 'KDH', name: 'Nhà Khang Điền', sector: 'Bất động sản', exchange: 'HOSE', price: 34500, refPrice: 34800, ceilPrice: 37200, floorPrice: 32400, volume: 3800000, change: -300, changePct: -0.86, pe: 24.5, pb: 1.7, roe: 8.5, eps: 1400, consensusScore: 80, aiSignal: 'BUY' },
  { symbol: 'NLG', name: 'Nam Long Group', sector: 'Bất động sản', exchange: 'HOSE', price: 38200, refPrice: 38500, ceilPrice: 41150, floorPrice: 35850, volume: 4100000, change: -300, changePct: -0.78, pe: 19.8, pb: 1.6, roe: 9.2, eps: 1930, consensusScore: 82, aiSignal: 'BUY' },
  { symbol: 'PDR', name: 'Bất động sản Phát Đạt', sector: 'Bất động sản', exchange: 'HOSE', price: 22400, refPrice: 22700, ceilPrice: 24250, floorPrice: 21150, volume: 9500000, change: -300, changePct: -1.32, pe: 26.0, pb: 1.8, roe: 7.8, eps: 860, consensusScore: 76, aiSignal: 'NEUTRAL' },
  { symbol: 'DIG', name: 'DIC Corp', sector: 'Bất động sản', exchange: 'HOSE', price: 21500, refPrice: 22000, ceilPrice: 23500, floorPrice: 20500, volume: 14200000, change: -500, changePct: -2.27, pe: 32.0, pb: 1.7, roe: 6.1, eps: 670, consensusScore: 72, aiSignal: 'NEUTRAL' },
  { symbol: 'DXG', name: 'Tập đoàn Đất Xanh', sector: 'Bất động sản', exchange: 'HOSE', price: 15300, refPrice: 15600, ceilPrice: 16650, floorPrice: 14550, volume: 11200000, change: -300, changePct: -1.92, pe: 28.5, pb: 1.1, roe: 5.4, eps: 536, consensusScore: 70, aiSignal: 'NEUTRAL' },
  { symbol: 'GAS', name: 'PV Gas', sector: 'Dầu khí & Năng lượng', exchange: 'HOSE', price: 83500, refPrice: 85000, ceilPrice: 90950, floorPrice: 79050, volume: 2125200, change: -1500, changePct: -1.76, pe: 14.5, pb: 2.6, roe: 19.2, eps: 5750, consensusScore: 84, aiSignal: 'BUY' },
  { symbol: 'PLX', name: 'Petrolimex', sector: 'Dầu khí & Năng lượng', exchange: 'HOSE', price: 39800, refPrice: 40200, ceilPrice: 43000, floorPrice: 37400, volume: 2400000, change: -400, changePct: -1.00, pe: 16.2, pb: 1.8, roe: 12.0, eps: 2450, consensusScore: 78, aiSignal: 'BUY' },
  { symbol: 'PVD', name: 'Khoan Dầu khí PVD', sector: 'Dầu khí & Năng lượng', exchange: 'HOSE', price: 25400, refPrice: 25800, ceilPrice: 27600, floorPrice: 24000, volume: 6800000, change: -400, changePct: -1.55, pe: 21.0, pb: 1.3, roe: 7.2, eps: 1210, consensusScore: 77, aiSignal: 'BUY' },
  { symbol: 'PVT', name: 'Vận tải Dầu khí PVT', sector: 'Dầu khí & Năng lượng', exchange: 'HOSE', price: 27800, refPrice: 28000, ceilPrice: 29950, floorPrice: 26050, volume: 3900000, change: -200, changePct: -0.71, pe: 9.8, pb: 1.3, roe: 15.5, eps: 2830, consensusScore: 85, aiSignal: 'BUY' },
  { symbol: 'POW', name: 'PV Power', sector: 'Dầu khí & Năng lượng', exchange: 'HOSE', price: 12100, refPrice: 12200, ceilPrice: 13050, floorPrice: 11350, volume: 15600000, change: -100, changePct: -0.82, pe: 23.0, pb: 0.9, roe: 4.8, eps: 526, consensusScore: 73, aiSignal: 'NEUTRAL' },
  { symbol: 'MSN', name: 'Tập đoàn Masan', sector: 'Bán lẻ & Tiêu dùng', exchange: 'HOSE', price: 69500, refPrice: 70000, ceilPrice: 74900, floorPrice: 65100, volume: 4643500, change: -500, changePct: -0.71, pe: 38.0, pb: 2.9, roe: 8.5, eps: 1830, consensusScore: 79, aiSignal: 'BUY' },
  { symbol: 'VNM', name: 'Vinamilk', sector: 'Bán lẻ & Tiêu dùng', exchange: 'HOSE', price: 62600, refPrice: 63200, ceilPrice: 67600, floorPrice: 58800, volume: 3343900, change: -600, changePct: -0.95, pe: 14.8, pb: 3.8, roe: 27.2, eps: 4230, consensusScore: 88, aiSignal: 'STRONG_BUY' },
  { symbol: 'PNJ', name: 'Vàng bạc Phú Nhuận', sector: 'Bán lẻ & Tiêu dùng', exchange: 'HOSE', price: 96800, refPrice: 97500, ceilPrice: 104300, floorPrice: 90700, volume: 1850000, change: -700, changePct: -0.72, pe: 16.5, pb: 3.2, roe: 22.0, eps: 5860, consensusScore: 87, aiSignal: 'BUY' },
  { symbol: 'DGC', name: 'Hóa chất Đức Giang', sector: 'Hóa chất & Phân bón', exchange: 'HOSE', price: 108000, refPrice: 109000, ceilPrice: 116600, floorPrice: 101400, volume: 2900000, change: -1000, changePct: -0.92, pe: 13.5, pb: 3.4, roe: 28.0, eps: 8000, consensusScore: 92, aiSignal: 'STRONG_BUY' },
  { symbol: 'DCM', name: 'Phân bón Cà Mau', sector: 'Hóa chất & Phân bón', exchange: 'HOSE', price: 34500, refPrice: 34900, ceilPrice: 37300, floorPrice: 32500, volume: 4200000, change: -400, changePct: -1.15, pe: 11.2, pb: 1.7, roe: 16.8, eps: 3080, consensusScore: 83, aiSignal: 'BUY' },
  { symbol: 'DPM', name: 'Đạm Phú Mỹ', sector: 'Hóa chất & Phân bón', exchange: 'HOSE', price: 33200, refPrice: 33600, ceilPrice: 35950, floorPrice: 31250, volume: 3800000, change: -400, changePct: -1.19, pe: 12.0, pb: 1.3, roe: 11.5, eps: 2760, consensusScore: 78, aiSignal: 'BUY' },
  { symbol: 'GVR', name: 'Tập đoàn Cao Su VN', sector: 'Hóa chất & Phân bón', exchange: 'HOSE', price: 32500, refPrice: 32200, ceilPrice: 34450, floorPrice: 29950, volume: 2610200, change: 300, changePct: 0.93, pe: 28.0, pb: 2.2, roe: 8.5, eps: 1160, consensusScore: 79, aiSignal: 'BUY' },
  { symbol: 'VHC', name: 'Vĩnh Hoàn (Cá tra)', sector: 'Thủy sản & Nông nghiệp', exchange: 'HOSE', price: 68500, refPrice: 69000, ceilPrice: 73800, floorPrice: 64200, volume: 1600000, change: -500, changePct: -0.72, pe: 14.0, pb: 1.8, roe: 14.2, eps: 4890, consensusScore: 84, aiSignal: 'BUY' },
  { symbol: 'ANV', name: 'Thủy sản Nam Việt', sector: 'Thủy sản & Nông nghiệp', exchange: 'HOSE', price: 31200, refPrice: 31800, ceilPrice: 34000, floorPrice: 29600, volume: 2900000, change: -600, changePct: -1.89, pe: 22.0, pb: 1.6, roe: 8.0, eps: 1410, consensusScore: 74, aiSignal: 'NEUTRAL' },
  { symbol: 'DBC', name: 'Tập đoàn Dabaco', sector: 'Thủy sản & Nông nghiệp', exchange: 'HOSE', price: 27400, refPrice: 27800, ceilPrice: 29700, floorPrice: 25900, volume: 6500000, change: -400, changePct: -1.44, pe: 15.0, pb: 1.4, roe: 11.0, eps: 1820, consensusScore: 81, aiSignal: 'BUY' },
  { symbol: 'GMD', name: 'Gemadept (Cảng biển)', sector: 'Vận tải & Logistics', exchange: 'HOSE', price: 81200, refPrice: 81500, ceilPrice: 87200, floorPrice: 75800, volume: 1750000, change: -300, changePct: -0.37, pe: 16.0, pb: 2.4, roe: 17.5, eps: 5070, consensusScore: 86, aiSignal: 'BUY' },
  { symbol: 'HAH', name: 'Vận tải Hải An', sector: 'Vận tải & Logistics', exchange: 'HOSE', price: 42800, refPrice: 43200, ceilPrice: 46200, floorPrice: 40200, volume: 3100000, change: -400, changePct: -0.93, pe: 10.5, pb: 1.5, roe: 16.0, eps: 4070, consensusScore: 87, aiSignal: 'BUY' },
  { symbol: 'REE', name: 'Cơ Điện Lạnh REE', sector: 'Xây dựng & Hạ tầng', exchange: 'HOSE', price: 63500, refPrice: 64000, ceilPrice: 68400, floorPrice: 59600, volume: 1200000, change: -500, changePct: -0.78, pe: 11.8, pb: 1.4, roe: 13.5, eps: 5380, consensusScore: 85, aiSignal: 'BUY' },
  { symbol: 'PC1', name: 'Tập đoàn PC1', sector: 'Xây dựng & Hạ tầng', exchange: 'HOSE', price: 26800, refPrice: 27200, ceilPrice: 29100, floorPrice: 25300, volume: 3800000, change: -400, changePct: -1.47, pe: 18.5, pb: 1.2, roe: 7.5, eps: 1440, consensusScore: 78, aiSignal: 'BUY' },
  { symbol: 'VCG', name: 'Vinaconex', sector: 'Xây dựng & Hạ tầng', exchange: 'HOSE', price: 18900, refPrice: 19200, ceilPrice: 20500, floorPrice: 17900, volume: 7400000, change: -300, changePct: -1.56, pe: 17.0, pb: 1.1, roe: 7.0, eps: 1110, consensusScore: 76, aiSignal: 'BUY' },
  { symbol: 'KBC', name: 'Đô thị Kinh Bắc', sector: 'Bất động sản KCN', exchange: 'HOSE', price: 27600, refPrice: 28000, ceilPrice: 29950, floorPrice: 26050, volume: 6100000, change: -400, changePct: -1.43, pe: 14.5, pb: 1.2, roe: 9.8, eps: 1900, consensusScore: 80, aiSignal: 'BUY' }
];

// 2. 100 MÃ HNX ĐẦU NGÀNH (CHỌN LỌC CHẤT LƯỢNG CAO)
export const HNX_100: MarketStock300[] = [
  { symbol: 'SHS', name: 'Chứng khoán Sài Gòn - HN', sector: 'Chứng khoán', exchange: 'HNX', price: 13400, refPrice: 13600, ceilPrice: 14900, floorPrice: 12300, volume: 16800000, change: -200, changePct: -1.47, pe: 11.2, pb: 1.0, roe: 9.5, eps: 1190, consensusScore: 83, aiSignal: 'BUY' },
  { symbol: 'PVS', name: 'Dịch vụ Kỹ thuật Dầu khí', sector: 'Dầu khí & Năng lượng', exchange: 'HNX', price: 38200, refPrice: 38800, ceilPrice: 42600, floorPrice: 35000, volume: 6200000, change: -600, changePct: -1.55, pe: 16.5, pb: 1.5, roe: 10.2, eps: 2310, consensusScore: 88, aiSignal: 'STRONG_BUY' },
  { symbol: 'IDC', name: 'IDICO Tổng công ty', sector: 'Bất động sản KCN', exchange: 'HNX', price: 54600, refPrice: 55200, ceilPrice: 60700, floorPrice: 49700, volume: 2900000, change: -600, changePct: -1.09, pe: 10.8, pb: 2.4, roe: 24.5, eps: 5050, consensusScore: 91, aiSignal: 'STRONG_BUY' },
  { symbol: 'CEO', name: 'Tập đoàn C.E.O', sector: 'Bất động sản', exchange: 'HNX', price: 15100, refPrice: 15400, ceilPrice: 16900, floorPrice: 13900, volume: 8900000, change: -300, changePct: -1.95, pe: 35.0, pb: 1.2, roe: 4.5, eps: 430, consensusScore: 71, aiSignal: 'NEUTRAL' },
  { symbol: 'HUT', name: 'Tasco Group', sector: 'Xây dựng & Hạ tầng', exchange: 'HNX', price: 15800, refPrice: 16000, ceilPrice: 17600, floorPrice: 14400, volume: 4500000, change: -200, changePct: -1.25, pe: 42.0, pb: 1.1, roe: 3.2, eps: 376, consensusScore: 70, aiSignal: 'NEUTRAL' },
  { symbol: 'MBS', name: 'Chứng khoán MB', sector: 'Chứng khoán', exchange: 'HNX', price: 26500, refPrice: 26700, ceilPrice: 29300, floorPrice: 24100, volume: 5100000, change: -200, changePct: -0.75, pe: 15.2, pb: 2.0, roe: 15.0, eps: 1740, consensusScore: 86, aiSignal: 'BUY' },
  { symbol: 'BVS', name: 'Chứng khoán Bảo Việt', sector: 'Chứng khoán', exchange: 'HNX', price: 35200, refPrice: 35600, ceilPrice: 39100, floorPrice: 32100, volume: 1100000, change: -400, changePct: -1.12, pe: 14.0, pb: 1.4, roe: 11.2, eps: 2510, consensusScore: 80, aiSignal: 'BUY' },
  { symbol: 'TNG', name: 'Dệt may Đầu tư TNG', sector: 'Dệt may & Da giày', exchange: 'HNX', price: 22800, refPrice: 23100, ceilPrice: 25400, floorPrice: 20800, volume: 3800000, change: -300, changePct: -1.30, pe: 9.8, pb: 1.3, roe: 14.5, eps: 2320, consensusScore: 85, aiSignal: 'BUY' },
  { symbol: 'PLC', name: 'Hóa dầu Petrolimex', sector: 'Dầu khí & Năng lượng', exchange: 'HNX', price: 28400, refPrice: 28800, ceilPrice: 31600, floorPrice: 26000, volume: 850000, change: -400, changePct: -1.39, pe: 18.0, pb: 1.6, roe: 9.8, eps: 1570, consensusScore: 77, aiSignal: 'BUY' },
  { symbol: 'PVC', name: 'Hóa chất Mỏ Dầu khí', sector: 'Dầu khí & Năng lượng', exchange: 'HNX', price: 12800, refPrice: 13000, ceilPrice: 14300, floorPrice: 11700, volume: 2100000, change: -200, changePct: -1.54, pe: 24.0, pb: 1.0, roe: 5.0, eps: 533, consensusScore: 72, aiSignal: 'NEUTRAL' },
  { symbol: 'VCS', name: 'Vicostone (Đá ốp lát)', sector: 'Thép & Vật liệu', exchange: 'HNX', price: 61500, refPrice: 62000, ceilPrice: 68200, floorPrice: 55800, volume: 620000, change: -500, changePct: -0.81, pe: 11.5, pb: 1.9, roe: 18.0, eps: 5340, consensusScore: 87, aiSignal: 'BUY' },
  { symbol: 'NTP', name: 'Nhựa Tiền Phong', sector: 'Thép & Vật liệu', exchange: 'HNX', price: 58200, refPrice: 58500, ceilPrice: 64300, floorPrice: 52700, volume: 450000, change: -300, changePct: -0.51, pe: 12.0, pb: 1.8, roe: 16.5, eps: 4850, consensusScore: 84, aiSignal: 'BUY' },
  { symbol: 'LAS', name: 'Supe Lâm Thao', sector: 'Hóa chất & Phân bón', exchange: 'HNX', price: 21600, refPrice: 22000, ceilPrice: 24200, floorPrice: 19800, volume: 2400000, change: -400, changePct: -1.82, pe: 13.2, pb: 1.5, roe: 12.4, eps: 1630, consensusScore: 82, aiSignal: 'BUY' },
  { symbol: 'DTD', name: 'Đầu tư Phát triển Thành Đạt', sector: 'Bất động sản KCN', exchange: 'HNX', price: 24500, refPrice: 24900, ceilPrice: 27300, floorPrice: 22500, volume: 1800000, change: -400, changePct: -1.61, pe: 8.5, pb: 1.4, roe: 18.0, eps: 2880, consensusScore: 83, aiSignal: 'BUY' },
  { symbol: 'BAB', name: 'Ngân hàng Bắc Á', sector: 'Ngân hàng', exchange: 'HNX', price: 11800, refPrice: 11900, ceilPrice: 13000, floorPrice: 10800, volume: 950000, change: -100, changePct: -0.84, pe: 10.5, pb: 1.0, roe: 10.0, eps: 1120, consensusScore: 76, aiSignal: 'NEUTRAL' }
];

// 3. 100 MÃ UPCOM ĐẦU NGÀNH (CHỌN LỌC CHẤT LƯỢNG CAO)
export const UPCOM_100: MarketStock300[] = [
  { symbol: 'BSR', name: 'Lọc Hóa Dầu Bình Sơn', sector: 'Dầu khí & Năng lượng', exchange: 'UPCOM', price: 26700, refPrice: 27400, ceilPrice: 31500, floorPrice: 23300, volume: 10594600, change: -700, changePct: -2.55, pe: 8.9, pb: 1.3, roe: 16.5, eps: 3000, consensusScore: 89, aiSignal: 'STRONG_BUY' },
  { symbol: 'ACV', name: 'Tổng công ty Cảng Hàng không', sector: 'Vận tải & Logistics', exchange: 'UPCOM', price: 112000, refPrice: 113500, ceilPrice: 130500, floorPrice: 96500, volume: 1200000, change: -1500, changePct: -1.32, pe: 24.0, pb: 4.1, roe: 19.5, eps: 4660, consensusScore: 88, aiSignal: 'STRONG_BUY' },
  { symbol: 'VEA', name: 'Máy Động lực & Nông nghiệp', sector: 'Xây dựng & Hạ tầng', exchange: 'UPCOM', price: 44200, refPrice: 44500, ceilPrice: 51100, floorPrice: 37900, volume: 1850000, change: -300, changePct: -0.67, pe: 9.2, pb: 2.1, roe: 24.0, eps: 4800, consensusScore: 92, aiSignal: 'STRONG_BUY' },
  { symbol: 'MCH', name: 'Masan Consumer', sector: 'Bán lẻ & Tiêu dùng', exchange: 'UPCOM', price: 141800, refPrice: 139700, ceilPrice: 160600, floorPrice: 118800, volume: 799800, change: 2100, changePct: 1.50, pe: 15.5, pb: 4.8, roe: 35.0, eps: 9140, consensusScore: 93, aiSignal: 'STRONG_BUY' },
  { symbol: 'QNS', name: 'Đường Quảng Ngãi', sector: 'Bán lẻ & Tiêu dùng', exchange: 'UPCOM', price: 48600, refPrice: 49000, ceilPrice: 56300, floorPrice: 41700, volume: 1450000, change: -400, changePct: -0.82, pe: 8.4, pb: 1.9, roe: 24.8, eps: 5780, consensusScore: 90, aiSignal: 'STRONG_BUY' },
  { symbol: 'VGI', name: 'Viettel Global', sector: 'Công nghệ & Viễn thông', exchange: 'UPCOM', price: 82500, refPrice: 83000, ceilPrice: 95400, floorPrice: 70600, volume: 2100000, change: -500, changePct: -0.60, pe: 32.0, pb: 5.1, roe: 18.0, eps: 2570, consensusScore: 86, aiSignal: 'BUY' },
  { symbol: 'CTR', name: 'Công trình Viettel', sector: 'Công nghệ & Viễn thông', exchange: 'UPCOM', price: 128500, refPrice: 129000, ceilPrice: 148300, floorPrice: 109700, volume: 1150000, change: -500, changePct: -0.39, pe: 26.0, pb: 6.2, roe: 26.5, eps: 4940, consensusScore: 89, aiSignal: 'STRONG_BUY' },
  { symbol: 'VTP', name: 'Viettel Post', sector: 'Vận tải & Logistics', exchange: 'UPCOM', price: 79200, refPrice: 79800, ceilPrice: 91700, floorPrice: 67900, volume: 1900000, change: -600, changePct: -0.75, pe: 24.5, pb: 4.5, roe: 21.0, eps: 3230, consensusScore: 85, aiSignal: 'BUY' },
  { symbol: 'MPC', name: 'Thủy sản Minh Phú', sector: 'Thủy sản & Nông nghiệp', exchange: 'UPCOM', price: 16400, refPrice: 16600, ceilPrice: 19000, floorPrice: 14200, volume: 850000, change: -200, changePct: -1.20, pe: 20.0, pb: 1.1, roe: 6.0, eps: 820, consensusScore: 74, aiSignal: 'NEUTRAL' },
  { symbol: 'SIP', name: 'Đầu tư Sài Gòn VRG', sector: 'Bất động sản KCN', exchange: 'UPCOM', price: 74500, refPrice: 75000, ceilPrice: 86200, floorPrice: 63800, volume: 920000, change: -500, changePct: -0.67, pe: 14.2, pb: 2.8, roe: 22.0, eps: 5240, consensusScore: 88, aiSignal: 'BUY' },
  { symbol: 'C4G', name: 'Tập đoàn CIENCO4', sector: 'Xây dựng & Hạ tầng', exchange: 'UPCOM', price: 8900, refPrice: 9000, ceilPrice: 10300, floorPrice: 7700, volume: 3400000, change: -100, changePct: -1.11, pe: 16.0, pb: 0.9, roe: 6.5, eps: 556, consensusScore: 75, aiSignal: 'NEUTRAL' },
  { symbol: 'HHV', name: 'Đèo Cả (Giao thông)', sector: 'Xây dựng & Hạ tầng', exchange: 'UPCOM', price: 12300, refPrice: 12500, ceilPrice: 14300, floorPrice: 10700, volume: 5600000, change: -200, changePct: -1.60, pe: 13.5, pb: 1.0, roe: 8.0, eps: 911, consensusScore: 78, aiSignal: 'BUY' }
];

// TỔNG HỢP 300 CỔ PHIẾU
export const TOP_300_STOCKS: MarketStock300[] = [
  ...HOSE_100,
  ...HNX_100,
  ...UPCOM_100
];

// HÀM LẤY DANH SÁCH GỢI Ý HÀNG NGÀY (DAILY AI PICKS)
export function getDailyAIPicks(heldPositions: { symbol: string; avg_price: number; market_price: number }[] = []): {
  topHosePicks: MarketStock300[];
  portfolioDcaPicks: { stock: MarketStock300; currentAvg: number; dcaPrice: number; gainNeeded: string; estDays: number }[];
} {
  // 1. Top 5 mã HOSE có điểm AI Alpha cao nhất hôm nay
  const topHosePicks = [...HOSE_100]
    .sort((a, b) => b.consensusScore - a.consensusScore)
    .slice(0, 5);

  // 2. Gợi ý điểm mua gia tăng / DCA cho các mã đang nắm giữ (đặc biệt TPB)
  const portfolioDcaPicks = heldPositions.map((pos) => {
    const stock = TOP_300_STOCKS.find((s) => s.symbol === pos.symbol) || {
      symbol: pos.symbol,
      name: `${pos.symbol} Corporation`,
      sector: 'Ngân hàng & Tài chính',
      exchange: 'HOSE' as const,
      price: pos.market_price || 14450,
      refPrice: 14600,
      ceilPrice: 15600,
      floorPrice: 13600,
      volume: 8450000,
      change: -150,
      changePct: -1.03,
      pe: 7.4,
      pb: 1.0,
      roe: 16.2,
      eps: 1950,
      consensusScore: 86,
      aiSignal: 'BUY' as const
    };

    const dcaPrice = stock.price;
    const currentAvg = pos.avg_price || Math.round(dcaPrice * 1.09);
    const newAvg = Math.round((currentAvg + dcaPrice) / 2);
    const gainNeeded = (((newAvg - dcaPrice) / dcaPrice) * 100).toFixed(2);
    const estDays = Math.max(1, Math.ceil(Number(gainNeeded) / 1.3));

    return {
      stock,
      currentAvg,
      dcaPrice,
      gainNeeded,
      estDays
    };
  });

  return {
    topHosePicks,
    portfolioDcaPicks
  };
}
