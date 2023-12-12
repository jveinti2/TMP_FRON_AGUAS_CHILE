import { api } from './apiAxios';

export const getGastosApi = async data => {
	try {
		const response = await api.post('listas/gastos', data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const postGastosApi = async values => {
	try {
		const response = await api.post('gastos/crear', values);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
