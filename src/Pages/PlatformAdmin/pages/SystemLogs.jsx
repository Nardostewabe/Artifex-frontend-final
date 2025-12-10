import DataTable from "../components/DataTable";

export default function SystemLogs() {
  const columns = ["User", "Action", "Time"];
  const data = [
    { User: "John Doe", Action: "Login", Time: "2025-12-05 10:20" },
    { User: "Jane Smith", Action: "Suspended Account", Time: "2025-12-05 09:45" },
  ];

  return <DataTable columns={columns} data={data} />;
}