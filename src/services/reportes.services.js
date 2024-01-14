import toast from "react-hot-toast";
import { api } from "./apiAxios";

export const getReporteVentasEdificiosApi = async (data) => {
  toast.loading("Cargando...");
  try {
    const response = await api.post("listas/reportes", data);
    return response.data;
  } catch (error) {
    console.log(error);
  } finally {
    toast.dismiss();
  }
};
