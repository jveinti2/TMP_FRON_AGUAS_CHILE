import { createContext, useState } from "react";

export const CierreMesContext = createContext();

export const CierreMesProvider = ({ children }) => {
  const [cierreMes, setCierreMes] = useState({
    total_ventas_mes: {
      total_ventas: 0,
      total_bindones_vendidos: 0,
    },
    total_ventas_mes_edificio: {
      total_ventas: 0,
      total_bindones_vendidos: 0,
      total_ventas_by_forma_pago: [],
    },
    total_ventas_mes_domicilio: {
      total_ventas: 0,
      total_bindones_vendidos: 0,
      total_ventas_by_forma_pago: [],
    },
    total_gastos_mes: 0,
    lista_gastos_mes: [],
    lista_ventas_mes: [],
    total_ventas_by_forma_pago: [],
    listado_donaciones: {
      lista: [],
      totales: {
        total_cantidad_bidones: 0,
        total_valor: 0,
      },
    },
  });
  return (
    <CierreMesContext.Provider
      value={{
        cierreMes,
        setCierreMes,
      }}
    >
      {children}
    </CierreMesContext.Provider>
  );
};
