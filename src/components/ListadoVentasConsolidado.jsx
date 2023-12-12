import { Table } from "flowbite-react";
import { useContext } from "react";
import { VentasContext } from "../context/Ventas";

import toMoney from "../utils/toMoney";

export default function ListadoVentasConsolidado() {
  const { ventas } = useContext(VentasContext);

  return (
    <div className="space-y-1">
      <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
        Consolidado de ventas
      </h2>
      <div className="overflow-x-auto w-full max-h-96">
        <Table striped className="text-xs md:text-base">
          <Table.Head>
            <Table.HeadCell>Edificio</Table.HeadCell>
            <Table.HeadCell>Cantidad bidones</Table.HeadCell>
            <Table.HeadCell>Valor</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {ventas.lista_ventas_consolidado_edificio.length > 0 ? (
              ventas.lista_ventas_consolidado_edificio.map((venta) => {
                return (
                  <Table.Row
                    key={venta.edificio_id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {venta.edificio}
                    </Table.Cell>
                    <Table.Cell>{venta.cantidad_bidones}</Table.Cell>
                    <Table.Cell>{toMoney(parseInt(venta.precio))}</Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell colSpan={3} className="text-center">
                  No hay ventas
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
