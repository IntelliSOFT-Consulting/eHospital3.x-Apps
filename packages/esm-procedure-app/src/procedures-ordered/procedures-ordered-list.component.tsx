import React from "react";
import { useOrdersWorklist } from "../hooks/useOrdersWorklist";
import GroupedOrdersTable from "../common/groupedOrdersTable.component";
import { DataTableSkeleton } from "@carbon/react";

interface ProcedurePatientListProps {
  fulfillerStatus: string;
}

const ProcedureOrderedList: React.FC<ProcedurePatientListProps> = () => {
  const { workListEntries, isLoading } = useOrdersWorklist("", "");

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (workListEntries?.length >= 0) {
    return (
      <GroupedOrdersTable
        orders={workListEntries}
        showActions={true}
        showStatus={true}
        showOrderType={true}
        showStatusFilter={true}
        showDateFilter={false}
        actions={[
          {
            actionName: "add-procedure-to-worklist-dialog",
            displayPosition: 1,
          },
          { actionName: "reject-procedure-order-dialog", displayPosition: 2 },
        ]}
      />
    );
  }
};

export default ProcedureOrderedList;
