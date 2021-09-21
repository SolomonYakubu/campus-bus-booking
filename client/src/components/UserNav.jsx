import React from "react";
import { useHistory } from "react-router";
import Swal from "sweetalert2";
import profile from "../assets/profile.svg";

export default function UserNav({ setShowNavbar, fundWallet, showNavbar }) {
	const history = useHistory();
	const { name, matric_number, email } = localStorage.getItem("data")
		? JSON.parse(localStorage.getItem("data"))
		: "";

	return (
		<>
			<div
				style={{
					borderStyle: "dashed",
					padding: "10px",
					borderWidth: "5px",
					borderColor: "#fff",
				}}
			>
				<img
					src={profile}
					alt="Profile"
					style={{
						// width: "0.2rem",
						height: "7rem",
						border: "none",
						outline: "none",
					}}
				/>
				<div style={{ color: "#fff", fontSize: "20px", fontFamily: "Arapey" }}>
					<div>Name: {name}</div>
					<div>Email: {email}</div>
					<div>Matric Number: {matric_number}</div>
				</div>
			</div>
			<div
				style={{
					display: "flex",

					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					paddingBottom: "20px",
				}}
			>
				<button className="button green" onClick={() => fundWallet()}>
					Fund Wallet
				</button>
				{/* <button className="button green">Ticket</button> */}
				<button
					className="button red"
					onClick={() => {
						Swal.fire({
							title: "Do you want to Logout?",

							showCancelButton: true,
							confirmButtonText: "Yes",
						}).then((result) => {
							/* Read more about isConfirmed, isDenied below */
							if (result.isConfirmed) {
								setShowNavbar(false);
								history.push("/");
								localStorage.clear();
								window.location.reload();
							}
						});
					}}
				>
					Logout
				</button>
			</div>
		</>
	);
}
