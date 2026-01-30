import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../context/AuthContext.jsx";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";

export default function PaymentForm() {
  const { token, user } = useAuth(); // Assuming you have user info in context
  const { showAlert } = useModal();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(1000); // Default amount

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Payment/initialize`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          email: user?.email || "customer@example.com",
          firstName: user?.username || "Customer",
          lastName: "User",
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Payment initialization failed");
      }

      const data = await response.json();

      // ✅ Redirect to Chapa Payment Page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Payment Error:", error);
      showAlert("Failed to start payment. Please try again.", "Payment Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Secure Checkout</h2>
          <p className="text-slate-500 text-sm">Pay securely with Chapa</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              Amount (ETB)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold uppercase tracking-wide hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}