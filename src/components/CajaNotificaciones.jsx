import { useEffect, useState } from "react";
import { getListaNotificacionesApi } from "../services/listas.services";
import { postConfirmarNotificacionApi } from "../services/notificaciones.services";
import { Dropdown } from "flowbite-react";
import { FaBell, FaClock } from "react-icons/fa6";
import { Toast } from "flowbite-react";
import Echo from "laravel-echo";

export default function CajaNotificaciones() {
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (loading) {
      if (user.role == 1 || user.role == 3) {
        getListaNotificacionesApi().then((response) => {
          setNotificaciones(response);
        });
        setLoading(false);
      }
    }
  }, [loading]);

  const postConfirmarNotificacion = (id) => {
    postConfirmarNotificacionApi(id).then((response) => {
      setLoading(true);
    });
  };

  useEffect(() => {
    const options = {
      broadcaster: "pusher",
      key: import.meta.env.VITE_PUSHER_APP_KEY, // Gm8VwE4c9fcgztt1eyHu
      wsHost: "api.quickconnection.com.co",
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      wsPort: 2088,
      wssPort: 2088,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      forceTLS: true,
    };

    const echo = new Echo(options);

    echo
      .channel("notification-delivery")
      .listen("NotificationDeliveryEvent", (event) => {
        setTimeout(() => {
          setLoading(true);
        }, 1000);
      });
  }, []);

  return (
    <>
      {user.role == 1 || user.role == 3 ? (
        <Dropdown
          arrowIcon={false}
          dismissOnClick={false}
          label=""
          renderTrigger={() => (
            <button
              type="button"
              className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <FaBell />
              <span className="sr-only">Notifications</span>
              {notifaciones.length > 0 && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                  {notifaciones.length}
                </div>
              )}
            </button>
          )}
        >
          {notifaciones && notifaciones.length > 0 ? (
            notifaciones.map((item) => (
              <Dropdown.Item key={item.id}>
                <div>
                  <Toast>
                    <div className="space-y-1 text-left">
                      <span className="block text-sm font-semibold">
                        {item.tipo_notificacion}
                      </span>
                      <span className="block text-left text-sm font-normal">
                        {item.mensaje}
                      </span>
                      <span className=" bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                        <FaClock className="mr-1" />
                        {item.created_at}
                      </span>
                    </div>
                    <Toast.Toggle
                      onClick={() => postConfirmarNotificacion(item.id)}
                    />
                  </Toast>
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item>
              <div>
                <Toast>
                  <div>
                    <div>
                      <p className="ml-3 text-sm font-normal">
                        No hay notificaciones
                      </p>
                    </div>
                  </div>
                </Toast>
              </div>
            </Dropdown.Item>
          )}
        </Dropdown>
      ) : null}
    </>
  );
}
