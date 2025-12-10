import { Outlet } from "react-router-dom";
import Sidebar from "../Pages/PlatformAdmin/components/SideBar";
import Header from "../Pages/PlatformAdmin/components/Header";

const PlatformAdminLayout = () => {
    return (
    <div className="flex min-h-screen w-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-br from-[#C2A8FF] via-[#BFAAFF] to-[#A6C7FF] p-6 min-h-screen">
          <Header />

          <main className="mt-6">
        {/* <Outlet /> renders whatever child route is active (Dashboard, Users, etc.) */}
        <Outlet /> 
       </main>
        </div>
      </div>
  );
};

export default PlatformAdminLayout;