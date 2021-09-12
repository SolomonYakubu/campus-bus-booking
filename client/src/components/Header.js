import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import NavOptions from "./NavOptions";
export default function Header({ setShowNavbar, showNavbar }) {
	return (
		<>
			<header>
				<div
					style={{
						// transform: "rotate(180deg)",
						position: "absolute",
						height: "100%",
						width: "100vw",
						backgroundColor: "#50c878",
					}}
				>
					{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
						<path
							fill="#50c878"
							fillOpacity="1"
							d="M0,224L60,234.7C120,245,240,267,360,272C480,277,600,267,720,240C840,213,960,171,1080,170.7C1200,171,1320,213,1380,234.7L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
						></path>
					</svg> */}
				</div>
				<button
					onClick={() => setShowNavbar(!showNavbar)}
					style={{
						background: "none",
						border: "none",
						outline: "none",
						marginLeft: "20px",
						zIndex: "47",
					}}
					className="nav-icon"
				>
					{showNavbar ? (
						<FontAwesomeIcon
							icon={faTimes}
							size="2x"
							style={
								{
									// color: "#444",
								}
							}
						/>
					) : (
						<FontAwesomeIcon
							icon={faBars}
							size="2x"
							style={
								{
									// color: "#444",
								}
							}
						/>
					)}
				</button>
			</header>
			<NavOptions showNavbar={showNavbar} setShowNavbar={setShowNavbar} />
		</>
	);
}
