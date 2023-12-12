import { api } from './apiAxios';

export const loginApi = async data => {
	try {
		const response = await api.post('ingreso', data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
