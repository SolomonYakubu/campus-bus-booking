import React, { useState, useEffect, useCallback } from "react";
import useQuery from "../../../hooks/useQuery";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

export default function OngoingTrip({ loading }) {
	const [data, setData] = useState({});
	const history = useHistory();
	const getOngoingTrip = useQuery(
		{
			url: "https://bookbus.herokuapp.com/bus/driver/ongoing-trip",
			method: "get",
		},
		{ auth: true, type: "driver" },
		loading
	);
	const getData = useCallback(async () => {
		try {
			const response = await getOngoingTrip();
			if (response.status === 200) {
				setData(response.data);
			}
			console.log(response.data);
		} catch (error) {
			switch (error.message) {
				case "400":
					Swal.fire({
						type: "success",
						text: "You currently have no active trip",
					});
					setTimeout(() => {
						history.push("/driver/dashboard");
					}, 1000);

					break;
				case "401":
					toast.error("Session Expired");
					localStorage.clear();
					history.push("/driver");

					break;
				default:
					toast.error("An error occured");
			}
		}
	}, [getOngoingTrip, history]);
	useEffect(() => {
		getData();
		//eslint-disable-next-line
	}, []);
	return (
		<div className="container">
			<ToastContainer />
			<div className="home-div">
				<h1>Booking Status</h1>
				<p>Destination: {data.destination}</p>
				<p>Departure Time: {data.departure_time}</p>
				<p>Number of booked seat: {data.booked_seat}</p>
			</div>
		</div>
	);
}
