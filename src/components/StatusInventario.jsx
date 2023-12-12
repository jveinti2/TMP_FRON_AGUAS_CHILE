import { useContext } from "react";
import { DashboardContext } from "../context/Dashboard";
import { FaRegCircle, FaClipboardList } from "react-icons/fa6";

export default function StatusInventario() {
  const { dashboard } = useContext(DashboardContext);

  return (
    <div className="md:flex md:gap-2 space-y-1 md:space-y-0">
      <div className="w-full md:w-auto flex items-center gap-2 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm">
        <FaClipboardList className="text-2xl md:text-4xl text-green-400" />
        <div>
          <h5 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bidones en inventario
          </h5>
          <div>
            {Object.keys(dashboard.cantidad_bidones.inventario).map(
              (productoId) => {
                const producto =
                  dashboard.cantidad_bidones.inventario[productoId];
                return (
                  <p
                    className="text-sm flex items-center gap-1 dark:text-gray-300 text-gray-700"
                    key={productoId}
                  >
                    <FaRegCircle className="text-xs text-green-400" />
                    {producto.nombre} <b>{producto.cantidad}</b>
                  </p>
                );
              }
            )}
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto flex items-center gap-2 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm">
        <FaClipboardList className="text-2xl md:text-4xl text-green-400" />
        <div className="md:text-center flex items-center gap-2">
          <h5 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Bidones en edificios
          </h5>
          <div>
            <p className="md:text-4xl font-bold text-green-400">
              {dashboard.cantidad_bidones.edificios}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
