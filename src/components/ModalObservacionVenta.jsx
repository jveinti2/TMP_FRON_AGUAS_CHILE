import { useEffect, useState } from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import { Button, Label, Modal, Textarea } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useFormaPago from "../hooks/useFormaPago";

export default function ModalObservacionVenta({ venta, setLoading }) {
  const [openModal, setOpenModal] = useState(undefined);
  const { postObservacionVenta } = useFormaPago();

  const formik = useFormik({
    initialValues: {
      id: "",
      observacion: "",
    },
    validationSchema: Yup.object({
      observacion: Yup.string(),
    }),
    onSubmit: (values) => {
      postObservacionVenta(values)
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
    if (venta) {
      formik.setFieldValue("id", venta.venta_id);
      formik.setFieldValue("observacion", venta.observacion);
    }
  }, [venta]);
  return (
    <>
      {venta.observacion != null && venta.observacion != "" ? (
        <Button
          className="mr-2"
          size={"xs"}
          color="failure"
          onClick={() => setOpenModal(!openModal)}
        >
          <FaPen />
        </Button>
      ) : (
        <Button
          className="mr-2"
          size={"xs"}
          onClick={() => setOpenModal(!openModal)}
        >
          <FaPlus />
        </Button>
      )}

      <Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
        <Modal.Header>
          {venta.observacion ? "Editar observacion" : "Agregar observacion"}
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
            {venta.observacion && (
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
