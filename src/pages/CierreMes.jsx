import { CierreMesProvider } from '../context/CierreMes';
import StatusCierreMes from '../components/StatusCierreMes';
import ListadoCierreMes from '../components/ListadoCierreMes';
import ListadoStatusCierreMes from '../components/ListadoStatusCierreMes';
import ListadoVentasFormasPagoMes from '../components/ListadoVentasFormasPagoMes';
import FiltroFechaCierreMes from '../components/FiltroFechaCierreMes';
import ListadoDonacionesMes from '../components/ListadoDonacionesMes';
import ModalGastos from '../components/ModalGastos';

export default function CierreMes() {
	return (
		<CierreMesProvider>
			<div className='p-1 md:p-5 w-full overflow-auto h-full'>
				<div className='space-y-2 mb-20'>
					<div className='flex justify-between'>
						<h2 className='text-2xl font-semibold leading-tight dark:text-white'>
							Cierre de mes
						</h2>
						<ModalGastos />
					</div>
					<FiltroFechaCierreMes />
					<StatusCierreMes />
					<ListadoStatusCierreMes />
					<ListadoCierreMes />
					<div className='grid md:grid-cols-2 gap-2 space-y-4 md:space-y-0 '>
						<ListadoVentasFormasPagoMes />
						<ListadoDonacionesMes />
					</div>
				</div>
			</div>
		</CierreMesProvider>
	);
}
