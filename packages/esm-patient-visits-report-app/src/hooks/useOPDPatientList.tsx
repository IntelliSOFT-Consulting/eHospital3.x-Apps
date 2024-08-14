import React, {useEffect, useState} from "react";
import {openmrsFetch} from "@openmrs/esm-framework";
import {getPaddedDateString, getPaddedTodayDateRange} from "../helpers/dateOps";


export function useOPDPatientList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPaginationState, setCurrentPaginationState] = useState({
    size: 50,
    page: 0
  });

  const [dateRange, setDateRange] = React.useState<{ start: any, end: any }>(getPaddedTodayDateRange);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalOpdPatients, setTotalOpdPatients] = useState(0);
  const [summary, setSummary] = useState({
    groupYear: {},
    groupMonth: {},
    groupWeek: {}
  })

  const getOPDClients = async ({page, size}) => {
    try {
      if (page === 0) setLoading(true);

      let startString = dateRange.start;
      let endString = dateRange.end;

      if (typeof dateRange.start === "object") {
        const dateObject = new Date(dateRange.start);
        startString = getPaddedDateString(dateObject);
      }

      if (typeof dateRange.end === "object") {
        const dateObject = new Date(dateRange.end);
        endString = getPaddedDateString(dateObject)
      }


      const url = `/ws/rest/v1/ehospital/outPatientClients?startDate=${startString}&endDate=${endString}`;
      const {data} = await openmrsFetch(url);

      setData([])
      if (data.results.length > 0) {
        setData(prev => [...prev, ...data.results.map(result => ({
          ...result,
          fullName: result?.name,
          age: result?.age,
          gender: result?.sex,
          opdNumber: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("opd"))?.identifier,
          openmrsID: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("openmrs"))?.identifier,
          diagnosis: result?.diagnosis
        }))]);
        setTotalOpdPatients(data.totalOpdPatients);
        setTotalPatients(data.totalPatients);
        setSummary(data.summary);
      } else {
        setTotalOpdPatients(0);
        setTotalPatients(0);
        setSummary({
          groupYear: {},
          groupMonth: {},
          groupWeek: {}
        })
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
    getOPDClients({...currentPaginationState})

  }, [dateRange]);


  return {
    isLoading: loading,
    data,
    setDateRange,
    dateRange,
    totalPatients,
    totalOpdPatients,
    summary
  };
}
