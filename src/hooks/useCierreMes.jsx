import { useContext, useEffect } from "react";
import { getCierreMesApi } from "../services/cierre_mes.services";
import { CierreMesContext } from "../context/CierreMes";

export default function useCierreMes() {
  const { setCierreMes } = useContext(CierreMesContext);

  useEffect(() => {
    getListCierreMes();
  }, []);

  const getListCierreMes = (data) => {
    getCierreMesApi(data)
      .then((response) => {
        if (response.status === 200) {
          setCierreMes({
            total_ventas_mes: {
              total_ventas: response.ventas.reduce((total, venta) => {
                const precio = parseFloat(venta.precio); // Convierte el precio a número
                return total + precio;
              }, 0),
              total_bindones_vendidos: response.ventas.reduce(
                (total, venta) => {
                  const cantidad_bidones = venta.cantidad_bidones;
                  return total + cantidad_bidones;
                },
                0
              ),
            },
            total_ventas_mes_edificio: {
              total_ventas: response.ventas.reduce((total, venta) => {
                const precio = parseFloat(venta.precio); // Convierte el precio a número
                return venta.domicilio ? total : total + precio;
              }, 0),

              total_bindones_vendidos: response.ventas.reduce(
                (total, venta) => {
                  const cantidad_bidones = venta.cantidad_bidones;
                  return venta.domicilio ? total : total + cantidad_bidones;
                },
                0
              ),
              total_ventas_by_forma_pago: response.ventas.reduce(
                (total, venta) => {
                  const forma_pago_id = venta.forma_pago_id;
                  const forma_pago_nombre = venta.forma_pago_nombre;

                  if (venta.domicilio == 0) {
                    if (!total[forma_pago_id]) {
                      total[forma_pago_id] = {
                        forma_pago_nombre,
                        cantidad_ventas: 1,
                      };
                    } else {
                      total[forma_pago_id].cantidad_ventas++;
                    }
                  }

                  return total;
                },
                {}
              ),
            },
            total_ventas_mes_domicilio: {
              total_ventas: response.ventas.reduce((total, venta) => {
                const precio = parseFloat(venta.precio); // Convierte el precio a número
                return venta.domicilio ? total + precio : total;
              }, 0),
              total_bindones_vendidos: response.ventas.reduce(
                (total, venta) => {
                  const cantidad_bidones = venta.cantidad_bidones;
                  return venta.domicilio ? total + cantidad_bidones : total;
                },
                0
              ),
              total_ventas_by_forma_pago: response.ventas.reduce(
                (total, venta) => {
                  const domicilio = venta.domicilio;
                  const forma_pago_id = venta.forma_pago_id;
                  const forma_pago_nombre = venta.forma_pago_nombre;
                  const estado_domicilio = venta.estado_domicilio;
                  const estado_domicilio_nombre = venta.estado_domicilio_nombre;

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

                  return total;
                },
                {}
              ),
            },
            total_gastos_mes: response.gastos.reduce((total, gasto) => {
              const valor = parseFloat(gasto.valor);
              return total + valor;
            }, 0),
            lista_gastos_mes: response.gastos,
            lista_ventas_mes: response.edificios,
            total_ventas_by_forma_pago: response.ventas.reduce(
              (total, venta) => {
                const forma_pago_id = venta.forma_pago_id;
                const forma_pago_nombre = venta.forma_pago_nombre;
                const valor = parseInt(venta.precio) * venta.cantidad_bidones;

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

                return total;
              },
              {}
            ),
            listado_donaciones: {
              lista: response.ventas.filter((venta) => venta.donacion == 1),
              totales: {
                cantidad_bidones: response.ventas.reduce((total, venta) => {
                  const cantidad_bidones = venta.cantidad_bidones;
                  return venta.donacion == 1 ? total + cantidad_bidones : total;
                }, 0),
                valor: response.ventas.reduce((total, venta) => {
                  const precio = parseFloat(venta.precio); // Convierte el precio a número
                  return venta.donacion == 1 ? total + precio : total;
                }, 0),
              },
            },
          });
        }
      })
      .catch((error) => console.log(error));
  };

  // const postVenta = async venta => {
  // 	try {
  // 		const response = await postVentaApi(venta);
  // 		if (response.status === 200) {
  // 			toast.success(response.mensaje);
  // 			getListVentas();
  // 		}
  // 		return response.venta;
  // 	} catch (error) {
  // 		console.log(error);
  // 		throw error; // Lanzar el error nuevamente para que se pueda manejar en la función que llama a postventa
  // 	}
  // };

  return { getListCierreMes };
}
