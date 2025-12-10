import DataTable from "../components/DataTable";

export default function SellerManagement() {
  const columns = ["Seller", "Status", "Sales", "Last Activity"];
  const data = [
    { Seller: "Seller One", Status: "Active", Sales: 120, "Last Activity": "2025-12-05" },
    { Seller: "Seller Two", Status: "Under Investigation", Sales: 30, "Last Activity": "2025-12-04" },
  ];

  return <DataTable columns={columns} data={data} />;
}