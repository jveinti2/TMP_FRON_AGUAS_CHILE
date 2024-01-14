import { lazy } from "react";
import {
  FaTableCellsLarge,
  FaToolbox,
  FaUserCheck,
  FaBox,
  FaCircleDollarToSlot,
  FaMotorcycle,
  FaCashRegister,
  FaNewspaper,
} from "react-icons/fa6";
const Maestros = lazy(() => import("../pages/Maestros"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const MaestroEdificios = lazy(() => import("../pages/MaestroEdificios"));
const Clientes = lazy(() => import("../pages/Clientes"));
const Productos = lazy(() => import("../pages/Productos"));
const Ventas = lazy(() => import("../pages/Ventas"));
const MaestroUsuarios = lazy(() => import("../pages/MaestroUsuarios"));
const Despachos = lazy(() => import("../pages/Despachos"));
const CierreMes = lazy(() => import("../pages/CierreMes"));
const MaestroFormasPago = lazy(() => import("../pages/MaestroFormasPago"));
const Reportes = lazy(() => import("../pages/Reportes"));

const ADMINISTRADOR = parseInt(import.meta.env.VITE_ROL_ADMINISTRADOR);
const DOMICILIARIO = parseInt(import.meta.env.VITE_ROL_DOMICILIARIO);
const OPERADOR = parseInt(import.meta.env.VITE_ROL_OPERADOR);

const routes = [
  {
    title: "Dashboard",
    path: "/",
    icon: FaTableCellsLarge,
    component: Dashboard,
    permissions: [ADMINISTRADOR, DOMICILIARIO, OPERADOR],
  },
  {
    title: "Clientes",
    path: "/clientes",
    icon: FaUserCheck,
    component: Clientes,
    permissions: [ADMINISTRADOR, OPERADOR],
  },
  {
    title: "Productos",
    path: "/productos",
    icon: FaBox,
    component: Productos,
    permissions: [ADMINISTRADOR, OPERADOR],
  },
  {
    title: "Ventas",
    path: "/ventas",
    icon: FaCircleDollarToSlot,
    component: Ventas,
    permissions: [ADMINISTRADOR, OPERADOR],
  },
  {
    title: "Despachos",
    path: "/despachos",
    icon: FaMotorcycle,
    component: Despachos,
    permissions: [ADMINISTRADOR, DOMICILIARIO, OPERADOR],
  },
  {
    title: "Cierre mes",
    path: "/cierre_mes",
    icon: FaCashRegister,
    component: CierreMes,
    permissions: [ADMINISTRADOR],
  },
  {
    title: "Reportes",
    path: "/reportes",
    icon: FaNewspaper,
    component: Reportes,
    permissions: [ADMINISTRADOR],
  },
  {
    title: "Maestros",
    path: "/maestros",
    icon: FaToolbox,
    component: Maestros,
    permissions: [ADMINISTRADOR],
    children: [
      {
        title: "Edificios",
        path: "/maestros/maestro_edificios",
        component: MaestroEdificios,
      },
      {
        title: "Usuarios",
        path: "/maestros/maestro_usuarios",
        component: MaestroUsuarios,
      },
      {
        title: "Formas de pago",
        path: "/maestros/maestro_formas_pago",
        component: MaestroFormasPago,
      },
    ],
  },
];

export default routes;
