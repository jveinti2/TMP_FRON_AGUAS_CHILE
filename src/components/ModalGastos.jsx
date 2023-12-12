import { useState, useContext } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Label, Modal, TextInput, Datepicker } from 'flowbite-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postGastosApi } from '../services/gastos.services';
import { CierreMesContext } from '../context/CierreMes';

export default function ModalGastos() {
	const { gastos, setGastos } = useContext(CierreMesContext);
	const [openModal, setOpenModal] = useState(false);
	const formik = useFormik({
		initialValues: {
			id: '',
			nombre: '',
			descripcion: '',
			valor: '',
			fh_creacion: '',
		},
		validationSchema: Yup.object({
			nombre: Yup.string().required('Campo requerido'),
			descripcion: Yup.string().required('Campo requerido'),
			valor: Yup.number().required('Campo requerido'),
			fh_creacion: Yup.date().required('Campo requerido'),
		}),

		onSubmit: values => {
			postGastosApi(values);
			setOpenModal(undefined);
			formik.resetForm();
			setGastos([...gastos, values]);
		},
	});

	return (
		<>
			<Button size={'xs'} onClick={() => setOpenModal(!openModal)}>
				<FaPlus />
				<p>Agregar gasto</p>
			</Button>

			<Modal
				size={'4xl'}
				show={openModal === true}
				onClose={() => setOpenModal(undefined)}
			>
				<Modal.Header>
					<div className='flex gap-14'>
						<h3>Agregar gasto</h3>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className='space-y-6 h-screen'>
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='nombre' value='Indique el nombre del gasto' />
								</div>
								<TextInput
									id='nombre'
									name='nombre'
									placeholder='Nombre del gasto'
									value={formik.values.nombre}
									onChange={formik.handleChange}
									type='text'
									sizing='sm'
								/>
								<small className='text-red-700'>
									{formik.errors.nombre && formik.touched.nombre
										? formik.errors.nombre
										: null}
								</small>
							</div>
							<div>
								<div className='mb-2 block'>
									<Label
										htmlFor='descipcion'
										value='Indique la descipcion del gasto'
									/>
								</div>
								<TextInput
									id='descripcion'
									name='descripcion'
									placeholder='Descripcion del gasto'
									value={formik.values.descripcion}
									onChange={formik.handleChange}
									type='text'
									sizing='sm'
								/>
								<small className='text-red-700'>
									{formik.errors.descripcion && formik.touched.descripcion
										? formik.errors.descripcion
										: null}
								</small>
							</div>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='valor' value='Indique el valor del gasto' />
								</div>
								<TextInput
									id='valor'
									name='valor'
									placeholder='Valor del gasto'
									value={formik.values.valor}
									onChange={formik.handleChange}
									sizing='sm'
									type='number'
								/>
								<small className='text-red-700'>
									{formik.errors.valor && formik.touched.valor
										? formik.errors.valor
										: null}
								</small>
							</div>

							<div>
								<div className='mb-2 block'>
									<Label htmlFor='valor' value='Indique la fecha del gasto' />
								</div>
								<Datepicker
									language='es-ES'
									labelClearButton='Limpiar'
									labelTodayButton='Hoy'
									onSelectedDateChanged={date =>
										(formik.values.fh_creacion = date)
									}
								/>
								<small className='text-red-700'>
									{formik.errors.fh_creacion && formik.touched.fh_creacion
										? formik.errors.fh_creacion
										: null}
								</small>
							</div>
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
