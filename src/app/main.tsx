import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
