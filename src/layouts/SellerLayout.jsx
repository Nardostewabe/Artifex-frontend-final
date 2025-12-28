import { Outlet } from "react-router-dom";
import SellerNavigationBar from "../components/SellerNavigationBar";
import Footer from "../components/Footer";

const SellerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <SellerNavigationBar />

            <div className="flex-1 bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]">
                {/* Use a subtle purple bg for sellers, or standard white */}
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default SellerLayout;
