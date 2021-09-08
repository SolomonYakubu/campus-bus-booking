import React from "react";
import { useHistory } from "react-router-dom";
import education from "./assets/education.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import bus from "./assets/bus2.png";
export default function Home() {
	const history = useHistory();
	return (
		<div
			className="container"
			style={{ marginBottom: "20px", marginTop: "80px" }}
		>
			<p
				style={{
					fontFamily: "flamenco",
					fontSize: "24px",
					fontWeight: "bolder",
				}}
			>
				Login As
			</p>
			<div className="home-div">
				<h3>Student</h3>
				<img
					src={education}
					alt="Education"
					style={{
						// width: "0.2rem",
						height: "7rem",
						border: "none",
						outline: "none",
					}}
				/>
				<button
					className="button home-btn"
					onClick={() => history.push("/user")}
				>
					<FontAwesomeIcon icon={faArrowRight} />
				</button>
			</div>
			<div className="home-div">
				<h3>Driver</h3>
				<img
					src={bus}
					alt="Education"
					style={{
						// width: "50%",
						height: "7rem",
						border: "none",
						outline: "none",
					}}
				/>
				<button className="button home-btn">
					<FontAwesomeIcon icon={faArrowRight} />
				</button>
			</div>
		</div>
	);
}
