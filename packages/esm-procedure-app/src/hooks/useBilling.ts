import useSWR from 'swr';
import {
  formatDate,
  parseDate,
  openmrsFetch,
  useSession,
  useVisit,
  restBaseUrl,
  useConfig,
} from '@openmrs/esm-framework';
import type { MappedBill, PatientInvoice } from '../types';
import isEmpty from 'lodash-es/isEmpty';
import sortBy from 'lodash-es/sortBy';
import { PaymentStatus } from '../types';
import dayjs from 'dayjs';

export const mapBillProperties = (bill: PatientInvoice): MappedBill => {
    // create base object
    const mappedBill: MappedBill = {
        id: bill?.id,
        uuid: bill?.uuid,
        patientName: bill?.patient?.display.split('-')?.[1],
        identifier: bill?.patient?.display.split('-')?.[0],
        patientUuid: bill?.patient?.uuid,
        status: bill.status,
        receiptNumber: bill?.receiptNumber,
        cashier: bill?.cashier,
        cashPointUuid: bill?.cashPoint?.uuid,
        cashPointName: bill?.cashPoint?.name,
        dateCreated: bill?.dateCreated ? formatDate(parseDate(bill.dateCreated), { mode: 'wide' }) : '--',
        dateCreatedUnformatted: bill?.dateCreated,
        lineItems: bill?.lineItems,
        billingService: bill?.lineItems.map((bill) => bill?.item || bill?.billableService || '--').join('  '),
        payments: bill?.payments,
        display: bill?.display,
        totalAmount: bill?.lineItems?.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0),
    };

    return mappedBill;
};

export const useBills = (
    patientUuid: string = '',
    billStatus: PaymentStatus.PAID | '' | string = '',
    startingDate: Date = dayjs().startOf('day').toDate(),
    endDate: Date = dayjs().endOf('day').toDate(),
    ) => {
    const startingDateISO = startingDate.toISOString();
    const endDateISO = endDate.toISOString();

    const url = `${restBaseUrl}/billing/bill?status=${billStatus}&v=custom:(uuid,display,voided,voidReason,adjustedBy,cashPoint:(uuid,name),cashier:(uuid,display),dateCreated,lineItems,patient:(uuid,display))&createdOnOrAfter=${startingDateISO}&createdOnOrBefore=${endDateISO}`;

    const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<PatientInvoice> } }>(
        patientUuid ? `${url}&patientUuid=${patientUuid}` : url,
        openmrsFetch,
        {
        errorRetryCount: 2,
        },
    );

    const sortBills = sortBy(data?.data?.results ?? [], ['dateCreated']).reverse();
    const dateFilteredBills = sortBills.filter((bill) => {
        const dateCreated = new Date(bill.dateCreated);
        return dateCreated >= startingDate && dateCreated <= endDate;
    });
    const filteredByStatus =
        billStatus === '' ? dateFilteredBills : dateFilteredBills.filter((bill) => bill?.status === billStatus);
    const mappedResults = filteredByStatus.map((bill) => mapBillProperties(bill));
    const filteredResults = mappedResults.filter((res) => res.patientUuid === patientUuid);
    const formattedBills = isEmpty(patientUuid) ? mappedResults : filteredResults || [];

    return {
        bills: formattedBills,
        error,
        isLoading,
        isValidating,
        mutate,
    };
};