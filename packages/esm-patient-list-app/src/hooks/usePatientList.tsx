import React, {useEffect, useState} from "react";
import {openmrsFetch} from "@openmrs/esm-framework";
import {getPaddedDateString} from "../helpers/dateOps";
import {Link} from "@carbon/react";

export function usePatientList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPaginationState, setCurrentPaginationState] = useState({
    size: 50,
    page: 0
  });
  const [dateRange, setDateRange] = React.useState({
    start: `01-01-${new Date().getFullYear()}`,
    end: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
  });

  const getAllClients = async ({page, size}) => {
    try {
      if (page === 0) setLoading(true);

      let startString =dateRange.start;
      let endString =dateRange.end;

      if(typeof dateRange.start === "object"){
        const dateObject = new Date(dateRange.start);
        startString = getPaddedDateString(dateObject);
      }

      if(typeof dateRange.end === "object"){
        const dateObject = new Date(dateRange.end);
        endString = getPaddedDateString(dateObject)
      }


      const url = `/ws/rest/v1/ehospital/allClients?startDate=${startString}&endDate=${endString}&page=${page}&size=${size}`;
      const {data} = await openmrsFetch(url);

      if (data.results.length > 0) {
        setData(prev => [...prev, ...data.results.map(result => ({
          ...result,
          fullName: result?.name,
          age: result?.age,
          gender: result?.sex,
          openmrsID: result.identifiers.find(item =>  item.identifierType.toLowerCase()?.includes("openmrs"))?.identifier,
          opdNumber: result.identifiers.find(item =>  item.identifierType.toLowerCase()?.includes("opd"))?.identifier,
        }))]);
      }

      if (data.results.length === size)
        setCurrentPaginationState(prev => ({
          ...prev,
          page: ++prev.page
        }))

    } catch (e) {
      return e
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    getAllClients({...currentPaginationState})
  }, [currentPaginationState.page]);

  useEffect(() => {
    setCurrentPaginationState(prev => ({...prev, page: 0}))
    setData([]);
    getAllClients({...currentPaginationState})
  }, [dateRange]);

  const tableColumns = [
    {
      name: "Name",
      cell: (row) => (
        <Link
          href={`${window.getOpenmrsSpaBase()}patient/${
            row.uuid
          }/chart/Patient%20Summary`}
        >
          {row.fullName}
        </Link>
      ),
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


  const clear = () => {
    setDateRange({
      start: `01-01-${new Date().getFullYear()}`,
      end: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    });
    setData([]);
    getAllClients({...currentPaginationState})
  };
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
    data,
    patient: data,
    isLoading: loading,
    dateRange,
    setDateRange,
    getAllClients,
    currentPaginationState,
    clear
  };
}
