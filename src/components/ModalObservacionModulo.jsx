import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaPen } from "react-icons/fa";
import {
  Button,
  Label,
  Modal,
  TextInput,
  Checkbox,
  Textarea,
} from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useModulos from "../hooks/useModulos";

export default function ModalProductos({ modulo, setLoading }) {
  const [openModal, setOpenModal] = useState(undefined);
  const { postObservacionModulo } = useModulos();

  const formik = useFormik({
    initialValues: {
      id: "",
      observacion: "",
    },
    validationSchema: Yup.object({
      observacion: Yup.string(),
    }),
    onSubmit: (values) => {
      postObservacionModulo(values)
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
    if (modulo) {
      formik.setFieldValue("id", modulo.id);
      formik.setFieldValue("observacion", modulo.observacion);
    }
  }, [modulo]);
  return (
    <>
      {modulo.observacion != null && modulo.observacion != "" ? (
        <Button
          className="mr-2"
          size={"xs"}
          color="failure"
          onClick={() => setOpenModal(!openModal)}
        >
          <p className="md:mr-2 hidden md:block">Observación</p>
          <FaPen />
        </Button>
      ) : (
        <Button
          className="mr-2"
          size={"xs"}
          onClick={() => setOpenModal(!openModal)}
        >
          <p className="md:mr-2 hidden md:block">Observación</p>
          <FaPlus />
        </Button>
      )}

      <Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
        <Modal.Header>
          {modulo.observacion ? "Editar observacion" : "Agregar observacion"}
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2 block">
            <Label htmlFor="observacion" value="Observacion del módulo" />
          </div>
          <Textarea
            onChange={formik.handleChange}
            value={formik.values.observacion}
            id="observacion"
            placeholder="Observacion del módulo"
            rows={4}
            className="p-2"
          />
        </Modal.Body>
        <Modal.Footer className="justify-between">
          <div className="flex gap-2">
            <Button onClick={formik.handleSubmit}>Guardar</Button>
            <Button color="gray" onClick={() => setOpenModal(undefined)}>
              Cancelar
            </Button>
          </div>
          <div>
            {modulo.observacion && (
              <Button
                color="red"
                onClick={() => {
                  formik.setFieldValue("observacion", ""); // Restablecer el valor del campo "observacion"
                  formik.handleSubmit(); // Ejecutar la función handleSubmit del formulario
                }}
              >
                Borrar
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
