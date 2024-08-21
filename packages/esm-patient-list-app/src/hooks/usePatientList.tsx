import React, {useEffect, useState} from "react";
import {openmrsFetch} from "@openmrs/esm-framework";
import {getPaddedDateString} from "../helpers/dateOps";

export function usePatientList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPaginationState, setCurrentPaginationState] = useState({
    size: 100,
    page: 0
  });
  const [dateRange, setDateRange] = React.useState({
    start: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
    end: `${new Date().getDate() + 1}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
  });
  const [totalPatients, setTotalPatients] = useState(0);

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
      const { data } = await openmrsFetch(url);
      
      setData([])
      if (data.results.length > 0) {
        setData(prev => [...prev, ...data.results.map(result => ({
          ...result,
          fullName: result?.name,
          age: result?.age,
          gender: result?.sex,
          openmrsID: result.identifiers.find(item =>  item.identifierType.toLowerCase()?.includes("openmrs"))?.identifier,
          opdNumber: result.identifiers.find(item =>  item.identifierType.toLowerCase()?.includes("opd"))?.identifier,
        }))]);
        setTotalPatients(data.totalPatients);
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
    setCurrentPaginationState(prev => ({...prev, page: 0}))
    getAllClients({...currentPaginationState})
  }, [dateRange]);


  return {
    data,
    patient: data,
    isLoading: loading,
    dateRange,
    setDateRange,
    getAllClients,
    currentPaginationState,
    totalPatients,
  };
}
