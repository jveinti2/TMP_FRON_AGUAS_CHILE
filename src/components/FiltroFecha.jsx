import { Datepicker } from "flowbite-react";
import useVentas from "../hooks/useVentas";
import ButtonReload from "./ButtonReload";

export default function FiltroFecha() {
  const { getListVentas, realoadData } = useVentas();
  const data_form = {
    fh_creacion: "",
    fh_modificacion: "",
  };

  const handleDateChange = (date) => {
    data_form.fh_creacion = date;
    getListVentas(data_form);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Datepicker
          className="md:w-1/4 w-full"
          language="es-ES"
          labelClearButton="Limpiar"
          labelTodayButton="Hoy"
          onSelectedDateChanged={handleDateChange}
        />
        <ButtonReload functionName={realoadData} />
      </div>
    </>
  );
}
