export interface IBinanceAsset {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

export interface IBinanceAssetsState {
  binanceAssets: IBinanceAsset[];
  isLoading: boolean;
  error: null | string;
}


export interface IAsset {
  id: string;
  name: string;
  quantity: number;
  price: number;
  change24h: number;
}

export interface IAssetsState {
  assets: IAsset[];
  isLoading: boolean;
  totalValue: number;
  totalChange24h : number;
}
