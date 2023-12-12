import { api } from './apiAxios';

export const getListaFormasPagoApi = async () => {
	try {
		const response = await api.get('listas/formas_pago');
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
export const getListaParametros = async () => {
	try {
		const response = await api.get('listas/parametros');
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
