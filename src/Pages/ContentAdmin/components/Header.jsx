import { useAuth } from "../../../context/AuthContext";

/**
 * COMPONENT: Header
 * Dynamically displays the logged-in Content Admin's name from the token.
 */
export default function Header() {
  const { token } = useAuth();

  // Helper to extract name from JWT without an external library
  const getUsernameFromToken = () => {
    if (!token) return "Admin";
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // ASP.NET Core often stores username in this specific claim schema
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] 
          || payload["unique_name"] 
          || payload.username 
          || "Content Admin";
    } catch (e) {
      return "Admin";
    }
  };

  const moderatorName = getUsernameFromToken();

  return (
    <div className="flex justify-between items-center bg-white border-b border-slate-200 px-8 py-4">
      {/* BRANDING */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Workspace</h2>
        <p className="text-[#3A3A6C] font-bold">Content Control Panel</p>
      </div>

      {/* MODERATOR PROFILE */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-[#3A3A6C]">{moderatorName}</p>
          <p className="text-[10px] bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
            Authorized Moderator
          </p>
        </div>

        {/* DYNAMIC AVATAR: First Initial */}
        <div className="w-10 h-10 bg-[#6C63FF] rounded-full flex items-center justify-center text-white font-bold shadow-md uppercase">
          {moderatorName.charAt(0)}
        </div>
      </div>
    </div>
  );
}