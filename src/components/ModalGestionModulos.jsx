import { useState } from 'react';
import { Button, Modal, TextInput, Label, Select } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useModulos from '../hooks/useModulos';

export default function ModalModulos({ edificio, sendMessage, setLoading }) {
	const [bidones, setBidones] = useState({
		capacidad_bidones: 0,
		bidones_existentes: 0,
	}); // [0, setCapacidadBidones
	const { postPassword } = useModulos();
	const [openModal, setOpenModal] = useState(false);

	const handlePasswordChange = e => {
		const modulo_id = e.target.value;
		const modulo_password = edificio.modulos.find(
			modulo => modulo.id === parseInt(modulo_id)
		).password;
		formik.setFieldValue('password', modulo_password);

		const capacidad_bidones = edificio.modulos.find(
			modulo => modulo.id === parseInt(modulo_id)
		).capacidad_bidones;

		const bidones_existentes = edificio.modulos.find(
			modulo => modulo.id === parseInt(modulo_id)
		).cantidad_bidones;

		setBidones({
			capacidad_bidones,
			bidones_existentes,
		});
	};

	const formik = useFormik({
		initialValues: {
			edificio_id: edificio.id,
			modulo: '',
			password: '',
			bidones: '',
		},
		validationSchema: Yup.object({
			modulo: Yup.string().required('El modulo es requerido'),
			bidones: Yup.number()
				.min(1, 'Los bidones deben ser minimo 1')
				.max(
					bidones.capacidad_bidones - bidones.bidones_existentes,
					'Los bidones deben ser maximo la capacidad disponible del modulo'
				),
		}),
		onSubmit: async values => {
			await postPassword(values);
			try {
				setLoading(true);
				setOpenModal(undefined);
				formik.resetForm();
				sendMessage('Modulo actualizado');
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<>
			<Button size={'xs'} onClick={() => setOpenModal(!openModal)}>
				<FaPlus />
				<p>Gestion modulos</p>
			</Button>
			<Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
				<Modal.Header>
					Gestionar modulos del edificio {edificio.nombre}
				</Modal.Header>
				<Modal.Body>
					<div className='space-y-6'>
						<p className='font-bold dark:text-white'>
							Selecciona el modulo a gestionar, cambia la contraseña y haz clic
							en actualizar.
						</p>
						<div className='md:flex w-full gap-3'>
							<div className='md:w-1/2'>
								<div className='mb-2 block'>
									<Label htmlFor='modulo' value='Selecciona el modulo' />
								</div>
								<Select
									id='modulo'
									name='modulo'
									placeholder='Selecciona el modulo'
									onChange={e => {
										formik.handleChange(e);
										handlePasswordChange(e);
									}}
								>
									<option value=''>Selecciona una opcion</option>
									{edificio.modulos.map(modulo => (
										<option key={modulo.id} value={modulo.id}>
											{modulo.nombre}
										</option>
									))}
								</Select>
								<small className='text-red-700'>
									{formik.errors.modulo && formik.touched.modulo
										? formik.errors.modulo
										: ''}
								</small>
							</div>
							<div className='md:w-1/2'>
								<div className='mb-2 block'>
									<Label htmlFor='password' value='Contraseña' />
								</div>
								<TextInput
									id='password'
									name='password'
									placeholder='1234'
									type='text'
									onChange={formik.handleChange}
									value={formik.values.password}
								/>
							</div>
						</div>
						<div className='md:w-1/3'>
							<div className='mb-2 block'>
								<Label
									htmlFor='bidones'
									value={`Recagar bidones MAX ${
										bidones.capacidad_bidones - bidones.bidones_existentes
									}`}
								/>
							</div>
							<TextInput
								id='bidones'
								name='bidones'
								placeholder='Recargar bidones'
								value={formik.values.bidones}
								onChange={formik.handleChange}
								sizing='sm'
								type='number'
							/>
							<small className='font-semibold text-red-700 dark:text-red-300'>
								{formik.errors.bidones && formik.touched.bidones
									? formik.errors.bidones
									: null}
							</small>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={formik.handleSubmit}>Guardar</Button>
					<Button color='gray' onClick={() => setOpenModal(undefined)}>
						Cancelar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
