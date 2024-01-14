import { useContext, useEffect } from "react";
import { getReporteVentasEdificiosApi } from "../services/reportes.services";
import { ReportesContext } from "../context/Reportes";

export default function useReportes() {
  const { setReportes, loading, setLoading } = useContext(ReportesContext);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  const getReporteVentasEdificios = (data) => {
    getReporteVentasEdificiosApi(data)
      .then((response) => {
        if (response.status === 200) {
          setReportes({
            ventasEdificios: response.reporte_edificio,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  return {
    getReporteVentasEdificios,
  };
}
