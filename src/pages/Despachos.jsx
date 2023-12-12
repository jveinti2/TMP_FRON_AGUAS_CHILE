import {
  Table,
  Badge,
  Button,
  TextInput,
  Datepicker,
  Accordion,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { getVentasApi, postDomicilioApi } from "../services/ventas.services";
import toast from "react-hot-toast";
import toMoney from "../utils/toMoney";
import { FaPen, FaWhatsapp } from "react-icons/fa6";
import useFormaPago from "../hooks/useFormaPago";
import FiltroFechaDespacho from "../components/FiltroFechaDespacho";
import toFormatDate from "../utils/toFormatDate";
import { getDomiciliariosApi } from "../services/domiciliarios.services";
import ButtonReload from "../components/ButtonReload";
import ModalDetalle from "../components/ModalDetalle";

import {
  postRecogerBidonesApi,
  postUpdateDomiciliarioApi,
} from "../services/ventas.services";

export default function Despachos() {
  const [filtro, setFiltro] = useState("");
  const [domicilios, setDomicilios] = useState([]);
  const [domiciliosPendientes, setDomiciliosPendientes] = useState([]);
  const [bidonesPendientes, setBidonesPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleEntregarDomicilio, handleFormaPago } = useFormaPago(setLoading);
  const [domiciliarios, setDomiciliarios] = useState([]);

  useEffect(() => {
    if (loading) {
      getVentasApi().then((response) => {
        setDomicilios(response.ventas.filter((venta) => venta.domicilio));
        setDomiciliosPendientes(response.domicilios_pendientes);
        setBidonesPendientes(response.pendiente_recoger_bidones);
      });
      getDomiciliariosApi().then((response) => {
        setDomiciliarios(response.domiciliarios);
        console.log(response.domiciliarios);
      });
      setLoading(false);
    }
  }, [loading]);

  const sendWhatsapp = (telefono) => {
    window.open(`https://api.whatsapp.com/send?phone=${telefono}&text=Hola,`);
  };

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const domiciliosFiltrados = domicilios.filter(
    (domicilio) =>
      `${domicilio.cliente_nombres} ${domicilio.cliente_apellidos}`
        .toLowerCase()
        .includes(filtro.toLowerCase()) ||
      domicilio.venta_id.toString().includes(filtro.toLowerCase()) ||
      domicilio.identificacion.toString().includes(filtro.toLowerCase()) ||
      domicilio.direccion_domicilio
        .toLowerCase()
        .includes(filtro.toLowerCase()) ||
      `${domicilio.domiciliario_nombres} ${domicilio.domiciliario_apellidos}`
        .toLowerCase()
        .includes(filtro.toLowerCase())
  );

  const data_form = {
    fh_creacion: "",
    fh_modificacion: "",
  };

  const handleDateChange = (date) => {
    data_form.fh_creacion = date;
    getVentasApi(data_form).then((response) => {
      setDomicilios(response.ventas.filter((venta) => venta.domicilio));
    });
  };

  const handleRecogerBidones = (id) => {
    toast(
      <div className="space-y-2">
        <p>¿Está seguro que desea recoger los bidones?</p>
        <div className="flex justify-end gap-2">
          <Button
            size={"xs"}
            color="success"
            onClick={() => {
              toast
                .promise(
                  postRecogerBidonesApi(id),
                  {
                    loading: "Recogiendo bidones...",
                    success: (response) => {
                      if (response.status === 200) {
                        return response.mensaje;
                      }
                    },
                    error: (error) => {
                      toast.error(error);
                    },
                  },
                  {
                    style: {
                      borderRadius: "10px",
                      background: "#333",
                      color: "#fff",
                    },
                  }
                )
                .then(() => {
                  getVentasApi().then((response) => {
                    setLoading(true);
                  });
                  toast.dismiss();
                })
                .catch((error) => console.log(error));
            }}
          >
            Sí
          </Button>
          <Button size={"xs"} color="failure" onClick={() => toast.dismiss()}>
            No
          </Button>
        </div>
      </div>,
      { duration: Infinity }
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
        getVentasApi().then((response) => {
          setLoading(true);
        });
        toast.dismiss();
      })
      .catch((error) => console.log(error));
  };

  const realoadData = () => {
    console.log("realoadData");
    toast.loading("Cargando...");
    setTimeout(() => {
      setLoading(true);
      toast.dismiss();
    }, 2000);
  };

  return (
    <div className="p-1 md:p-5 w-full  overflow-auto h-full">
      <div className="space-y-2 mb-20">
        <div className="flex justify-between">
          <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
            Modulo de despachos
          </h2>
        </div>

        <div className="space-y-2">
          <div className="">
            <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
              Domicilios
            </h2>
            <div className="md:w-1/4 flex items-center gap-2">
              <Datepicker
                className="w-full"
                language="es-ES"
                labelClearButton="Limpiar"
                labelTodayButton="Hoy"
                onSelectedDateChanged={handleDateChange}
              />
              <ButtonReload functionName={realoadData} />
            </div>
          </div>
          <TextInput
            className="text-sm md:text-base"
            placeholder="Buscar"
            value={filtro}
            onChange={handleFiltroChange}
          />
          <div className="overflow-x-auto">
            <Table className="text-xs shadow-xl">
              <Table.Head>
                <Table.HeadCell>Nro. Venta</Table.HeadCell>
                <Table.HeadCell>Dirección</Table.HeadCell>
                <Table.HeadCell>Domiciliario</Table.HeadCell>
                <Table.HeadCell>Cantidad bidones</Table.HeadCell>
                <Table.HeadCell>Producto</Table.HeadCell>
                <Table.HeadCell>Valor domicilio</Table.HeadCell>
                <Table.HeadCell>Forma de pago</Table.HeadCell>
                <Table.HeadCell>Estado</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {domicilios.length > 0 ? (
                  domiciliosFiltrados.map((domicilio) => (
                    <Table.Row
                      key={domicilio.id}
                      className={`bg-white dark:border-gray-700 dark:bg-gray-800 
                      ${
                        domicilio.estado_domicilio != 2
                          ? " bg-[#59b377] font-semibold text-white border-gray-600 dark:bg-[#3e7e54] dark:text-white"
                          : null
                      }
                      `}
                    >
                      <Table.Cell># {domicilio.venta_id}</Table.Cell>
                      <Table.Cell>{`${domicilio.direccion_domicilio}`}</Table.Cell>
                      <Table.Cell className="flex items-center gap-2">
                        {domicilio.domiciliario_nombres === null ? null : (
                          <>
                            <Button size={"xs"}>
                              <FaPen
                                className=" cursor-pointer"
                                onClick={() =>
                                  handleUpdateDomiciliario(
                                    domicilio.venta_id,
                                    setLoading
                                  )
                                }
                              />
                            </Button>
                            {domicilio.domiciliario_nombres}{" "}
                            {domicilio.domiciliario_apellidos}
                          </>
                        )}
                      </Table.Cell>
                      <Table.Cell>{domicilio.cantidad_bidones}</Table.Cell>
                      <Table.Cell>{domicilio.producto}</Table.Cell>
                      <Table.Cell>
                        {toMoney(
                          parseInt(domicilio.precio) *
                            parseInt(domicilio.cantidad_bidones)
                        )}
                      </Table.Cell>

                      <Table.Cell className="flex items-center gap-2">
                        {domicilio.forma_pago_nombre === null ? null : (
                          <>
                            <Button size={"xs"}>
                              <FaPen
                                className="cursor-pointer"
                                onClick={() =>
                                  handleFormaPago(
                                    domicilio.venta_id,
                                    2,
                                    setLoading,
                                    domicilio.domiciliario_id,
                                    domicilio.sw_domicilio_recogida
                                  )
                                }
                              />
                            </Button>
                            {domicilio.forma_pago_nombre}
                          </>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          className="shadow-xl"
                          color={
                            domicilio.estado_domicilio === 1
                              ? "success"
                              : domicilio.estado_domicilio === 2
                              ? "warning"
                              : "failure"
                          }
                        >
                          {domicilio.estado_domicilio_nombre}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <ModalDetalle venta={domicilio} />
                          <FaWhatsapp
                            onClick={() => {
                              sendWhatsapp(domicilio.telefono);
                            }}
                            className={`cursor-pointer text-green-500 hover:text-green-700
                            ${
                              domicilio.estado_domicilio != 2
                                ? " bg-[#59b377] font-semibold text-white border-gray-600 dark:bg-[#3e7e54] dark:text-white"
                                : null
                            }
                            `}
                            size={22}
                          />
                          {/* Buttón con el flujo completo */}
                          {domicilio.estado_domicilio === 2 && (
                            <Button
                              onClick={() =>
                                handleEntregarDomicilio(
                                  domicilio,
                                  1,
                                  setLoading
                                )
                              }
                              size={"xs"}
                              className="bg-blue-500 hover:bg-blue-700"
                            >
                              Entregar
                            </Button>
                          )}

                          {/* Botón solo forma de pago */}
                          {domicilio.estado_domicilio === 3 && (
                            <Button
                              onClick={() =>
                                handleFormaPago(
                                  domicilio.venta_id,
                                  1,
                                  setLoading,
                                  domicilio.domiciliario_id,
                                  domicilio.sw_domicilio_recogida
                                )
                              }
                              size={"xs"}
                              className="bg-blue-500 hover:bg-blue-700"
                            >
                              Facturar
                            </Button>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={10}>No hay ventas</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>

        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title className="bg-white dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <span>Domicilios pendientes por entregar o facturar</span>
                <Badge color="warning">{domiciliosPendientes.length}</Badge>
              </div>
            </Accordion.Title>
            <Accordion.Content className="p-1">
              <div className="overflow-x-auto ">
                <Table className="text-xs">
                  <Table.Head>
                    <Table.HeadCell>Nro. Venta</Table.HeadCell>
                    <Table.HeadCell>Dirección</Table.HeadCell>
                    <Table.HeadCell>Domiciliario</Table.HeadCell>
                    <Table.HeadCell>Cantidad bidones</Table.HeadCell>
                    <Table.HeadCell>Valor domicilio</Table.HeadCell>
                    <Table.HeadCell>Fecha de venta</Table.HeadCell>
                    <Table.HeadCell>Forma de pago</Table.HeadCell>
                    <Table.HeadCell>Estado</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {domiciliosPendientes.length > 0 ? (
                      domiciliosPendientes.map((domicilio) => (
                        <Table.Row
                          key={domicilio.id}
                          className={`bg-white dark:border-gray-700 dark:bg-gray-800 
                      ${
                        domicilio.estado_domicilio != 2
                          ? " bg-[#59b377] font-semibold text-white border-gray-600 dark:bg-[#3e7e54] dark:text-white"
                          : null
                      }
                      `}
                        >
                          <Table.Cell># {domicilio.venta_id}</Table.Cell>
                          <Table.Cell>{`${domicilio.direccion_domicilio}`}</Table.Cell>
                          <Table.Cell>
                            {domicilio.domiciliario_nombres &&
                              `${domicilio.domiciliario_nombres} ${domicilio.domiciliario_apellidos}`}
                          </Table.Cell>
                          <Table.Cell>{domicilio.cantidad_bidones}</Table.Cell>
                          <Table.Cell>
                            {toMoney(
                              parseInt(domicilio.precio) *
                                parseInt(domicilio.cantidad_bidones)
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {toFormatDate(domicilio.fh_creacion)}
                          </Table.Cell>
                          <Table.Cell className="flex items-center gap-2">
                            {domicilio.forma_pago_nombre === null ? null : (
                              <>
                                <Button size={"xs"}>
                                  <FaPen
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleEntregarDomicilio(
                                        domicilio.venta_id,
                                        2,
                                        setLoading
                                      )
                                    }
                                  />
                                </Button>
                                {domicilio.forma_pago_nombre}
                              </>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              color={
                                domicilio.estado_domicilio === 1
                                  ? "success"
                                  : domicilio.estado_domicilio === 2
                                  ? "warning"
                                  : "failure"
                              }
                            >
                              {domicilio.estado_domicilio_nombre}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell className="flex items-center gap-2">
                            <FaWhatsapp
                              onClick={() => {
                                sendWhatsapp(domicilio.telefono);
                              }}
                              className={`cursor-pointer text-green-500 hover:text-green-700
                            ${
                              domicilio.estado_domicilio != 2
                                ? " bg-[#59b377] font-semibold text-white border-gray-600 dark:bg-[#3e7e54] dark:text-white"
                                : null
                            }
                            `}
                              size={22}
                            />
                            {/* Buttón con el flujo completo */}
                            {domicilio.estado_domicilio === 2 && (
                              <Button
                                onClick={() =>
                                  handleEntregarDomicilio(
                                    domicilio,
                                    1,
                                    setLoading
                                  )
                                }
                                size={"xs"}
                                className="bg-blue-500 hover:bg-blue-700"
                              >
                                Entregar
                              </Button>
                            )}

                            {/* Botón solo forma de pago */}
                            {domicilio.estado_domicilio === 3 && (
                              <Button
                                onClick={() =>
                                  handleFormaPago(
                                    domicilio.venta_id,
                                    1,
                                    setLoading,
                                    domicilio.domiciliario_id,
                                    domicilio.sw_domicilio_recogida
                                  )
                                }
                                size={"xs"}
                                className="bg-blue-500 hover:bg-blue-700"
                              >
                                Facturar
                              </Button>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      ))
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

        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title className="bg-white dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <span>Pendientes recoger bidones</span>
                <Badge color="warning">{bidonesPendientes.length}</Badge>
              </div>
            </Accordion.Title>
            <Accordion.Content className="p-1">
              <div className="overflow-x-auto ">
                <Table striped className="text-xs ">
                  <Table.Head>
                    <Table.HeadCell>Nro. Venta</Table.HeadCell>
                    <Table.HeadCell>Dirección</Table.HeadCell>
                    <Table.HeadCell>Telefono</Table.HeadCell>
                    <Table.HeadCell>Domiciliario</Table.HeadCell>
                    <Table.HeadCell>Producto</Table.HeadCell>
                    <Table.HeadCell>Cantidad</Table.HeadCell>
                    <Table.HeadCell>Valor domicilio</Table.HeadCell>
                    <Table.HeadCell>Fecha de venta</Table.HeadCell>
                    {/* <Table.HeadCell>Forma de pago</Table.HeadCell> */}
                    <Table.HeadCell>
                      <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {bidonesPendientes.length > 0 ? (
                      bidonesPendientes.map((domicilio) => (
                        <Table.Row
                          key={domicilio.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell># {`${domicilio.venta_id}`}</Table.Cell>
                          <Table.Cell>{`${domicilio.direccion_domicilio}`}</Table.Cell>
                          <Table.Cell>{`${domicilio.telefono}`}</Table.Cell>
                          <Table.Cell>
                            {domicilio.domiciliario_nombres &&
                              `${domicilio.domiciliario_nombres} ${domicilio.domiciliario_apellidos}`}
                          </Table.Cell>
                          <Table.Cell>{domicilio.producto}</Table.Cell>
                          <Table.Cell>{domicilio.cantidad_bidones}</Table.Cell>
                          <Table.Cell>
                            {toMoney(
                              parseInt(domicilio.precio) *
                                parseInt(domicilio.cantidad_bidones)
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {toFormatDate(domicilio.fh_creacion)}
                          </Table.Cell>
                          <Table.Cell className="flex items-center gap-2">
                            <Button
                              size={"xs"}
                              className="cursor-pointer"
                              onClick={() =>
                                handleRecogerBidones(
                                  domicilio.venta_id,
                                  setLoading
                                )
                              }
                            >
                              Recoger
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))
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
