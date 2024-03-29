import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useQuery from "../../../hooks/useQuery";

import Swal from "sweetalert2";

import empty from "../../../assets/empty.svg";
import Pay from "../../../components/Pay.jsx";
import axios from "axios";

export default function UserDashboard({
	loading,
	setWallet,
	fund,
	setFund,
	amount,
}) {
	const [bus, setBus] = useState([]);
	const [active, setActive] = useState(true);
	const [booked, setBooked] = useState(false);
	const getUserData = useQuery(
		{
			url: "https://bookbus.herokuapp.com/user",
			method: "get",
		},
		{ auth: true, type: "user" },
		loading
	);
	const getHostelBuses = useQuery(
		{
			url: "https://bookbus.herokuapp.com/user/bus/Hostel",
			method: "get",
		},
		{ auth: true, type: "user" },
		loading
	);
	const getCampusBuses = useQuery(
		{
			url: "https://bookbus.herokuapp.com/user/bus/Campus",
			method: "get",
		},
		{ auth: true, type: "user" },
		loading
	);

	const cancelTrip = async (destination, bus_id) => {
		console.log(destination.toLowerCase(), bus_id);
		Swal.fire({
			title: "Do you really want to cancel trip?",

			showCancelButton: true,
			confirmButtonText: "Yes",
		}).then(async (result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				try {
					const response = await axios.post(
						`https://bookbus.herokuapp.com/user/cancel-trip/${destination.toLowerCase()}/${bus_id}`,
						{},
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`,
							},
						}
					);

					toast.success("Trip cancelled successfully");
					setTimeout(() => window.location.reload(), 1500);
				} catch (error) {
					switch (error.message) {
						case "400":
							toast.error("An error occured", {
								position: "top-right",
								autoClose: 3000,
								hideProgressBar: "false",
							});
							break;

						case "401":
							toast.error("Session Expired");
							history.push("/admin");
							localStorage.clear();
							break;
						default:
							toast.error("An error occured");
					}
				}
			}
		});
	};
	const history = useHistory();
	const handleActive = useCallback(
		async (val) => {
			try {
				const response =
					val === "hostel" ? await getHostelBuses() : await getCampusBuses();
				if (response.status === 200) {
					setBus(response.data);
					setActive(val === "hostel" ? true : false);
					if (response.data.ticket) {
						setBooked(true);
					} else {
						setBooked(false);
					}
				}
			} catch (error) {
				switch (error.message) {
					case "401":
						toast.error("Session Expired");
						history.push("/user");
						localStorage.clear();
						break;
					default:
						toast.error("An error occured");
				}
			}
		},
		[getCampusBuses, getHostelBuses, history]
	);
	const getData = useCallback(async () => {
		try {
			const response = await getUserData();
			// console.log(response.data);
			const { name, email, matric_number } = response.data;
			localStorage.setItem(
				"data",
				JSON.stringify({ name, email, matric_number })
			);

			handleActive("hostel");
			setWallet(response.data.wallet);
		} catch (error) {
			switch (error.message) {
				case "401":
					toast.error("Session Expired");
					history.push("/user");
					localStorage.clear();
					break;
				default:
					toast.error("An error occured");
			}
		}
	}, [getUserData, handleActive, setWallet, history]);

	useEffect(() => {
		getData();
		//eslint-disable-next-line
	}, []);
	const departureTime = (val) => {
		dayjs.extend(utc);
		dayjs.extend(timezone);
		return dayjs(val).tz("Africa/Lagos").format("hh:mm A");
	};

	const book = (id) => {
		localStorage.setItem("bus_id", id);
		history.push("/user/book");
	};
	// console.log(bus.hostel);
	return (
		<div
			className="container"
			// style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
		>
			<ToastContainer />
			<div
				style={{
					fontSize: "25px",
					alignSelf: "flex-start",
					marginLeft: "10px",
					fontWeight: "bold",
					color: "#444",
				}}
			>
				Welcome{" "}
				{localStorage.getItem("data")
					? JSON.parse(localStorage.getItem("data")).name.split(" ")[0]
					: "Anonymous"}
			</div>
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
				Where are you going to?
			</div>
			<div
				style={{
					display: "flex",
					alignSelf: "flex-end",
					marginRight: "20px",
					background: "#fff",
					borderRadius: "47%",
				}}
			>
				<button
					style={active ? roundButtonActive : roundButtonInActive}
					onClick={() => handleActive("hostel")}
				>
					Hostel
				</button>
				<button
					style={!active ? roundButtonActive : roundButtonInActive}
					onClick={() => handleActive("campus")}
				>
					Campus
				</button>
			</div>
			{!fund ? (
				!booked ? (
					<>
						<div className="home">
							{Array.isArray(bus) && bus.length !== 0 ? (
								bus.map((item, index) => (
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
											Departure Time:{" "}
											{item.departure_time
												? (() => departureTime(item.departure_time))()
												: null}
										</p>
										<button
											className="button book"
											onClick={() => book(item.bus_id)}
										>
											Book
										</button>
									</div>
								))
							) : (
								<div style={{ width: "100%" }}>
									<p style={{ fontSize: "20px" }}>
										Sorry we couldn't find any Bus going to the{" "}
										{active ? "Hostel" : "Campus"}
									</p>
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
					</>
				) : (
					<div>
						<div className="home">
							{bus[Object.keys(bus)[0]] ? (
								<div className="dashboard-div">
									<div
										style={{
											alignSelf: "flex-end",
											backgroundColor: "#b3f1cb",
											color: "#50c878",
											padding: "5px",
											fontFamily: "arapey",
										}}
									>
										Booked
									</div>
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
											0{bus[Object.keys(bus)[0]].bus_id}
										</b>
									</div>

									{/* <div>Bus 0{item.bus_id}</div> */}
									<p style={{ fontFamily: "arapey", color: "#444" }}>
										Departure Time:{" "}
										{bus[Object.keys(bus)[0]].departure_time
											? (() =>
													departureTime(
														bus[Object.keys(bus)[0]].departure_time
													))()
											: null}
									</p>
									<button
										className="button book"
										onClick={() => {
											localStorage.setItem(
												"ticket",
												JSON.stringify({
													bus_id: bus[Object.keys(bus)[0]].bus_id,
													code: bus.ticket.code,
													seat: bus.ticket.seat,
													destination: bus[Object.keys(bus)[0]].destination,
													departure_time: (() =>
														departureTime(
															bus[Object.keys(bus)[0]].departure_time
														))(),
												})
											);
											history.push("/user/ticket");
										}}
									>
										View Ticket
									</button>
									<button
										className="button book red"
										onClick={() =>
											cancelTrip(
												bus[Object.keys(bus)[0]].destination,
												bus[Object.keys(bus)[0]].bus_id
											)
										}
									>
										Cancel Trip
									</button>
								</div>
							) : null}
						</div>
					</div>
				)
			) : (
				<Pay amount={amount} loading={loading} setFund={setFund} />
			)}
		</div>
	);
}

const roundButtonActive = {
	height: "50px",
	width: "50px",
	borderRadius: "50%",
	background: "rgb(247, 10, 187)",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
	color: "#fff",
	fontFamily: "flamenco",
	margin: "5px",
	outline: "none",
};
const roundButtonInActive = {
	height: "50px",
	width: "50px",
	borderRadius: "50%",
	background: "grey",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
	color: "#fff",
	fontFamily: "flamenco",
	margin: "5px",
	outline: "none",
	opacity: "0.5",
};
