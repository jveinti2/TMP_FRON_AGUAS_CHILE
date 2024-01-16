import { useState, useContext } from "react";
import {
  Accordion,
  Table,
  Badge,
  TextInput,
  Button,
  Tooltip,
} from "flowbite-react";
import { postEdificio } from "../services/edificios.services";
import toast from "react-hot-toast";
import {
  FaLock,
  FaPen,
  FaCirclePlus,
  FaUser,
  FaBottleWater,
  FaPlus,
  FaCircleExclamation,
  FaCircleMinus,
} from "react-icons/fa6";
import useModulos from "../hooks/useModulos";
import { DashboardContext } from "../context/Dashboard";
import ButtonReload from "./ButtonReload";
import ModalObservacionModulo from "./ModalObservacionModulo";
import useDashboard from "../hooks/useDashboard";

export default function AcordionEdificios() {
  const [isAccordionCollapsed, setIsAccordionCollapsed] = useState(true);
  const [filtro, setFiltro] = useState("");
  const { postPassword, postModulo, postReloadModulos } = useModulos();
  const { realoadData } = useDashboard();

  const { dashboard, setLoading } = useContext(DashboardContext);

  const bidonesModulo = (modulo) => {
    const {
      capacidad_bidones,
      cantidad_bidones,
      pendiente_recarga,
      bindon_cliente_nuevo,
    } = modulo;

    const bidones = [];
    let restantesBindonNuevo = bindon_cliente_nuevo;

    for (let i = 0; i < capacidad_bidones; i++) {
      if (i < cantidad_bidones) {
        bidones.push(
          <FaBottleWater
            color="green"
            className="text-gray-400 text-xl md:text-2xl"
            key={i}
          />
        );
      } else if (i < cantidad_bidones + pendiente_recarga) {
        if (
          restantesBindonNuevo > 0 &&
          pendiente_recarga >= restantesBindonNuevo
        ) {
          bidones.push(
            <FaBottleWater
              color="blue"
              className="text-gray-400 text-xl md:text-2xl"
              key={i}
            />
          );
          restantesBindonNuevo = restantesBindonNuevo - 1;
        } else {
          bidones.push(
            <FaBottleWater
              color="#6d4534"
              className="text-gray-400 text-xl md:text-2xl"
              key={i}
            />
          );
        }
      } else {
        if (restantesBindonNuevo > 0) {
          bidones.push(
            <FaBottleWater
              color="blue"
              className="text-gray-400 text-xl md:text-2xl"
              key={i}
            />
          );
          restantesBindonNuevo = restantesBindonNuevo - 1;
        } else {
          bidones.push(
            <FaBottleWater
              color="red"
              className="text-gray-400 text-xl md:text-2xl"
              key={i}
            />
          );
        }
      }
    }

    return bidones;
  };

  const alertPassword = (modulo) => {
    const fechaCreacion = new Date(modulo.updated_at);
    const fechaActual = new Date();
    const diferencia = fechaActual.getTime() - fechaCreacion.getTime();
    const diferenciaDias = Math.round(diferencia / (1000 * 60 * 60 * 24));

    if (diferenciaDias > 30) {
      return (
        <Badge color="red" className=" w-max">
          <span className="flex items-center gap-1">
            <span className="hidden md:block">Vencida</span>
            <FaLock className="inline-block ml-1" /> {modulo.password}
          </span>
        </Badge>
      );
    } else if (diferenciaDias > 20) {
      return (
        <Badge color="yellow" className=" w-max">
          <span className="flex items-center gap-1">
            <span className="hidden md:block">Por vencer</span>
            <FaLock className="inline-block ml-1" /> {modulo.password}
          </span>
        </Badge>
      );
    } else {
      return (
        <Badge color="green" className="w-max ">
          <span className="flex items-center gap-1">
            <span className="hidden md:block">Vigente</span>
            <FaLock className="inline-block ml-1" /> {modulo.password}
          </span>
        </Badge>
      );
    }
  };

  const cantidadBindonesEdificio = (edificio) => {
    let cantidad = 0;
    edificio.modulos.forEach((modulo) => {
      cantidad += modulo.cantidad_bidones;
    });
    return cantidad;
  };

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const edificiosFiltrados = dashboard.edificios.filter(
    (edificio) =>
      edificio.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      edificio.zona.toLowerCase().includes(filtro.toLowerCase())
  );

  const updatePassword = (edificio, modulo) => {
    const values = {
      edificio_id: edificio.id,
      modulo: modulo.id,
      password: modulo.password,
      bidones: "",
    };
    toast(
      <div className="p-2">
        <h5 className=" font-semibold">Actualizar contraseña</h5>
        <h6 className="text-base">Contraseña actual: {modulo.password}</h6>
        <div className="space-y-2">
          <input
            onChange={(e) => {
              values.password = e.target.value;
            }}
            type="number"
            className="border rounded-md p-1 text-sm md:text-base"
            placeholder="Nueva contraseña"
          />
          <div className="flex gap-2 justify-center">
            <Button
              size={"xs"}
              color="success"
              onClick={async () => {
                await postPassword(values);
                setLoading(true);
              }}
            >
              Actualizar
            </Button>
            <Button
              size={"xs"}
              color="failure"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    ),
      {
        duration: Infinity,
      };
  };
  const updateEdificio = (edificio) => {
    const values = {
      id: edificio.id,
      nombre: edificio.nombre,
      direccion: edificio.direccion,
      telefono: edificio.telefono,
      responsable: edificio.responsable,
      zona: edificio.zona,
      llave_maestra: edificio.llave_maestra,
    };
    // Update de llave maestra
    toast(
      <div className="p-2">
        <h3 className="text-lg font-semibold">Actualizar contraseña</h3>
        <p>Contraseña actual: {edificio.llave_maestra}</p>
        <div className="space-y-2">
          <input
            onChange={(e) => {
              values.llave_maestra = e.target.value;
            }}
            type="number"
            className="border rounded-md p-1"
            placeholder="Nueva contraseña"
          />
          <div className="flex gap-2">
            <Button
              size={"xs"}
              color="success"
              onClick={async () => {
                toast.dismiss();
                await postEdificio(values);
                setLoading(true);
              }}
            >
              Actualizar contraseña
            </Button>
            <Button
              size={"xs"}
              color="failure"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    ),
      {
        duration: 10000,
      };
  };

  const addBidon = async (modulo) => {
    if (modulo.capacidad_bidones == modulo.cantidad_bidones) {
      toast.error("El módulo ya está lleno");
      return;
    }

    const values = {
      bandera: 1,
      edificio_id: modulo.edificio_id,
      modulo: modulo.id,
      password: modulo.password,
      bidones: 1,
      pendiente_recarga: modulo.pendiente_recarga,
    };

    toast(
      <div className="p-2">
        <h3 className="text-lg font-semibold">Agregar bidón</h3>
        <p>
          ¿Está seguro de recargar 1 bidon{" "}
          {!modulo.pendiente_recarga && "completo"} al modulo?
        </p>
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <Button
              size={"xs"}
              color="success"
              onClick={async () => {
                await postPassword(values);
                try {
                  setIsAccordionCollapsed(false);
                  setLoading(true);
                } catch (error) {
                  console.log(error);
                } finally {
                  toast.dismiss();
                }
              }}
            >
              Actualizar
            </Button>
            <Button
              size={"xs"}
              color="failure"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>,
      {
        duration: 10000,
      }
    );
  };
  const removeBidon = async (modulo) => {
    if (modulo.cantidad_bidones == 0) {
      toast.error("El módulo ya está vacio");
      return;
    }

    const values = {
      bandera: 0,
      edificio_id: modulo.edificio_id,
      modulo: modulo.id,
      password: modulo.password,
      bidones: 1,
      pendiente_recarga: 0,
    };

    toast(
      <div className="p-2">
        <h3 className="text-lg font-semibold">Remover bidón</h3>
        <p>¿Está seguro de remover 1 bidon del modulo?</p>
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <Button
              size={"xs"}
              color="success"
              onClick={async () => {
                await postPassword(values);
                setIsAccordionCollapsed(false);
                setLoading(true);
                toast.dismiss();
              }}
            >
              Actualizar
            </Button>
            <Button
              size={"xs"}
              color="failure"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>,
      {
        duration: 10000,
      }
    );
  };

  const addBidonesAllModulos = async (edificio) => {
    const value = {
      edificio_id: edificio.id,
    };

    toast(
      <div className="p-2">
        <h3 className="text-lg font-semibold">
          Recargar todos los modulos de {edificio.nombre}
        </h3>
        <p>¿Está seguro de recargar todos los modulos?</p>
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <Button
              size={"xs"}
              color="success"
              onClick={async () => {
                await postReloadModulos(value);
                setIsAccordionCollapsed(false);
                setLoading(true);
                toast.dismiss();
              }}
            >
              Actualizar
            </Button>
            <Button
              size={"xs"}
              color="failure"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>,
      {
        duration: 10000,
      }
    );
  };

  const editNombreModulo = (modulo) => {
    const values = {
      modulo_id: modulo.id,
      nombre: "",
    };
    toast(
      <div className="p-2">
        <h3 className="text-lg font-semibold">Editar nombre del módulo</h3>
        <p>Nombre actual: {modulo.nombre}</p>
        <div className="space-y-2">
          <input
            onChange={(e) => {
              values.nombre = e.target.value;
            }}
            type="text"
            className="border rounded-md p-1"
            placeholder="Nuevo nombre"
          />
          <div className="flex gap-2">
            <Button
              size={"xs"}
              color="success"
              onClick={async () => {
                // console.log(values);
                await postModulo(values);
                setLoading(true);
              }}
            >
              Actualizar
            </Button>
            <Button
              size={"xs"}
              color="failure"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    ),
      {
        duration: 50000,
      };
  };

  const clientsByBuilding = (edificio) => {
    return dashboard.clientes.filter(
      (cliente) => cliente.edificio_id === edificio.id
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="text-lg md:text-2xl font-semibold leading-tight dark:text-white">
          Estado edificios
        </h3>
        <ButtonReload functionName={realoadData} />
      </div>
      <TextInput
        className="text-sm md:text-base"
        placeholder="Buscar por edificio o zona"
        value={filtro}
        onChange={handleFiltroChange}
      />
      {dashboard.edificios.length > 0 && (
        <Accordion collapseAll={isAccordionCollapsed} className="space-y-2">
          {edificiosFiltrados.map((edificio) => (
            <Accordion.Panel key={edificio.id}>
              <Accordion.Title className="bg-white dark:bg-gray-800 p-3">
                <div className="flex gap-1 items-center">
                  <span className="text-sm md:text-base">
                    {edificio.nombre}
                  </span>

                  <div className="flex items-center gap-1">
                    <Tooltip content="Clientes por edificio">
                      <Badge color="success">
                        <span className="flex gap-1 items-center">
                          <FaUser />
                          <span className="hidden md:block">Clientes</span>
                          {clientsByBuilding(edificio).length}
                        </span>
                      </Badge>
                    </Tooltip>

                    {cantidadBindonesEdificio(edificio) <= 4 ? (
                      <Badge color="red">
                        <span className="flex items-center gap-2">
                          <span className="hidden md:block">
                            Quedan en stock
                          </span>
                          <FaBottleWater />
                          {cantidadBindonesEdificio(edificio)}
                        </span>
                      </Badge>
                    ) : (
                      <Badge color="green">
                        <span className="flex items-center gap-2">
                          <span className="hidden md:block">Con stock de</span>
                          <FaBottleWater />
                          {cantidadBindonesEdificio(edificio)}
                        </span>
                      </Badge>
                    )}
                    <Tooltip content="Clientes por edificio">
                      <Badge color="success">
                        <span className="flex gap-1 items-center">
                          <span className="hidden md:block">
                            {" "}
                            Llave maestra{" "}
                          </span>
                          <FaLock />
                          {edificio.llave_maestra}
                          <FaPen
                            className="cursor-pointer"
                            onClick={() => updateEdificio(edificio)}
                          />
                        </span>
                      </Badge>
                    </Tooltip>
                  </div>
                </div>
              </Accordion.Title>
              <Accordion.Content
                className="
         					bg-white px-1 py-3 md:p-4 space-y-2
         				"
              >
                {edificio.modulos.find(
                  (modulo) => modulo.cantidad_bidones < modulo.capacidad_bidones
                ) && (
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => addBidonesAllModulos(edificio)}
                    size={"xs"}
                  >
                    <FaPlus className="inline-block mr-1" />
                    Recargar todos los modulos
                  </Button>
                )}
                <Table className="text-xs md:text-lg">
                  <Table.Head>
                    <Table.HeadCell className="p-1">Modulos</Table.HeadCell>
                    <Table.HeadCell className="flex items-center justify-center p-1">
                      <span className="flex items-center gap-1">
                        Bidones disponibles
                        <Tooltip
                          content={`🟢: Disponible, 🟤: Pendiente recarga, 🔴: No disponible, 🔵: Bidon cliente nuevo`}
                        >
                          <FaCircleExclamation />
                        </Tooltip>
                      </span>
                    </Table.HeadCell>
                    <Table.HeadCell className="p-1">Contraseña</Table.HeadCell>
                    <Table.HeadCell className="p-1">Observación</Table.HeadCell>
                  </Table.Head>
                  <Table.Body
                    className="divide-y
         						bg-white dark:border-gray-700 dark:bg-gray-800
         						"
                  >
                    {edificio.modulos.length > 0 ? (
                      edificio.modulos.map((modulo) => (
                        <Table.Row
                          key={modulo.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="flex gap-2 font-medium text-gray-900 dark:text-white px-2 items-center">
                            <span className="text-xs md:text-normal">
                              {modulo.nombre}
                            </span>
                            <FaPen
                              className="cursor-pointer"
                              onClick={() => {
                                editNombreModulo(modulo);
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center justify-center">
                              <FaCircleMinus
                                className={`${
                                  modulo.cantidad_bidones == 0 && "hidden"
                                } cursor-pointer`}
                                onClick={() => removeBidon(modulo)}
                              />
                              <span className="flex items-center md:gap-1">
                                {bidonesModulo(modulo)}{" "}
                              </span>
                              <FaCirclePlus
                                className={`${
                                  modulo.cantidad_bidones ==
                                    modulo.capacidad_bidones && "hidden"
                                } cursor-pointer`}
                                onClick={() => addBidon(modulo)}
                              />
                            </div>
                          </Table.Cell>
                          <Table.Cell className="px-2 flex items-center gap-2">
                            {alertPassword(modulo)}
                            <FaPen
                              className="cursor-pointer"
                              onClick={() => {
                                updatePassword(edificio, modulo);
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <ModalObservacionModulo
                              modulo={modulo}
                              setLoading={setLoading}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row className="text-center">
                        <Table.Cell colSpan={7}>
                          No hay modulos registrados
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      )}
    </div>
  );
}
