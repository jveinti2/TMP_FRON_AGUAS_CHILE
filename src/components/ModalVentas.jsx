import { useEffect, useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import {
  Button,
  Label,
  Modal,
  TextInput,
  Checkbox,
  Select as Select2,
  Datepicker,
} from "flowbite-react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import useClientes from "../hooks/useClientes";
import useGetEdificios from "../hooks/useGetEdificios";
import useProductos from "../hooks/useProductos";
import useVentas from "../hooks/useVentas";
import { getDomiciliariosApi } from "../services/domiciliarios.services";
import { getListaFormasPagoApi } from "../services/listas.services";
import ModalClientes from "./ModalClientes";
import toFormatDate from "../utils/toFormatDate";
import { toFormData } from "axios";

export default function ModalVentas({ ventaEdit }) {
  const [novedad, setNovedad] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [fechaVenta, setFechaVenta] = useState();
  const [filterClienteSelected, setFilterClienteSelected] = useState("");
  const [clienteCreated, setClienteCreated] = useState();
  const [loadingModalVenta, setLoadingModalVenta] = useState(false);
  const [bidonesDisponibles, setBidonesDisponibles] = useState(0);
  const [modulos, setModulos] = useState([]);
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [formas_pago, setFormasPago] = useState([]);
  const [openModal, setOpenModal] = useState(undefined);
  const { clientes, getListClientes } = useClientes();
  const { edificios, getListEdificios } = useGetEdificios();
  const { productos, getProductos } = useProductos();
  const { postVenta } = useVentas();
  const [loading, setLoading] = useState(true);

  const modalVenta = true;

  useEffect(() => {
    if (loading) {
      setSelectedOption(null);
      getListClientes();
      getListEdificios();
      getProductos();
      getDomiciliariosApi().then((response) => {
        setDomiciliarios(response.domiciliarios);
      });
      getListaFormasPagoApi().then((response) => {
        setFormasPago(response.formas_pago);
      });
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (loadingModalVenta) {
      getListClientes();
      getListEdificios();
      getProductos();
      getDomiciliariosApi().then((response) => {
        setDomiciliarios(response.domiciliarios);
      });
      getListaFormasPagoApi().then((response) => {
        setFormasPago(response.formas_pago);
      });
      setLoadingModalVenta(false);
    }
  }, [loadingModalVenta]);

  const handleGetModulos = (edificio) => {
    if (edificio !== undefined) return setModulos(edificio.modulos);
  };

  const clientesMapping = clientes.map((cliente) => {
    return {
      value: cliente.id,
      // añadir icono para saber que es u cliente marcado
      label: cliente.sw_novedad
        ? `⚠️ ${cliente.nombres} / ${cliente.telefono} / ${cliente.direccion_domicilio}`
        : `${cliente.nombres} / ${cliente.telefono} / ${cliente.direccion_domicilio}`,
      direccion_domicilio: cliente.direccion_domicilio,
      apartamento: cliente.apartameto,
      edificio_id: cliente.edificio_id,
      edificio: cliente.edificio,
      sw_novedad: cliente.sw_novedad,
      descripcion: cliente.descripcion,
    };
  });
  const edificiosMapping = edificios.map((edificio) => {
    return {
      value: edificio.id,
      label: edificio.nombre,
      modulos: edificio.modulos,
    };
  });

  const productosMapping = productos.map((producto) => {
    return {
      value: producto.id,
      label: ` ${producto.nombre} $${producto.precio}`,
    };
  });

  const domiciliariosMapping = domiciliarios.map((domiciliario) => {
    return {
      value: domiciliario.id,
      label: `${domiciliario.nombres} ${domiciliario.apellidos}`,
    };
  });
  const formasPagosMapping = formas_pago.map((forma_pago) => {
    return {
      value: forma_pago.id,
      label: `${forma_pago.nombre}`,
    };
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      cliente: "",
      edificio: "",
      producto: "",
      forma_pago: "",
      cantidad_bidones: "",
      domicilio: false,
      domiciliario: "",
      modulo: "",
      direccion_domicilio: "",
      apartamento: "",
      donacion: false,
    },
    validationSchema: Yup.object({
      domicilio: Yup.boolean(),
      donacion: Yup.boolean(),
      cliente: Yup.string().required("El cliente es obligatorio"),
      producto: Yup.string().required("El producto es obligatorio"),
      forma_pago: Yup.string().when("domicilio", {
        is: false,
        then: () => Yup.string().required("La forma de pago es obligatoria"),
      }),

      modulo: Yup.string().when("domicilio", {
        is: false,
        then: () => Yup.string().required("El modulo es obligatorio"),
      }),

      cantidad_bidones: Yup.number().when("domicilio", {
        is: false,
        then: () =>
          Yup.number()
            .required("La cantidad de bidones es obligatoria")
            .min(1, "La cantidad de bidones debe ser mayor a 0")
            .max(
              bidonesDisponibles,
              `La cantidad de bidones debe ser menor o igual a ${bidonesDisponibles}`
            ),
        otherwise: () =>
          Yup.number()
            .required("La cantidad de bidones es requerida")
            .min(1, "La cantidad de bidones debe ser mayor a 0"),
      }),
      direccion_domicilio: Yup.string().when("domicilio", {
        is: true,
        then: () =>
          Yup.string().required("La direccion del domicilio es obligatoria"),
      }),
    }),

    onSubmit: (values) => {
      values.fh_creacion = document.getElementById("fh_creacion").value;
      values.fh_creacion = toFormatDate(values.fh_creacion);
      try {
        postVenta(values);
        setOpenModal(undefined);
        formik.resetForm();
        setSelectedOption(null);
        setNovedad("");
        setModulos([]);
      } catch (error) {
        console.log(error);
        setSelectedOption(null);
        setNovedad("");
      } finally {
        setSelectedOption(null);
        setNovedad("");
      }
    },
  });

  // Actualiza el valor del Select cuando clienteCreated tiene datos
  useEffect(() => {
    if (clienteCreated) {
      setSelectedOption({
        value: clienteCreated.id,
        label: clienteCreated.nombres,
        direccion_domicilio: clienteCreated.direccion_domicilio,
        apartamento: clienteCreated.apartamento,
        edificio_id: clienteCreated.edificio_id,
      });
      formik.setFieldValue("cliente", clienteCreated.id);
      formik.setFieldValue(
        "direccion_domicilio",
        clienteCreated.direccion_domicilio
      );
      formik.setFieldValue("apartamento", clienteCreated.apartameto);
      formik.setFieldValue("edificio", clienteCreated.edificio_id);

      handleGetModulos(
        edificiosMapping.find(
          (edificio) => edificio.value == clienteCreated.edificio_id
        )
      );
    }
  }, [clienteCreated]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    formik.setFieldValue("cliente", selectedOption ? selectedOption.value : "");
    formik.setFieldValue(
      "direccion_domicilio",
      selectedOption ? selectedOption.direccion_domicilio : ""
    );
    formik.setFieldValue(
      "apartamento",
      selectedOption ? selectedOption.apartamento : ""
    );

    if (selectedOption && selectedOption.edificio_id !== null) {
      formik.setFieldValue("edificio", selectedOption.edificio_id);
      handleGetModulos(
        edificiosMapping.find(
          (edificio) => edificio.value == selectedOption.edificio_id
        )
      );
    } else {
      formik.setFieldValue("edificio", "");
    }

    selectedOption.sw_novedad == 1
      ? setNovedad(selectedOption.descripcion)
      : setNovedad("");
  };

  return (
    <>
      {ventaEdit ? (
        <Button size={"xs"} onClick={() => setOpenModal(!openModal)}>
          <FaEdit />
          <p>Editar venta </p>
        </Button>
      ) : (
        <Button
          className="mr-2"
          size={"xs"}
          onClick={() => setOpenModal(!openModal) || setLoading(true)}
        >
          <FaPlus />
          <p className="md:ml-2 hidden md:block">Agregar venta</p>
        </Button>
      )}

      <Modal
        size={"4xl"}
        show={openModal === true}
        onClose={() =>
          setOpenModal(undefined) ||
          formik.resetForm() ||
          setNovedad("") ||
          setModulos([])
        }
      >
        <Modal.Header>
          <div className="flex gap-5">
            <h3>Agregar venta {clienteCreated && clienteCreated.id}</h3>
            <ModalClientes
              modalVenta={modalVenta}
              setLoadingModalVenta={setLoadingModalVenta}
              setClienteCreated={setClienteCreated}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6 h-full pb-16">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="donacion" value="Indique si es donación" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="donacion"
                    name="donacion"
                    checked={formik.values.donacion}
                    onChange={() => {
                      formik.setFieldValue("donacion", !formik.values.donacion);
                    }}
                  />
                  <Label className="flex" htmlFor="donacion">
                    <p>¿es donación?</p>
                  </Label>
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="domicilio" value="Indique si es domicilio" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="domicilio"
                    name="domicilio"
                    onChange={() => {
                      formik.setFieldValue(
                        "domicilio",
                        !formik.values.domicilio
                      );
                    }}
                    checked={formik.values.domicilio}
                  />
                  <Label className="flex" htmlFor="domicilio">
                    <p>¿es domicilio?</p>
                  </Label>
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="fh_creacion" value="Fecha de venta" />
                </div>
                <Datepicker id="fh_creacion" name="fh_creacion" />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="producto" value="Seleccione un producto" />
                </div>
                <Select
                  className="text-sm "
                  placeholder="Seleccione un producto"
                  id="producto"
                  name="producto"
                  options={productosMapping}
                  onChange={(value) => {
                    formik.setFieldValue("producto", value.value);
                  }}
                  values={formik.values.producto}
                />
                <small className="text-red-500 font-semibold">
                  {formik.errors.producto && formik.touched.producto
                    ? formik.errors.producto
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 md:block">
                  <Label htmlFor="cliente" value="Seleccione un cliente" />
                </div>
                <Select
                  options={clientesMapping}
                  className="text-sm"
                  placeholder="Seleccione un cliente"
                  id="cliente"
                  name="cliente"
                  onChange={handleSelectChange}
                  value={selectedOption}
                />

                {/* <input
									type='text'
									onChange={e => {
										setFilterClienteSelected(e.target.value);
									}}
								/>

								<select
									id='cliente'
									name='cliente'
									value={formik.values.cliente}
									onChange={e => {
										const value = clientesMapping.find(
											cliente => cliente.value == e.target.value
										);
										formik.setFieldValue('cliente', value.value);
										formik.setFieldValue(
											'direccion_domicilio',
											value.direccion_domicilio
										);
										formik.setFieldValue('apartamento', value.apartamento);

										if (value.edificio_id !== null) {
											formik.setFieldValue('edificio', value.edificio_id);
											handleGetModulos(
												edificiosMapping.find(
													edificio => edificio.value == value.edificio_id
												)
											);
										}
									}}
								>
									{clientesMapping
										.filter(cliente =>
											cliente.label
												.toLowerCase()
												.includes(filterClienteSelected.toLowerCase())
										)
										.map(cliente => (
											<option key={cliente.value} value={cliente.value}>
												{cliente.label}
											</option>
										))}
								</select> */}

                {/* <Select
									options={clientesMapping}
									className='text-sm'
									placeholder='Seleccione un cliente 2'
									id='cliente'
									name='cliente'
									onChange={value => {
										formik.setFieldValue('cliente', value.value);
										formik.setFieldValue(
											'direccion_domicilio',
											value.direccion_domicilio
										);
										formik.setFieldValue('apartamento', value.apartamento);

										if (value.edificio_id !== null) {
											formik.setFieldValue('edificio', value.edificio_id);
											handleGetModulos(
												edificiosMapping.find(
													edificio => edificio.value == value.edificio_id
												)
											);
										}
									}}
								/> */}

                <small className="text-red-500 font-semibold">
                  {formik.errors.cliente && formik.touched.cliente
                    ? formik.errors.cliente
                    : null}
                </small>
                <small className="text-red-500 font-semibold">
                  {novedad != "" ? `Cliente con novedad: ${novedad}` : null}
                </small>
              </div>
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
                />
                <small className="text-red-500 font-semibold">
                  {formik.errors.direccion_domicilio &&
                  formik.touched.direccion_domicilio
                    ? formik.errors.direccion_domicilio
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="apartamento" value="Indique el apartamento" />
                </div>
                <TextInput
                  type="text"
                  className="text-sm"
                  placeholder="Direccion domicilio"
                  id="apartamento"
                  name="apartamento"
                  onChange={formik.handleChange}
                  value={formik.values.apartamento}
                />
                <small className="text-red-500 font-semibold">
                  {formik.errors.apartamento && formik.touched.apartamento
                    ? formik.errors.apartamento
                    : null}
                </small>
              </div>
              {/* si se hace check en domicilio, se debe mostrar el select de domiciliarios */}
              {formik.values.domicilio == true ? (
                <>
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="domiciliario"
                        value="Seleccione un domiciliario"
                      />
                    </div>
                    <Select
                      className="text-sm"
                      placeholder="Seleccione un domiciliario"
                      id="domiciliario"
                      name="domiciliario"
                      options={domiciliariosMapping}
                      onChange={(value) => {
                        formik.setFieldValue("domiciliario", value.value);
                      }}
                      values={formik.values.domiciliario}
                    />
                    <small className="text-red-500 font-semibold">
                      {formik.errors.domiciliario && formik.touched.domiciliario
                        ? formik.errors.domiciliario
                        : null}
                    </small>
                  </div>
                </>
              ) : null}
              {formik.values.domicilio == false ? (
                <>
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="edificio"
                        value="Seleccione un edificio"
                      />
                    </div>
                    <select
                      className="w-full p-2 border border-[#d1d5db] rounded-lg"
                      id="edificio"
                      name="edificio"
                      onChange={(e) => {
                        formik.setFieldValue("edificio", e.target.value);
                        handleGetModulos(
                          edificiosMapping.find(
                            (edificio) => edificio.value == e.target.value
                          )
                        );
                      }}
                      value={formik.values.edificio}
                    >
                      <option value="">Seleccione una por defecto</option>
                      {edificiosMapping.map((edificio) => {
                        return (
                          <option value={edificio.value} key={edificio.value}>
                            {edificio.label}
                          </option>
                        );
                      })}
                    </select>
                    {/* <Select
											className='text-sm'
											placeholder='Seleccione un edificio'
											id='edificio'
											name='edificio'
											options={edificiosMapping}
											onChange={value => {
												formik.setFieldValue('edificio', value.value);
												handleGetModulos(value);
											}}
											values={formik.values.edificio}
										/> */}
                    <small className="text-red-500 font-semibold">
                      {formik.errors.edificio && formik.touched.edificio
                        ? formik.errors.edificio
                        : null}
                    </small>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="modulo" value="Seleccione un modulo" />
                    </div>
                    <Select2
                      id="modulo"
                      name="modulo"
                      value={formik.values.modulo}
                      onChange={formik.handleChange}
                      onBlur={() =>
                        setBidonesDisponibles(
                          modulos.find(
                            (modulo) => modulo.id == formik.values.modulo
                          ).cantidad_bidones
                        )
                      }
                    >
                      <option>Seleccione un modulo</option>
                      {modulos.map((modulo) => {
                        return (
                          <option value={modulo.id} key={modulo.id}>
                            {modulo.nombre} - {modulo.cantidad_bidones} bidones
                          </option>
                        );
                      })}
                    </Select2>
                    <small className="text-red-500 font-semibold">
                      {formik.errors.modulo && formik.touched.modulo
                        ? formik.errors.modulo
                        : null}
                    </small>
                  </div>
                </>
              ) : null}
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="forma_pago"
                    value="Seleccione un forma pago"
                  />
                </div>
                <Select
                  className="text-sm"
                  placeholder="Seleccione un forma pago"
                  id="forma_pago"
                  name="forma_pago"
                  options={formasPagosMapping}
                  onChange={(value) => {
                    formik.setFieldValue("forma_pago", value.value);
                  }}
                  values={formik.values.forma_pago}
                />
                <small className="text-red-500 font-semibold">
                  {formik.errors.forma_pago && formik.touched.forma_pago
                    ? formik.errors.forma_pago
                    : null}
                </small>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="cantidad_bidones" value={`Cantidad`} />
                </div>
                <TextInput
                  id="cantidad_bidones"
                  name="cantidad_bidones"
                  placeholder="Cantidad bidones"
                  value={formik.values.cantidad_bidones}
                  onChange={formik.handleChange}
                  sizing="sm"
                  type="number"
                />
                <small className="text-red-500 font-semibold">
                  {formik.errors.cantidad_bidones &&
                  formik.touched.cantidad_bidones
                    ? formik.errors.cantidad_bidones
                    : null}
                </small>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={formik.handleSubmit}>Guardar</Button>
          <Button
            color="gray"
            onClick={() =>
              setOpenModal(undefined) ||
              formik.resetForm() ||
              setNovedad("") ||
              setModulos([])
            }
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
