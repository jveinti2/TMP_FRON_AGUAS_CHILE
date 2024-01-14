import { useState } from "react";
import {
  getClientes,
  postClienteApi,
  deleteCliente,
  activeCliente,
  markedClienteApi,
  verifyTelApi,
} from "../services/clientes.services";
import toast from "react-hot-toast";

export default function useClientes() {
  const [clientes, setClientes] = useState([]);

  const getListClientes = () => {
    getClientes()
      .then((response) => {
        if (response.status === 200) {
          setClientes(response.clientes);
          toast.dismiss();
        }
      })
      .catch((error) => console.log(error));
  };

  const postCliente = async (cliente) => {
    toast.loading("Guardando cliente...");
    try {
      const response = await postClienteApi(cliente);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
      return response.cliente;
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error;
    } finally {
      toast.dismiss();
    }
  };

  const deleteClienteApi = async (clienteId) => {
    toast.loading("Eliminando cliente...");
    try {
      const response = await deleteCliente(clienteId);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error;
    } finally {
      toast.dismiss();
    }
  };
  const activeClienteApi = async (clienteId) => {
    toast.loading("Reactivando cliente...");
    try {
      const response = await activeCliente(clienteId);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error;
    } finally {
      toast.dismiss();
    }
  };

  const markedCliente = async (data) => {
    toast.loading("Marcando cliente...");
    try {
      const response = await markedClienteApi(data);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error;
    } finally {
      toast.dismiss();
    }
  };

  const verifyTel = async (data) => {
    return toast.promise(verifyTelApi(data), {
      loading: "Verificando teléfono...",
      success: (response) => {
        return response.mensaje;
      },
      error: (error) => {
        return error.response.data.mensaje;
      },
    });
  };

  return {
    clientes,
    setClientes,
    getListClientes,
    postCliente,
    deleteClienteApi,
    activeClienteApi,
    markedCliente,
    verifyTel,
  };
}
