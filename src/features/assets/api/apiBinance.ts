import axios from "axios";
import { IBinanceAsset } from "../model/type";

export const fetchBinanceAssets = async (): Promise<IBinanceAsset[]> => {
  try {
    const response = await axios.get<IBinanceAsset[]>(
      "https://api.binance.com/api/v3/ticker/24hr"
    );

    const filteredAssets = response.data
      .filter((asset) => asset.symbol.includes('USDT') && parseFloat(asset.lastPrice) > 0.1)
      .slice(0, 45);

    return filteredAssets;
  } catch (error) {
    console.error("Error fetching Binance assets:", error);
    throw error;
  }
};