import { Table } from 'flowbite-react';
import { useContext } from 'react';
import { CierreMesContext } from '../context/CierreMes';
import toMoney from '../utils/toMoney';

export default function ListadoStatusCierreMes() {
	const { cierreMes } = useContext(CierreMesContext);
	return (
		<div className='space-y-2'>
			<div className='flex justify-between'>
				<h2 className='text-xl font-semibold leading-tight dark:text-white'>
					Listado ventas por edificio
				</h2>
			</div>
			<div className='grid grid-flow-col'>
				<div className='overflow-x-auto'>
					<Table striped>
						<Table.Head>
							<Table.HeadCell>Edificio</Table.HeadCell>
							<Table.HeadCell>Cantidad bindones vendidos</Table.HeadCell>
							<Table.HeadCell>Valor</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{cierreMes.lista_ventas_mes.length > 0 ? (
								cierreMes.lista_ventas_mes.map(edificio => {
									return (
										<Table.Row
											key={edificio.id}
											className='bg-white dark:border-gray-700 dark:bg-gray-800'
										>
											<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
												{edificio.edificio_nombre}
											</Table.Cell>
											<Table.Cell>{edificio.cantidad_bidones}</Table.Cell>
											<Table.Cell>{toMoney(edificio.total)}</Table.Cell>
										</Table.Row>
									);
								})
							) : (
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell colSpan={3}>No hay gastos</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table>
				</div>
			</div>
		</div>
	);
}
