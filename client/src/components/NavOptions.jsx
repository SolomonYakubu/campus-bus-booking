import signin from "../assets/signin.svg";
import UserNav from "./UserNav";
import DriverNav from "./DriverNav";
const NavOptions = ({ showNavbar, setShowNavbar, fundWallet }) => {
	return (
		<div
			style={{
				// height: "110%",
				position: "absolute",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "rgb(38, 46, 59)",
				// paddingTop: "rem",
				top: 0,
				zIndex: "44",
				right: "0",
				width: "100%",
			}}
			className={showNavbar ? "show-nav" : "hide-nav"}
		>
			{localStorage.getItem("token") ? (
				<>
					<UserNav
						setShowNavbar={setShowNavbar}
						showNavbar={showNavbar}
						fundWallet={fundWallet}
					/>
				</>
			) : localStorage.getItem("driverToken") ? (
				<DriverNav setShowNavbar={setShowNavbar} showNavbar={showNavbar} />
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
							style={{ marginBottom: "20px" }}
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
