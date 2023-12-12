import { useEffect, useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Button, Label, Modal, TextInput, Checkbox } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postFormasPagoApi } from "../services/formasPago.services.js";

export default function ModalFormasPago({ formaPagoEdit, setLoading }) {
  const [openModal, setOpenModal] = useState(undefined);

  const formik = useFormik({
    initialValues: {
      id: "",
      nombre: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es requerido"),
      descripcion: Yup.string().required("La descripcion es requerida"),
    }),
    onSubmit: (values) => {
      postFormasPagoApi(values)
        .then((response) => {
          setLoading(true);
          setOpenModal(undefined);
          formik.resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  useEffect(() => {
    if (formaPagoEdit) {
      formik.setFieldValue("id", formaPagoEdit.id);
      formik.setFieldValue("nombre", formaPagoEdit.nombre);
      formik.setFieldValue("descripcion", formaPagoEdit.descripcion);
    }
  }, [formaPagoEdit]);
  return (
    <>
      {formaPagoEdit ? (
        <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
          <FaEdit />
          <span className="hidden md:block">Editar forma de pago</span>
        </Button>
      ) : (
        <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
          <FaPlus />
          <span className="hidden md:block">Agregar forma de pago</span>
        </Button>
      )}

      <Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
        <Modal.Header>Agregar forma de pago</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nombre" value="Nombre" />
                </div>
                <TextInput
                  id="nombre"
                  name="nombre"
                  placeholder="Numero de nombre"
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
                  <Label htmlFor="descripcion" value="descripcion" />
                </div>
                <TextInput
                  id="descripcion"
                  name="descripcion"
                  placeholder="Numero de descripcion"
                  value={formik.values.descripcion}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-400 font-semibold">
                  {formik.errors.descripcion && formik.touched.descripcion
                    ? formik.errors.descripcion
                    : null}
                </small>
              </div>
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
