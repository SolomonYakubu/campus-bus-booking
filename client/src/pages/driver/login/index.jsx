import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import useQuery from "../../../hooks/useQuery";
export default function DriverLogin({ loading }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginEmpty, setIsLoginEmpty] = useState(true);
	const history = useHistory();
	useEffect(() => {
		if (username !== "" && password !== "") {
			setIsLoginEmpty(false);
		} else {
			setIsLoginEmpty(true);
		}
	}, [username, password]);
	const onPasswordChange = (val) => {
		setPassword(val);
	};
	const onUsernameChange = (val) => {
		setUsername(val);
	};
	const loginHook = useQuery(
		{
			url: "http://localhost:8000/bus/driver/login",
			method: "post",
			body: {
				username,
				password,
			},
		},
		{ auth: false },
		loading
	);

	const login = async () => {
		if (isLoginEmpty) {
			return;
		}
		try {
			const response = await loginHook();
			if (response.status === 200) {
				localStorage.setItem("driverToken", response.data.token);
				localStorage.setItem("busId", response.data.bus_id);
				history.push("/driver/dashboard");
				toast.success("Logged in successfully!!", { autoClose: 1000 });
			}
		} catch (error) {
			switch (error.message) {
				case "400":
					toast.error("Invalid Login Details", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: "false",
					});
					break;
				default:
					toast.error("Something went wrong");
			}
		}
	};
	useEffect(() => {
		if (localStorage.getItem("driverToken")) {
			history.push("/driver/dashboard");
		}
	}, [history]);
	return (
		<div className="container">
			<ToastContainer />
			<form
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "#fff",
					padding: "20px",
					// paddingTop: ,
					// width: "90%",
					alignSelf: "center",
					borderRadius: "5px",
					// boxShadow: "1px 10px 10px grey",
					margin: "auto",
					// position: "relative",
				}}
			>
				<div
					style={{
						fontSize: "25px",
						color: "#444",
						fontFamily: "Arapey",
						marginBottom: "5px",
					}}
				>
					Login
				</div>
				<input
					type="text"
					className="input"
					value={username}
					onChange={(e) => onUsernameChange(e.target.value)}
					placeholder="Username"
					required
				/>
				<input
					type="password"
					className="input"
					value={password}
					onChange={(e) => onPasswordChange(e.target.value)}
					placeholder="password"
					required
				/>
				<button
					className="button login-btn"
					onClick={() => login()}
					style={{ opacity: isLoginEmpty ? "0.6" : "1" }}
				>
					Login
				</button>
			</form>
		</div>
	);
}
