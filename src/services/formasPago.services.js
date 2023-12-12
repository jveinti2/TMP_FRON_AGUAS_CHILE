import { api } from './apiAxios';

export const postFormasPagoApi = async values => {
	try {
		const response = await api.post('formas_pago/crear', values);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
export const anularFormaPagoApi = async id => {
	try {
		const response = await api.post('formas_pago/anular', { id });
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
