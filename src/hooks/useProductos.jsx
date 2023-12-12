import { useState } from "react";
import {
  getProductosApi,
  postProductoApi,
} from "../services/productos.services";
import toast from "react-hot-toast";

export default function useProductos() {
  const [productos, setProductos] = useState([]);

  const getProductos = () => {
    getProductosApi()
      .then((response) => {
        if (response.status === 200) {
          setProductos(response.productos);
        }
      })
      .catch((error) => console.log(error));
  };

  const postProducto = async (producto) => {
    try {
      const response = await postProductoApi(producto);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
      return response.producto;
    } catch (error) {
      console.log(error);
      throw error; // Lanzar el error nuevamente para que se pueda manejar en la función que llama a postProducto..
    }
  };

  return {
    productos,
    setProductos,
    getProductos,
    postProducto,
  };
}
