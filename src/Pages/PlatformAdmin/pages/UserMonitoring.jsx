import DataTable from "../components/DataTable";

export default function UserMonitoring() {
  const columns = ["User", "Role", "Last Login", "Actions"];
  const data = [
    { User: "John Doe", Role: "Customer", "Last Login": "2025-12-05", Actions: "Active" },
    { User: "Jane Smith", Role: "Seller", "Last Login": "2025-12-04", Actions: "Suspended" },
  ];

  return <DataTable columns={columns} data={data} />;
}