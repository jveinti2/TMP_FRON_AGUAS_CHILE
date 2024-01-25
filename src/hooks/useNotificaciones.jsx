import { useState, useEffect } from "react";
import { getListaNotificacionesApi } from "../services/listas.services";
import { postConfirmarNotificacionApi } from "../services/notificaciones.services";
import toast from "react-hot-toast";

export const useNotificaciones = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNotificaciones = () => {
    setLoading(true);

    getListaNotificacionesApi()
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const postNotificacion = (id) => {
    postConfirmarNotificacionApi(id)
      .then(() => {
        getNotificaciones();
      })
      .catch(() => {
        toast.error("Error al confirmar la notificación");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getNotificaciones();
  }, []);

  return { data, loading, getNotificaciones, postNotificacion };
};
