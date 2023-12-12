import { Sidebar } from "flowbite-react";
import routes from "../routes";
import { NavLink } from "react-router-dom";
import { FaGripVertical } from "react-icons/fa6";

export default function SidebarMenu() {
  // const { user } = useContext(LoginContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleMenu = () => {
    const sidebar = document.getElementById("default-sidebar");
    if (sidebar) {
      sidebar.classList.toggle("-translate-x-full"); // Agrega o quita la clase para abrir/cerrar el sidebar
    }
  };

  const filteredRoutes = routes.filter((route) => {
    // Si la ruta no tiene permisos definidos, se muestra para todos
    if (!route.permissions) {
      return true;
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    return route.permissions.includes(user.role);
  });

  const renderedRoutes = filteredRoutes.map((route) => {
    if (route.children) {
      return (
        <Sidebar.Collapse
          key={route.path}
          label={route.title}
          icon={route.icon}
        >
          {route.children.map((child) => {
            return (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={() => {
                  toggleMenu();
                }}
              >
                <Sidebar.Item>
                  <p>{child.title} </p>
                </Sidebar.Item>
              </NavLink>
            );
          })}
        </Sidebar.Collapse>
      );
    } else {
      return (
        <NavLink
          key={route.path}
          to={route.path}
          onClick={() => {
            toggleMenu();
          }}
        >
          <Sidebar.Item icon={route.icon}>
            <p>{route.title}</p>
          </Sidebar.Item>
        </NavLink>
      );
    }
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="default-sidebar"
          type="button"
          className="inline-flex items-center text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={toggleMenu}
        >
          <FaGripVertical className="h-6 w-6" />
        </button>
        <img
          className="h-10 md:h-12 object-cover "
          src="/aguas_chile.PNG"
          alt="logo"
        />
      </div>
      <div className="fixed z-10 p-1">
        <aside
          id="default-sidebar"
          className="shadow-xl	fixed top-16 left-0 z-40 w-64 h-screen transition-transform -translate-x-full  "
          aria-label="Sidebar"
        >
          <Sidebar aria-label="Sidebar with multi-level dropdown example">
            {/* <div className='flex justify-center'>
						<div className='flex justify-between items-center'>
							<img
								className='hidden md:h-20 md:block object-cover'
								src='/aguas_chile.PNG'
								alt='logo'
							/>
						</div>
					</div> */}
            <div className="px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <Sidebar.Items>
                <Sidebar.ItemGroup>{renderedRoutes}</Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </Sidebar>
        </aside>
      </div>
    </>
  );
}
