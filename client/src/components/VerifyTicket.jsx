import axios from "axios";
import React, { useState } from "react";
import QrReader from "react-qr-reader";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
export default function VerifyTicket({ loading }) {
	const delay = 500;

	const [id, setId] = useState("");
	const [scan, setScan] = useState(false);
	const token = localStorage.getItem("driverToken");
	function onIdChange(val) {
		setId(val);
	}

	const verifyCode = async (val) => {
		loading(true);
		try {
			const response = await axios.get(
				`http://192.168.43.244:8000/bus/ticket/verify/${val}`,

				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status === 200) {
				// console.log(response.data);
				loading(false);
				Swal.fire({
					title: "<strong>Verified</strong>",
					icon: "success",
					html: `
				<div>Matric Number: ${response.data.matric_number}</div>
				<div>Ticket ID: ${response.data.code}</div>
				
				<div>Seat: ${response.data.seat}</div>
				<div>Destination: ${response.data.destination}</div>
				<div>Departure Time: ${response.data.departure_time}</div>`,
					showCloseButton: false,
					showCancelButton: true,
				}).then((result) => {
					if (result.isConfirmed) {
						setScan(false);
					}
				});
			}
		} catch (error) {
			loading(false);
			const err = error.message.split(" ")[5];

			switch (err) {
				case "404":
					toast.error("Ticket Not Valid", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: "false",
					});
					break;
				default:
					toast.error("Network Error");
			}
		}
	};
	function handleScan(result) {
		if (result) {
			verifyCode(result);
		}
	}
	function handleError(err) {
		console.error(err);
	}

	const previewStyle = {
		height: 240,
		width: 320,
	};
	// console.log(token, id);
	return (
		<div className="container">
			<ToastContainer />

			{!scan ? (
				<div className="home-div">
					<div
						style={{
							fontSize: "22px",
							fontFamily: "Flamenco",
							color: "#444",
							marginBottom: "10px",
							fontWeight: "bold",
						}}
					>
						Verify Ticket
					</div>
					<input
						type="text"
						maxLength="4"
						value={id}
						onChange={(e) => onIdChange(e.target.value)}
						className="input"
						placeholder="Enter Ticket ID"
					/>
					<button className="input button green" onClick={() => verifyCode(id)}>
						Verify
					</button>
					<div
						style={{
							fontSize: "25px",
							// alignSelf: "flex-start",
							marginTop: "16px",
							fontWeight: "bold",
							color: "#444",
						}}
					>
						Or
					</div>
					<button className="button green" onClick={() => setScan(true)}>
						Scan
					</button>
				</div>
			) : (
				<>
					<QrReader
						delay={delay}
						style={previewStyle}
						onError={handleError}
						onScan={handleScan}
					/>
				</>
			)}
		</div>
	);
}
