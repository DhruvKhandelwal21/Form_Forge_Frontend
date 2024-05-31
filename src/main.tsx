import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import DesignerContextProvider from "./context/designerContext.tsx";
import AuthContextProvider from "./context/authContext.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
    <DesignerContextProvider>
      <App />
      <Toaster />
    </DesignerContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
