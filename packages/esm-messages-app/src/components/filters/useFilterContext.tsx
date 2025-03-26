import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs from "dayjs";
import { useLLMMessages } from "../../hooks/useLLMMessage";

interface DateFilterContextType {
  dateRange: [Date, Date];
  setDateRange: (dates: [Date, Date]) => void;
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

  const messagesResponse = useLLMMessages(dateRange[0], dateRange[1]);

  const { messages } = messagesResponse;

  const value = {
    dateRange,
    setDateRange,
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
