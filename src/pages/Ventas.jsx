import StatusVentas from "../components/StatusVentas";
import ListadoVentas from "../components/ListadoVentas";
import ModalVentas from "../components/ModalVentas";
import { VentasProvider } from "../context/Ventas";
import FiltroFecha from "../components/FiltroFecha";
import ListadoVentasConsolidado from "../components/ListadoVentasConsolidado";
import ListadoVentasFormasPago from "../components/ListadoVentasFormasPago";
import ListadoDonaciones from "../components/ListadoDonaciones";

export default function Ventas() {
  return (
    <VentasProvider>
      <div className="p-2 md:p-5 w-full overflow-auto h-full">
        <div className="space-y-4 mb-20">
          <div className="flex justify-between">
            <h2 className="text-lg md:text-2xl font-semibold leading-tight dark:text-white">
              Ventas
            </h2>
            <ModalVentas />
          </div>
          <FiltroFecha />
          <StatusVentas />
          <ListadoVentas />
          <div className="md:grid md:grid-cols-2 gap-2 space-y-3 md:space-y-0 ">
            <ListadoVentasFormasPago />
            <ListadoDonaciones />
            <ListadoVentasConsolidado />
          </div>
        </div>
      </div>
    </VentasProvider>
  );
}
