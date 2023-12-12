import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import { LoginProvider } from "./context/Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter hashType="hashbang">
    <LoginProvider>
      <App />
    </LoginProvider>
  </HashRouter>
);
