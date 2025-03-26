import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import dayjs from "dayjs";
import { useLLMMessages } from "../../hooks/useLLMMessage";

interface FormattedMessage {
  id: string;
  name: string;
  date: string;
  fullMessage: string;
  status: string;
  statusMessage: string;
  timeSent: string;
}

interface DateFilterContextType {
  dateRange: [Date, Date];
  setDateRange: (dates: [Date, Date]) => void;
  messages: FormattedMessage[];
  isLoading: boolean;
  mutate: () => void;
}

const defaultDateRange: [Date, Date] = [
  dayjs().startOf("day").toDate(),
  dayjs().endOf("day").toDate(),
];

const DateFilterContext = createContext<DateFilterContextType>({
  dateRange: defaultDateRange,
  setDateRange: () => {},

  messages: [],
  isLoading: false,
  mutate: () => {},
});

interface DateFilterProviderProps {
  children: ReactNode;
}

export const DateFilterProvider = ({ children }: DateFilterProviderProps) => {
  const [dateRange, setDateRange] = useState<[Date, Date]>(defaultDateRange);

  const messagesResponse = useLLMMessages(dateRange[0], dateRange[1]);

  const value = useMemo(
    () => ({
      dateRange,
      setDateRange,
      messages: messagesResponse.messages,
      isLoading: messagesResponse.isLoading,
      mutate: messagesResponse.mutate,
    }),
    [
      dateRange,
      messagesResponse.messages,
      messagesResponse.isLoading,
      messagesResponse.mutate,
    ]
  );

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
