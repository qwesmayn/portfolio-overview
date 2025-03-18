import { FC, useState } from "react";
import { addAsset } from "../model/assetsSlice";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { IBinanceAsset } from "../model/type";
import { Badge } from "@/shared/ui/badge";

interface IFormInput {
  quantity: number;
}

export const AddAssetModal: FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<IBinanceAsset | null>(
    null
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const { binanceAssets } = useAppSelector(
    (state) => state.binanceAssetsReducer
  );

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (!selectedAsset) {
      alert("Please select an asset from the list.");
      return;
    }

    const newAsset = {
      id: selectedAsset.symbol.replace("USDT", ""),
      name: selectedAsset.symbol.replace("USDT", ""),
      quantity: data.quantity,
      price: parseFloat(selectedAsset.lastPrice),
      change24h: parseFloat(selectedAsset.priceChangePercent),
    };

    dispatch(addAsset(newAsset));
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    reset();
    setSelectedAsset(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="py-5 px-12 border-none" asChild>
        <Button>Add Asset</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Asset</DialogTitle>
          <DialogDescription className="text-gray-300">
            Select an asset from the list and enter the quantity.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Available Assets</Label>
            <ul className="max-h-60 overflow-y-auto border border-gray-700 rounded-lg shadow-sm p-2">
              {binanceAssets.map((asset) => (
                <li
                  key={asset.symbol}
                  className={`p-3 cursor-pointer hover:bg-gray-800 rounded-lg transition-colors ${
                    selectedAsset?.symbol === asset.symbol
                      ? "bg-blue-900 border border-blue-700"
                      : ""
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <p className="font-medium text-white">
                    {asset.symbol.replace("USDT", "")}
                  </p>
                  <p className="text-sm text-gray-300">
                    Price: ${Number(asset.lastPrice).toFixed(2)}
                  </p>
                  <Badge
                    variant={
                      Number(asset.priceChangePercent) >= 0
                        ? "default"
                        : "destructive"
                    }
                    className={`text-sm ${
                      Number(asset.priceChangePercent) >= 0
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {Number(asset.priceChangePercent) >= 0 ? "▲" : "▼"}{" "}
                    {Number(asset.priceChangePercent).toFixed(2)}%
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Quantity</Label>
            <Input
              type="number"
              className="bg-gray-800 text-white border-gray-700"
              {...register("quantity", {
                required: "Quantity is required",
                min: {
                  value: 0.01,
                  message: "Quantity must be greater than 0",
                },
                max: {
                  value: 1000,
                  message: "Quantity must be less than 1000",
                },
                valueAsNumber: true,
              })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Add
            </Button>
            <Button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-700 hover:bg-gray-600"
            >
              Reset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
