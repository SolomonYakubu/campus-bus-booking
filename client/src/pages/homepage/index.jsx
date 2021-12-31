import React from "react";
import { useHistory } from "react-router-dom";
import TypingEffect from "react-typing-effect";
import admin from "../../assets/admin.svg";
import student from "../../assets/student.svg";
import driver from "../../assets/driver.svg";

export default function Home() {
	const history = useHistory();
	return (
		<div
			className="container"
			// style={{ marginBottom: "20px", marginTop: "80px" }}
		>
			<div
				style={{
					color: "#808080",
					fontFamily: "Staatliches",
					fontSize: "24px",
					marginBottom: "10px",
					marginTop: "30px",
				}}
			>
				<TypingEffect
					text={[
						"Federal Polytechnic Nasarawa",
						"Project By...",
						"Yakubu Abraham",
						"BookBus",
						"Booking Made Easy😎😎",
					]}
					speed={50}
					eraseDelay={2000}
				/>
			</div>

			<p
				style={{
					fontFamily: "flamenco",
					fontSize: "24px",
					fontWeight: "bolder",
					margin: "15px",
				}}
				className="login-as"
			>
				Login As
			</p>
			<div className="home">
				<div className="home-div" onClick={() => history.push("/user")}>
					<h3 style={{ margin: 0, marginBottom: "10px" }}>Student</h3>
					<img
						src={student}
						alt="Student"
						style={{
							// width: "0.2rem",
							height: "7rem",
							border: "none",
							outline: "none",
						}}
					/>
					{/* <button
						className="button home-btn"
						onClick={() => history.push("/user")}
					>
						<FontAwesomeIcon icon={faArrowRight} />
					</button> */}
				</div>
				<div className="home-div" onClick={() => history.push("/driver")}>
					<h3 style={{ margin: 0, marginBottom: "10px" }}>Driver</h3>
					<img
						src={driver}
						alt="Driver"
						style={{
							// width: "50%",
							height: "7rem",
							border: "none",
							colorAdjust: "#000",
							outline: "none",
						}}
					/>
					{/* <button className="button home-btn">
						<FontAwesomeIcon icon={faArrowRight} />
					</button> */}
				</div>
				<div className="home-div" onClick={() => history.push("/admin")}>
					<h3 style={{ margin: 0, marginBottom: "10px" }}>Admin</h3>
					<img
						src={admin}
						alt="Admin"
						style={{
							// width: "50%",
							height: "7rem",
							border: "none",
							colorAdjust: "#000",
							outline: "none",
						}}
					/>
					{/* <button
						className="button home-btn"
						onClick={() => history.push("/driver")}
					>
						<FontAwesomeIcon icon={faArrowRight} />
					</button> */}
				</div>
			</div>
		</div>
	);
}
