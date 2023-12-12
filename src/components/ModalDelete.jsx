import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import { deleteEdificio } from '../services/edificios.services';

export default function ModalDelete(props) {
	const [openModal, setOpenModal] = useState(false);

	const switchOffData = id => {
		deleteEdificio(id)
			.then(response => {
				if (response.status === 200) {
					setOpenModal(!openModal);
				}
			})
			.catch(error => console.log(error));
	};

	return (
		<>
			<Button
				color='failure'
				size='xs'
				onClick={() => setOpenModal(!openModal)}
			>
				<p>Desactivar</p>
			</Button>
			<Modal
				show={openModal === true}
				size='md'
				popup
				onClose={() => setOpenModal(!openModal)}
			>
				<Modal.Header />
				<Modal.Body>
					<div className='text-center'>
						<h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
							Seguro desea desactivar?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={() => switchOffData(props.id)}>
								Si estoy seguro
							</Button>
							<Button color='gray' onClick={() => setOpenModal(!openModal)}>
								No, cancelar
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
