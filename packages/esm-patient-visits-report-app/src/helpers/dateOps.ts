export const getPaddedDateString = (date) => {
  const dateObject = new Date(date);

  const day = dateObject.getDate() < 10 ? `0${dateObject.getDate()}` : dateObject.getDate();

  const month = dateObject.getMonth() + 1 < 10 ? `0${dateObject.getMonth() + 1}` : dateObject.getMonth() + 1;

  return `${day}-${month}-${dateObject.getFullYear()}`

}

export const getPaddedDate = (date: Date) => {
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`
}

