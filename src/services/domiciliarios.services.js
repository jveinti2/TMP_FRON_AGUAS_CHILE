import { api } from './apiAxios';

export const getDomiciliariosApi = async () => {
	try {
		const response = await api.get('listas/domiciliarios');
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const postDomiciliariosApi = async values => {
	try {
		const response = await api.post('domiciliarios/crear', values);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
//  export const deleteCliente = async id => {
//  	try {
//  		const response = await api.post('edificios/anular', { id });
//  		return response.data;
//  	} catch (error) {
//  		console.log(error);
//  	}
//  };
