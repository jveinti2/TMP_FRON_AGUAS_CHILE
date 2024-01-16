import { createContext, useState, useEffect } from "react";
export const DespachosContext = createContext();

export const DespachosProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState({
    domicilios_dia: [],
    domicilios_pendientes_gestionar: [],
    domicilios_pendientes_recoger_bidones: [],
  });

  return (
    <DespachosContext.Provider
      value={{
        ventas,
        setVentas,
        loading,
        setLoading,
      }}
    >
      {children}
    </DespachosContext.Provider>
  );
};
