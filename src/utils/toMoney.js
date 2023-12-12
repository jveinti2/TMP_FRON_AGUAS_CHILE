export default function toMoney(dinero) {
	const dineroFormat = new Intl.NumberFormat('es-CL', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
	}).format(dinero);

	return dineroFormat.replace('COP', '$');
}
