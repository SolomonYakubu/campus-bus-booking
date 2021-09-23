import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import useQuery from "../../../hooks/useQuery";

import empty from "../../../assets/empty.svg";

export default function Buses({ loading }) {
	const [buses, setBuses] = useState([]);
	const getBusQuery = useQuery(
		{
			url: "https://bookbus.herokuapp.com/bus",
			method: "get",
		},
		{ auth: true, type: "admin" },
		loading
	);

	const history = useHistory();

	const getData = useCallback(async () => {
		try {
			const response = await getBusQuery();
			setBuses(response.data);
		} catch (error) {
			switch (error.message) {
				case "401":
					toast.error("Session Expired");
					history.push("/admin");
					localStorage.clear();
					break;
				default:
					toast.error("An error occured");
			}
		}
	}, [getBusQuery, history]);

	useEffect(() => {
		getData();
		//eslint-disable-next-line
	}, []);

	return (
		<div
			className="container"
			// style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
		>
			<div
				style={{
					fontSize: "22px",
					fontFamily: "flamenco",
					padding: "20px",
					// margin: "auto",
					// position: "relative",
					// top:"20px"
				}}
			>
				Registered Buses
			</div>

			<div className="home">
				{Array.isArray(buses) && buses.length !== 0 ? (
					buses.map((item, index) => (
						<div className="dashboard-div" key={index}>
							<div
								style={{
									height: "150px",
									width: "150px",
									borderRadius: "50%",
									background: "#b3f1cb",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
								}}
								className=""
							>
								<FontAwesomeIcon
									icon={faBus}
									size="lg"
									style={{ color: "#50c878" }}
								/>
								<b style={{ color: "#fff", fontSize: "2rem" }}>
									0{item.bus_id}
								</b>
							</div>

							{/* <div>Bus 0{item.bus_id}</div> */}
							<p style={{ fontFamily: "arapey", color: "#444" }}>
								Driver Username: {item.username}
							</p>
							<p style={{ fontFamily: "arapey", color: "#444" }}>
								Number of Seats: {item.number_of_seat}
							</p>
						</div>
					))
				) : (
					<div style={{ width: "100%" }}>
						<p style={{ fontSize: "20px" }}>No Bus Registered Yet</p>
						<img
							src={empty}
							alt="No Data"
							style={{
								width: "100%",
								// height: "60vh",
								border: "none",
								colorAdjust: "#000",
								outline: "none",
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
