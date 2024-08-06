import React from "react";
import { useTranslation } from "react-i18next";

import Overlay from "../components/overlay/overlay.component";
import { useOrdersWorklist } from "../hooks/useOrdersWorklist";
import GroupedOrdersTable from "../common/groupedOrdersTable.component";
import { DataTableSkeleton } from "@carbon/react";

interface CompletedListProps {
  fulfillerStatus: string;
}

export const CompletedList: React.FC<CompletedListProps> = ({
  fulfillerStatus,
}) => {
  const { t } = useTranslation();

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
            showActions={false}
            showStatus={true}
            showOrderType={true}
            showStatusFilter={false}
            showDateFilter={true}
            actions={[]}
          />
        </div>
        <Overlay />
      </>
    );
  }
};
