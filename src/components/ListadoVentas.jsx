import { Table, Button, Badge, Accordion, TextInput } from "flowbite-react";
import { useContext, useState, useEffect } from "react";
import { VentasContext } from "../context/Ventas";
import { NavLink } from "react-router-dom";
import {
  FaWhatsapp,
  FaFileLines,
  FaPen,
  FaRegTrashCan,
  FaSun,
  FaMoon,
} from "react-icons/fa6";
import toMoney from "../utils/toMoney";
import constants from "../utils/constants";
import useFormaPago from "../hooks/useFormaPago";
import { TableHead } from "flowbite-react/lib/esm/components/Table/TableHead";
import toast from "react-hot-toast";
import { useVentas } from "../hooks/useVentas";
import { getDomiciliariosApi } from "../services/domiciliarios.services";
import { postUpdateDomiciliarioApi } from "../services/ventas.services";
import ModalDetalle from "./ModalDetalle";

export default function ListadoVentas() {
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [filtroVentasEdificio, setFiltroVentasEdificio] = useState("");
  const [filtroVentasDomicilio, setFiltroVentasDomicilio] = useState("");
  const { ventas, setLoading } = useContext(VentasContext);
  const { handleEntregarDomicilio, handleFormaPago, handleDomiciliario } =
    useFormaPago(setLoading);
  const { deleteVenta } = useVentas();

  useEffect(() => {
    getDomiciliariosApi().then((response) => {
      setDomiciliarios(response.domiciliarios);
    });
  }, []);

  const sendWhatsapp = (
    modulo_nombre,
    modulo_contrasena,
    telefono,
    venta_id
  ) => {
    const mensaje = `Hola!%20Somos%20Agua%20Purificada%20Vn%20%F0%9F%91%8B%0AGracias%20por%20tu%20compra,%20por%20favor%20retirar%20tu%20bid%C3%B3n%20en%20el:%0A*MODULO*:%20${modulo_nombre}%0A*CONTRASE%C3%91A:*%20${modulo_contrasena}%0ARecuerde%20que%20ese%20codigo%20estará%20disponible%20solo%20una%20hora.%0A%0ASi%20deseas%20m%C3%A1s%20detalle%20puedes%20descargar%20tu%20recibo%20aqu%C3%AD%20%F0%9F%91%89%20${constants.API_URL}ventas/pdf/${venta_id}`;
    window.open(
      `https://api.whatsapp.com/send?phone=${telefono}&text=${mensaje}`
    );
  };

  const handleFiltroVentasEdificio = (e) => {
    setFiltroVentasEdificio(e.target.value);
  };
  const handleFiltroVentasDomicilio = (e) => {
    setFiltroVentasDomicilio(e.target.value);
  };

  const ventasEdificiosFiltrados = ventas.lista_ventas_sitio.filter(
    (venta) =>
      (venta.identificacion &&
        venta.identificacion
          .toLowerCase()
          .includes(filtroVentasEdificio.toLowerCase())) ||
      (venta.cliente_nombres &&
        venta.cliente_nombres
          .toLowerCase()
          .includes(filtroVentasEdificio.toLowerCase())) ||
      (venta.edificio &&
        venta.edificio
          .toLowerCase()
          .includes(filtroVentasEdificio.toLowerCase())) ||
      venta.precio.toString().includes(filtroVentasEdificio.toLowerCase()) ||
      (venta.forma_pago_nombre &&
        venta.forma_pago_nombre
          .toLowerCase()
          .includes(filtroVentasEdificio.toLowerCase()))
  );

  const ventasDomicilioFiltrados = ventas.lista_ventas_domicilio.filter(
    (venta) =>
      (venta.cliente_nombres &&
        venta.cliente_nombres
          .toLowerCase()
          .includes(filtroVentasDomicilio.toLowerCase())) ||
      (venta.identificacion &&
        venta.identificacion
          .toLowerCase()
          .includes(filtroVentasDomicilio.toLowerCase())) ||
      (venta.direccion_domicilio &&
        venta.direccion_domicilio
          .toLowerCase()
          .includes(filtroVentasDomicilio.toLowerCase())) ||
      (venta.apartameto &&
        venta.apartameto
          .toLowerCase()
          .includes(filtroVentasDomicilio.toLowerCase())) ||
      venta.precio.toString().includes(filtroVentasDomicilio.toLowerCase()) ||
      (venta.forma_pago_nombre &&
        venta.forma_pago_nombre
          .toLowerCase()
          .includes(filtroVentasDomicilio.toLowerCase())) ||
      (venta.estado_domicilio_nombre &&
        venta.estado_domicilio_nombre
          .toLowerCase()
          .includes(filtroVentasDomicilio.toLowerCase()))
  );

  const handleDeleteVenta = (id) => {
    toast(
      <div className="flex flex-col gap-2">
        <p>¿Estás seguro de eliminar esta venta?</p>
        <div className="flex gap-2">
          <Button
            size="xs"
            className="bg-red-500 hover:bg-red-700"
            onClick={() => {
              deleteVenta(id);
              toast.dismiss();
            }}
          >
            Eliminar
          </Button>
          <Button
            size="xs"
            className="bg-gray-500 hover:bg-gray-700"
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  const handleUpdateDomiciliario = async (id, setLoading) => {
    // Seleccionar domiciliario
    const domiciliarioPromise = new Promise((resolve) => {
      const handleDomiciliarioClick = (domiciliario) => {
        resolve(domiciliario);
      };

      toast(
        <div className="space-y-2">
          <p>¿Quién entregará el domicilio?</p>
          <div className="grid grid-cols-2 gap-2">
            {domiciliarios.length > 0 &&
              domiciliarios.map((domiciliario) => {
                return (
                  <Button
                    key={domiciliario.id}
                    size={"xs"}
                    color="success"
                    onClick={() => handleDomiciliarioClick(domiciliario.id)}
                  >
                    {domiciliario.nombres} {domiciliario.apellidos}
                  </Button>
                );
              })}
          </div>
          <div className="grid place-content-center">
            <Button size={"xs"} color="failure" onClick={() => toast.dismiss()}>
              Cancelar
            </Button>
          </div>
        </div>,
        { duration: Infinity }
      );
    });

    const domiciliario = await domiciliarioPromise;

    const data_form = {
      domiciliario_id: domiciliario,
    };

    toast
      .promise(
        postUpdateDomiciliarioApi(id, data_form),
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
      .then(() => {
        setLoading(true);
        toast.dismiss();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
          Listado de ventas
        </h2>
      </div>
      <div className=" space-y-2 gap-4">
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title className="bg-white dark:bg-gray-800 py-3 ">
              Ventas en edificios
            </Accordion.Title>
            <Accordion.Content className="p-1">
              <div className="overflow-x-auto ">
                <Table striped className="text-xs">
                  <TableHead>
                    <Table.HeadCell colSpan={8}>
                      <TextInput
                        placeholder="Buscar ventas"
                        value={filtroVentasEdificio}
                        onChange={handleFiltroVentasEdificio}
                      />
                    </Table.HeadCell>
                  </TableHead>
                  <Table.Head>
                    <Table.HeadCell>Nro. Venta</Table.HeadCell>
                    <Table.HeadCell>Nombre cliente</Table.HeadCell>
                    <Table.HeadCell>Edificio</Table.HeadCell>
                    <Table.HeadCell>Producto</Table.HeadCell>
                    <Table.HeadCell>Cantidad</Table.HeadCell>
                    <Table.HeadCell>Vr. Total</Table.HeadCell>
                    <Table.HeadCell>Forma pago</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {ventas.lista_ventas_sitio.length > 0 ? (
                      ventasEdificiosFiltrados.map((venta) => {
                        return (
                          <Table.Row
                            key={venta.venta_id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell># {venta.venta_id}</Table.Cell>
                            <Table.Cell>{venta.cliente_nombres}</Table.Cell>
                            <Table.Cell>{venta.edificio}</Table.Cell>
                            <Table.Cell>{venta.producto}</Table.Cell>
                            <Table.Cell>{venta.cantidad_bidones}</Table.Cell>
                            <Table.Cell>
                              {toMoney(
                                parseInt(venta.cantidad_bidones * venta.precio)
                              )}
                            </Table.Cell>
                            <Table.Cell>{venta.forma_pago_nombre}</Table.Cell>
                            <Table.Cell className="flex gap-2">
                              <ModalDetalle venta={venta} />
                              <FaWhatsapp
                                onClick={() => {
                                  sendWhatsapp(
                                    venta.modulo_nombre,
                                    venta.modulo_contrasena,
                                    venta.telefono,
                                    venta.venta_id
                                  );
                                }}
                                className="cursor-pointer text-green-500 hover:text-green-700"
                                size={22}
                              />

                              <FaFileLines
                                size={22}
                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                onClick={() =>
                                  window.open(
                                    `${constants.API_URL}ventas/pdf/${venta.venta_id}`
                                  )
                                }
                              />

                              <FaRegTrashCan
                                size={22}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() =>
                                  handleDeleteVenta(venta.venta_id)
                                }
                              />
                            </Table.Cell>
                          </Table.Row>
                        );
                      })
                    ) : (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell colSpan={8} className="text-center">
                          No hay ventas
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>

        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title className="bg-white dark:bg-gray-800 py-3 ">
              Ventas a domicilio
            </Accordion.Title>
            <Accordion.Content className="p-1 space-y-3">
              <TextInput
                className="w-full md:w-1/3 mt-1"
                placeholder="Buscar ventas"
                value={filtroVentasDomicilio}
                onChange={handleFiltroVentasDomicilio}
              />
              <div className="overflow-x-auto ">
                <Table className="text-xs ">
                  <Table.Head>
                    <Table.HeadCell colSpan={9}>
                      <span className="flex items-center gap-2">
                        <FaSun className="text-yellow-500" size={22} />
                        <b className="dark:text-white ">Turno de la mañana </b>
                      </span>
                    </Table.HeadCell>
                    <Table.HeadCell>
                      <NavLink to="/despachos">
                        <Button
                          size={"xs"}
                          className="bg-blue-500 hover:bg-blue-700"
                        >
                          Despachos
                        </Button>
                      </NavLink>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Head>
                    <Table.HeadCell>Nro. Venta</Table.HeadCell>
                    <Table.HeadCell>Nombre cliente</Table.HeadCell>
                    <Table.HeadCell>Dirección</Table.HeadCell>
                    <Table.HeadCell>Producto</Table.HeadCell>
                    <Table.HeadCell>Cantidad bidones</Table.HeadCell>
                    <Table.HeadCell>Valor</Table.HeadCell>
                    <Table.HeadCell>Domiciliario</Table.HeadCell>
                    <Table.HeadCell>Forma pago</Table.HeadCell>
                    <Table.HeadCell>Estado</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {ventas.lista_ventas_domicilio.length > 0 ? (
                      ventasDomicilioFiltrados
                        .filter((venta) => venta.turno_tarde === 0)
                        .map((venta) => {
                          return (
                            <Table.Row
                              key={venta.venta_id}
                              className={`bg-white dark:border-gray-700 dark:bg-gray-800 
                      ${
                        venta.estado_domicilio != 2
                          ? " bg-[#59b377] font-semibold text-white border-gray-600 dark:bg-[#3e7e54] dark:text-white"
                          : null
                      }
                            `}
                            >
                              <Table.Cell># {venta.venta_id}</Table.Cell>
                              <Table.Cell>{venta.cliente_nombres}</Table.Cell>
                              <Table.Cell>
                                {venta.direccion_domicilio} {venta.apartameto}
                              </Table.Cell>
                              <Table.Cell>{venta.producto}</Table.Cell>
                              <Table.Cell>{venta.cantidad_bidones}</Table.Cell>
                              <Table.Cell>
                                {toMoney(
                                  parseInt(
                                    venta.precio * venta.cantidad_bidones
                                  )
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <span className="flex items-center gap-2">
                                  {venta.domiciliario_nombres && (
                                    <>
                                      <Button size={"xs"}>
                                        <FaPen
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleDomiciliario(
                                              venta.venta_id,
                                              2,
                                              setLoading,
                                              venta.forma_pago_id,
                                              venta.sw_domicilio_recogida
                                            )
                                          }
                                        />
                                      </Button>
                                      {venta.domiciliario_nombres}{" "}
                                      {venta.domiciliario_apellidos}
                                    </>
                                  )}
                                </span>
                              </Table.Cell>
                              <Table.Cell className="flex items-center gap-2">
                                {venta.forma_pago_nombre === null ? null : (
                                  <>
                                    <Button size={"xs"}>
                                      <FaPen
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleFormaPago(
                                            venta.venta_id,
                                            2,
                                            setLoading,
                                            venta.domiciliario_id,
                                            venta.sw_domicilio_recogida,
                                            venta.cantidad_bidones
                                          )
                                        }
                                      />
                                    </Button>
                                    {venta.forma_pago_nombre}
                                  </>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex items-center gap-2">
                                  <ModalDetalle venta={venta} />
                                  {venta.estado_domicilio === 1 ? (
                                    <Badge color="success">
                                      {venta.estado_domicilio_nombre}
                                    </Badge>
                                  ) : (
                                    <Badge color="warning">
                                      {venta.estado_domicilio_nombre}
                                    </Badge>
                                  )}
                                </div>
                              </Table.Cell>
                              <Table.Cell>
                                <FaRegTrashCan
                                  size={22}
                                  className="cursor-pointer text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    handleDeleteVenta(venta.venta_id)
                                  }
                                />
                              </Table.Cell>
                            </Table.Row>
                          );
                        })
                    ) : (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell colSpan={9}>No hay ventas</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
              <div className="overflow-x-auto ">
                <Table className="text-xs ">
                  <Table.Head>
                    <Table.HeadCell colSpan={9}>
                      <span className="flex items-center gap-2">
                        <FaMoon className="text-blue-500" size={22} />
                        <b className="dark:text-white ">Turno de la tarde </b>
                      </span>
                    </Table.HeadCell>
                    <Table.HeadCell>
                      <NavLink to="/despachos">
                        <Button
                          size={"xs"}
                          className="bg-blue-500 hover:bg-blue-700"
                        >
                          Despachos
                        </Button>
                      </NavLink>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Head>
                    <Table.HeadCell>Nro. Venta</Table.HeadCell>
                    <Table.HeadCell>Nombre cliente</Table.HeadCell>
                    <Table.HeadCell>Dirección</Table.HeadCell>
                    <Table.HeadCell>Producto</Table.HeadCell>
                    <Table.HeadCell>Cantidad bidones</Table.HeadCell>
                    <Table.HeadCell>Valor</Table.HeadCell>
                    <Table.HeadCell>Domiciliario</Table.HeadCell>
                    <Table.HeadCell>Forma pago</Table.HeadCell>
                    <Table.HeadCell>Estado</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {ventas.lista_ventas_domicilio.length > 0 ? (
                      ventasDomicilioFiltrados
                        .filter((venta) => venta.turno_tarde === 1)
                        .map((venta) => {
                          return (
                            <Table.Row
                              key={venta.venta_id}
                              className={`bg-white dark:border-gray-700 dark:bg-gray-800 
                      ${
                        venta.estado_domicilio != 2
                          ? " bg-[#59b377] font-semibold text-white border-gray-600 dark:bg-[#3e7e54] dark:text-white"
                          : null
                      }
                            `}
                            >
                              <Table.Cell># {venta.venta_id}</Table.Cell>
                              <Table.Cell>{venta.cliente_nombres}</Table.Cell>
                              <Table.Cell>
                                {venta.direccion_domicilio} {venta.apartameto}
                              </Table.Cell>
                              <Table.Cell>{venta.producto}</Table.Cell>
                              <Table.Cell>{venta.cantidad_bidones}</Table.Cell>
                              <Table.Cell>
                                {toMoney(
                                  parseInt(
                                    venta.precio * venta.cantidad_bidones
                                  )
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <span className="flex items-center gap-2">
                                  {venta.domiciliario_nombres && (
                                    <>
                                      <Button size={"xs"}>
                                        <FaPen
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleDomiciliario(
                                              venta.venta_id,
                                              2,
                                              setLoading,
                                              venta.forma_pago_id,
                                              venta.sw_domicilio_recogida
                                            )
                                          }
                                        />
                                      </Button>
                                      {venta.domiciliario_nombres}{" "}
                                      {venta.domiciliario_apellidos}
                                    </>
                                  )}
                                </span>
                              </Table.Cell>
                              <Table.Cell className="flex items-center gap-2">
                                {venta.forma_pago_nombre === null ? null : (
                                  <>
                                    <Button size={"xs"}>
                                      <FaPen
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleFormaPago(
                                            venta.venta_id,
                                            2,
                                            setLoading,
                                            venta.domiciliario_id,
                                            venta.sw_domicilio_recogida,
                                            venta.cantidad_bidones
                                          )
                                        }
                                      />
                                    </Button>
                                    {venta.forma_pago_nombre}
                                  </>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex items-center gap-2">
                                  <ModalDetalle venta={venta} />
                                  {venta.estado_domicilio === 1 ? (
                                    <Badge color="success">
                                      {venta.estado_domicilio_nombre}
                                    </Badge>
                                  ) : (
                                    <Badge color="warning">
                                      {venta.estado_domicilio_nombre}
                                    </Badge>
                                  )}
                                </div>
                              </Table.Cell>
                              <Table.Cell>
                                <FaRegTrashCan
                                  size={22}
                                  className="cursor-pointer text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    handleDeleteVenta(venta.venta_id)
                                  }
                                />
                              </Table.Cell>
                            </Table.Row>
                          );
                        })
                    ) : (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell colSpan={9}>No hay ventas</Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  );
}
