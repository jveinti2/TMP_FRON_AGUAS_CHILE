import React, { useEffect } from "react";
import Default from "./layouts/Default";
import SingIn from "./pages/SingIn";
import { Flowbite } from "flowbite-react";
import "./App.css";

function App() {
  return (
    <div>
      {localStorage.getItem("userToken") || localStorage.getItem("user") ? (
        <Flowbite>
          <div className="dark:bg-[#171e29] bg-curious-blue-200 h-screen">
            <Default />
          </div>
        </Flowbite>
      ) : (
        <SingIn />
      )}
    </div>
  );
}

export default App;
