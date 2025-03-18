import { FC, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { loadAssets, removeAsset } from "../model/assetsSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Badge } from "@/shared/ui/badge";
import { AssetCard } from "@/widgets/AssetCard/ui/AssetCard";
import { AddAssetModal } from "./AddAssetModal";
import { createWebSocket } from "@/features/lib/createWebSocket";
import { LoadingSpinner } from "@/shared/ui/loader";
import { fetchAssets } from "../model/binanceAssetsSlice";

export const AssetList: FC = () => {
  const dispatch = useAppDispatch();
  const { assets, isLoading, totalValue, totalChange24h } = useAppSelector(
    (state) => state.assetsReducer
  );

  const handleDeleteAsset = (id: string) => {
    dispatch(removeAsset(id));
  };

  useEffect(() => {
    dispatch(loadAssets());
    dispatch(fetchAssets());
  }, []);

  useEffect(() => {
    let closeWebSocket: () => void;

    if (assets.length > 0) {
      const tickers = assets.map((asset) =>
        (asset.id + "USDT").toLocaleLowerCase()
      );
      closeWebSocket = createWebSocket(tickers, dispatch);
    }

    return () => {
      if (closeWebSocket) {
        closeWebSocket();
      }
    };
  }, [dispatch, assets.length]);

  const formattedAssets = assets.map((asset) => {
    const assetTotalValue = asset.quantity * asset.price;
    const portfolioShare =
      totalValue === 0 ? 0 : (assetTotalValue / totalValue) * 100;

    return {
      ...asset,
      totalValue: assetTotalValue.toFixed(2),
      portfolioShare: portfolioShare.toFixed(2),
    };
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: formattedAssets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 250,
    overscan: 4,
  });

  return (
    <div className=" max-w-[1000px] mx-auto p-6 space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl leading-tight font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          My Portfolio
        </h1>
        <div className="flex items-center justify-center flex-wrap gap-2">
          <p className="text-2xl text-gray-200">
            Total Value:{" "}
            <span className="font-bold text-3xl text-white">
              ${totalValue.toFixed(2)}
            </span>
          </p>
          <Badge
            variant={totalChange24h >= 0 ? "default" : "destructive"}
            className={`text-lg ${
              totalChange24h >= 0
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            } hover:scale-105 transition-transform`}
          >
            {totalChange24h >= 0 ? "▲" : "▼"} {totalChange24h.toFixed(2)}%
          </Badge>
        </div>
        <AddAssetModal />
      </div>
      {isLoading ? (
        <LoadingSpinner color="#FFFFFF" />
      ) : (
        <div ref={parentRef} className="h-[625px] sm:h-[760px] 2xl:h-[810px] overflow-auto px-3">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const asset = formattedAssets[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <AssetCard asset={asset} onDelete={handleDeleteAsset} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
