import { Datepicker } from 'flowbite-react';

export default function FiltroFechaDespacho() {
	const data_form = {
		fh_creacion: '',
		fh_modificacion: '',
	};

	const handleDateChange = date => {
		data_form.fh_creacion = date;
	};

	return (
		<>
			<Datepicker
				className='md:w-1/4'
				language='es-ES'
				labelClearButton='Limpiar'
				labelTodayButton='Hoy'
				onSelectedDateChanged={handleDateChange}
			/>
		</>
	);
}
