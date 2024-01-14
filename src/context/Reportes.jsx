import { createContext, useState } from "react";

export const ReportesContext = createContext();

export const ReportesProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState({
    ventasEdificios: [],
  });

  return (
    <ReportesContext.Provider
      value={{
        reportes,
        setReportes,
        loading,
        setLoading,
      }}
    >
      {children}
    </ReportesContext.Provider>
  );
};
