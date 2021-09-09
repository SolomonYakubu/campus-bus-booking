import React from "react";
import QRCode from "qrcode.react";
export default function Ticket() {
	const ticket = JSON.parse(localStorage.getItem("ticket"));
	const data = JSON.parse(localStorage.getItem("data"));
	console.log(ticket);
	console.log(data);
	return (
		<div className="container">
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-between",
					fontFamily: "Buenard",
					fontSize: "18px",
					background: "#fff",
					padding: "20px",
					width: "80%",
					height: "60vh",
					color: "#666",
				}}
			>
				<div style={{ fontSize: "22px", fontWeight: "bold" }}>Ticket</div>
				<div>Name: {data.name}</div>
				<div>Matric Number: {data.matric_number}</div>
				<div>Ticket ID: {ticket.code}</div>
				<div>Bus ID: {ticket.bus_id}</div>
				<div>Seat: {ticket.seat}</div>
				{ticket.code ? <QRCode value={ticket.code} /> : null}
			</div>
		</div>
	);
}
