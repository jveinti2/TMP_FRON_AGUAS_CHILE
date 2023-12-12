import React, { useEffect } from "react";
import Default from "./layouts/Default";
import SingIn from "./pages/SingIn";
import { Flowbite } from "flowbite-react";
import "./App.css";
import Echo from "laravel-echo";
// import Pusher from "pusher-js";

function App() {
  // useEffect(() => {
  //   const echo = new Echo({
  //     broadcaster: "pusher",
  //     key: import.meta.env.VITE_PUSHER_APP_KEY,
  //     wsHost: import.meta.env.VITE_PUSHER_APP_HOST,
  //     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  //     encrypted: true,
  //     wsPort: import.meta.env.VITE_PUSHER_APP_PORT,
  //     wssPort: import.meta.env.VITE_PUSHER_APP_PORT,
  //     disableStats: true,
  //     enabledTransports: import.meta.env.VITE_PUSHER_APP_TRANSPORTS,
  //     forceTLS: import.meta.env.VITE_PUSHER_APP_FORCE_TLS,
  //   });

  //   echo
  //     .channel("notification-delivery")
  //     .listen("NotificationDeliveryEvent", (event) => {
  //       console.log("Evento de entrega de notificación recibido:", event.data);
  //       // Aquí puedes manejar la notificación, actualizar el estado, etc.
  //     });
  // }, []);
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
