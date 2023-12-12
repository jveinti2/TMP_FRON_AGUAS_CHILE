import { useContext, useEffect } from "react";
import { DashboardContext } from "../context/Dashboard";
import { getProductosApi } from "../services/productos.services";
import { getEdificios } from "../services/edificios.services";
import { getClientes } from "../services/clientes.services";
import toast from "react-hot-toast";

export default function useDashboard() {
  const { setDashboard, loading, setLoading } = useContext(DashboardContext);

  useEffect(() => {
    if (loading) {
      getDashboard();
      setLoading(false);
      console.log("useDashboard");
    }
  }, [loading]);

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
