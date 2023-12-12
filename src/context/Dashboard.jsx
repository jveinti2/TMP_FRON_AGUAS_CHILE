import { createContext, useState } from "react";
export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    cantidad_bidones: {
      edificios: 0,
      inventario: 0,
    },
    edificios: [],
    clientes: [],
  });
  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        setDashboard,
        loading,
        setLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
