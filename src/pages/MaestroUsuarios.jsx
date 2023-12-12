import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import ModalUsuarios from "../components/ModalUsuarios";
import { getUsuariosApi } from "../services/usuarios.services";
import toast from "react-hot-toast";

export default function MaestroUsuarios() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (loading) {
      toast.loading("Cargando usuarios...");
      getUsuariosApi().then((response) => {
        setUsuarios(response.usuarios);
        toast.dismiss();
      });
      setLoading(false);
    }
  }, [loading]);

  return (
    <div className="space-y-2  overflow-auto h-full">
      <div className="flex justify-between">
        <h2 className="text-lg md:text-xl font-semibold leading-tight dark:text-white">
          Maestro de usuarios
        </h2>
        <ModalUsuarios setLoading={setLoading} />
      </div>
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Nombres</Table.HeadCell>
            <Table.HeadCell>Apellidos</Table.HeadCell>
            <Table.HeadCell>Correo</Table.HeadCell>
            <Table.HeadCell>Telefono</Table.HeadCell>
            <Table.HeadCell>Rol</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <Table.Row
                  key={usuario.usuario_id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{usuario.name}</Table.Cell>
                  <Table.Cell>{usuario?.apellidos}</Table.Cell>
                  <Table.Cell>{usuario.email}</Table.Cell>
                  <Table.Cell>{usuario.telefono}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {usuario.rol}
                  </Table.Cell>
                  <Table.Cell>
                    <ModalUsuarios
                      usuarioEdit={usuario}
                      setLoading={setLoading}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5}>No hay domiciliarios</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
