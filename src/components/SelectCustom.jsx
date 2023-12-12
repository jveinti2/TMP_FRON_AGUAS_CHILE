import { useState } from 'react';
import { Label, Select } from 'flowbite-react';
import useGetEdificios from '../hooks/useGetEdificios';
import useModulos from '../hooks/useModulos';

export default function SelectCustom() {
	const { edificios, handleEdificioChange, selectedEdificioId } =
		useGetEdificios();

	return (
		<div className='max-w-md' id='select'>
			Desde select custom {selectedEdificioId}
			<div className='mb-2 block'>
				<Label
					htmlFor='countries'
					value='Seleccione el edificio para gestionar los modulos'
				/>
			</div>
			<Select
				value={selectedEdificioId}
				onChange={handleEdificioChange}
				id='countries'
				required
			>
				<option value=''>Seleccione un edificio</option>
				{edificios.map(edificio => (
					<option key={edificio.id} value={edificio.id}>
						{edificio.nombre}
					</option>
				))}
			</Select>
		</div>
	);
}
