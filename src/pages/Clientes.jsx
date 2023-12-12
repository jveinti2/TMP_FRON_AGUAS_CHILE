import { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  TextInput,
  Button,
  Checkbox,
  Tooltip,
  Label,
  Textarea,
} from "flowbite-react";
import ModalClientes from "../components/ModalClientes";
import useClientes from "../hooks/useClientes";
import {
  FaTrash,
  FaTriangleExclamation,
  FaHeartCircleExclamation,
  FaCircleRadiation,
} from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { toFormData } from "axios";
// import DataTable from "react-data-table-component";

export default function Clientes() {
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const {
    clientes,
    setClientes,
    getListClientes,
    deleteClienteApi,
    markedCliente,
  } = useClientes();

  useEffect(() => {
    if (loading) {
      toast.loading("Cargando...");
      getListClientes();
      setLoading(false);
    }
  }, [loading]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const getDaysFhUltimaCompra = (fhUltimaCompra) => {
    const fhUltimaCompraDate = new Date(fhUltimaCompra);
    const today = new Date();
    const days = Math.floor(
      (today.getTime() - fhUltimaCompraDate.getTime()) / (1000 * 3600 * 24)
    );
    return days;
  };

  const dataFiltrada = clientes.filter((cliente) => {
    const nombres = cliente.nombres || "";
    const identificacion = cliente.identificacion || "";
    const direccion = cliente.direccion_domicilio || "";
    const apartamento = cliente.apartameto || "";
    const edificio = cliente.edificio || "";
    const telefono = cliente.telefono || "";

    return (
      nombres.toLowerCase().includes(filtro.toLowerCase()) ||
      identificacion.toLowerCase().includes(filtro.toLowerCase()) ||
      direccion.toLowerCase().includes(filtro.toLowerCase()) ||
      apartamento.toLowerCase().includes(filtro.toLowerCase()) ||
      edificio.toLowerCase().includes(filtro.toLowerCase()) ||
      telefono.toLowerCase().includes(filtro.toLowerCase())
    );
  });

  const inactivarCliente = (cliente) => {
    toast(
      <div>
        ¿Está seguro que desea inactivar el cliente {cliente.nombres}?
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              toast.dismiss();
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              deleteClienteApi(cliente.id)
                .then((response) => {
                  if (response.status === 200) {
                    setLoading(true);
                  }
                })
                .catch((error) => console.log(error));
              toast.dismiss();
            }}
          >
            Aceptar
          </Button>
        </div>
      </div>
    );
  };

  const handleMarkedClient = (cliente) => {
    toast(
      <div>
        Está por marcar al cliente {cliente.nombres}?
        <div>
          <div className="max-w-md">
            <div className=" mb-2 block">
              <Label
                className="dark:text-slate-900"
                htmlFor="comment"
                value="Agrege la descripción de la novedad por la cual marcará al cliente"
              />
            </div>
            <Textarea
              id="comment"
              name="comment"
              className="p-2 dark:bg-slate-50 dark:text-gray-600"
              placeholder="El cliente no tiene buen comportamiento de pago"
              required
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              toast.dismiss();
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              const value = document.getElementById("comment").value;
              const data = {
                id: cliente.id,
                descripcion: value,
              };
              value === ""
                ? toast.error("Debe agregar una descripción")
                : (markedCliente(data)
                    .then((response) => {
                      setLoading(true);
                    })
                    .catch((error) => console.log(error)),
                  toast.dismiss());
            }}
          >
            Aceptar
          </Button>
        </div>
      </div>
    );
  };

  const columns = [
    {
      name: "Identificacion",
      selector: (row) => row.identificacion,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombres,
      sortable: true,
    },
    {
      name: "Dirección",
      selector: (row) => row.direccion_domicilio,
      sortable: true,
    },
    {
      name: "Apartamento",
      selector: (row) => row.apartameto,
      sortable: true,
    },
    {
      name: "Edificio",
      selector: (row) => row.edificio,
      sortable: true,
    },
    {
      name: "Telefono",
      selector: (row) => row.telefono,
      sortable: true,
    },
    {
      name: "Novedad cliente",
      selector: (row) => row.descripcion,
      sortable: true,
      cell: (row) => {
        return row.descripcion !== "" && row.descripcion !== null ? (
          <Tooltip content={row.descripcion}>
            <FaTriangleExclamation size={15} />
          </Tooltip>
        ) : null;
      },
    },
    {
      name: "Fecha ultima compra",
      selector: (row) => row.ultima_compra,
      sortable: true,
      cell: (row) => {
        return row.ultima_compra !== null &&
          getDaysFhUltimaCompra(row.ultima_compra) > 29 ? (
          <>
            {row.ultima_compra}{" "}
            <FaHeartCircleExclamation className="ml-2" size={15} />
          </>
        ) : (
          row.ultima_compra
        );
      },
    },
    {
      name: "Acciones",
      selector: (row) => row.acciones,
      sortable: true,
    },
  ];

  const data = dataFiltrada.map((cliente) => ({
    id: cliente.id,
    identificacion: cliente.identificacion,
    nombres: cliente.nombres,
    direccion_domicilio: cliente.direccion_domicilio,
    apartameto: cliente.apartameto,
    edificio: cliente.edificio,
    telefono: cliente.telefono,
    descripcion: cliente.descripcion,
    ultima_compra: cliente.fh_ultima_compra,
    // descripcion: cliente.sw_novedad ? (
    //   <Tooltip content={cliente.descripcion}>
    //     <FaTriangleExclamation size={15} />
    //   </Tooltip>
    // ) : null,
    // ultima_compra: cliente.fh_ultima_compra != null &&
    //   getDaysFhUltimaCompra(cliente.fh_ultima_compra) > 29 && (
    //     <Tooltip
    //       content={`Ultima fecha de compra: ${cliente.fh_ultima_compra}`}
    //     >
    //       <FaHeartCircleExclamation size={15} />
    //     </Tooltip>
    //   ),
    acciones: (
      <>
        <div className="flex items-center gap-1">
          <ModalClientes clienteEdit={cliente} setLoading={setLoading} />
          <FaTrash
            onClick={() => inactivarCliente(cliente)}
            size={"20"}
            color="red"
            className="cursor-pointer hover:text-red-500"
          />
          {!cliente.sw_novedad && (
            <Button size={"xs"} onClick={() => handleMarkedClient(cliente)}>
              <FaTriangleExclamation size={15} />
            </Button>
          )}
        </div>
      </>
    ),
  }));

  return (
    <div className="p-1 md:p-5 w-full  overflow-auto h-full">
      <div className="space-y-2 mb-20">
        <div className="flex justify-between">
          <h2 className="text-xl md:text-2xl font-semibold leading-tight dark:text-white">
            Clientes
          </h2>
          <ModalClientes setLoading={setLoading} />
        </div>
        {/* <TextInput
          placeholder="Buscar"
          type="text"
          onChange={handleFiltroChange}
          value={filtro}
        /> */}
        {/*<DataTable
          className="bg-white dark:border-gray-700 dark:bg-gray-800"
          columns={columns}
          data={data}
          pagination={true}
          paginationPerPage={10}
        /> */}
        <TextInput
          placeholder="Buscar"
          // value={filtro}
          // onChange={handleFiltroChange}
        />
        <div className="overflow-x-auto">
          <Table striped className="text-xs">
            <Table.Head>
              <Table.HeadCell>Identificacion</Table.HeadCell>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Dirección</Table.HeadCell>
              <Table.HeadCell>Departamento</Table.HeadCell>
              <Table.HeadCell>Edificio</Table.HeadCell>
              <Table.HeadCell>Telefono</Table.HeadCell>
              <Table.HeadCell>Novedad cliente</Table.HeadCell>
              <Table.HeadCell>Novedad compra</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <Table.Row
                    key={cliente.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="">
                      {cliente.identificacion}
                    </Table.Cell>
                    <Table.Cell>{cliente.nombres}</Table.Cell>
                    <Table.Cell>{cliente.direccion_domicilio}</Table.Cell>
                    <Table.Cell>{cliente.apartameto}</Table.Cell>
                    <Table.Cell>{cliente.edificio}</Table.Cell>
                    <Table.Cell>{cliente.telefono}</Table.Cell>
                    <Table.Cell className="flex items-center gap-2">
                      {cliente.sw_novedad ? (
                        <Tooltip content={cliente.descripcion}>
                          <FaCircleRadiation size={15} />
                        </Tooltip>
                      ) : null}
                    </Table.Cell>
                    <Table.Cell>
                      {cliente.fh_ultima_compra != null &&
                        getDaysFhUltimaCompra(cliente.fh_ultima_compra) >
                          29 && (
                          <Tooltip
                            content={`Ultima fecha de compra: ${cliente.fh_ultima_compra}`}
                          >
                            <FaHeartCircleExclamation size={15} />
                          </Tooltip>
                        )}
                    </Table.Cell>

                    <Table.Cell className="flex items-center gap-2">
                      <ModalClientes
                        clienteEdit={cliente}
                        setLoading={setLoading}
                      />
                      <FaTrash
                        onClick={() => inactivarCliente(cliente)}
                        size={"20"}
                        color="red"
                        className="cursor-pointer hover:text-red-500"
                      />
                      {!cliente.sw_novedad && (
                        <Button
                          size={"xs"}
                          onClick={() => handleMarkedClient(cliente)}
                        >
                          <FaCircleRadiation size={15} />
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell colSpan="7" className="text-center">
                    <p>No hay clientes registrados</p>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
