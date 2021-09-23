import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router";
import useQuery from "../../../hooks/useQuery";
export default function RegisterBus({ loading }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [busId, setBusId] = useState("");
	const [seat, setSeat] = useState("");
	const [isFieldEmpty, setIsFieldEmpty] = useState(true);
	const history = useHistory();
	useEffect(() => {
		if (username !== "" && password !== "" && busId !== "" && seat !== "") {
			setIsFieldEmpty(false);
		} else {
			setIsFieldEmpty(true);
		}
	}, [password, username, busId, seat]);
	const registerQuery = useQuery(
		{
			url: "https://bookbus.herokuapp.com/bus/register",
			method: "post",
			body: {
				username,
				password,

				number_of_seat: seat,
				bus_id: busId,
			},
		},
		{ auth: true, type: "admin" },
		loading
	);
	const register = async () => {
		try {
			const response = await registerQuery();
			if (response.status === 201) {
				toast.success("Bus Registered Successfully");
				setPassword("");
				setUsername("");
				setBusId("");
				setSeat("");
			}
		} catch (error) {
			switch (error.message) {
				case "400":
					toast.error("Bus Already Exist", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: "false",
					});
					break;

				case "401":
					toast.error("Session Expired");
					history.push("/admin");
					localStorage.clear();
					break;
				default:
					toast.error("An error occured");
			}
		}
	};
	return (
		<div className="container">
			<ToastContainer />
			<form>
				<input
					type="text"
					className="input"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Driver Username"
					required
				/>
				<input
					type="text"
					className="input"
					value={busId}
					onChange={(e) => setBusId(e.target.value)}
					placeholder="Bus Number"
					required
				/>
				<input
					type="text"
					className="input"
					value={seat}
					onChange={(e) => setSeat(e.target.value)}
					placeholder="Number of Seats"
					required
				/>
				<input
					type="password"
					className="input"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
				/>
				<button
					className="button green input"
					onClick={register}
					style={{ opacity: isFieldEmpty ? "0.6" : "1" }}
				>
					Register
				</button>
			</form>
		</div>
	);
}
