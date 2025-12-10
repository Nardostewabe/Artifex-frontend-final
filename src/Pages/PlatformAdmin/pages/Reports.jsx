import DataTable from "../components/DataTable";

export default function Reports() {
  const columns = ["Reported Item", "Reporter", "Reason", "Severity"];
  const data = [
    { "Reported Item": "Product X", Reporter: "John", Reason: "Fake", Severity: "High" },
    { "Reported Item": "Review Y", Reporter: "Jane", Reason: "Spam", Severity: "Medium" },
  ];

  return <DataTable columns={columns} data={data} />;
}