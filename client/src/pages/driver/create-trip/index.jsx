import React, { useState, useCallback, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useHistory } from "react-router";
// import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import useQuery from "../../../hooks/useQuery";
export default function NewTrip({ loading }) {
	const [date, setDate] = useState(new Date(Date.now()));
	const [destination, setDestination] = useState("Hostel");
	// const token = localStorage.getItem("driverToken");
	const history = useHistory();
	const onDropChange = useCallback((e) => {
		const value = e.label;
		setDestination((destination) => value);
	}, []);
	const newTrip = useQuery(
		{
			url: "http://192.168.43.244:8000/bus/driver/status",
			method: "post",
			body: {
				destination,
				departure_time: date,
			},
		},
		{ auth: true, type: "driver" },
		loading
	);

	const createTrip = useCallback(async () => {
		try {
			const response = await newTrip();
			if (response.status === 201) {
				toast.success("Trip Created Successfully");
			}
		} catch (error) {
			switch (error.message) {
				case "400":
					toast.error("You have an active trip", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: "false",
					});
					break;

				case "401":
					toast.error("Session Expired");
					history.push("/driver");
					localStorage.clear();
					break;
				default:
					toast.error("An error occured");
			}
		}
	}, [history, newTrip]);
	useEffect(() => {
		if (destination === "" || date === "") {
			toast.error("Fill out all fields");
		}
	}, [createTrip, date, destination]);
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
