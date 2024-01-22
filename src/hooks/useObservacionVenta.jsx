import { postObservacionVentaApi } from "../services/ventas.services";
import toast from "react-hot-toast";

export default function useObservacionVenta() {
  const postObservacionVenta = async (data) => {
    toast.loading("Guardando observación...");
    try {
      const response = await postObservacionVentaApi(data);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
      return response.venta;
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error;
    } finally {
      toast.dismiss();
    }
  };
  return {
    postObservacionVenta,
  };
}
