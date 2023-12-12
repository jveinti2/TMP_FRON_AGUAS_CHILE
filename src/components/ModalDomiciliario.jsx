import { useState } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postDomiciliariosApi } from '../services/domiciliarios.services';
import toast from 'react-hot-toast';

export default function ModalVentas({
	setDomiciliarios,
	domiciliarioEdit,
	domiciliarios,
}) {
	const [openModal, setOpenModal] = useState(undefined);
	const formik = useFormik({
		initialValues: {
			id: '',
			identificacion: '',
			nombres: '',
			apellidos: '',
			telefono: '',
		},
		validationSchema: Yup.object({
			identificacion: Yup.string().required('La identificacion es requerida'),
			nombres: Yup.string().required('El nombre es requerido'),
			apellidos: Yup.string().required('El apellido es requerido'),
			telefono: Yup.string().required('El telefono es requerido'),
		}),
		onSubmit: values => {
			postDomiciliariosApi(values)
				.then(response => {
					toast.success(response.mensaje);
					setOpenModal(undefined);
					setDomiciliarios([...domiciliarios, response.domiciliario]);
				})
				.catch(error => {
					console.log(error);
				});
		},
	});

	// useEffect(() => {
	// 	if (ventaEdit) {
	// 		formik.setFieldValue('id', ventaEdit.id);
	// 		formik.setFieldValue('cliente', ventaEdit.cliente);
	// 		formik.setFieldValue('edificio', ventaEdit.edificio);
	// 		formik.setFieldValue('cantidad_bidones', ventaEdit.cantidad_bidones);
	// 		formik.setFieldValue('producto', ventaEdit.producto);
	// 	}
	// }, [ventaEdit]);
	return (
		<>
			{domiciliarioEdit ? (
				<Button size={'xs'} onClick={() => setOpenModal(!openModal)}>
					<FaEdit />
					<p>Editar domiciliario</p>
				</Button>
			) : (
				<Button size={'xs'} onClick={() => setOpenModal(!openModal)}>
					<FaPlus />
					<p>Agregar domiciliario</p>
				</Button>
			)}

			<Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
				<Modal.Header>Agregar domiciliario</Modal.Header>
				<Modal.Body>
					<div className='space-y-6 '>
						<div className='grid gap-4 grid-cols-2'>
							<div>
								<div className='mb-2 block'>
									<Label
										htmlFor='identificacion'
										value='Numero de identificacion'
									/>
								</div>
								<TextInput
									id='identificacion'
									name='identificacion'
									placeholder='Numero de identificacion'
									value={formik.values.identificacion}
									onChange={formik.handleChange}
									sizing='sm'
									type='number'
								/>
								<small className='text-red-700'>
									{formik.errors.identificacion && formik.touched.identificacion
										? formik.errors.identificacion
										: null}
								</small>
							</div>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='nombres' value='Nombres' />
								</div>
								<TextInput
									id='nombres'
									name='nombres'
									placeholder='Nombres'
									value={formik.values.nombres}
									onChange={formik.handleChange}
									sizing='sm'
									type='text'
								/>
								<small className='text-red-700'>
									{formik.errors.nombres && formik.touched.nombres
										? formik.errors.nombres
										: null}
								</small>
							</div>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='apellidos' value='Apellidos' />
								</div>
								<TextInput
									id='apellidos'
									name='apellidos'
									placeholder='Apellidos'
									value={formik.values.apellidos}
									onChange={formik.handleChange}
									sizing='sm'
									type='text'
								/>
								<small className='text-red-700'>
									{formik.errors.apellidos && formik.touched.apellidos
										? formik.errors.apellidos
										: null}
								</small>
							</div>
							<div>
								<div className='mb-2 block'>
									<Label htmlFor='telefono' value='Numero telefono' />
								</div>
								<TextInput
									id='telefono'
									name='telefono'
									placeholder='Numero de telefono'
									value={formik.values.telefono}
									onChange={formik.handleChange}
									sizing='sm'
									type='number'
								/>
								<small className='text-red-700'>
									{formik.errors.telefono && formik.touched.telefono
										? formik.errors.telefono
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
