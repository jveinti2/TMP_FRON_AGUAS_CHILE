import { useContext, useEffect } from "react";
import { getVentasApi } from "../services/ventas.services";
import toast from "react-hot-toast";
import { DespachosContext } from "../context/Despachos";
// import Echo from "laravel-echo";

export default function useDespachos() {
  const { setVentas, loading, setLoading } = useContext(DespachosContext);

  useEffect(() => {
    if (loading) {
      getListaDomilicios();
      setLoading(false);
    }
  }, [loading]);

  // useEffect(() => {
  //   const options = {
  //     broadcaster: "pusher",
  //     key: import.meta.env.VITE_PUSHER_APP_KEY, // Gm8VwE4c9fcgztt1eyHu
  //     wsHost: "api.quickconnection.com.co",
  //     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  //     wsPort: 2088,
  //     wssPort: 2088,
  //     disableStats: true,
  //     enabledTransports: ["ws", "wss"],
  //     forceTLS: true,
  //   };
  //   const echo = new Echo(options);
  //   echo
  //     .channel("notification-delivery")
  //     .listen("NotificationDeliveryEvent", (event) => {
  //       setTimeout(() => {
  //         setLoading(true);
  //         toast.dismiss();
  //       }, 2000);
  //     });
  // }, []);

  const getListaDomilicios = (data) => {
    getVentasApi(data)
      .then((response) => {
        if (response.status === 200) {
          setVentas({
            domicilios_dia: response.ventas
              .filter((venta) => venta.domicilio)
              .sort((a, b) => b.venta_id - a.venta_id),
            domicilios_pendientes_gestionar: response.domicilios_pendientes,
            domicilios_pendientes_recoger_bidones:
              response.pendiente_recoger_bidones,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const realoadData = () => {
    toast.loading("Cargando...");
    setTimeout(() => {
      // setLoading(true);
      toast.dismiss();
    }, 2000);
  };

  return {
    getListaDomilicios,
    realoadData,
  };
}
