import React from "react";
import { useOrdersWorklist } from "../hooks/useOrdersWorklist";
import GroupedOrdersTable from "../common/groupedOrdersTable.component";
import { DataTableSkeleton } from "@carbon/react";
interface WorklistProps {
  fulfillerStatus: string;
}

const WorkList: React.FC<WorklistProps> = ({ fulfillerStatus }) => {
  const { workListEntries, isLoading } = useOrdersWorklist("", fulfillerStatus);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (workListEntries?.length >= 0) {
    return (
      <>
        <div>
          <GroupedOrdersTable
            orders={workListEntries}
            showActions={true}
            showStatus={true}
            showOrderType={true}
            showStatusFilter={false}
            showDateFilter={true}
            actions={[
              { actionName: "postProcedureResultForm", displayPosition: 1 },
              {
                actionName: "reject-procedure-order-dialog",
                displayPosition: 2,
              },
            ]}
          />
        </div>
      </>
    );
  }
};

export default WorkList;
