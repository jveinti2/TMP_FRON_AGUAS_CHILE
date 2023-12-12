import { useState } from "react";
import toast from "react-hot-toast";
import { Modal, Button, Table } from "flowbite-react";
import { FaCircleInfo } from "react-icons/fa6";

export default function ModalDetalle({ venta }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <FaCircleInfo
        className="cursor-pointer "
        size={22}
        onClick={() => setOpenModal(true)}
      />
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="p-3">Venta # {venta.venta_id}</Modal.Header>
        <Modal.Body className="p-2">
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Identicacion
                  </Table.Cell>
                  <Table.Cell>{venta.identificacion}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Nombre cliente
                  </Table.Cell>
                  <Table.Cell>{venta.cliente_nombres}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Nombre cliente
                  </Table.Cell>
                  <Table.Cell>{venta.cliente_apellidos}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Edificio
                  </Table.Cell>
                  <Table.Cell>{venta.edificio}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Apartamento
                  </Table.Cell>
                  <Table.Cell>{venta.apartameto}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Telefono
                  </Table.Cell>
                  <Table.Cell>{venta.telefono}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Producto
                  </Table.Cell>
                  <Table.Cell>{venta.producto}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Cantidad
                  </Table.Cell>
                  <Table.Cell>{venta.cantidad_bidones}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Vr. Unitario
                  </Table.Cell>
                  <Table.Cell>{venta.precio}</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Vr. Total
                  </Table.Cell>
                  <Table.Cell>
                    {venta.precio * venta.cantidad_bidones}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Forma de pago
                  </Table.Cell>
                  <Table.Cell>{venta.forma_pago_nombre}</Table.Cell>
                </Table.Row>
                {venta.domicilio == 1 && (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      Bidones pedientes por recoger
                    </Table.Cell>
                    <Table.Cell>
                      {venta.sw_domicilio_recogida == 1 ? "SI" : "NO"}
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size={"xs"} color="gray" onClick={() => setOpenModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
