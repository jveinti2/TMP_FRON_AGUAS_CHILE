import { useEffect } from "react";
import { useVentas } from "../hooks/useVentas";

export default function FiltroFecha() {
  const { getVentas, date } = useVentas();

  useEffect(() => {
    getVentas(date);

    const dateInput = document.getElementById("date");

    if (dateInput) {
      dateInput.addEventListener("click", function () {
        dateInput.showPicker();
      });
    }

    return () => {
      if (dateInput) {
        dateInput.removeEventListener("click", function () {
          dateInput.showPicker();
        });
      }
    };
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          id="date"
          type="date"
          className=" w-full md:w-1/6 px-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
          dark:bg-[#171e29] dark:border-gray-600 dark:text-white dark:focus:ring-[#1d4ed8] dark:focus:border-transparent
          "
          value={date}
          onChange={(e) => {
            getVentas(e.target.value);
          }}
        />

        {/* <ButtonReload functionName={realoadData} /> */}
      </div>
    </>
  );
}
