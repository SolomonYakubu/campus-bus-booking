import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// import { usePaystackPayment } from "react-paystack";
// import Swal from "sweetalert2";
import Pay from "./Pay";

export default function UserDashboard({
	loading,
	setWallet,
	fund,
	setFund,
	amount,
}) {
	const token = localStorage.getItem("token");
	// const [data, setData] = useState({});
	const [bus, setBus] = useState([]);
	const [active, setActive] = useState(true);
	const [booked, setBooked] = useState(false);
	// const [amount, setAmount] = useState(0);
	// const [fund, setFund] = useState(false);

	const history = useHistory();
	const handleActive = useCallback(
		async (val) => {
			loading(true);
			if (val === "hostel") {
				try {
					const response = await axios.get(
						"http://192.168.43.244:8000/user/bus/Hostel",
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					if (response.status === 200) {
						setBus(response.data);
						if (response.data.ticket) {
							setBooked(true);
						} else {
							setBooked(false);
						}

						loading(false);
						setActive(true);
					}
				} catch (error) {
					loading(false);
					toast.error("An error occured");
				}
			} else {
				try {
					const response = await axios.get(
						"http://192.168.43.244:8000/user/bus/Campus",
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					if (response.status === 200) {
						setBus(response.data);
						if (response.data.ticket) {
							setBooked(true);
						} else {
							setBooked(false);
						}
						loading(false);
						setActive(false);
					}
				} catch (error) {
					loading(false);
					toast.error("An error occured");
				}
			}
		},
		[loading, token]
	);
	const getData = useCallback(async () => {
		loading(true);
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
			// setData(response.data);
			handleActive("hostel");
			setWallet(response.data.wallet);
			loading(false);
		} catch (error) {
			loading(false);
			const err = error.message.split(" ")[5];

			switch (err) {
				case "401":
					history.push("/user");
					localStorage.removeItem("token");
					break;
				default:
					toast.error("Network Error");
			}
		}
	}, [token, loading, history, setWallet, handleActive]);

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
			style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
		>
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
							{Array.isArray(bus)
								? bus.map((item, index) => (
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
								: null}
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
