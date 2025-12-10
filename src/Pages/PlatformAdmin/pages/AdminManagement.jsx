import DataTable from "../components/DataTable";

export default function AdminManagement() {
  const columns = ["Admin", "Privilege", "Status"];
  const data = [
    { Admin: "Alice", Privilege: "Super", Status: "Active" },
    { Admin: "Bob", Privilege: "Moderator", Status: "Deactivated" },
  ];

  return <DataTable columns={columns} data={data} />;
}