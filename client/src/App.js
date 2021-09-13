import "./App.css";
import { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import User from "./components/UserLogin";

import Header from "./components/Header";
// import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Book from "./components/Book";
import DriverLogin from "./components/DriverLogin";
import DriverDashboard from "./components/DriverDashboard";
import Ticket from "./components/Ticket";

import Swal from "sweetalert2";
import UserDashboard from "./components/UserDashboard";
function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [showNavbar, setShowNavbar] = useState(false);
	const [wallet, setWallet] = useState("");
	const [amount, setAmount] = useState("");
	const [fund, setFund] = useState(false);
	const fundWallet = () => {
		setShowNavbar(false);
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

	const loading = (val) => {
		val ? setIsLoading(true) : setIsLoading(false);
	};

	return (
		<>
			{isLoading ? <Loader /> : null}
			<div
				className="App"
				style={{
					opacity: isLoading ? "0.1" : "1",
					pointerEvents: isLoading ? "none" : "all",
				}}
			>
				<Router>
					<Header
						showNavbar={showNavbar}
						setShowNavbar={setShowNavbar}
						wallet={wallet}
						fundWallet={fundWallet}
					/>
					<section style={{ display: showNavbar ? "none" : "block" }}>
						<Switch>
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/user">
								<User loading={loading} />
							</Route>
							<Route exact path="/user/dashboard">
								<UserDashboard
									loading={loading}
									setWallet={setWallet}
									fund={fund}
									setFund={setFund}
									amount={amount}
								/>
							</Route>
							<Route exact path="/user/book">
								<Book loading={loading} />
							</Route>
							<Route exact path="/driver">
								<DriverLogin loading={loading} />
							</Route>
							<Route exact path="/driver/dashboard">
								<DriverDashboard loading={loading} />
							</Route>
							<Route exact path="/user/ticket">
								<Ticket loading={loading} />
							</Route>
						</Switch>
					</section>
				</Router>
				{/* <Footer /> */}
			</div>
		</>
	);
}

export default App;
