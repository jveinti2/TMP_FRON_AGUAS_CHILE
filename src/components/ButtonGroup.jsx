import { Button } from 'flowbite-react';
import { FaMinus } from 'react-icons/fa6';

export default function WithIcons() {
	return (
		<Button size={'xs'} color='gray'>
			<FaMinus className='mr-3 h-4 w-4' />
			<p>Vender</p>
		</Button>
	);
}
