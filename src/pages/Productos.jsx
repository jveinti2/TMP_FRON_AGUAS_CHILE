import ModalProductos from "../components/ModalProductos";
import { useEffect, useState } from "react";
import useProductos from "../hooks/useProductos";
import toMoney from "../utils/toMoney";
import { Table } from "flowbite-react";
import toast from "react-hot-toast";
export default function Productos() {
  const [loading, setLoading] = useState(true);
  const { getProductos, productos } = useProductos();
  useEffect(() => {
    if (loading) {
      toast.loading("Cargando...");
      setLoading(false);
      getProductos();
    }
  }, [loading]);

  return (
    <div className="p-1 md:p-5 w-full  overflow-auto h-full">
      <div className="space-y-2 mb-20">
        <div className="flex justify-between">
          <h2 className="text-xl md:text-2xl font-semibold leading-tight dark:text-white">
            Productos
          </h2>
          <ModalProductos setLoading={setLoading} />
        </div>
        <div className="overflow-x-auto">
          <Table striped className="text-xs md:text-lg">
            <Table.Head>
              <Table.HeadCell>Referencia</Table.HeadCell>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Precio</Table.HeadCell>
              <Table.HeadCell>Cantidad en inventario</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <Table.Row
                    key={producto.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{producto.referencia}</Table.Cell>
                    <Table.Cell>{producto.nombre}</Table.Cell>
                    <Table.Cell>{toMoney(producto.precio)}</Table.Cell>
                    <Table.Cell>{producto.cantidad_inventario}</Table.Cell>
                    <Table.Cell>
                      <ModalProductos
                        productoEdit={producto}
                        setLoading={setLoading}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell colSpan="5" className="text-center">
                    <p>No hay productos registrados</p>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
