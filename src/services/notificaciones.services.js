import { api } from "./apiAxios";
import toast from "react-hot-toast";

export const postConfirmarNotificacionApi = async (data_form) => {
  try {
    const reponse = await api.post(`notificaciones/confirmar/${data_form}`);
    return reponse.data;
  } catch (error) {
    toast.error("Error al confirmar la notificación");
    console.log(error);
  }
};
