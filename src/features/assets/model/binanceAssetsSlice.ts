import { IBinanceAsset, IBinanceAssetsState } from './type';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchBinanceAssets } from '../api/apiBinance';

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async () => {
  const assets = await fetchBinanceAssets();
  return assets;
});

const initialState: IBinanceAssetsState = {
  binanceAssets: [],
  isLoading: false,
  error: null,
};


const binanceAssetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action: PayloadAction<IBinanceAsset[]>) => {
        state.isLoading = false;
        state.binanceAssets = action.payload;
        state.error = null;
      })
      .addCase(fetchAssets.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default binanceAssetsSlice.reducer;