import { useContext } from 'react';
import { CierreMesContext } from '../context/CierreMes';
import { Card, Badge } from 'flowbite-react';
import toMoney from '../utils/toMoney';
export default function StatusCierreMes() {
	const { cierreMes } = useContext(CierreMesContext);

	return (
		<>
			<div className='md:flex grid grid-cols-2 md:gap-4 gap-2'>
				<div className='md:w-1/4 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm'>
					<h5 className='text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
						<p>Total ventas mes</p>
					</h5>
					<p className='font-normal text-gray-700 dark:text-gray-400'>
						<h3 className='text-xl md:text-2xl font-bold text-green-400'>
							{toMoney(cierreMes.total_ventas_mes.total_ventas)}
						</h3>
					</p>
				</div>
				<div className='md:w-1/4 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm'>
					<h5 className='text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
						<p>Total ventas edificios</p>
					</h5>
					<p className='font-normal text-gray-700 dark:text-gray-400'>
						<h3 className='text-xl md:text-2xl font-bold text-green-400'>
							{toMoney(cierreMes.total_ventas_mes_edificio.total_ventas)}
						</h3>
					</p>
				</div>
				<div className='md:w-1/4 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm'>
					<h5 className='text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
						<p>Total ventas domicilios</p>
					</h5>
					<p className='font-normal text-gray-700 dark:text-gray-400'>
						<h3 className='text-xl md:text-2xl font-bold text-green-400'>
							{toMoney(cierreMes.total_ventas_mes_domicilio.total_ventas)}
						</h3>
					</p>
				</div>
				<div className='md:w-1/4 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm'>
					<h5 className='text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
						<p>Total gastos mes</p>
					</h5>
					<p className='font-normal text-gray-700 dark:text-gray-400'>
						<h3 className='text-xl md:text-2xl font-bold text-green-400'>
							{toMoney(cierreMes.total_gastos_mes)}
						</h3>
					</p>
				</div>
			</div>
		</>
	);
}
