import React, { useState } from "react";
import { useHistory } from "react-router";
export default function AdminDashboard({ loading }) {
	// const [verify, setVerify] = useState(false);
	const history = useHistory();
	return (
		<div className="container">
			<div className="home-div">
				<button
					className="input button green"
					onClick={() => history.push("/admin/register-bus")}
				>
					Register New Bus
				</button>
				<button
					className="input button green"
					onClick={() => history.push("/admin/buses")}
				>
					View Registered Busess
				</button>
			</div>
		</div>
	);
}
