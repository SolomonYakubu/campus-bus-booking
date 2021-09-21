import React from "react";
import { useHistory } from "react-router";
import Swal from "sweetalert2";
import profile from "../assets/profile.svg";

export default function UserNav({ setShowNavbar, showNavbar }) {
	const busId = localStorage.getItem("busId");
	const history = useHistory();
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
					<div>Bus Number: 0{busId}</div>
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
