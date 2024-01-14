import { useState } from "react";
import { useContext, useEffect } from "react";
import { DashboardContext } from "../context/Dashboard";
import { getProductosApi } from "../services/productos.services";
import { getEdificios } from "../services/edificios.services";
import { getClientes } from "../services/clientes.services";
import toast from "react-hot-toast";
import Echo from "laravel-echo";

export default function useDashboard() {
  const { setDashboard, loading, setLoading } = useContext(DashboardContext);
  const [isToastShown, setIsToastShown] = useState(false);

  useEffect(() => {
    if (loading) {
      getDashboard();
      setLoading(false);
      console.log("useDashboard");
    }
  }, [loading]);

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
          toast.dismiss();
        }, 1000);
      });
  }, []);

  const getDashboard = async () => {
    toast.loading("Cargando...");
    try {
      const [productosResponse, edificiosResponse, clientesResponse] =
        await Promise.all([getProductosApi(), getEdificios(), getClientes()]);

      const resProductos = productosResponse.productos;
      const resEdificios = edificiosResponse;
      const resClientes = clientesResponse.clientes;

      const productos_inventario = resProductos.reduce((acc, producto) => {
        if (producto.recarga_id !== 0) {
          return acc;
        }

        const productoId = producto.id;
        const productoNombre = producto.nombre;
        const cantidadInventario = producto.cantidad_inventario;

        if (!acc[productoId]) {
          acc[productoId] = {
            nombre: productoNombre,
            cantidad: 0,
          };
        }

        acc[productoId].cantidad += cantidadInventario;
        return acc;
      }, {});

      const productos_edificios = resEdificios.modulos.reduce((acc, modulo) => {
        return acc + modulo.cantidad_bidones;
      }, 0);

      const edificios = resEdificios.edificios.map((edificio) => ({
        ...edificio,
        modulos: resEdificios.modulos.filter(
          (modulo) => modulo.edificio_id === edificio.id
        ),
      }));

      setDashboard({
        cantidad_bidones: {
          inventario: productos_inventario,
          edificios: productos_edificios,
        },
        edificios: edificios,
        clientes: resClientes,
      });
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    } finally {
      toast.dismiss();
    }
  };

  const realoadData = () => {
    toast.loading("Cargando...");
    setTimeout(() => {
      setLoading(true);
      toast.dismiss();
    }, 2000);
  };

  return { getDashboard, realoadData };
}
