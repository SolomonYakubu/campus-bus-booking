import React from "react";
import Loader from "react-loader-spinner";

export default function Spinner() {
	return (
		<>
			<div className="loader">
				<Loader type="TailSpin" color="#007fff" height={50} />
			</div>
		</>
	);
}
