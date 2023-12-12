import { api } from "./apiAxios";

export const getClientes = async () => {
  try {
    const response = await api.get("listas/clientes");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postClienteApi = async (values) => {
  try {
    const response = await api.post("clientes/crear", values);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteCliente = async (id) => {
  try {
    const response = await api.post("clientes/anular", { id });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const markedClienteApi = async (data) => {
  try {
    const response = await api.post("clientes/marcar", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verifyTelApi = async (data) => {
  try {
    const response = await api.post("clientes/verificar", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
