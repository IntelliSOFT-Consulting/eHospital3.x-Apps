import React, {useEffect, useState} from "react";
import {openmrsFetch} from "@openmrs/esm-framework";
import {getPaddedDateString} from "../helpers/dateOps";
import {Link} from "@carbon/react";
import { PatientData } from "../types";

export function useOPDPatientList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPaginationState, setCurrentPaginationState] = useState({
    size: 50,
    page: 0
  });
  const [dateRange, setDateRange] = React.useState({
    start: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
    end: `${new Date().getDate() + 1}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
  });
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalOpdPatients, setTotalOpdPatients] = useState(0);

  const getOPDClients = async ({page, size}) => {
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


      const url = `/ws/rest/v1/ehospital/outPatientClients?startDate=${startString}&endDate=${endString}`;
      const { data } = await openmrsFetch(url);
      
      setData([])
      if (data.results.length > 0) {
        setData(prev => [...prev, ...data.results.map(result => ({
          ...result,
          fullName: result?.name,
          age: result?.age,
          gender: result?.sex,
          opdNumber: result.identifiers.find(item =>  item.identifierType.toLowerCase()?.includes("opd"))?.identifier,
          openmrsID: result.identifiers.find(item =>  item.identifierType.toLowerCase()?.includes("openmrs"))?.identifier,
          diagnosis: result?.diagnosis
        }))]);
        setTotalOpdPatients(data.totalOpdPatients);
        setTotalPatients(data.totalPatients);
      }

      // console.log(data.results)

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
    setCurrentPaginationState(prev => ({...prev, page: 0}))
    getOPDClients({...currentPaginationState})
    
  }, [dateRange]);

  // const tableColumns = [
  //   {
  //     name: "Name",
  //     cell: (row: PatientData) => (
  //       <Link
  //         href={`${window.getOpenmrsSpaBase()}patient/${
  //           row.uuid
  //         }/chart/Patient%20Summary`}
  //       >
  //         {row.fullName}
  //       </Link>
  //     ),
  //   },
  //   {
  //     name: "ID",
  //     selector: (row: PatientData) => row.openmrsID,
  //   },
  //   {
  //     name: "Gender",
  //     selector: (row: PatientData) => row.gender,
  //   },
  //   {
  //     name: "Age",
  //     selector: (row: PatientData) => row.age,
  //   },
  //   {
  //     name: "OPD Number",
  //     selector: (row: PatientData) => row.opdNumber,
  //   },
  //   {
  //     name: "Diagnosis",
  //     selector: (row: PatientData) => row.diagnosis,
  //   }
  // ];


  const clear = () => {
    setDateRange({
      start: `01-01-${new Date().getFullYear()}`,
      end: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    });
    setData([]);
    getOPDClients({...currentPaginationState})
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
    // tableColumns,
    data,
    patient: data,
    isLoading: loading,
    dateRange,
    setDateRange,
    getOPDClients,
    currentPaginationState,
    clear,
    totalPatients,
    totalOpdPatients,
    setTotalOpdPatients,
    setTotalPatients
  };
}
