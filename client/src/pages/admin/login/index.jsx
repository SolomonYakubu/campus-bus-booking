import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import useQuery from "../../../hooks/useQuery";
export default function AdminLogin({ loading }) {
	const [pin, setPin] = useState("");
	const [isLoginEmpty, setIsLoginEmpty] = useState(true);
	const history = useHistory();
	useEffect(() => {
		if (pin !== "") {
			setIsLoginEmpty(false);
		} else {
			setIsLoginEmpty(true);
		}
	}, [pin]);

	const loginHook = useQuery(
		{
			url: "http://192.168.43.244:8000/bus/admin/login",
			method: "post",
			body: {
				pin,
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
				// localStorage.setItem("adminToken", response.data.token);
				console.log(response.data);
				history.push("/admin/dashboard");
				toast.success("Logged in successfully!!", { autoClose: 1000 });
			}
		} catch (error) {
			switch (error.message) {
				case "400":
					toast.error("Invalid Pin", {
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
	// useEffect(() => {
	// 	if (localStorage.getItem("driverToken")) {
	// 		history.push("/driver/dashboard");
	// 	}
	// }, [history]);
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
					type="password"
					className="input"
					value={pin}
					onChange={(e) => setPin(e.target.value)}
					placeholder="Secret Pin"
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
