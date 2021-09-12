import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
//Login form
const LoginForm = ({
	id,
	password,
	onPasswordChange,
	onIdChange,
	login,
	isLoginEmpty,
}) => {
	return (
		<>
			<input
				type="text"
				className="input"
				value={id}
				onChange={(e) => onIdChange(e.target.value)}
				placeholder="Email or Matric No"
				required
			/>
			<input
				type="password"
				className="input"
				value={password}
				onChange={(e) => onPasswordChange(e.target.value)}
				placeholder="Password"
				required
			/>
			<button
				className="button login-btn"
				onClick={() => login()}
				style={{ opacity: isLoginEmpty ? "0.6" : "1" }}
			>
				Login
			</button>
		</>
	);
};

//Sign up form
const SignUpForm = ({
	name,
	matric,
	email,
	password,
	onPasswordChange,
	onNameChange,
	onEmailChange,
	onMatricChange,
	signUp,
	isSignUpEmpty,
}) => {
	return (
		<>
			<input
				type="text"
				className="input"
				value={name}
				onChange={(e) => onNameChange(e.target.value)}
				placeholder="Name"
			/>
			<input
				type="text"
				className="input"
				value={matric}
				onChange={(e) => onMatricChange(e.target.value)}
				placeholder="Matric Number"
			/>
			<input
				type="email"
				className="input"
				value={email}
				onChange={(e) => onEmailChange(e.target.value)}
				placeholder="Email"
			/>
			<input
				type="password"
				className="input"
				value={password}
				onChange={(e) => onPasswordChange(e.target.value)}
				placeholder="Password"
			/>
			<button
				className="button login-btn"
				onClick={signUp}
				style={{ opacity: isSignUpEmpty ? "0.6" : "1" }}
			>
				Sign Up
			</button>
		</>
	);
};

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

	const onIdChange = (val) => {
		setId(val);
	};
	const onPasswordChange = (val) => {
		setPassword(val);
	};
	const onNameChange = (val) => {
		setName(val);
	};
	const onEmailChange = (val) => {
		setEmail(val);
	};
	const onMatricChange = (val) => {
		setMatric(val);
	};

	const login = async () => {
		if (isLoginEmpty) {
			return;
		}
		loading(true);
		try {
			const response = await axios.post(
				// "http://localhost:8000/user/login",
				"http://192.168.43.244:8000/user/login",
				{
					id,
					password,
				}
			);

			if (response.status === 200) {
				toast.success("Logged in successfully!!", { autoClose: 1000 });
				localStorage.setItem("token", response.data);
				history.push("/user/dashboard");
				loading(false);
			}
		} catch (error) {
			loading(false);
			const err = error.message.split(" ")[5];

			switch (err) {
				case "400":
					toast.error("Invalid Login Details", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: "false",
					});
					break;
				default:
					toast.error("Network Error");
			}
		}
	};
	const signUp = async () => {
		loading(true);
		if (isSignUpEmpty) {
			return;
		}
		try {
			const response = await axios.post("http://localhost:8000/user/register", {
				name,
				email,
				password,
				matric_number: matric,
			});
			if (response.status === 201) {
				toast.success("Account Created Successfully");
				setActive(true);
				loading(false);
			}
		} catch (error) {
			loading(false);
			toast.error("An Error Occured");
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
					// minHeight: "100vh",
					alignItems: "center",
					// padding: "10px",
					width: "100vw",
					height: "37rem",
					alignSelf: "center",
					// position: "relative",
					// marginTop: 0,
					// paddingTop: 0,
					// paddingBottom: 0,
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
						<LoginForm
							id={id}
							password={password}
							onIdChange={onIdChange}
							onPasswordChange={onPasswordChange}
							login={login}
							isLoginEmpty={isLoginEmpty}
						/>
					) : (
						<SignUpForm
							name={name}
							matric={matric}
							password={password}
							email={email}
							onNameChange={onNameChange}
							onEmailChange={onEmailChange}
							onMatricChange={onMatricChange}
							onPasswordChange={onPasswordChange}
							login={login}
							signUp={signUp}
							isSignUpEmpty={isSignUpEmpty}
						/>
					)}
				</form>
			</div>
		</>
	);
}
