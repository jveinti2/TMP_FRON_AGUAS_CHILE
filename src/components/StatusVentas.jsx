import { Card, Badge } from "flowbite-react";
import { useContext } from "react";
import { VentasContext } from "../context/Ventas";
import toMoney from "../utils/toMoney";
import {
  FaCircleDollarToSlot,
  FaBuilding,
  FaMotorcycle,
  FaTriangleExclamation,
} from "react-icons/fa6";

export default function StatusVentas() {
  const { ventas } = useContext(VentasContext);

  return (
    <>
      <div className="grid grid-cols-2 md:flex gap-1 md:gap-4">
        <div className="flex items-center gap-2 md:w-1/3 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm">
          <FaCircleDollarToSlot className="text-2xl md:text-4xl text-green-400" />
          <div>
            <h5 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Total ventas
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              <h3 className="text-lg md:text-xl font-bold text-green-400">
                {toMoney(ventas.total_ventas)}
              </h3>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2  md:w-1/3 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm">
          <FaBuilding className="text-2xl md:text-4xl text-green-400" />
          <div>
            <h5 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Ventas edificios
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              <h3 className="text-lg md:text-xl font-bold text-green-400">
                {toMoney(ventas.total_ventas_sitio)}
              </h3>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2  md:w-1/3 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm">
          <FaMotorcycle className="text-2xl md:text-4xl text-green-400" />
          <div>
            <h5 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Ventas domicilio
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              <h3 className="text-lg md:text-xl font-bold text-green-400">
                {toMoney(ventas.total_ventas_domicilio)}
              </h3>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2  md:w-1/3 bg-white dark:bg-[#1f2937] rounded-md p-3 md:p-6 shadow-sm">
          <FaTriangleExclamation className="text-2xl md:text-4xl text-orange-500" />
          <div>
            <h5 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Pendiente pago
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              <h3 className="text-lg md:text-xl font-bold text-orange-500">
                {toMoney(ventas.total_ventas_pendiente_pago)}
              </h3>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
