import { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postUsuariosApi } from "../services/usuarios.services";
import toast from "react-hot-toast";

export default function ModalUsuarios({ usuarioEdit, setLoading }) {
  const [openModal, setOpenModal] = useState(undefined);

  useEffect(() => {
    if (usuarioEdit) {
      formik.setFieldValue("usuario_id", usuarioEdit.usuario_id);
      formik.setFieldValue("name", usuarioEdit.name);
      formik.setFieldValue("apellidos", usuarioEdit.apellidos);
      formik.setFieldValue("email", usuarioEdit.email);
      formik.setFieldValue("telefono", usuarioEdit.telefono);
      formik.setFieldValue("rol_id", usuarioEdit.rol_id);
    }
  }, [usuarioEdit]);

  const formik = useFormik({
    initialValues: {
      usuario_id: "",
      rol_id: "",
      name: "",
      apellidos: "",
      email: "",
      telefono: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      apellidos: Yup.string().required("El apellido es requerido"),
      email: Yup.string()
        .email("Correo electronico invalido")
        .required("El correo electronico es requerido"),
      telefono: Yup.string().required("El telefono es requerido"),
      password: Yup.string().when("usuario_id", {
        is: (usuarioId) => !usuarioId,
        then: () => Yup.string().required("La contraseña es requerida"),
      }),
      rol_id: Yup.string().required("El rol es requerido"),
    }),
    onSubmit: (values) => {
      postUsuariosApi(values)
        .then((response) => {
          toast.success(response.mensaje);
          setOpenModal(undefined);
          formik.resetForm();
          setLoading(true);
        })
        .catch((error) => {
          toast.error(error.response.data.mensaje);
          console.log(error);
        });
    },
  });

  return (
    <>
      {usuarioEdit ? (
        <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
          <FaEdit />
          <span className="hidden md:block">Editar usuario</span>
        </Button>
      ) : (
        <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
          <FaPlus />
          <span className="hidden md:block">Agregar usuario</span>
        </Button>
      )}

      <Modal show={openModal === true} onClose={() => setOpenModal(undefined)}>
        <Modal.Header>Agregar usuario</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 ">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Nombres" />
                </div>
                <TextInput
                  id="name"
                  name="name"
                  placeholder="Nombres"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-700">
                  {formik.errors.name && formik.touched.name
                    ? formik.errors.name
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="apellidos" value="Apellidos" />
                </div>
                <TextInput
                  id="apellidos"
                  name="apellidos"
                  placeholder="Apellidos"
                  value={formik.values.apellidos}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-700">
                  {formik.errors.apellidos && formik.touched.apellidos
                    ? formik.errors.apellidos
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Correo electronico" />
                </div>
                <TextInput
                  id="email"
                  name="email"
                  placeholder="Correo electronico"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="email"
                />
                <small className="text-red-700">
                  {formik.errors.email && formik.touched.email
                    ? formik.errors.email
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="telefono" value="Numero telefono" />
                </div>
                <TextInput
                  id="telefono"
                  name="telefono"
                  placeholder="Numero de telefono"
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
                  <Label htmlFor="password" value="Contraseña" />
                </div>
                <TextInput
                  id="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-700">
                  {formik.errors.password && formik.touched.password
                    ? formik.errors.password
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="rol_id" value="Rol" />
                </div>
                <Select
                  id="rol_id"
                  name="rol_id"
                  value={formik.values.rol_id}
                  onChange={formik.handleChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Administrador</option>
                  <option value="2">Domiciliario</option>
                  <option value="3">Operario</option>
                </Select>
                <small className="text-red-700">
                  {formik.errors.rol_id && formik.touched.rol_id
                    ? formik.errors.rol_id
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
