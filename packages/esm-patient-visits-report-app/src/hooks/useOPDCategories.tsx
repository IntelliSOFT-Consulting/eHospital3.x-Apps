import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-framework";
import {getPaddedDateString, getPaddedTodayDateRange} from "../helpers/dateOps";

export function useOPDCategories(initialCategory="outPatientClients") {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPaginationState, setCurrentPaginationState] = useState({
      size: 50,
      page: 0
    });
		const [category, setCategory] = useState(initialCategory);
	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${day}/${month}/${year}`
	}

	const [dateRange, setDateRange] = useState(() => {
		const today = new Date();
		const tomorrow = new Date()
		tomorrow.setDate(today.getDate() + 1)

		return {
			start: today,
			end: tomorrow
		}
	})
    const [summary, setSummary] = useState({
      groupYear: {},
      groupMonth: {},
      groupWeek: {}
    })
		const [totalPatients, setTotalPatients] = useState(0);
		const [totalOpdVisits, setTotalOpdVisits] = useState(0);
		const [totalOpdRevisits, setTotalOpdRevisits] = useState(0);

    const getOPDVisits = async ({page, size}) => {
      try {
        if (page === 0) setLoading(true);

        let startString = dateRange.start;
        let endString = dateRange.end;

        const url = `/ws/rest/v1/ehospital/${category}?startDate=${startString}&endDate=${endString}`;
        const {data} = await openmrsFetch(url);
				const cardUrl = `/ws/rest/v1/ehospital/outPatientClients?startDate=${startString}&endDate=${endString}`;
				const {data: cardData} = await openmrsFetch(cardUrl);

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
					}))])
					setTotalPatients(cardData.totalPatients);
					setTotalOpdVisits(cardData.totalOpdVisits);
					setTotalOpdRevisits(cardData.totalOpdRevisits);
					setSummary(data.summary)
        }else {
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

        }catch(e) {
					return e
				}finally{
					setLoading(false)
				}
    }

		useEffect(() => {
			setCurrentPaginationState(prev => ({...prev, page: 0}))
			getOPDVisits({...currentPaginationState})
		}, [dateRange, category])

		return {
			data,
			dateRange,
			loading,
			getOPDVisits,
			summary,
			totalPatients,
			setCategory,
			setDateRange,
			totalOpdVisits,
			totalOpdRevisits,
			category
		}
}