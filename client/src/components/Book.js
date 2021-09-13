import React, { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import swal from "sweetalert2";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ticket from "./Ticket";
import { useHistory } from "react-router-dom";
import pay from "./assets/pay.svg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
const data = localStorage.getItem("data")
	? JSON.parse(localStorage.getItem("data"))
	: "";
const config = {
	reference: new Date().getTime().toString(),
	email: data.email,
	amount: 5000,
	publicKey: "pk_test_0a4093b99f32878ae511ab0f19d32710c16702f8",
};

const Options = ({ handleChange, loading }) => {
	const departureTime = (val) => {
		dayjs.extend(utc);
		dayjs.extend(timezone);
		return dayjs(val).tz("Africa/Lagos").format("hh:mm A");
	};

	const token = localStorage.getItem("token");
	const onSuccess = (reference) => {
		loading(true);
		const check = async () => {
			try {
				const response = await axios.post(
					`http://192.168.43.244:8000/user/book/${localStorage.getItem(
						"bus_id"
					)}`,
					{ chargeType: "bank", reference_id: reference.reference },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				loading(false);

				localStorage.removeItem("bus_id");
				localStorage.setItem(
					"ticket",
					JSON.stringify({
						bus_id: response.data.bus_id,
						code: response.data.code,
						seat: response.data.seat,
						destination: response.data.destination,
						departure_time: (() =>
							departureTime(response.data.departure_time))(),
					})
				);
				handleChange("ticket");
			} catch (error) {
				loading(false);
				const err = error.message.split(" ")[5];

				switch (err) {
					case "400":
						toast.error("Something went wrong");
						break;
					default:
						toast.error("Network Error");
				}
			}
		};
		check();
	};

	const onClose = () => {
		console.log("closed");
	};
	const initializePayment = usePaystackPayment(config);
	return (
		<div
			style={{
				// width: "90%",
				background: "#fff",
				padding: "20px",
				borderRadius: "10px",
			}}
			className="pay-div"
		>
			<img
				src={pay}
				alt="pay"
				style={{
					height: "7rem",
					border: "none",
					outline: "none",
				}}
			/>
			<p style={{ fontFamily: "flamenco", fontSize: "20px" }}>Pay from?</p>
			<div style={divStyle}>
				<button
					className="button book"
					onClick={() => {
						initializePayment(onSuccess, onClose);
					}}
				>
					Bank
				</button>
				<button
					className="button book"
					onClick={() =>
						swal
							.fire({
								text: "You will be charged #50 from your wallet",

								showCancelButton: true,
								focusConfirm: false,
								confirmButtonText: "Confirm",
							})
							.then(async (result) => {
								if (result.isConfirmed) {
									loading(true);
									try {
										const response = await axios.post(
											`http://192.168.43.244:8000/user/book/${localStorage.getItem(
												"bus_id"
											)}`,
											{ chargeType: "wallet" },
											{
												headers: {
													Authorization: `Bearer ${token}`,
												},
											}
										);
										loading(false);
										localStorage.removeItem("bus_id");
										localStorage.setItem(
											"ticket",
											JSON.stringify({
												bus_id: response.data.bus_id,
												code: response.data.code,
												seat: response.data.seat,
												destination: response.data.destination,
												departure_time: (() =>
													departureTime(response.data.departure_time))(),
											})
										);
										toast.success("Payment Successful");
										handleChange("ticket");
									} catch (error) {
										loading(false);
										const err = error.message.split(" ")[5];

										switch (err) {
											case "406":
												toast.error("Insufficient funds");
												break;
											default:
												toast.error("Network Error");
										}
									}
								}
							})
					}
				>
					Wallet
				</button>
			</div>
		</div>
	);
};
export default function Book({ loading }) {
	const [state, setState] = useState("default");
	const handleChange = (val) => {
		setState(val);
	};
	const history = useHistory();
	useEffect(() => {
		if (!localStorage.getItem("bus_id")) {
			history.push("/user/dashboard");
		}
	}, [history]);
	return (
		<div className="container">
			<ToastContainer />
			{state === "default" ? (
				<Options handleChange={handleChange} loading={loading} />
			) : (
				<Ticket />
			)}
		</div>
	);
}
const divStyle = {
	display: "flex",
	flexDirection: "column",
	width: "100%",
	alignItems: "center",
	justifyContent: "center",
};
