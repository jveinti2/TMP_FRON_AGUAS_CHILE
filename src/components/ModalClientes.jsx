import { useEffect, useState } from "react";
import useClientes from "../hooks/useClientes";
import { FaPlus, FaEdit } from "react-icons/fa";
import {
  Button,
  Label,
  Modal,
  TextInput,
  Checkbox,
  Textarea,
} from "flowbite-react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import useGetEdificios from "../hooks/useGetEdificios";
import toast from "react-hot-toast";

export default function ModalClientes({
  clienteEdit,
  setLoading,
  modalVenta,
  setLoadingModalVenta,
  setClienteCreated,
}) {
  const [openModal, setOpenModal] = useState(undefined);
  const { postCliente, verifyTel } = useClientes();
  const { edificios, getListEdificios } = useGetEdificios();

  useEffect(() => {
    if (openModal) {
      getListEdificios();
    }
  }, [openModal]);

  useEffect(() => {
    if (clienteEdit) {
      formik.setFieldValue("id", clienteEdit.id);
      formik.setFieldValue("identificacion", clienteEdit.identificacion);
      formik.setFieldValue("nombres", clienteEdit.nombres);
      formik.setFieldValue("apellidos", clienteEdit.apellidos);
      formik.setFieldValue("telefono", clienteEdit.telefono);
      formik.setFieldValue(
        "direccion_domicilio",
        clienteEdit.direccion_domicilio
      );
      formik.setFieldValue("apartamento", clienteEdit.apartameto);
      formik.setFieldValue("edificio_id", clienteEdit.edificio_id);
      formik.setFieldValue("sw_novedad", clienteEdit.sw_novedad);
      formik.setFieldValue("descripcion", clienteEdit.descripcion);
    }
  }, [clienteEdit]);

  const edificiosMapping = edificios.map((edificio) => {
    return {
      value: edificio.id,
      label: edificio.nombre,
      modulos: edificio.modulos,
    };
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      identificacion: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion_domicilio: "",
      apartamento: "",
      edificio_id: "",
      sw_novedad: false,
      descripcion: "",
    },
    validationSchema: Yup.object({
      identificacion: Yup.string().required("La identificacion es requerida"),
      nombres: Yup.string().required("El nombre es requerido"),
    }),
    onSubmit: (values) => {
      if (values.sw_novedad == false) {
        values.descripcion = "";
      }
      postCliente(values)
        .then((response) => {
          setOpenModal(undefined);
          formik.resetForm();

          if (modalVenta == undefined) {
            setLoading(true);
          } else {
            setLoadingModalVenta(true);
            setClienteCreated(response);
          }
        })
        .catch((error) => {
          console.log(error);
          modalVenta == undefined
            ? setLoading(true)
            : setLoadingModalVenta(true);
        });
    },
  });

  const handleVerifyTel = (data) => {
    data = { telefono: data };
    formik.setFieldValue("telefono", data.telefono);
    verifyTel(data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        formik.setFieldValue("telefono", "");
      });
  };

  return (
    <>
      {clienteEdit ? (
        <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
          <FaEdit />
        </Button>
      ) : (
        <Button
          className="mr-2"
          size={"xs"}
          onClick={() => setOpenModal(!openModal)}
        >
          <FaPlus />

          <p className="md:ml-2 hidden md:block">Agregar cliente</p>
        </Button>
      )}

      <Modal
        show={openModal === true}
        onClose={() => {
          setOpenModal(undefined), formik.resetForm();
        }}
      >
        <Modal.Header>Agregar cliente</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 h-96">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="direccion_domicilio"
                    value="Indique la direccion del domicilio"
                  />
                </div>
                <TextInput
                  type="text"
                  className="text-sm"
                  placeholder="Direccion domicilio"
                  id="direccion_domicilio"
                  name="direccion_domicilio"
                  onChange={formik.handleChange}
                  value={formik.values.direccion_domicilio}
                  sizing="sm"
                />
                <small className="text-red-700">
                  {formik.errors.direccion_domicilio &&
                  formik.touched.direccion_domicilio
                    ? formik.errors.direccion_domicilio
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="identificacion"
                    value="Numero de identificacion"
                  />
                </div>
                <TextInput
                  id="identificacion"
                  name="identificacion"
                  placeholder="Numero de identificacion"
                  value={formik.values.identificacion}
                  onChange={formik.handleChange}
                  onPaste={(e) => {
                    e.preventDefault();
                    let text = e.clipboardData.getData("text/plain");
                    let text2 = text.replace(/\s/g, "");
                    formik.setFieldValue("identificacion", text2);
                  }}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-700">
                  {formik.errors.identificacion && formik.touched.identificacion
                    ? formik.errors.identificacion
                    : null}
                </small>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nombres" value="Nombres" />
                </div>
                <TextInput
                  id="nombres"
                  name="nombres"
                  placeholder="Nombres"
                  value={formik.values.nombres}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-700">
                  {formik.errors.nombres && formik.touched.nombres
                    ? formik.errors.nombres
                    : null}
                </small>
              </div>
              {/* <div>
								<div className='mb-2 block'>
									<Label htmlFor='apellidos' value='Apellidos' />
								</div>
								<TextInput
									id='apellidos'
									name='apellidos'
									placeholder='Apellidos'
									value={formik.values.apellidos}
									onChange={formik.handleChange}
									sizing='sm'
									type='text'
								/>
								<small className='text-red-700'>
									{formik.errors.apellidos && formik.touched.apellidos
										? formik.errors.apellidos
										: null}
								</small>
							</div> */}
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
                  onPaste={(e) => {
                    e.preventDefault();
                    let text = e.clipboardData.getData("text/plain");
                    let text2 = text.replace(/\s/g, "");
                    handleVerifyTel(text2);
                  }}
                  sizing="sm"
                  type="text"
                />
                <small className="text-red-700">
                  {formik.errors.telefono && formik.touched.telefono
                    ? formik.errors.telefono
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="edificio_id" value="Seleccione el edificio" />
                </div>
                <Select
                  className="text-sm"
                  placeholder="Seleccione un edificio"
                  id="edificio_id"
                  name="edificio_id"
                  options={edificiosMapping}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("edificio_id", selectedOption.value);
                  }}
                  value={edificiosMapping.find(
                    (option) => option.value === formik.values.edificio_id
                  )}
                />

                <small className="text-red-700">
                  {formik.errors.edificio_id && formik.touched.edificio_id
                    ? formik.errors.edificio_id
                    : null}
                </small>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="apartamento"
                    value="Indique el departamento"
                  />
                </div>
                <TextInput
                  type="text"
                  className="text-sm"
                  placeholder="Departamento"
                  id="apartamento"
                  name="apartamento"
                  onChange={formik.handleChange}
                  value={formik.values.apartamento}
                  sizing="sm"
                />
                <small className="text-red-700">
                  {formik.errors.apartamento && formik.touched.apartamento
                    ? formik.errors.apartamento
                    : null}
                </small>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sw_novedad"
                    name="sw_novedad"
                    onChange={() => {
                      formik.setFieldValue(
                        "sw_novedad",
                        !formik.values.sw_novedad
                      );
                    }}
                    checked={formik.values.sw_novedad}
                  />
                  <Label className="flex" htmlFor="sw_novedad">
                    <p>¿Tiene novedad?</p>
                  </Label>
                </div>
              </div>
              {formik.values.sw_novedad ? (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="descripcion" value="Describa la novedad" />
                  </div>
                  <Textarea
                    className="p-1"
                    id="descripcion"
                    placeholder="El cliente no devuelve los bidones"
                    name="descripcion"
                    rows={4}
                    onChange={formik.handleChange}
                    value={formik.values.descripcion}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={formik.handleSubmit}>Guardar</Button>
          <Button
            color="gray"
            onClick={() => {
              setOpenModal(undefined), formik.resetForm();
            }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
