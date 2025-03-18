import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Badge } from "@/shared/ui/badge";
import { FC } from "react";
import { IAsset } from "@/features/assets/model/type";

interface AssetCardProps {
  asset: IAsset & {totalValue: string, portfolioShare: string};
  onDelete: (id:string) => void;
}

export const AssetCard: FC<AssetCardProps> = ({ asset, onDelete }) => {
  return (
    <Card onClick={() => onDelete(asset.id)} className="bg-gray-900 hover:bg-gray-800/80 transition-colors shadow-lg border-gray-600">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {asset.name[0]}
          </div>
          <div>
            <CardTitle className="text-white">{asset.name}</CardTitle>
            <CardDescription className="text-gray-300">
              {asset.quantity} {asset.id} (Price: ${asset.price.toFixed(2)})
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">
            ${asset.totalValue}
          </p>
          <Badge
            variant={asset.change24h >= 0 ? "default" : "destructive"}
            className={`text-sm ${
              asset.change24h >= 0
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {asset.change24h >= 0 ? "▲" : "▼"} {asset.change24h.toFixed(2)}%
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <Progress
            value={parseFloat(asset.portfolioShare)}
            className="h-2 bg-gray-600"
          />
          <p className="text-sm text-gray-400">
            {asset.portfolioShare}% of portfolio
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
