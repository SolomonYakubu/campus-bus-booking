import React from "react";
import Loader from "react-loader-spinner";

export default function Spinner() {
	return (
		<>
			<div className="loader">
				<Loader type="Oval" color="#007fff" height={30} />
			</div>
		</>
	);
}
