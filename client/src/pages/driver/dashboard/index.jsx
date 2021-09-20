import React, { useState } from "react";
// import Flatpickr from "react-flatpickr";
import { useHistory } from "react-router";
import "flatpickr/dist/themes/dark.css";
// import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
// import axios from "axios";

// import {  ToastContainer } from "react-toastify";
import VerifyTicket from "../../../components/VerifyTicket";
export default function DriverDashboard({ loading }) {
	const [verify, setVerify] = useState(false);
	const history = useHistory();
	return (
		<div className="container">
			{/* <ToastContainer /> */}
			{verify ? (
				<VerifyTicket loading={loading} />
			) : (
				<>
					<button
						className="input button green"
						onClick={() => setVerify(true)}
					>
						Verify Ticket
					</button>
					<button
						className="input button green"
						onClick={() => history.push("/driver/newtrip")}
					>
						Create New Trip
					</button>
					<button className="input button green">Suspend Current Trip</button>
				</>
			)}
		</div>
	);
}
