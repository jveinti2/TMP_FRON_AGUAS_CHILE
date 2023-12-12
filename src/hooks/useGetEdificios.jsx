import { useState, useEffect } from 'react';
import { getEdificios } from '../services/edificios.services';

export default function useGetEdificios() {
	const [edificios, setEdificios] = useState([]);
	const [selectedEdificioId, setSelectedEdificioId] = useState();

	const getListEdificios = () => {
		getEdificios()
			.then(response => {
				if (response.status === 200) {
					const edificiosConModulos = response.edificios.map(edificio => ({
						...edificio,
						modulos: response.modulos.filter(
							modulo => modulo.edificio_id === edificio.id
						),
					}));
					setEdificios(edificiosConModulos);
				}
			})
			.catch(error => console.log(error));
	};

	const handleEdificioChange = e => {
		const edificioId = e.target.value;
		setSelectedEdificioId(edificioId);
	};

	return {
		edificios,
		getListEdificios,
		handleEdificioChange,
		selectedEdificioId,
	};
}
