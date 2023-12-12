import { useEffect, useState } from "react";
import { Table, Spinner, Button, TextInput } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { getEdificios } from "../services/edificios.services";
import ModalEdificios from "../components/ModalEdificios";
// import ModalDelete from '../components/ModalDelete';
import ModalModulos from "../components/ModalModulos";
import ModalGestionModulos from "../components/ModalGestionModulos";
import { deleteEdificio } from "../services/edificios.services";
import { FaTrash } from "react-icons/fa6";

export default function MaestroEdificios() {
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [edificios, setEdificios] = useState([]);
  useEffect(() => {
    if (loading) {
      handleGetEdificios();
      setLoading(false);
    }
  }, [loading]);

  const handleGetEdificios = async () => {
    toast.loading("Cargando...");
    try {
      const response = await getEdificios();
      const edificiosConModulos = response.edificios.map((edificio) => ({
        ...edificio,
        modulos: response.modulos.filter(
          (modulo) => modulo.edificio_id === edificio.id
        ),
      }));
      setEdificios(edificiosConModulos);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  // const searchData = e => {};
  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const edificiosFiltrados = edificios.filter(
    (edificio) =>
      edificio.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      edificio.zona.toLowerCase().includes(filtro.toLowerCase())
  );

  const anularEdificio = (edificioId) => {
    toast(
      <div>
        ¿Está seguro que desea anular el edificio?
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              toast.dismiss();
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              deleteEdificio(edificioId)
                .then((response) => {
                  if (response.status === 200) {
                    setLoading(true);
                    toast.dismiss();
                  }
                })
                .catch((error) => console.log(error));
            }}
          >
            Aceptar
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-2 mb-20">
      <div className="flex justify-between">
        <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
          Maestro de Edificios
        </h2>
        <ModalEdificios setLoading={setLoading} />
        <Toaster />
      </div>
      <TextInput
        placeholder="Buscar por edificio o zona"
        value={filtro}
        onChange={handleFiltroChange}
      />

      <div className="overflow-y-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Dirección</Table.HeadCell>
            <Table.HeadCell>Zona</Table.HeadCell>
            <Table.HeadCell>Telefono</Table.HeadCell>
            <Table.HeadCell>Responsable</Table.HeadCell>
            <Table.HeadCell>Modulos</Table.HeadCell>
            <Table.HeadCell>Bidones</Table.HeadCell>
            <Table.HeadCell>Llave maestra</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {edificios.length > 0
              ? edificiosFiltrados.map((edificio) => {
                  return (
                    <Table.Row
                      key={edificio.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>{edificio.nombre}</Table.Cell>
                      <Table.Cell>{edificio.direccion}</Table.Cell>
                      <Table.Cell>{edificio.zona}</Table.Cell>
                      <Table.Cell>{edificio.telefono}</Table.Cell>
                      <Table.Cell>{edificio.responsable}</Table.Cell>
                      <Table.Cell>{edificio.modulos.length}</Table.Cell>
                      <Table.Cell>
                        {edificio.modulos.reduce(
                          (acc, modulo) => acc + modulo.cantidad_bidones,
                          0
                        )}
                      </Table.Cell>
                      <Table.Cell>{edificio.llave_maestra}</Table.Cell>

                      <Table.Cell className="flex justify-end gap-2 items-center">
                        <ModalModulos
                          edificioId={edificio.id}
                          setLoading={setLoading}
                        />
                        <ModalEdificios
                          edificio={edificio}
                          setLoading={setLoading}
                        />
                        <ModalGestionModulos
                          edificio={edificio}
                          setLoading={setLoading}
                        />
                        <FaTrash
                          size={20}
                          className=" text-red-500 cursor-pointer"
                          onClick={() => anularEdificio(edificio.id)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              : loading && (
                  <Table.Row className="text-center">
                    <Table.Cell colSpan={7}>
                      <Spinner size={"xl"} />
                    </Table.Cell>
                  </Table.Row>
                )}
            {edificios.length === 0 && !loading && (
              <Table.Row className="text-center">
                <Table.Cell colSpan={8}>No hay datos</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
