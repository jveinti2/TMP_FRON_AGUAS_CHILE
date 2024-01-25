import toast from "react-hot-toast";
import { api } from "./apiAxios";

export const getVentasApi = async (data) => {
  toast.loading("Cargando... ventas");
  try {
    const response = await api.post("listas/ventas", data);
    return response.data;
  } catch (error) {
    console.log(error);
  } finally {
    toast.dismiss();
  }
};

export const postVentaApi = async (values) => {
  try {
    const response = await api.post("ventas/crear", values);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postDomicilioApi = async (venta_id, data_form, bandera) => {
  data_form = {
    ...data_form,
    bandera: bandera,
  };
  console.log("data_form:", data_form);
  try {
    const response = await api.post(`ventas/domicilio/${venta_id}`, data_form);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteVentaApi = async (id) => {
  try {
    const response = await api.post(`ventas/eliminar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en deleteVentaApi:", error);
    throw error;
  }
};

export const postRecogerBidonesApi = async (venta_id, data_form) => {
  try {
    const response = await api.post(
      `ventas/recoger_bidones/${venta_id}`,
      data_form
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const postUpdateDomiciliarioApi = async (id, data_form) => {
  try {
    const response = await api.post(
      `ventas/update_domiciliario/${id}`,
      data_form
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postObservacionVentaApi = async (data_form) => {
  try {
    const response = await api.post(`ventas/observacion`, data_form);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
