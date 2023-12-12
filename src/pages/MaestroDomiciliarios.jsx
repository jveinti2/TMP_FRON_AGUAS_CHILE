import { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';
import { getDomiciliariosApi } from '../services/domiciliarios.services';
import ModalDomiciliario from '../components/ModalDomiciliario';

export default function MaestroDomiciliarios() {
	const [domiciliarios, setDomiciliarios] = useState([]);

	useEffect(() => {
		getDomiciliariosApi().then(response => {
			setDomiciliarios(response.domiciliarios);
		});
	}, []);

	return (
		<div className='space-y-2  overflow-auto h-full'>
			<div className='flex justify-between'>
				<h2 className='text-2xl font-semibold leading-tight dark:text-white'>
					Maestro de domiciliarios
				</h2>
				<ModalDomiciliario
					domiciliarios={domiciliarios}
					setDomiciliarios={setDomiciliarios}
				/>
			</div>
			<div>
				<Table>
					<Table.Head>
						<Table.HeadCell>Identificación</Table.HeadCell>
						<Table.HeadCell>Nombres</Table.HeadCell>
						<Table.HeadCell>Apellidos</Table.HeadCell>
						<Table.HeadCell>Telefono</Table.HeadCell>
					</Table.Head>
					<Table.Body className='divide-y'>
						{domiciliarios.length > 0 ? (
							domiciliarios.map(domiciliario => (
								<Table.Row
									key={domiciliario.id}
									className='bg-white dark:border-gray-700 dark:bg-gray-800'
								>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
										{domiciliario.identificacion}
									</Table.Cell>
									<Table.Cell>{domiciliario.nombres}</Table.Cell>
									<Table.Cell>{domiciliario.apellidos}</Table.Cell>
									<Table.Cell>{domiciliario.telefono}</Table.Cell>
								</Table.Row>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={4}>No hay domiciliarios</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</div>
		</div>
	);
}
