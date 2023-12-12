import { useEffect, useState } from "react";
import { Button, Modal, Label, TextInput } from "flowbite-react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import { postEdificio } from "../services/edificios.services";
import * as Yup from "yup";

export default function ModalEdificios({ edificio, setLoading }) {
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: "",
      nombre: "",
      direccion: "",
      telefono: "",
      responsable: "",
      zona: "",
      llave_maestra: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      direccion: Yup.string().required("La dirección es obligatoria"),
    }),
    onSubmit: (values) => {
      postEdificio(values)
        .then((response) => {
          if (response.status === 200) {
            setOpenModal(!openModal);
            setLoading(true);
            formik.resetForm();
          }
        })
        .catch((error) => console.log(error));
    },
  });

  useEffect(() => {
    if (edificio) {
      formik.setValues({
        id: edificio.id,
        nombre: edificio.nombre,
        direccion: edificio.direccion,
        telefono: edificio.telefono,
        responsable: edificio.responsable,
        zona: edificio.zona,
        llave_maestra: edificio.llave_maestra,
      });
    }
  }, [edificio]);

  return (
    <>
      {edificio ? (
        <Button size="xs" onClick={() => setOpenModal(!openModal)}>
          <FaEdit />
          <span>Editar edificio</span>
        </Button>
      ) : (
        <Button size="xs" onClick={() => setOpenModal(!openModal)}>
          <FaPlus />
          <span className="hidden md:block">Agregar edificio</span>
        </Button>
      )}

      <Modal show={openModal === true} onClose={() => setOpenModal(!openModal)}>
        <Modal.Header>Agregar edificio</Modal.Header>
        <Modal.Body>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="hidden"
              name="id"
              onChange={formik.handleChange}
              value={formik.values.id}
            />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nombre" value="Nombre del edificio" />
              </div>
              <TextInput
                id="nombre"
                name="nombre"
                placeholder="Nombre del edificio"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                sizing="sm"
                type="text"
              />
              <small className="text-red-700">
                {formik.errors.nombre && formik.touched.nombre
                  ? formik.errors.nombre
                  : null}
              </small>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="direccion" value="Dirección" />
              </div>
              <TextInput
                id="direccion"
                name="direccion"
                placeholder="Dirección"
                value={formik.values.direccion}
                onChange={formik.handleChange}
                sizing="sm"
                type="text"
              />
              <small className="text-red-700">
                {formik.errors.direccion && formik.touched.direccion
                  ? formik.errors.direccion
                  : null}
              </small>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="telefono" value="Telefono" />
              </div>
              <TextInput
                id="telefono"
                name="telefono"
                placeholder="Telefono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                sizing="sm"
                type="number"
              />
              <small className="text-red-700">
                {formik.errors.telefono && formik.touched.telefono
                  ? formik.errors.telefono
                  : null}
              </small>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="responsable" value="Nombre del responsable" />
              </div>
              <TextInput
                id="responsable"
                name="responsable"
                placeholder="Nombre del responsable"
                value={formik.values.responsable}
                onChange={formik.handleChange}
                sizing="sm"
                type="text"
              />
              <small className="text-red-700">
                {formik.errors.responsable && formik.touched.responsable
                  ? formik.errors.responsable
                  : null}
              </small>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="zona" value="Nombre del zona" />
              </div>
              <TextInput
                id="zona"
                name="zona"
                placeholder="Nombre del zona"
                value={formik.values.zona}
                onChange={formik.handleChange}
                sizing="sm"
                type="text"
              />
              <small className="text-red-700">
                {formik.errors.zona && formik.touched.zona
                  ? formik.errors.zona
                  : null}
              </small>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="llave_maestra" value="Llave maestra" />
              </div>
              <TextInput
                id="llave_maestra"
                name="llave_maestra"
                placeholder="Nombre del llave_maestra"
                value={formik.values.llave_maestra}
                onChange={formik.handleChange}
                sizing="sm"
                type="text"
              />
              <small className="text-red-700">
                {formik.errors.llave_maestra && formik.touched.llave_maestra
                  ? formik.errors.llave_maestra
                  : null}
              </small>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={formik.handleSubmit}>Guardar</Button>
          <Button color="red" onClick={() => setOpenModal(!openModal)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
