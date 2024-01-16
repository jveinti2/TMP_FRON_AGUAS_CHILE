import { useContext, useEffect } from "react";
import {
  getVentasApi,
  postVentaApi,
  deleteVentaApi,
  postUpdateDomiciliarioApi,
} from "../services/ventas.services";
import toast from "react-hot-toast";
import { VentasContext } from "../context/Ventas";
import constants from "../utils/constants";
import Echo from "laravel-echo";

export default function useVentas() {
  const { setVentas, loading, setLoading } = useContext(VentasContext);

  const sendWhatsapp = (telefono, venta_id) => {
    const mensaje = encodeURIComponent(
      `Hola, te envío el código y detalle de tu compra en el siguiente link ➡️ ${constants.API_URL}ventas/pdf/${venta_id}`
    );
    window.open(
      `https://api.whatsapp.com/send?phone=${telefono}&text=${mensaje}`
    );
  };

  useEffect(() => {
    if (loading) {
      getListVentas();
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const options = {
      broadcaster: "pusher",
      key: import.meta.env.VITE_PUSHER_APP_KEY, // Gm8VwE4c9fcgztt1eyHu
      wsHost: "api.quickconnection.com.co",
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      wsPort: 2088,
      wssPort: 2088,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      forceTLS: true,
    };
    const echo = new Echo(options);
    echo
      .channel("notification-delivery")
      .listen("NotificationDeliveryEvent", (event) => {
        setTimeout(() => {
          setLoading(true);
          toast.dismiss();
        }, 2000);
      });
  }, []);

  const getListVentas = (data) => {
    getVentasApi(data)
      .then((response) => {
        if (response.status === 200) {
          setVentas({
            total_ventas: response.ventas.reduce((total, venta) => {
              return !venta.donacion
                ? total + parseFloat(venta.precio * venta.cantidad_bidones)
                : total;
            }, 0),
            total_ventas_sitio: response.ventas.reduce((total, venta) => {
              return !venta.donacion && !venta.domicilio
                ? total + parseFloat(venta.precio * venta.cantidad_bidones)
                : total;
            }, 0),
            total_ventas_by_forma_pago: response.ventas.reduce(
              (total, venta) => {
                const forma_pago_id = venta.forma_pago_id;
                const forma_pago_nombre = venta.forma_pago_nombre;
                const valor = parseInt(venta.precio) * venta.cantidad_bidones;
                if (venta.forma_pago_id !== null) {
                  if (!total[forma_pago_id]) {
                    total[forma_pago_id] = {
                      forma_pago_nombre,
                      cantidad_ventas: 1,
                      valor: valor, // Aquí inicializamos la propiedad valor
                    };
                  } else {
                    total[forma_pago_id].cantidad_ventas++;
                    total[forma_pago_id].valor =
                      (total[forma_pago_id].valor || 0) + valor;
                  }
                }

                return total;
              },
              {}
            ),

            total_ventas_domicilio: response.ventas.reduce((total, venta) => {
              return !venta.donacion && venta.domicilio
                ? total + parseInt(venta.precio * venta.cantidad_bidones)
                : total;
            }, 0),
            total_ventas_domicilio_by_forma_pago: response.ventas.reduce(
              (total, venta) => {
                const domicilio = venta.domicilio;
                const forma_pago_id = venta.forma_pago_id;
                const forma_pago_nombre = venta.forma_pago_nombre;
                const estado_domicilio = venta.estado_domicilio;
                const estado_domicilio_nombre = venta.estado_domicilio_nombre;

                if (!venta.donacion) {
                  if (domicilio == 1) {
                    if (estado_domicilio == 1) {
                      // Mostrar forma de pago y cantidad de ventas en esa forma de pago
                      if (!total[forma_pago_id]) {
                        total[forma_pago_id] = {
                          forma_pago_nombre,
                          cantidad_ventas: 1,
                        };
                      } else {
                        total[forma_pago_id].cantidad_ventas++;
                      }
                    } else {
                      // Mostrar estado y cantidad de ventas en ese estado
                      if (!total[estado_domicilio_nombre]) {
                        total[estado_domicilio_nombre] = {
                          estado_domicilio_nombre,
                          cantidad_ventas: 1,
                        };
                      } else {
                        total[estado_domicilio_nombre].cantidad_ventas++;
                      }
                    }
                  }
                }

                return total;
              },
              {}
            ),

            lista_ventas_sitio: response.ventas.filter(
              (venta) => !venta.domicilio && !venta.donacion
            ),
            lista_ventas_domicilio: response.ventas
              .sort((a, b) => b.venta_id - a.venta_id)
              .filter((venta) => venta.domicilio && !venta.donacion),
            lista_ventas_consolidado_edificio: (response.ventas || []).reduce(
              (acc, venta) => {
                const index = acc.findIndex(
                  (item) => item.edificio_id === venta.edificio_id
                );

                if (!venta.donacion) {
                  if (!venta.domicilio) {
                    if (index === -1) {
                      acc.push({
                        edificio_id: venta.edificio_id,
                        edificio: venta.edificio,
                        cantidad_bidones: parseFloat(venta.cantidad_bidones),
                        precio: parseFloat(venta.precio),
                      });
                    } else {
                      acc[index].cantidad_bidones += parseFloat(
                        venta.cantidad_bidones
                      );
                      acc[index].precio += parseFloat(
                        venta.precio * venta.cantidad_bidones
                      );
                    }
                  }
                }

                return acc;
              },
              []
            ),

            lista_donaciones: {
              lista: response.ventas.filter((venta) => venta.donacion),
              totales: {
                total_cantidad_bidones: response.ventas.reduce(
                  (total, venta) => {
                    return venta.donacion
                      ? total + parseFloat(venta.cantidad_bidones)
                      : total;
                  },
                  0
                ),
                total_valor: response.ventas.reduce((total, venta) => {
                  return venta.donacion
                    ? total + parseFloat(venta.precio * venta.cantidad_bidones)
                    : total;
                }, 0),
              },
            },

            total_ventas_pendiente_pago: response.domicilios_pendientes.reduce(
              (total, venta) => {
                return venta.estado_domicilio === 3
                  ? total + parseFloat(venta.precio * venta.cantidad_bidones)
                  : total;
              },
              0
            ),
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const postVenta = async (venta) => {
    toast.loading("Procesando venta...");
    try {
      const response = await postVentaApi(venta);
      if (response.status === 200) {
        if (response.venta.domicilio) {
          toast.success("Domicilio registrado");
        } else {
          toast.success(
            "Venta procesada correctamente. Se abrirá otra esta pestaña para enviar el detalle de la venta por whatsapp"
          );
          setTimeout(() => {
            sendWhatsapp(response.venta.telefono, response.venta.id);
          }, 3000);
        }
      }
      return response.venta;
    } catch (error) {
      toast.error("Error al procesar la venta");
      console.log(error);
      throw error;
    } finally {
      setLoading(true);
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    }
  };

  const deleteVenta = (id) => {
    toast
      .promise(
        deleteVentaApi(id),
        {
          loading: "Eliminando venta...",
          success: (response) => {
            if (response.status === 200) {
              return response.mensaje;
            }
          },
          error: (error) => {
            toast.error(error);
          },
        },
        { style: { borderRadius: "10px", background: "#333", color: "#fff" } }
      )
      .finally(() => {
        setLoading(true);
      });
  };

  const updateDomiciliario = (venta_id, domiciliario_id) => {
    toast
      .promise(
        postUpdateDomiciliarioApi(venta_id, domiciliario_id),
        {
          loading: "Actualizando domiciliario...",
          success: (response) => {
            if (response.status === 200) {
              return response.mensaje;
            }
          },
          error: (error) => {
            toast.error(error);
          },
        },
        { style: { borderRadius: "10px", background: "#333", color: "#fff" } }
      )
      .finally(() => {
        setLoading(true);
      });
  };

  const realoadData = () => {
    toast.loading("Cargando...");
    setTimeout(() => {
      setLoading(true);
      toast.dismiss();
    }, 2000);
  };

  return {
    getListVentas,
    postVenta,
    deleteVenta,
    updateDomiciliario,
    realoadData,
  };
}
