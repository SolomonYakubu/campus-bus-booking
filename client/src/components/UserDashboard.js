import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
export default function UserDashboard() {
	const token = localStorage.getItem("token");
	const [data, setData] = useState({});
	const getData = useCallback(async () => {
		try {
			const response = await axios.get(
				// "http://localhost:8000/user",
				"http://192.168.43.244:8000/user",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// console.log(response.data);
			const { name, email, matric_number } = response.data;
			localStorage.setItem(
				"data",
				JSON.stringify({ name, email, matric_number })
			);
			setData(response.data);
		} catch (error) {
			console.log(error.message);
		}
	}, [token]);

	useEffect(() => {
		getData();
		//eslint-disable-next-line
	}, []);
	console.log(data);
	return (
		<div
			className="container"
			style={{ paddingTop: "6rem", paddingBottom: "2rem" }}
		>
			<div className="wallet">Wallet: #{data.wallet}</div>
			{data.buses
				? data.buses.map((item, index) => (
						<div className="dashboard-div" key={index}>
							<div
								style={{
									height: "150px",
									width: "150px",
									borderRadius: "50%",
									background: "rgb(185, 241, 215)",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<FontAwesomeIcon
									icon={faBus}
									size="lg"
									style={{ color: "rgb(40, 196, 123)" }}
								/>
								<b style={{ color: "#fff", fontSize: "2rem" }}>
									0{item.bus_id}
								</b>
							</div>

							{/* <div>Bus 0{item.bus_id}</div> */}
							<p>{item.departure_time ? item.departure_time : null}</p>
							<button className="button book">Book</button>
						</div>
				  ))
				: null}
		</div>
	);
}
