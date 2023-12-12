export default function toFormatDate(date) {
	const dateFormated = new Intl.DateTimeFormat('es-CL').format(new Date(date));

	return dateFormated;
}
