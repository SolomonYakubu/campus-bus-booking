import React, { useState } from "react";
// import logo from "./logo.svg";
import { usePaystackPayment } from "react-paystack";
import QrReader from "react-qr-reader";
// import "./App.css";

const config = {
	reference: new Date().getTime().toString(),
	email: "user@example.com",
	amount: 5000,
	publicKey: "pk_test_0a4093b99f32878ae511ab0f19d32710c16702f8",
};

// you can call this function anything
const onSuccess = (reference) => {
	// Implementation for whatever you want to do with reference and after success call.
	console.log(reference);
};

// you can call this function anything
const onClose = () => {
	// implementation for  whatever you want to do when the Paystack dialog closed.
	console.log("closed");
};

const PaystackHookExample = () => {
	const initializePayment = usePaystackPayment(config);
	return (
		<div>
			<button
				onClick={() => {
					initializePayment(onSuccess, onClose);
				}}
				className="button book"
			>
				Pay #50
			</button>
		</div>
	);
};

function Pay() {
	const [result, setResult] = useState("");
	const handleError = (err) => {
		console.log(err);
	};
	const handleScan = (data) => {
		if (data) {
			setResult(data);
		}
	};
	return (
		<div className="App">
			{/* <header className="App-header">
				{/* <img src={logo} className="App-logo" alt="logo" /> */}
			{/* <p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			// </header> */}
			<PaystackHookExample />
			{/* <QrReader
				delay={300}
				onError={handleError}
				onScan={handleScan}
				style={{ width: "100%" }}
			/> */}
			<p>{result}</p>
		</div>
	);
}

export default Pay;
