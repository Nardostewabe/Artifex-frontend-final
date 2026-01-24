import { Outlet } from "react-router-dom";
import Navigationbar from "../Pages/Customer/components/NavigationBar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <>
      <Navigationbar />

      <Outlet />

      <Footer />
    </>
  );
};

export default PublicLayout;