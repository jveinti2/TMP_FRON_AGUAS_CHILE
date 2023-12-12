import StatusInventario from "../components/StatusInventario";
import AcordionEdificios from "../components/AcordionEdificios";
import { DashboardProvider } from "../context/Dashboard";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="p-2 md:p-5 w-full overflow-auto">
        <div className="space-y-2 mb-20">
          <div className="flex justify-between">
            <h2 className="text-lg md:text-2xl font-semibold leading-tight dark:text-white ">
              Dashboard
            </h2>
          </div>
          <div className="space-y-4">
            <StatusInventario />
            <AcordionEdificios />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
