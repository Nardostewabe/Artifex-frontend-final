import { User, ShoppingBag, TriangleAlert, ClipboardList, BarChart } from 'lucide-react';


export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: 1200,
      icon: <User className="w-8 h-8 text-[#8EB8FF]" />,
      gradient: "from-[#C2A8FF] to-[#BFAAFF]",
    },
    {
      title: "Total Sellers",
      value: 150,
      icon: <ShoppingBag className="w-8 h-8 text-[#B18AFF]" />,
      gradient: "from-[#A6C7FF] to-[#C2A8FF]",
    },
    {
      title: "Active Listings",
      value: 420,
      icon: <ClipboardList className="w-8 h-8 text-[#FFB6C1]" />,
      gradient: "from-[#BFAAFF] to-[#A6C7FF]",
    },
    {
      title: "Flagged Reports",
      value: 8,
      icon: <TriangleAlert className="w-8 h-8 text-[#FF3B3B]" />,
      gradient: "from-[#FF7A7A] to-[#FF5F5F]",
    },
    {
      title: "Escalated Disputes",
      value: 3,
      icon: <BarChart className="w-8 h-8 text-[#FFD700]" />,
      gradient: "from-[#FFD700] to-[#FFC107]",
    },
    {
      title: "High-risk Sellers",
      value: 2,
      icon: <TriangleAlert className="w-8 h-8 text-[#FF4500]" />,
      gradient: "from-[#FF8C00] to-[#FF4500]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-6 shadow-xl flex items-center justify-between transform transition-transform hover:scale-105 hover:shadow-2xl`}
        >
          <div>
            <h3 className="text-white text-lg font-semibold">{stat.title}</h3>
            <p className="text-white text-3xl font-bold mt-2">{stat.value}</p>
          </div>
          <div className="bg-white/30 p-3 rounded-full">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}