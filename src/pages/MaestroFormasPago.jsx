import { useState, useEffect } from "react";
import { Table, Badge, Button } from "flowbite-react";
import { getListaFormasPagoApi } from "../services/listas.services.js";
import { anularFormaPagoApi } from "../services/formasPago.services.js";
import ModalFormasPago from "../components/ModalFormasPago.jsx";
import { FaTrash } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

export default function MaestroFormasPago() {
  const [loading, setLoading] = useState(true);
  const [formasPago, setFormasPago] = useState([]);

  useEffect(() => {
    if (loading) {
      getListaFormasPagoApi()
        .then((response) => {
          if (response.status === 200) {
            setFormasPago(response.formas_pago);
          }
        })
        .catch((error) => console.log(error));
      setLoading(false);
    }
  }, [loading]);

  const anularFormaPago = (id) => {
    toast(
      <div>
        ¿Está seguro que desea anular la forma de pago?
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
              anularFormaPagoApi(id)
                .then((response) => {
                  if (response.status === 200) {
                    setLoading(true);
                    toast.dismiss();
                  }
                })
                .catch((error) => console.log(error));
            }}
          >
            Aceptar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2  overflow-auto h-full">
      <div className="flex justify-between">
        <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
          Maestro formas de pago
        </h2>
        <ModalFormasPago setLoading={setLoading} />
      </div>
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {formasPago.length > 0 ? (
              formasPago.map((formaPago) => {
                return (
                  <Table.Row
                    key={formaPago.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{formaPago.nombre}</Table.Cell>
                    <Table.Cell>{formaPago.descripcion}</Table.Cell>
                    <Table.Cell>
                      {formaPago.estado == 1 ? (
                        <Badge color="green">Activo</Badge>
                      ) : (
                        <Badge color="red">Inactivo</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell className="flex items-center gap-2">
                      <ModalFormasPago
                        setLoading={setLoading}
                        formaPagoEdit={formaPago}
                      />
                      <FaTrash
                        size={20}
                        className=" text-red-500 cursor-pointer"
                        onClick={() => anularFormaPago(formaPago.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell colSpan={4}>No hay formas de pago</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
