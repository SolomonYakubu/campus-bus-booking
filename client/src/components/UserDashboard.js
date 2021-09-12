import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
// import { usePaystackPayment } from "react-paystack";
import Swal from "sweetalert2";
import Pay from "./Pay";

export default function UserDashboard({ loading }) {
	const token = localStorage.getItem("token");
	const [data, setData] = useState({});
	const [bus, setBus] = useState([]);
	const [active, setActive] = useState(true);
	const [amount, setAmount] = useState(0);
	const [fund, setFund] = useState(false);

	const fundWallet = () => {
		Swal.fire({
			title: "Enter Amount",
			input: "number",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Fund wallet",
			showLoaderOnConfirm: true,
			preConfirm: (amount) => {
				setAmount(amount * 100);
			},
			allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
			if (result.isConfirmed) {
				setFund(true);
			}
		});
	};

	const history = useHistory();
	const getData = useCallback(async () => {
		loading(true);
		try {
			const response = await axios.get(
				// "http://localhost:8000/user",

				"http://192.168.43.244:8000/user",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// console.log(response.data);
			const { name, email, matric_number } = response.data;
			localStorage.setItem(
				"data",
				JSON.stringify({ name, email, matric_number })
			);
			setData(response.data);
			setBus(response.data.buses);
			loading(false);
		} catch (error) {
			loading(false);
			const err = error.message.split(" ")[5];

			switch (err) {
				case "401":
					history.push("/user");
					localStorage.removeItem("token");
					break;
				default:
					toast.error("Network Error");
			}
		}
	}, [token, loading, history]);

	useEffect(() => {
		getData();
		//eslint-disable-next-line
	}, []);

	const handleActive = async (val) => {
		loading(true);
		if (val === "hostel") {
			try {
				const response = await axios.get(
					"http://192.168.43.244:8000/user/bus/HtoC",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (response.status === 200) {
					setBus(response.data);
					loading(false);
					setActive(true);
				}
			} catch (error) {
				loading(false);
				toast.error("An error occured");
			}
		} else {
			try {
				const response = await axios.get(
					"http://192.168.43.244:8000/user/bus/CtoH",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (response.status === 200) {
					setBus(response.data);
					loading(false);
					setActive(false);
				}
			} catch (error) {
				loading(false);
				toast.error("An error occured");
			}
		}
	};
	const book = (id) => {
		localStorage.setItem("bus_id", id);
		history.push("/user/book");
	};
	return (
		<div
			className="container"
			style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
		>
			{!fund ? (
				<>
					<div
						style={{
							display: "flex",
							// width: "90%",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							alignSelf: "flex-end",
							marginRight: "30px",
							backgroundColor: "#fff",
							padding: "10px",
						}}
					>
						<div className="" style={{ color: "#444" }}>
							Wallet: &#8358;{data.wallet}
						</div>
						<button
							className="wallet button blue"
							style={{
								fontSize: "16px",
								fontWeight: "lighter",
								alignSelf: "flex-start",
								margin: 0,
							}}
							onClick={fundWallet}
						>
							Fund Wallet
						</button>
					</div>
					<div
						style={{
							fontSize: "22px",
							fontFamily: "flamenco",
							padding: "20px",
						}}
					>
						Where are you going to?
					</div>
					<div
						style={{
							display: "flex",
							// alignSelf: "flex-end",
							// marginRight: "20px",
							background: "#fff",
							borderRadius: "47%",
						}}
					>
						<button
							style={active ? roundButtonActive : roundButtonInActive}
							onClick={() => handleActive("hostel")}
						>
							Hostel
						</button>
						<button
							style={!active ? roundButtonActive : roundButtonInActive}
							onClick={() => handleActive("campus")}
						>
							Campus
						</button>
					</div>
					<div className="home">
						{bus
							? bus.map((item, index) => (
									<div className="dashboard-div" key={index}>
										<div
											style={{
												height: "150px",
												width: "150px",
												borderRadius: "50%",
												background: "#b3f1cb",
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
											}}
											className=""
										>
											<FontAwesomeIcon
												icon={faBus}
												size="lg"
												style={{ color: "#50c878" }}
											/>
											<b style={{ color: "#fff", fontSize: "2rem" }}>
												0{item.bus_id}
											</b>
										</div>

										{/* <div>Bus 0{item.bus_id}</div> */}
										<p>{item.departure_time ? item.departure_time : null}</p>
										<button
											className="button book"
											onClick={() => book(item.bus_id)}
										>
											Book
										</button>
									</div>
							  ))
							: null}
					</div>
				</>
			) : (
				<Pay amount={amount} loading={loading} setFund={setFund} />
			)}
		</div>
	);
}

const roundButtonActive = {
	height: "50px",
	width: "50px",
	borderRadius: "50%",
	background: "rgb(235, 50, 189)",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
	color: "#fff",
	fontFamily: "flamenco",
	margin: "5px",
	outline: "none",
};
const roundButtonInActive = {
	height: "50px",
	width: "50px",
	borderRadius: "50%",
	background: "grey",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
	color: "#fff",
	fontFamily: "flamenco",
	margin: "5px",
	outline: "none",
	opacity: "0.5",
};
