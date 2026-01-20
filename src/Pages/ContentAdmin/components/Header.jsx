/**
 * COMPONENT: Header
 * Fulfills the "Header display for moderator name/role" requirement.
 */
export default function Header({ moderatorName = "Admin" }) {
  return (
    <div className="flex justify-between items-center bg-white border-b border-slate-200 px-8 py-4">
      {/* BRANDING: Secondary label */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Workspace</h2>
        <p className="text-[#3A3A6C] font-bold">Content Control Panel</p>
      </div>

      {/* MODERATOR PROFILE: Displays the moderator's name and a dynamic avatar badge */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-[#3A3A6C]">{moderatorName}</p>
          <p className="text-[10px] bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
            Senior Moderator
          </p>
        </div>
        
        {/* AVATAR: Generates first initial of the name */}
        <div className="w-10 h-10 bg-[#6C63FF] rounded-full flex items-center justify-center text-white font-bold shadow-md">
          {moderatorName.charAt(0)}
        </div>
      </div>
    </div>
  );
}