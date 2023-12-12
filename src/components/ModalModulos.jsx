import { Button, Modal, TextInput, Label } from "flowbite-react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import useModulos from "../hooks/useModulos";

export default function ModalModulos({ edificioId, setLoading }) {
  const { postModulo } = useModulos();
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      capacidad_bidones: 2,
      password: "",
    },
    validationSchema: Yup.object({
      capacidad_bidones: Yup.number().required("Campo requerido"),
      password: Yup.string().required("Campo requerido"),
    }),
    onSubmit: (values) => {
      const data_form = {
        ...values,
        edificioId: edificioId,
      };
      postModulo(data_form)
        .then((response) => {
          setOpenModal(undefined);
          formik.resetForm();
          setLoading(true);
        })
        .catch((error) => {
          formik.resetForm();
          console.log(error);
          setLoading(true);
        });
    },
  });

  return (
    <>
      <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
        <FaPlus />
        <p>Agregar modulos</p>
      </Button>
      <Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
        <Modal.Header>Agregar modulo para edificio</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nombre" value="Nombre del modulo" />
                </div>
                <TextInput
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre del modulo"
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
                  <Label
                    htmlFor="capacidad_bidones"
                    value="Capacidad de bidones"
                  />
                </div>
                <TextInput
                  id="capacidad_bidones"
                  name="capacidad_bidones"
                  placeholder="Capacidad de bidones"
                  value={formik.values.capacidad_bidones}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="number"
                />
                <small className="text-red-700">
                  {formik.errors.capacidad_bidones &&
                  formik.touched.capacidad_bidones
                    ? formik.errors.capacidad_bidones
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Contraseña" value="Contraseña" />
                </div>
                <TextInput
                  id="password"
                  name="password"
                  placeholder="********"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="number"
                />
                <small className="text-red-700">
                  {formik.errors.password && formik.touched.password
                    ? formik.errors.password
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
