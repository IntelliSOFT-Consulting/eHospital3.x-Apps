export const truncateMessage = (message: string, wordLimit: number) => {
  const words = message.split(" ");
  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(" ")}...`
    : message;
};