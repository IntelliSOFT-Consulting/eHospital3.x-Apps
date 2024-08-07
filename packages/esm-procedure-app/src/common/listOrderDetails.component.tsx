import React, { useMemo, useState } from "react";
import styles from "./listOrderDetails.scss";

import { useTranslation } from "react-i18next";
import { formatDate, parseDate, showModal } from "@openmrs/esm-framework";
import { launchOverlay } from "../components/overlay/hook";
import { Button, Tile } from "@carbon/react";
import { OrderDetail } from "./orderDetail.component";
import PostProcedureForm from "../form/post-procedures/post-procedure-form.component";
import { ListOrdersDetailsProps } from "../types";

// can render orders of a patient
const ListOrderDetails: React.FC<ListOrdersDetailsProps> = (props) => {
  const orders = props.groupedOrders?.orders;
  const { t } = useTranslation();
  const orderrows = useMemo(() => {
    return orders
      ?.filter((item) => item.action === "NEW")
      .map((entry) => ({
        ...entry,
        id: entry.uuid,
        orderNumber: entry.orderNumber,
        procedure: entry.display,
        status: entry.fulfillerStatus ? entry.fulfillerStatus : "--",
        urgency: entry.urgency,
        orderer: entry.orderer?.display,
        instructions: entry.instructions ? entry.instructions : "--",
        date: (
          <span className={styles["single-line-display"]}>
            {formatDate(parseDate(entry?.dateActivated))}
          </span>
        ),
      }));
  }, [orders]);

  return (
    <div className={styles.ordersContainer}>
      {orderrows.map((row) => (
        <Tile className={styles.orderTile}>
          {props.showActions && (
            <div className={styles.actionBtns}>
              {props.actions
                .sort((a, b) => {
                  // Replace 'property' with the actual property you want to sort by
                  if (a.displayPosition < b.displayPosition) return -1;
                  if (a.displayPosition > b.displayPosition) return 1;
                  return 0;
                })
                .map((action) => {
                  if (
                    action.actionName === "add-procedure-to-worklist-dialog"
                  ) {
                    return (
                      <Button
                        kind="primary"
                        onClick={() => {
                          const dispose = showModal(
                            "add-procedure-to-worklist-dialog",
                            {
                              closeModal: () => dispose(),
                              order: orders.find(
                                (order) => order.uuid == row.id
                              ),
                            }
                          );
                        }}
                      >
                        {t("picklabrequest", "Pick Lab Request")}
                      </Button>
                    );
                  }
                  if (action.actionName === "postProcedureResultForm") {
                    return (
                      <Button
                        kind="primary"
                        onClick={() => {
                          launchOverlay(
                            t(
                              "postProcedureResultForm",
                              "Procedure report form"
                            ),
                            <PostProcedureForm
                              patientUuid={row.patient.uuid}
                              procedure={orders.find(
                                (order) => order.uuid == row.id
                              )}
                            />
                          );
                        }}
                      >
                        {t("procedurereportform", "Procedure Report Form")}
                      </Button>
                    );
                  }
                  if (action.actionName === "procedure-reject-reason-modal") {
                    return (
                      <Button
                        kind="tertiary"
                        onClick={() => {
                          const dispose = showModal(
                            "procedure-reject-reason-modal",
                            {
                              closeModal: () => dispose(),
                              order: orders.find(
                                (order) => order.uuid == row.id
                              ),
                            }
                          );
                        }}
                      >
                        {t("rejectreason", "Reject Reason")}
                      </Button>
                    );
                  }
                  if (action.actionName === "reject-procedure-order-dialog") {
                    return (
                      <Button
                        kind="danger"
                        onClick={() => {
                          const dispose = showModal(
                            "reject-procedure-order-dialog",
                            {
                              closeModal: () => dispose(),
                              order: orders.find(
                                (order) => order.uuid == row.id
                              ),
                            }
                          );
                        }}
                      >
                        {t("rejectorder", "Reject Order")}
                      </Button>
                    );
                  }
                })}
            </div>
          )}
          <div>
            <OrderDetail
              label={t("date", "DATE").toUpperCase()}
              value={row.date}
            />
            <OrderDetail
              label={t("orderNumber", "Order Number").toUpperCase()}
              value={row.orderNumber}
            />
            <OrderDetail
              label={t("procedure", "procedure").toUpperCase()}
              value={row.procedure}
            />

            {props.showStatus && (
              <OrderDetail
                label={t("status", "Status").toUpperCase()}
                value={row.status}
              />
            )}
            <OrderDetail
              label={t("urgency", "urgency").toUpperCase()}
              value={row.urgency}
            />
            <OrderDetail
              label={t("orderer", "orderer").toUpperCase()}
              value={row.orderer}
            />
            <OrderDetail
              label={t("instructions", "Instructions").toUpperCase()}
              value={row.instructions}
            />
          </div>
        </Tile>
      ))}
    </div>
  );
};

export default ListOrderDetails;
