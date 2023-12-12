import { api } from './apiAxios';

export const getCierreMesApi = async data => {
	try {
		const response = await api.post('listas/cierre_mes', data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

// export const postVentaApi = async values => {
// 	try {
// 		const response = await api.post('ventas/crear', values);
// 		return response.data;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// export const postDomicilioApi = async venta_id => {
// 	try {
// 		const response = await api.post(`ventas/domicilio/${venta_id}`);
// 		return response.data;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
