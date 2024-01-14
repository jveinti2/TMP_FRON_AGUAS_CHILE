import { Table, Button, Label, Select } from "flowbite-react";
import { useContext, useState, useEffect } from "react";
import { ReportesContext } from "../context/Reportes";
import { FaSearchengin } from "react-icons/fa6";
import useReportes from "../hooks/useReportes";
import { getEdificios } from "../services/edificios.services";
import toFormData from "../utils/toFormatDate";
// import toMoney from "../utils/toMoney";

export default function ReporteVentasEdificios() {
  const { reportes } = useContext(ReportesContext);
  const { getReporteVentasEdificios } = useReportes();
  const [edificios, setEdificios] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [modulosFiltrados, setModulosFiltrados] = useState([]);

  useEffect(() => {
    getEdificios()
      .then((response) => {
        if (response.status === 200) {
          setEdificios(response.edificios);
          setModulos(response.modulos);
        }
      })
      .catch((error) => console.log(error));
  }, [reportes]);

  const getModulos = (id) => {
    const modulosEdificio = modulos.filter(
      (modulo) => modulo.edificio_id === Number(id)
    );
    setModulosFiltrados(modulosEdificio);
  };

  const getReporte = () => {
    const data_form = {
      edificio_id: document.getElementById("Edificio").value,
      modulo: document.getElementById("Modulo").value,
    };
    getReporteVentasEdificios(data_form);
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
          Reporte de ventas por edificios
        </h2>
      </div>
      <div className=" space-y-2 gap-4">
        <div className="flex gap-2 items-end">
          <div className="md:w-1/5">
            <div className="mb-2 block">
              <Label htmlFor="Edificio" value="Edificio" />
            </div>
            <Select
              id="Edificio"
              onChange={(e) => {
                console.log(e.target.value), getModulos(e.target.value);
              }}
            >
              <option>Seleccione una opcion</option>
              {edificios &&
                edificios.map((edificio) => (
                  <option key={edificio.id} value={edificio.id}>
                    {edificio.nombre}
                  </option>
                ))}
            </Select>
          </div>
          <div className="md:w-1/5">
            <div className="mb-2 block">
              <Label htmlFor="Modulo" value="Modulo" />
            </div>
            <Select id="Modulo" required>
              <option>Seleccione una opcion</option>
              {modulosFiltrados.map((modulo) => (
                <option key={modulo.id} value={modulo.id}>
                  {modulo.nombre}
                </option>
              ))}
            </Select>
          </div>
          <Button
            onClick={() => getReporte()}
            className="flex gap-2 items-center"
            type="submit"
            size={"sm"}
          >
            <FaSearchengin />
            <span className="hidden md:block">Buscar</span>
          </Button>
        </div>
        <div className="overflow-x-auto">
          {reportes.ventasEdificios && reportes.ventasEdificios.length > 0 ? (
            <Table className="text-sm">
              <Table.Head>
                <Table.HeadCell>Cliente</Table.HeadCell>

                <Table.HeadCell>Fecha</Table.HeadCell>
                <Table.HeadCell>Producto</Table.HeadCell>
                <Table.HeadCell>Cantidad</Table.HeadCell>
              </Table.Head>
              <Table.Body
                className="divide-y
              bg-white divide-gray-200 dark:bg-gray-800 dark:divide-gray-700
              "
              >
                {reportes.ventasEdificios.map((reporte) => (
                  <Table.Row key={reporte.id}>
                    <Table.Cell>{reporte.nombre_cliente}</Table.Cell>

                    <Table.Cell>{toFormData(reporte.fh_creacion)}</Table.Cell>
                    <Table.Cell>{reporte.producto}</Table.Cell>
                    <Table.Cell>{reporte.cantidad_bidones}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : null}
        </div>
      </div>
    </div>
  );
}
