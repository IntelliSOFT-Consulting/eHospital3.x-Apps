import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs from "dayjs";
import { useLLMMessages } from "../../hooks/useLLMMessage";

interface DateFilterContextType {
  dateRange: [Date, Date];
  setDateRange: (dates: [Date, Date]) => void;
  appliedDateRange: [Date, Date];
  applyDateFilter: () => void;
  messages: any[];
}

const defaultDateRange: [Date, Date] = [
  dayjs().startOf("day").toDate(),
  dayjs().endOf("day").toDate(),
];

const DateFilterContext = createContext<DateFilterContextType | undefined>(
  undefined
);

interface DateFilterProviderProps {
  children: ReactNode;
}

export const DateFilterProvider = ({ children }: DateFilterProviderProps) => {
  const [dateRange, setDateRange] = useState<[Date, Date]>(defaultDateRange);
  const [appliedDateRange, setAppliedDateRange] =
    useState<[Date, Date]>(defaultDateRange);

  const messagesResponse = useLLMMessages(
    appliedDateRange[0],
    appliedDateRange[1]
  );

  const { messages } = messagesResponse;

  const applyDateFilter = () => {
    setAppliedDateRange(dateRange);
  };

  const value = {
    dateRange,
    setDateRange,
    applyDateFilter,
    appliedDateRange,
    messages,
  };

  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  );
};

export const useDateFilterContext = () => {
  const context = useContext(DateFilterContext);
  if (!context) {
    throw new Error(
      "useDateFilterContext must be used within a DateFilterProvider"
    );
  }
  return context;
};
