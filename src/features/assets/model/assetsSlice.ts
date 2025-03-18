import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAsset, IAssetsState } from "./type";

const initialState: IAssetsState = {
  assets: [],
  isLoading: false,
  totalValue: 0,
  totalChange24h: 0,
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    loadAssets: (state) => {
      const assetsString = localStorage.getItem("assets");
      const assets: IAsset[] = assetsString ? JSON.parse(assetsString) : [];

      state.assets = assets;
      if (assets.length > 0) {
        state.totalValue = assets.reduce(
          (sum, a) => sum + a.quantity * a.price,
          0
        );
        state.totalChange24h = assets.reduce((sum, a) => sum + a.change24h, 0);
        state.isLoading = true;
      }
    },
    updateAssetPrice: (
      state,
      action: PayloadAction<{ id: string; price: number; change24h: number }>
    ) => {
      const asset = state.assets.find((a) => a.id === action.payload.id);
      if (asset) {
        asset.price = action.payload.price;
        asset.change24h = action.payload.change24h;
      }
      state.totalValue = state.assets.reduce(
        (sum, a) => sum + a.quantity * a.price,
        0
      );
      state.totalChange24h = state.assets.reduce(
        (sum, a) => sum + a.change24h,
        0
      );
      state.isLoading = false;
    },
    addAsset: (state, action: PayloadAction<IAsset>) => {
      const asset = state.assets.find((a) => a.id === action.payload.id);
      if (asset) {
        asset.quantity += action.payload.quantity;
      } else {
        state.assets.push(action.payload);
      }
      state.totalValue = state.assets.reduce(
        (sum, a) => sum + a.quantity * a.price,
        0
      );
      state.totalChange24h = state.assets.reduce(
        (sum, a) => sum + a.change24h,
        0
      );

      localStorage.setItem("assets", JSON.stringify(state.assets));
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(
        (asset) => asset.id !== action.payload
      );
      state.totalValue = state.assets.reduce(
        (sum, a) => sum + a.quantity * a.price,
        0
      );
      state.totalChange24h = state.assets.reduce(
        (sum, a) => sum + a.change24h,
        0
      );
      localStorage.setItem("assets", JSON.stringify(state.assets));
    },
  },
});

export const { loadAssets, updateAssetPrice, addAsset, removeAsset } =
  assetsSlice.actions;
export default assetsSlice.reducer;
