import { Table } from "flowbite-react";
import { useContext } from "react";
import { VentasContext } from "../context/Ventas";

import toMoney from "../utils/toMoney";

export default function ListadoVentasFormasPago() {
  const { ventas } = useContext(VentasContext);
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
          Listado ventas por formas de pago
        </h2>
      </div>
      <div className="md:flex space-y-3 md:space-y-0 gap-4">
        <div className="overflow-x-auto md:w-full">
          <Table striped className="text-xs md:text-base">
            <Table.Head>
              <Table.HeadCell>Forma de pago</Table.HeadCell>
              <Table.HeadCell>Cantidad vendida</Table.HeadCell>
              <Table.HeadCell>Valor</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {Object.values(ventas.total_ventas_by_forma_pago).map(
                (venta, i) => (
                  <Table.Row
                    key={i}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {venta.forma_pago_nombre}
                    </Table.Cell>
                    <Table.Cell>{venta.cantidad_ventas}</Table.Cell>
                    <Table.Cell>{toMoney(venta.valor)}</Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        </div>

        {/* <div className='overflow-x-auto md:w-1/2'>
					<Table striped>
						<Table.Head>
							<Table.HeadCell colSpan={6}>Ventas domicilio</Table.HeadCell>
							<Table.HeadCell>
								<NavLink to='/despachos'>
									<Button size={'xs'} className='bg-blue-500 hover:bg-blue-700'>
										Ir a despacho
									</Button>
								</NavLink>
							</Table.HeadCell>
						</Table.Head>
						<Table.Head>
							<Table.HeadCell># Venta</Table.HeadCell>
							<Table.HeadCell>Identificación cliente</Table.HeadCell>
							<Table.HeadCell>Nombre cliente</Table.HeadCell>
							<Table.HeadCell>Dirección</Table.HeadCell>
							<Table.HeadCell>Valor</Table.HeadCell>
							<Table.HeadCell>Forma pago</Table.HeadCell>
							<Table.HeadCell>Estado</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{ventas.lista_ventas_domicilio.length > 0 ? (
								ventas.lista_ventas_domicilio.map(venta => {
									return (
										<Table.Row
											key={venta.venta_id}
											className='bg-white dark:border-gray-700 dark:bg-gray-800'
										>
											<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
												{venta.venta_id}
											</Table.Cell>
											<Table.Cell>{venta.identificacion}</Table.Cell>
											<Table.Cell>
												{venta.cliente_nombres} {venta.cliente_apellidos}
											</Table.Cell>
											<Table.Cell>
												{venta.direccion_domicilio} {venta.apartameto}
											</Table.Cell>
											<Table.Cell>{toMoney(venta.precio)}</Table.Cell>
											<Table.Cell className='flex gap-2'>
												{venta.forma_pago_nombre}
												<FaPen
													onClick={() =>
														handleEntregarDomicilio(
															venta.venta_id,
															2,
															setLoading
														)
													}
												/>
											</Table.Cell>
											<Table.Cell>
												{venta.estado_domicilio === 1 ? (
													<Badge color='success'>
														{venta.estado_domicilio_nombre}
													</Badge>
												) : (
													<Badge color='warning'>
														{venta.estado_domicilio_nombre}
													</Badge>
												)}
											</Table.Cell>
										</Table.Row>
									);
								})
							) : (
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell colSpan={7}>No hay ventas</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table>
				</div> */}
      </div>
    </div>
  );
}
