import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
	return (
		<header>
			<FontAwesomeIcon
				icon={faBars}
				size="2x"
				style={{
					color: "#fff",
					marginRight: "20px",
				}}
			/>
		</header>
	);
}
