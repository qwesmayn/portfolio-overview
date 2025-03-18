import { AppDispatch } from "@/app/store/store";
import { updateAssetPrice } from "../assets";

const createWebSocketConnection = (
  tickers: string[],
  onMessage: (ticker: string, price: number, change24h: number) => void,
  onError: () => void
) => {
  const streams = tickers.map((ticker) => `${ticker}@ticker`).join("/");
  const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("WebSocket connection established");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data.toString());

    if (data.stream.endsWith("@ticker")) {
      const ticker = data.data.s;
      const price = parseFloat(data.data.c);
      const change24h = parseFloat(data.data.P);

      onMessage(ticker, price, change24h);
    }
  };

  ws.onerror = () => {;
    onError();
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  return ws;
};

export const createWebSocket = (tickers: string[], dispatch: AppDispatch) => {
  let ws: WebSocket | null = null;

  const connect = () => {
    ws = createWebSocketConnection(
      tickers,
      (s, c, P) => {
        const assetId = s.replace("USDT", "").toUpperCase();
        dispatch(
          updateAssetPrice({
            id: assetId,
            price: c,
            change24h: P,
          })
        );
      },
      () => {
        setTimeout(() => {
          connect();
        }, 3 * 1000);
      }
    );
  };

  connect();

  return () => {
    if (ws) {
      ws.close();
    }
  };
};