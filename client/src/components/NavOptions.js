import profile from "./assets/profile.svg";
import signin from "./assets/signin.svg";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
const NavOptions = ({ showNavbar, setShowNavbar }) => {
	const { name, matric_number, email } = localStorage.getItem("data")
		? JSON.parse(localStorage.getItem("data"))
		: "";
	const history = useHistory();
	return (
		<div
			style={{
				// height: "110%",
				position: "absolute",
				background: "rgb(38, 46, 59)",
				paddingTop: "4rem",
				top: 0,
				zIndex: "44",
				right: "0",
				width: "100%",
			}}
			className={showNavbar ? "show-nav container" : "hide-nav"}
		>
			{localStorage.getItem("token") ? (
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
						<div
							style={{ color: "#fff", fontSize: "20px", fontFamily: "Arapey" }}
						>
							<div>Name: {name}</div>
							<div>Email: {email}</div>
							<div>Matric Number: {matric_number}</div>
						</div>
					</div>
					<div
						style={{
							display: showNavbar ? "flex" : "none",

							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<button className="button green">Ticket</button>
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
										localStorage.removeItem("token");
									}
								});
							}}
						>
							Logout
						</button>
					</div>
				</>
			) : (
				<>
					<div style={{ marginTop: "-40px" }}>
						<img
							src={signin}
							alt="Sign In"
							className="nav-image"
							style={{
								// width: "90vw",
								// height: "60vh",
								border: "none",
								outline: "none",
								alignSelf: "center",
							}}
						/>
						<div style={{ color: "#fff", margin: "10px", fontSize: "20px" }}>
							Sign Up or Login to get started
						</div>
						<button
							className="button red"
							style={{ display: showNavbar ? "inline-block" : "none" }}
							onClick={() => setShowNavbar(false)}
						>
							Get Started
						</button>
					</div>
				</>
			)}
		</div>
	);
};
export default NavOptions;
