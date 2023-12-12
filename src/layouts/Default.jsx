import SidebarMenu from "../components/SidebarMenu";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import routes from "../routes";
import Dashboard from "../pages/Dashboard";
import NavbarMenu from "../components/NavbarMenu";
import { Toaster } from "react-hot-toast";
import Loader from "../common/Loader";

export default function Default() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRoutes = routes.filter((route) => {
    // Si la ruta no tiene permisos definidos, se muestra para todos
    if (!route.permissions) {
      return true;
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    return route.permissions.includes(user.role);
  });

  const renderRoutes = filteredRoutes.map((route) => {
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={<route.component />}>
          {route.children.map((child) => {
            return (
              <Route
                key={child.path}
                path={child.path}
                element={<child.component />}
              />
            );
          })}
        </Route>
      );
    } else {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
        />
      );
    }
  });

  // Redirige al usuario a la página de inicio si no tiene acceso a ninguna ruta
  if (filteredRoutes.length === 0) {
    navigate("/");
    return null;
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster />
      <div className="dark:bg-[#171e29] bg-curious-blue-200">
        <div className="flex px-2 w-full justify-between bg-white dark:border-gray-700 dark:bg-gray-800">
          <SidebarMenu />
          <NavbarMenu />
        </div>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {renderRoutes}
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
