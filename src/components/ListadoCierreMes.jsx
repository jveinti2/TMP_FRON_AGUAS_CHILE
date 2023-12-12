import { Table } from 'flowbite-react';
import { useContext } from 'react';
import { CierreMesContext } from '../context/CierreMes';
import toMoney from '../utils/toMoney';

export default function ListadoCierreMes() {
	const { cierreMes } = useContext(CierreMesContext);
	return (
		<div className='space-y-2'>
			<div className='flex justify-between'>
				<h2 className='text-xl font-semibold leading-tight dark:text-white'>
					Listado de gastos
				</h2>
			</div>
			<div className='grid grid-flow-col'>
				<div className='overflow-x-auto'>
					<Table striped>
						<Table.Head>
							<Table.HeadCell colSpan={3}>Ventas en sitio</Table.HeadCell>
						</Table.Head>
						<Table.Head>
							<Table.HeadCell>Gasto</Table.HeadCell>
							<Table.HeadCell>Descripción</Table.HeadCell>
							<Table.HeadCell>Valor</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{cierreMes.lista_gastos_mes.length > 0 ? (
								cierreMes.lista_gastos_mes.map(gasto => {
									return (
										<Table.Row
											key={gasto.id}
											className='bg-white dark:border-gray-700 dark:bg-gray-800'
										>
											<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
												{gasto.nombre}
											</Table.Cell>
											<Table.Cell>{gasto.descripcion}</Table.Cell>
											<Table.Cell>{toMoney(gasto.valor)}</Table.Cell>
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
