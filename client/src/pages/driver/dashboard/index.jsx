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
				<div className="dashboard-div">
					<button
						className="input button green"
						onClick={() => setVerify(true)}
					>
						Verify Ticket
					</button>
					<button
						className="input button green"
						onClick={() => history.push("/driver/ongoing-trip")}
					>
						Ongoing Trip
					</button>
					<button
						className="input button green"
						onClick={() => history.push("/driver/newtrip")}
					>
						Create New Trip
					</button>
				</div>
			)}
		</div>
	);
}
