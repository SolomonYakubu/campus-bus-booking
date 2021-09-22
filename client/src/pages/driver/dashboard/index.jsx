import React, { useState } from "react";
import { useHistory } from "react-router";
import "flatpickr/dist/themes/dark.css";

import "react-dropdown/style.css";

import VerifyTicket from "../../../components/VerifyTicket";
export default function DriverDashboard({ loading }) {
	const [verify, setVerify] = useState(false);
	const history = useHistory();
	return (
		<div className="container">
			{verify ? (
				<VerifyTicket loading={loading} />
			) : (
				<div className="home-div">
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
				</div>
			)}
		</div>
	);
}
