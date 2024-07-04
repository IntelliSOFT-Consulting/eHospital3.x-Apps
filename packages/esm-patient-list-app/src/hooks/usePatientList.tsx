import { useEffect, useState } from "react";
import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";

export function usePatientList() {
  const [filteredData, setFilteredData] = useState<[]>([]);

  const fetcher = async (url: string) => {
    const response = await openmrsFetch(url);
    return response.json();
  };

  const { data, error } = useSWR(`/ws/fhir2/R4/Patient?_count=1000`, fetcher);

  const filterData = ({ start = null, end = null }) => {
    let filteredArray = data.entry;

    if (start && end) {
      filteredArray = filteredArray.filter(
        (item) =>
          new Date(item.resource.meta.lastUpdated) >= new Date(start) &&
          new Date(item.resource.meta.lastUpdated) <= new Date(end)
      );
    }

    filteredArray = filteredArray.map((item: any) => {
      const givenName =
        item?.resource?.name[0]?.given[0] +
        (item?.resource?.name[0]?.given[1]
          ? " " + item.resource?.name[0]?.given[1]
          : "");

      const gender = item.resource.gender
        ? item.resource.gender.charAt(0).toUpperCase()
        : "";

      return {
        fullName: givenName + " " + item.resource?.name[0]?.family,
        age:
          new Date().getFullYear() -
          new Date(item.resource.birthDate).getFullYear(),
        gender: gender,
        openmrsID: item.resource?.identifier?.find(
          (id) => id.type?.text === "OpenMRS ID"
        )?.value,
        opdNumber: item.resource?.identifier?.find(
          (id) => id.type.text === "Unique OPD Number"
        )?.value,
        dateRegistered: new Date(
          item.resource?.meta?.lastUpdated
        ).toLocaleDateString(),
        timeRegistered: new Date(
          item.resource?.meta?.lastUpdated
        ).toLocaleTimeString(),
      };
    });

    filteredArray.sort((a, b) => {
      const dateA = new Date(a.dateRegistered + " " + a.timeRegistered);
      const dateB = new Date(b.dateRegistered + " " + b.timeRegistered);
      return (dateB as unknown as number) - (dateA as unknown as number);
    });

    setFilteredData(filteredArray);
  };

  useEffect(() => {
    if (data?.entry) filterData({});
  }, [data]);

  const tableColumns = [
    {
      name: "Name",
      selector: (row) => row.fullName,
    },
    {
      name: "ID",
      selector: (row) => row.openmrsID,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
    },
    {
      name: "Age",
      selector: (row) => row.age,
    },
    {
      name: "OPD Number",
      selector: (row) => row.opdNumber,
    },
    {
      name: "Date Registered",
      selector: (row) => row.dateRegistered,
    },
    {
      name: "Time Registered",
      selector: (row) => row.timeRegistered,
    },
  ];

  const customStyles = {
    cells: {
      style: {
        minHeight: "22px",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    headCells: {
      style: {
        fontSize: ".9rem",
        fontWeight: "600",
      },
    },
  };

  return {
    customStyles,
    tableColumns,
    filterData,
    filteredData,
    patient: data,
    isLoading: !error && !data,
    isError: error,
  };
}
