import {
  Navbar,
  Dropdown,
  Avatar,
  DarkThemeToggle,
  Button,
} from "flowbite-react";
import { FaCircleUser } from "react-icons/fa6";

export default function NavbarMenu() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Navbar className="rounded justify-end">
      <div className="flex w-full justify-end gap-2 items-center">
        <DarkThemeToggle />
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar src={FaCircleUser} alt="Avatar" size="sm" />}
        >
          <Dropdown.Header>
            <span className="block text-sm">{}</span>
            <span className="block truncate text-sm font-medium">
              {user.email}
            </span>
          </Dropdown.Header>
          <div className="p-2">
            <Button
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("user");
                window.location.href = "/#";
                window.location.reload();
              }}
              size={"xs"}
              className="w-full"
            >
              Cerrar sesión
            </Button>
          </div>
        </Dropdown>
      </div>
    </Navbar>
  );
}
