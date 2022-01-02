import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import useQuery from "../../../hooks/useQuery";
import axios from "axios";

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
	const deleteBus = async (bus_id) => {
		const { value: pin } = await Swal.fire({
			title: "Input Pin",
			input: "password",

			inputPlaceholder: "Enter your Pin",
		});
		if (pin) {
			try {
				loading(true);
				const response = await axios({
					url: `https://bookbus.herokuapp.com/bus/admin/delete-driver`,
					method: "DELETE",
					data: { pin, bus_id },
					headers: {
						"content-type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
					},
				});
				if (response.status === 200) {
					Swal.fire("Account deleted successfully!");

					loading(false);
					window.location.reload();
					return;
				}
				loading(false);
			} catch (error) {
				const err = error.message.split(" ")[5];
				loading(false);
				console.log(err);
				switch (err) {
					case "401":
						toast.error("Session expired", {
							position: "top-right",
							autoClose: 3000,
							hideProgressBar: "false",
						});
						setTimeout(() => {
							history.push("/admin");
							localStorage.clear();
						}, 3000);
						break;
					case "400":
						toast.error("Incorrect pin", {
							position: "top-right",
							autoClose: 3000,
							hideProgressBar: "false",
						});
						break;
					default:
						toast.error("Network error", {
							position: "top-right",
							autoClose: 3000,
							hideProgressBar: "false",
						});
				}
			}
		}
	};
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
			<ToastContainer />
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
							<button
								className="button red"
								onClick={() => deleteBus(item.bus_id)}
							>
								Delete
							</button>
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
