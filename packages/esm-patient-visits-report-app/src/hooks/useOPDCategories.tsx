import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-framework";
import {getPaddedDateString, getPaddedTodayDateRange} from "../helpers/dateOps";

export function useOPDCategories(initialCategory="outPatientClients") {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
		const [backgroundLoading, setBackgroundLoading] = useState(false);
    const [currentPaginationState, setCurrentPaginationState] = useState({
      size: 25,
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

		const getOPDVisits = async () => {
			try {
					const formatDateForReq = (dateString) => {
							const date = new Date(dateString);
							const year = date.getFullYear();
							const month = String(date.getMonth() + 1).padStart(2, '0');
							const day = String(date.getDate()).padStart(2, '0');
							return `${day}-${month}-${year}`;
					};
	
					let startString = formatDateForReq(dateRange.start);
					let endString = formatDateForReq(dateRange.end);
	
					let currentPage = 0;
					let allData = []; 
					let hasMoreData = true;
					let totalFetchedPatients = 0;
					let totalFetchedOpdVisits = 0;
					let totalFetchedOpdRevisits = 0;
	
					let cumulativeSummary = {
							groupYear: {},
							groupMonth: {},
							groupWeek: {},
					};
	
					setLoading(true);
	
					while (hasMoreData) {
							const url = `/ws/rest/v1/ehospital/${category}?startDate=${startString}&endDate=${endString}&page=${currentPage}&size=25`;
							const { data: batchResponse } = await openmrsFetch(url);
							const cardUrl = `/ws/rest/v1/ehospital/outPatientClients?startDate=${startString}&endDate=${endString}&page=${currentPage}&size=25`;
							const { data: cardData } = await openmrsFetch(cardUrl);
	
							const fetchedData = batchResponse.results.map(result => ({
									...result,
									fullName: result?.name,
									age: result?.age,
									gender: result?.sex,
									opdNumber: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("opd"))?.identifier,
									openmrsID: result.identifiers.find(item => item.identifierType.toLowerCase()?.includes("openmrs"))?.identifier,
									diagnosis: result?.diagnosis
							}));
							
							allData = [...allData, ...fetchedData];
							setData(allData);

							if (currentPage === 0) {
								totalFetchedOpdVisits += cardData.totalOpdVisits;
								totalFetchedOpdRevisits += cardData.totalOpdRevisits;
								setLoading(false);
							} else {
								setBackgroundLoading(true);
							}
	
							totalFetchedPatients += cardData.totalPatients;
	
							const updateSummary = (sourceSummary, targetSummary) => {
									Object.keys(sourceSummary).forEach(key => {
											if (targetSummary[key]) {
													targetSummary[key] += sourceSummary[key];
											} else {
													targetSummary[key] = sourceSummary[key];
											}
									});
							};
	
							updateSummary(batchResponse.summary.groupYear, cumulativeSummary.groupYear);
							updateSummary(batchResponse.summary.groupMonth, cumulativeSummary.groupMonth);
							updateSummary(batchResponse.summary.groupWeek, cumulativeSummary.groupWeek);
	
							currentPage += 1;
	
							if (fetchedData.length < 25) {
								hasMoreData = false;
								setBackgroundLoading(false);
							}
					}

					cumulativeSummary.groupMonth = Object.keys(cumulativeSummary.groupMonth)
            .sort((a, b) => {
                const [aMonth, aWeek] = a.split('_Week');
                const [bMonth, bWeek] = b.split('_Week');

                const aDate: any = new Date(`${aMonth} 1, 2024`);
                const bDate: any = new Date(`${bMonth} 1, 2024`);

                return aDate - bDate || parseInt(aWeek) - parseInt(bWeek);
            })
            .reduce((sortedSummary, key) => {
                sortedSummary[key] = cumulativeSummary.groupMonth[key];
                return sortedSummary;
            }, {});
	
					setData(allData); 
					setTotalPatients(totalFetchedPatients);
					setTotalOpdVisits(totalFetchedOpdVisits);
					setTotalOpdRevisits(totalFetchedOpdRevisits);
					setSummary(cumulativeSummary);
					setLoading(false);
					setBackgroundLoading(false);
	
			} catch (e) {
					console.error(e);
					setLoading(false);
					setBackgroundLoading(false);
			}
		};

		useEffect(() => {
			setCurrentPaginationState(prev => ({...prev, page: 0}))
			getOPDVisits()
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