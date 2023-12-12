import { Table } from "flowbite-react";
import { useContext } from "react";
import { VentasContext } from "../context/Ventas";
import toMoney from "../utils/toMoney";
import { FaWhatsapp, FaFileLines, FaRegTrashCan } from "react-icons/fa6";
import constants from "../utils/constants";

export default function ListadoDonaciones() {
  const { ventas } = useContext(VentasContext);

  const sendWhatsapp = (telefono, venta_id) => {
    window.open(
      `https://api.whatsapp.com/send?phone=${telefono}&text=Hola, te envío el código y detalle de tu compra en el siguiente link ➡️ ${constants.API_URL}ventas/pdf/${venta_id}`
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
          Listado de donaciones
        </h2>
      </div>
      <div className="md:flex space-y-3 md:space-y-0 gap-4">
        <div className="overflow-x-auto w-full">
          <Table striped className="text-xs md:text-base">
            <Table.Head>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Cantidad</Table.HeadCell>
              {/* <Table.HeadCell>Valor</Table.HeadCell> */}
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {ventas.lista_donaciones.lista.length > 0 ? (
                ventas.lista_donaciones.lista.map((venta) => {
                  return (
                    <Table.Row
                      key={venta.forma_pago_id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {venta.cliente_nombres}
                      </Table.Cell>
                      <Table.Cell>{venta.cantidad_bidones}</Table.Cell>
                      {/* <Table.Cell>{toMoney(venta.precio)}</Table.Cell> */}
                      <Table.Cell className="flex gap-2">
                        <FaWhatsapp
                          onClick={() => {
                            sendWhatsapp(venta.telefono, venta.venta_id);
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
                        {/* 
                              <FaRegTrashCan
                                size={22}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() =>
                                  handleDeleteVenta(venta.venta_id)
                                }
                              /> */}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell colSpan={4}>No hay donaciones</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>

            <Table.Head>
              <Table.HeadCell>Total</Table.HeadCell>

              <Table.HeadCell>
                {ventas.lista_donaciones.lista.length &&
                  ventas.lista_donaciones.totales.total_cantidad_bidones}
              </Table.HeadCell>
              {/* <Table.HeadCell className="text-sm">
                {ventas.lista_donaciones.lista.length &&
                  toMoney(ventas.lista_donaciones.totales.total_valor)}
              </Table.HeadCell> */}
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
          </Table>
        </div>
      </div>
    </div>
  );
}
