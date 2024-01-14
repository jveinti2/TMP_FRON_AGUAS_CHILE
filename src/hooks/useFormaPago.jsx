import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button, Label, TextInput } from "flowbite-react";
import {
  getVentasApi,
  postDomicilioApi,
  postObservacionVentaApi,
} from "../services/ventas.services";
import { getListaFormasPagoApi } from "../services/listas.services";
import { getDomiciliariosApi } from "../services/domiciliarios.services";

export default function useFormaPago() {
  const [loadingFormasPago, setLoadingFormasPago] = useState(true);
  const [formasPago, setFormasPago] = useState([]);
  const [domiciliarios, setDomiciliarios] = useState([]);

  useEffect(() => {
    getListaFormasPagoApi().then((response) => {
      setFormasPago(response.formas_pago);
    });
    getDomiciliariosApi().then((response) => {
      setDomiciliarios(response.domiciliarios);
    });
  }, []);

  const selectDomiciliario = () => {
    return new Promise((resolve) => {
      const handleDomiciliarioClick = (domiciliario) => {
        resolve(domiciliario);
        toast.dismiss();
      };

      toast(
        <div className="space-y-2">
          <p>¿Quién entregará el domicilio?</p>
          <div className="grid grid-cols-2 gap-2">
            {domiciliarios.length > 0 &&
              domiciliarios.map((domiciliario) => {
                return (
                  <Button
                    key={domiciliario.id}
                    size={"xs"}
                    color="success"
                    onClick={() => handleDomiciliarioClick(domiciliario.id)}
                  >
                    {domiciliario.nombres} {domiciliario.apellidos}
                  </Button>
                );
              })}
          </div>
          <div className="grid place-content-center">
            <Button size={"xs"} color="failure" onClick={() => toast.dismiss()}>
              Cancelar
            </Button>
          </div>
        </div>,
        { duration: Infinity }
      );
    });
  };

  const confirmDomicilio = (cantidad) => {
    return new Promise((resolve) => {
      const handleConfirmDomicilioClick = () => {
        resolve(document.getElementById("cantidadNueva").value);
        toast.dismiss();
      };

      toast(
        <div className="space-y-2">
          <p className="text-center">
            Se facturaron <b>{cantidad} unidades.</b> <br />
            Confirme o cambie el valor
          </p>
          <div className="grid place-content-center gap-2">
            <div className="flex items-center gap-2">
              <div className="mb-2 block">
                <Label htmlFor="cantidad" value="Cantidad nueva" />
              </div>
              <TextInput sizing="sm" id="cantidadNueva" type="number" min={1} />
            </div>
          </div>
          <div className="grid place-content-center">
            <div className="flex gap-2">
              <Button
                size={"xs"}
                color="success"
                onClick={handleConfirmDomicilioClick}
              >
                Confirmar
              </Button>
              <Button
                size={"xs"}
                color="failure"
                onClick={() => {
                  toast.dismiss();
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>,
        { duration: Infinity }
      );
    });
  };

  const selectFormaPago = () => {
    return new Promise((resolve) => {
      const handleFormaPagoClick = (formaPago) => {
        resolve(formaPago);
        toast.dismiss();
      };

      toast(
        <div className="space-y-4">
          <div className="space-y-2">
            <p>
              *Recuerde autorizar el pago luego de recibir el efectivo o
              comprobante de pago.
            </p>
            <br />
            <p>
              *Si el cliente no pagará inmediatamente, por favor dejarlo en
              Pendiente pago.
            </p>
          </div>
          <hr />
          <div className="space-y-2">
            <div className="space-y-2">
              <Label>¿Cómo desea pagar el cliente?</Label>
              <div className="grid grid-cols-2 gap-2">
                {formasPago.length > 0 &&
                  formasPago.map((formaPago) => {
                    return (
                      <Button
                        key={formaPago.id}
                        size={"xs"}
                        color="success"
                        onClick={() => handleFormaPagoClick(formaPago.id)}
                      >
                        {formaPago.nombre}
                      </Button>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="grid place-content-center">
            <Button size={"xs"} color="failure" onClick={() => toast.dismiss()}>
              Cancelar
            </Button>
          </div>
        </div>,
        { duration: Infinity }
      );
    });
  };
  const selectSwRecogerBidones = () => {
    return new Promise((resolve) => {
      const handleSwRecogerBidonesClick = (sw_recoger_bidones) => {
        resolve(sw_recoger_bidones);
      };

      toast(
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="remember"
              className="
              text-black dark:text-black
            "
            >
              ¿Se dejarán los bidones?
            </Label>
            <div className="flex justify-center gap-2">
              <Button
                size={"xs"}
                color="success"
                onClick={() => handleSwRecogerBidonesClick(true)}
              >
                Si
              </Button>
              <Button
                size={"xs"}
                color="success"
                onClick={() => handleSwRecogerBidonesClick(false)}
              >
                No
              </Button>
            </div>
            <hr />
          </div>
          <div className="grid place-content-center">
            <Button size={"xs"} color="failure" onClick={() => toast.dismiss()}>
              Cancelar
            </Button>
          </div>
        </div>,
        { duration: Infinity }
      );
    });
  };

  const handleEntregarDomicilio = async (domicilio, bandera, setLoading) => {
    const domiciliario =
      domicilio.domiciliario_id !== null
        ? domicilio.domiciliario_id
        : await selectDomiciliario();

    const formaPago =
      domicilio.forma_pago_id !== null && domicilio.forma_pago_id !== undefined
        ? domicilio.forma_pago_id
        : await selectFormaPago();

    const cantidad_bidones =
      domicilio.estado_domicilio === 2
        ? await confirmDomicilio(domicilio.cantidad_bidones)
        : domicilio.cantidad_bidones;

    const swDejarBidones =
      domicilio.estado_domicilio !== 2
        ? domicilio.sw_domicilio_recogida
        : await selectSwRecogerBidones();

    const data_form = {
      domiciliario,
      forma_pago: formaPago,
      cantidad_bidones:
        cantidad_bidones !== "" ? cantidad_bidones : domicilio.cantidad_bidones,
      swDejarBidones: swDejarBidones,
    };

    toast
      .promise(
        postDomicilioApi(domicilio.venta_id, data_form, bandera),
        {
          loading: "Entregando domicilio...",
          success: "Domicilio entregado",
          error: "Error al entregar el domicilio",
        },
        {
          duration: 3000,
          position: "top-center",
        }
      )
      .then(() => {
        getVentasApi().then((response) => {
          setLoading(true);
        });
        toast.dismiss();
      });
  };

  const handleFormaPago = async (
    venta_id,
    bandera,
    setLoading,
    domiciliario_id,
    sw_domicilio_recogida,
    cantidad_bidones
  ) => {
    const formaPago = await selectFormaPago();
    const data_form = {
      domiciliario: domiciliario_id,
      forma_pago: formaPago,
      swDejarBidones: sw_domicilio_recogida,
      cantidad_bidones: cantidad_bidones,
    };

    toast
      .promise(
        postDomicilioApi(venta_id, data_form, bandera),
        {
          loading: "Entregando domicilio...",
          success: "Domicilio entregado",
          error: "Error al entregar el domicilio",
        },
        {
          duration: 3000,
          position: "top-center",
        }
      )
      .then(() => {
        getVentasApi().then((response) => {
          setLoading(true);
        });
        toast.dismiss();
      });
  };

  const handleDomiciliario = async (
    venta_id,
    bandera,
    setLoading,
    forma_pago_id,
    sw_domicilio_recogida
  ) => {
    const domiciliario = await selectDomiciliario();
    const data_form = {
      domiciliario,
      forma_pago: forma_pago_id,
      swDejarBidones: sw_domicilio_recogida,
    };

    toast
      .promise(
        postDomicilioApi(venta_id, data_form, bandera),
        {
          loading: "Entregando domicilio...",
          success: "Domicilio entregado",
          error: "Error al entregar el domicilio",
        },
        {
          duration: 3000,
          position: "top-center",
        }
      )
      .then(() => {
        getVentasApi().then((response) => {
          setLoading(true);
        });
        toast.dismiss();
      });
  };

  const postObservacionVenta = async (data) => {
    toast.loading("Guardando observación...");
    try {
      const response = await postObservacionVentaApi(data);
      if (response.status === 200) {
        toast.success(response.mensaje);
      }
      return response.venta;
    } catch (error) {
      toast.error(error.response.data.mensaje);
      throw error;
    } finally {
      toast.dismiss();
    }
  };

  return {
    handleEntregarDomicilio,
    handleFormaPago,
    handleDomiciliario,
    postObservacionVenta,
  };
}
