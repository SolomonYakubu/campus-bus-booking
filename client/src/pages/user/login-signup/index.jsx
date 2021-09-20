import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import SignUp from "../../../components/SignUp";
import Login from "../../../components/Login";
import useQuery from "../../../hooks/useQuery";

export default function UserLogin({ loading }) {
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [matric, setMatric] = useState("");
	const [email, setEmail] = useState("");
	const [active, setActive] = useState(true);
	const [isLoginEmpty, setisLoginEmpty] = useState(true);
	const [isSignUpEmpty, setisSignUpEmpty] = useState(true);
	const history = useHistory();
	useEffect(() => {
		if (id !== "" && password !== "") {
			setisLoginEmpty(false);
		} else {
			setisLoginEmpty(true);
		}
	}, [id, password]);
	useEffect(() => {
		if (name !== "" && password !== "" && email !== "" && matric !== "") {
			setisSignUpEmpty(false);
		} else {
			setisSignUpEmpty(true);
		}
	}, [name, email, matric, password]);
	useEffect(() => {
		if (localStorage.getItem("token")) {
			history.push("/user/dashboard");
		}
	}, [history]);

	const loginHook = useQuery(
		{
			url: "http://192.168.43.244:8000/user/login",
			method: "post",
			body: { id, password },
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
				toast.success("Logged in successfully!!", { autoClose: 1000 });
				localStorage.setItem("token", response.data);
				history.push("/user/dashboard");
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

	const signUpHook = useQuery(
		{
			url: "http://192.168.43.244:8000/user/register",
			method: "post",
			body: {
				name,
				email,
				password,
				matric_number: matric,
			},
		},
		{ auth: false },
		loading
	);

	const signUp = async () => {
		if (isSignUpEmpty) {
			return;
		}
		try {
			const response = await signUpHook();
			if (response.status === 201) {
				toast.success("Account created Successfully", { autoClose: 1000 });
				setActive(true);
			}
		} catch (error) {
			switch (error.message) {
				case "400":
					toast.error("User already exist", {
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

	return (
		<>
			<div
				className="container"
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",

					alignItems: "center",

					width: "100vw",
					height: "37rem",
					alignSelf: "center",
				}}
			>
				<ToastContainer />
				<form
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						background: "#fff",
						padding: "20px",
						paddingTop: 0,
						// width: "90%",
						alignSelf: "center",
						borderRadius: "5px",
						boxShadow: "1px 10px 10px grey",
						margin: "auto",
						// position: "relative",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							width: "auto",
							alignSelf: "flex-end",
							marginTop: 0,
							marginBottom: "10px",
							background: "#f4f4f4",
							height: "fit-content",
							padding: 0,
						}}
					>
						<button
							className="button user-login"
							style={{
								borderTopStyle: active ? "solid" : "none",
								borderWidth: "3px",
								borderColor: "#50c878",
								background: active ? "#fff" : "#f4f4f4 ",
								opacity: active ? "1" : "0.5",
							}}
							onClick={() => setActive(true)}
						>
							Login
						</button>
						<button
							className="button user-login"
							onClick={() => setActive(false)}
							style={{
								borderTopStyle: !active ? "solid" : "none",
								borderWidth: "3px",
								borderColor: "#50c878",
								background: !active ? "#fff" : "#f4f4f4 ",
								opacity: !active ? "1" : "0.5",
							}}
						>
							Sign Up
						</button>
					</div>
					{active ? (
						<Login
							id={id}
							password={password}
							setId={setId}
							setPassword={setPassword}
							login={login}
							isLoginEmpty={isLoginEmpty}
						/>
					) : (
						<SignUp
							name={name}
							matric={matric}
							password={password}
							email={email}
							setName={setName}
							setEmail={setEmail}
							setMatric={setMatric}
							setPassword={setPassword}
							signUp={signUp}
							isSignUpEmpty={isSignUpEmpty}
						/>
					)}
				</form>
			</div>
		</>
	);
}
