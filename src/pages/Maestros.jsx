import { Outlet } from 'react-router-dom';

export default function Maestros() {
	return (
		<div className='p-1 md:p-5 w-full  overflow-auto h-full'>
			<Outlet />
		</div>
	);
}
