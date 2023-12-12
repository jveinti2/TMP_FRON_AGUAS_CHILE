import { useState } from "react";
import { FaCalendarWeek } from "react-icons/fa6";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Datepicker } from "flowbite-react";

import useCierreMes from "../hooks/useCierreMes";

export default function FiltroFechaCierreMes() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getListCierreMes } = useCierreMes();
  const data_form = {
    fh_creacion: "",
    fh_modificacion: "",
  };

  const handleDateChange = (date) => {
    data_form.fh_creacion = date;
    getListCierreMes(data_form);
    // setSelectedDate(date);
  };

  const renderMonthContent = (month, shortMonth, longMonth) => {
    const tooltipText = `Tooltip for month: ${longMonth}`;
    return <span title={tooltipText}>{shortMonth}</span>;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Datepicker
          onSelectedDateChanged={handleDateChange}
          language="es-ES"
          labelTodayButton="Hoy"
          labelClearButton="Limpar"
        />

        {/* <DatePicker
          className="border border-gray-300 rounded-md p-1"
          selected={selectedDate}
          renderMonthContent={renderMonthContent}
          showMonthYearPicker
          dateFormat="MM/yyyy"
          onChange={handleDateChange}
        /> */}
      </div>
    </>
  );
}
