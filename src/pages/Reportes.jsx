import { ReportesProvider } from "../context/Reportes";
import ReporteVentasEdificios from "../components/ReporteVentasEdificios";

export default function Reportes() {
  return (
    <ReportesProvider>
      <div className="p-1 md:p-5 w-full overflow-auto h-full">
        <div className="space-y-2 mb-20">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold leading-tight dark:text-white">
              Reportes
            </h2>
          </div>
          <ReporteVentasEdificios />
        </div>
      </div>
    </ReportesProvider>
  );
}
