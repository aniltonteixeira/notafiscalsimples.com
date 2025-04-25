import { DataTable } from "@/components/admin/data-table"

import data from "./data.json"

export default function Page() {
  return (
    <>
    <DataTable data={data} />
    </>
  );
}
