import { useContext, useState, useEffect } from "react";
import useDespachos from "../hooks/useDespachos";
import { DespachosContext } from "../context/Despachos";

export default function ListadoDespachos() {
  const { ventas, setLoading } = useContext(DespachosContext);
  // const { getListDomilicios } = useDespachos();
  return <div>ListadoDespachos</div>;
}
