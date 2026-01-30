import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [status, setStatus] = useState("verifying"); // verifying, success, failed
  const txRef = searchParams.get("tx_ref") || searchParams.get("trx_ref");

  useEffect(() => {
    if (!txRef) {
      setStatus("failed");
      return;
    }
    verifyTransaction();
  }, [txRef]);

  const verifyTransaction = async () => {
    try {
      // Call your backend to verify with Chapa
      const response = await fetch(`${API_BASE_URL}/api/Payment/verify/${txRef}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "Success") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      setStatus("failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        
        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">Verifying Payment...</h2>
            <p className="text-slate-500">Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Payment Successful!</h2>
              <p className="text-slate-500 mt-2">Thank you for your purchase. Your transaction ID is <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{txRef}</span></p>
            </div>
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Payment Failed</h2>
              <p className="text-slate-500 mt-2">We couldn't verify your payment. Please contact support if you were charged.</p>
            </div>
            <button 
              onClick={() => navigate("/payment")} // Go back to try again
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}