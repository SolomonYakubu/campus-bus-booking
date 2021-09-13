import React, { useState, useCallback } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
export default function DriverDashboard({ loading }) {
	const [date, setDate] = useState(new Date(Date.now()));
	const [destination, setDestination] = useState("Hostel");
	const token = localStorage.getItem("driverToken");
	const onDropChange = useCallback((e) => {
		const value = e.label;
		setDestination((destination) => value);
	}, []);
	const createTrip = async () => {
		loading(true);
		try {
			const response = await axios.post(
				"http://192.168.43.244:8000/bus/driver/status",
				{
					destination,
					departure_time: date,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status === 201) {
				toast.success("Trip Created Successfully");
				loading(false);
			}
		} catch (error) {
			loading(false);
			const err = error.message.split(" ")[5];

			switch (err) {
				case "400":
					toast.error("Fill out all fields provided", {
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
	console.log(date, destination);
	return (
		<div className="container">
			<ToastContainer />
			<h3 style={{ fontSize: "25px", color: "#444" }}>New Trip</h3>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					alignSelf: "center",
					boxSizing: "border-box",
					width: "90%",
					backgroundColor: "#fff",
					borderRadius: "5px",
					fontFamily: "arapey",
					padding: "10px",
					color: "#444",
				}}
			>
				<p style={{ margin: "3px", fontSize: "22px" }}>Destination</p>
				<Dropdown
					options={["Hostel", "Campus"]}
					onChange={onDropChange}
					value={"Hostel"}
					className="dropdown"
				/>
				<p style={{ marginBottom: "3px", marginLeft: "3px", fontSize: "22px" }}>
					Departure Time
				</p>
				<Flatpickr
					// data-enable-time

					options={{
						enableTime: true,
						noCalendar: true,
						dateFormat: "H:i",
						minDate: new Date(Date.now()),
						defaultDate: date,
					}}
					// value={date}
					className="input flatpickr"
					onChange={(date) => {
						setDate(date);
					}}
				/>
				<button
					className="button green"
					style={{ width: "100%" }}
					onClick={createTrip}
				>
					Create Trip
				</button>
			</div>
		</div>
	);
}
