import { api } from "./apiAxios";

export const getListModulosByEdificio = async (edificioId) => {
  try {
    const { data } = await api.get(`modulos/${edificioId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postModuloEdificio = async (data_form) => {
  try {
    const { data } = await api.post(
      `modulos/${data_form.edificioId}/crear`,
      data_form
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const postPasswordApi = async (data_form) => {
  const user = JSON.parse(localStorage.getItem("user"));
  data_form["domiciliario_id"] = user.id;
  try {
    const { data } = await api.post(`modulos/update_password`, data_form);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postReloadModulosApi = async (data_form) => {
  const user = JSON.parse(localStorage.getItem("user"));
  data_form["domiciliario_id"] = user.id;
  try {
    const { data } = await api.post(`modulos/reload`, data_form);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postObservacionModuloApi = async (data_form) => {
  try {
    const { data } = await api.post(`modulos/observacion`, data_form);
    return data;
  } catch (error) {
    console.log(error);
  }
};
