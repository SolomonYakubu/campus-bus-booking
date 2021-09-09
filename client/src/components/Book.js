import React, { useState } from "react";
import Pay from "./Pay";
import { usePaystackPayment } from "react-paystack";
import swal from "sweetalert2";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ticket from "./Ticket";
import { useHistory } from "react-router-dom";

const config = {
	reference: new Date().getTime().toString(),
	email: "user@example.com",
	amount: 5000,
	publicKey: "pk_test_0a4093b99f32878ae511ab0f19d32710c16702f8",
};

const Options = ({ handleChange, loading }) => {
	// const history = useHistory();
	const token = localStorage.getItem("token");
	const onSuccess = (reference) => {
		// console.log(reference);
		loading(true);
		const check = async () => {
			console.log(reference);
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
				// localStorage.removeItem("bus_id");
				localStorage.removeItem("bus_id");
				localStorage.setItem("ticket", JSON.stringify(response.data));
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
		<>
			<p style={{ fontFamily: "flamenco", fontSize: "20px" }}>Pay from?</p>
			<div style={divStyle}>
				<button
					className="button book"
					onClick={() => {
						// handleChange("bank");
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
								// html: "<button>test</button>",
								// showCloseButton: true,
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
											JSON.stringify(response.data)
										);
										handleChange("ticket");
										// console.log(response.data);
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
		</>
	);
};
export default function Book({ loading }) {
	const [state, setState] = useState("default");
	const handleChange = (val) => {
		setState(val);
	};
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
