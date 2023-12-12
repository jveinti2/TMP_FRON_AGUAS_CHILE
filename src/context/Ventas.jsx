import { createContext, useState } from "react";
export const VentasContext = createContext();

export const VentasProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState({
    total_ventas: 0,
    total_ventas_sitio: 0,
    total_ventas_by_forma_pago: [],
    total_ventas_domicilio: 0,
    total_ventas_domicilio_by_forma_pago: [],
    lista_ventas_sitio: [],
    lista_ventas_domicilio: [],
    lista_ventas_consolidado_edificio: [],
    lista_donaciones: {
      lista: [],
      totales: {
        total_cantidad_bidones: 0,
        total_valor: 0,
      },
    },
    total_ventas_pendiente_pago: 0,
  });
  return (
    <VentasContext.Provider
      value={{
        ventas,
        setVentas,
        loading,
        setLoading,
      }}
    >
      {children}
    </VentasContext.Provider>
  );
};
