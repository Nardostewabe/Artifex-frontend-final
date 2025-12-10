import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Navigationbar";

const PublicLayout = () => {
  return (
    <>
      <Navigationbar />
      
      <Outlet /> 
      
    </>
  );
};

export default PublicLayout;