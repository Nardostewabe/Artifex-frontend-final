import { Outlet } from "react-router-dom";
import SellerNavigationBar from "../Pages/Seller/components/SellerNavigationBar";
import Footer from "../components/Footer";

const SellerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff]">
            <SellerNavigationBar />

            <div className="flex-1">
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default SellerLayout;
