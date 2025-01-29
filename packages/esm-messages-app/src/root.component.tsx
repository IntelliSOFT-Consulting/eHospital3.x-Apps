import { setLeftNav, unsetLeftNav } from "@openmrs/esm-framework";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MessagesDashboard from "./home-dashboard/messages-dashboard.component";
import styles from "./root.scss";
import LeftPanel from "./left-panel/left-panel.component";

const RootComponent: React.FC = () => {
	const spaBasePath = window.spaBase
	const messagesSpaBasePath = window.getOpenmrsSpaBase() + 'messages'

	useEffect(() => {
		setLeftNav({
			name: 'messages-left-panel-slot',
			basePath: spaBasePath
		})
		return () => unsetLeftNav('messages-left-panel-slot')
	}, [spaBasePath])

  return (
		<BrowserRouter basename={messagesSpaBasePath}>
			<LeftPanel />
			<main className={styles.container}>
				<Routes>
					<Route path="/" element={<MessagesDashboard />} />
				</Routes>
			</main>
		</BrowserRouter>
	)
}

export default RootComponent