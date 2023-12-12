import toast from "react-hot-toast";
import { api } from "./apiAxios";

export const getEdificios = async () => {
  try {
    const response = await api.get("listas/edificios");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postEdificio = async (values) => {
  toast.loading("Guardando...");
  try {
    const response = await api.post("edificios/crear", values);
    return response.data;
  } catch (error) {
    console.log(error);
  } finally {
    toast.dismiss();
  }
};
export const deleteEdificio = async (id) => {
  try {
    const response = await api.post("edificios/anular", { id });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
