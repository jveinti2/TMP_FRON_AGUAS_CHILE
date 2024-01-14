import { useState } from "react";
import {
  getListModulosByEdificio,
  postModuloEdificio,
  postPasswordApi,
  postReloadModulosApi,
  postObservacionModuloApi,
} from "../services/modulos.services";
import toast from "react-hot-toast";

export default function useModulos() {
  const [modulos, setModulos] = useState([]);

  const getModulosByEdificio = (edificioId) => {
    getListModulosByEdificio(edificioId)
      .then((response) => {
        if (response.status === 200) {
          setModulos(response.modulos);
        }
      })
      .catch((error) => console.log(error));
  };

  const postModulo = async (data) => {
    toast.loading("Guardando modulo...");
    try {
      const response = await postModuloEdificio(data);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
      return response.modulo;
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error; // Lanzar el error nuevamente para que se pueda manejar en la función que llama a postCliente
    } finally {
      toast.dismiss();
    }
  };
  const postPassword = async (data) => {
    await postPasswordApi(data)
      .then((response) => {
        if (response.status === 200) {
          setModulos(response.modulos);
          toast.success(response.mensaje);
        }
      })
      .catch((error) => console.log(error));
  };

  const postReloadModulos = async (edificioId) => {
    await postReloadModulosApi(edificioId)
      .then((response) => {
        if (response.status === 200) {
          setModulos(response.modulos);
        }
      })
      .catch((error) => console.log(error));
  };

  const postObservacionModulo = async (data) => {
    toast.loading("Guardando observación...");
    try {
      const response = await postObservacionModuloApi(data);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
      return response.modulo;
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error;
    } finally {
      toast.dismiss();
    }
  };

  return {
    modulos,
    getModulosByEdificio,
    postModulo,
    postPassword,
    postReloadModulos,
    postObservacionModulo,
  };
}
