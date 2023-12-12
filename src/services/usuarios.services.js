import { api } from './apiAxios';

export const getUsuariosApi = async () => {
	try {
		const response = await api.get('listas/usuarios');
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const postUsuariosApi = async values => {
	try {
		const response = await api.post('usuarios/crear', values);
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
