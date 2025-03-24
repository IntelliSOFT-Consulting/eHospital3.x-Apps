import React, { createContext, ReactNode, useState, useContext } from "react";
import dayjs from "dayjs";
import { useLLMMessages } from "../../hooks/useLLMMessage";

interface MessageFilterContextType {
  dateRange: [Date, Date];
  setDateRange: (dates: [Date, Date]) => void;

  messages: any[];
}

const defaultDateRange: [Date, Date] = [
  dayjs().startOf("day").toDate(),
  dayjs().endOf("day").toDate(),
];

export const MessageFilterContext = createContext<MessageFilterContextType>({
  dateRange: defaultDateRange,
  setDateRange: () => {}, // No-op function to avoid errors

  messages: [],
});

interface MessageFilterProviderProps {
  children: ReactNode;
}

export const MessageFilterProvider = ({
  children,
}: MessageFilterProviderProps) => {
  const [dateRange, setDateRange] = useState<[Date, Date]>(defaultDateRange);

  const messageResponse = useLLMMessages(dateRange[0], dateRange[1]);
  const { messages } = messageResponse;

  const value = {
    dateRange,
    setDateRange,
    messages,
  };

  return (
    <MessageFilterContext.Provider value={value}>
      {children}
    </MessageFilterContext.Provider>
  );
};

export const useMessageFilterContext = () => {
  const context = useContext(MessageFilterContext);

  if (context === undefined) {
    throw new Error(
      "useMessageFilterContext must be used within a MessageFilterProvider"
    );
  }

  return context;
};
