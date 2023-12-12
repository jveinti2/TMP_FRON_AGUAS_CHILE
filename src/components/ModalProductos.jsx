import { useEffect, useState } from "react";
import useProductos from "../hooks/useProductos";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Button, Label, Modal, TextInput, Checkbox } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ModalProductos({ productoEdit, setLoading }) {
  const [openModal, setOpenModal] = useState(undefined);
  const { postProducto } = useProductos();

  const formik = useFormik({
    initialValues: {
      id: "",
      referencia: "",
      nombre: "",
      precio: "",
      cantidad_inventario: "",
      sw_inventario: false,
    },
    validationSchema: Yup.object({
      referencia: Yup.string().required("La referencia es requerida"),
      nombre: Yup.string().required("El nombre es requerido"),
      precio: Yup.string().required("El precio es requerido"),
      cantidad_inventario: Yup.string().when("sw_inventario", {
        is: true,
        then: () => Yup.string().required("La cantidad es requerida"),
      }),
    }),
    onSubmit: (values) => {
      postProducto(values)
        .then(() => {
          setOpenModal(undefined);
          setLoading(true);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  useEffect(() => {
    if (productoEdit) {
      formik.setFieldValue("id", productoEdit.id);
      formik.setFieldValue("referencia", productoEdit.referencia);
      formik.setFieldValue("nombre", productoEdit.nombre);
      formik.setFieldValue("precio", productoEdit.precio);
      formik.setFieldValue(
        "cantidad_inventario",
        productoEdit.cantidad_inventario
      );
    }
  }, [productoEdit]);
  return (
    <>
      {productoEdit ? (
        <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
          <FaEdit />
          <p className="hidden md:block">Editar producto</p>
        </Button>
      ) : (
        <Button
          className="mr-2"
          size={"xs"}
          onClick={() => setOpenModal(!openModal)}
        >
          <FaPlus />
          <p className="md:ml-2 hidden md:block">Agregar producto</p>
        </Button>
      )}

      <Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
        <Modal.Header>Agregar producto</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="sw_inventario" value="¿Afecta inventario?" />
                </div>
                <Checkbox
                  id="sw_inventario"
                  name="sw_inventario"
                  checked={formik.values.sw_inventario}
                  onChange={() => {
                    formik.setFieldValue(
                      "sw_inventario",
                      !formik.values.sw_inventario
                    );
                  }}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="referencia" value="Numero de referencia" />
                </div>
                <TextInput
                  id="referencia"
                  name="referencia"
                  placeholder="Numero de referencia"
                  value={formik.values.referencia}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-400 font-semibold">
                  {formik.errors.referencia && formik.touched.referencia
                    ? formik.errors.referencia
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nombre" value="nombre" />
                </div>
                <TextInput
                  id="nombre"
                  name="nombre"
                  placeholder="nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-400 font-semibold">
                  {formik.errors.nombre && formik.touched.nombre
                    ? formik.errors.nombre
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="precio" value="precio" />
                </div>
                <TextInput
                  id="precio"
                  name="precio"
                  placeholder="precio"
                  value={formik.values.precio}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="number"
                />
                <small className="text-red-400 font-semibold">
                  {formik.errors.precio && formik.touched.precio
                    ? formik.errors.precio
                    : null}
                </small>
              </div>
              {formik.values.sw_inventario && (
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="cantidad_inventario"
                      value="Numero cantidad_inventario"
                    />
                  </div>
                  <TextInput
                    id="cantidad_inventario"
                    name="cantidad_inventario"
                    placeholder="Numero de cantidad_inventario"
                    value={formik.values.cantidad_inventario}
                    onChange={formik.handleChange}
                    sizing="sm"
                    type="number"
                  />
                  <small className="text-red-400 font-semibold">
                    {formik.errors.cantidad_inventario &&
                    formik.touched.cantidad_inventario
                      ? formik.errors.cantidad_inventario
                      : null}
                  </small>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={formik.handleSubmit}>Guardar</Button>
          <Button color="gray" onClick={() => setOpenModal(undefined)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
