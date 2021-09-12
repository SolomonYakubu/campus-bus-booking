import "./App.css";
import { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import User from "./components/UserLogin";

import Header from "./components/Header";
// import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Book from "./components/Book";

import UserDashboard from "./components/UserDashboard";
function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [showNavbar, setShowNavbar] = useState(false);
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
					<Header showNavbar={showNavbar} setShowNavbar={setShowNavbar} />
					<section style={{ display: showNavbar ? "none" : "block" }}>
						<Switch>
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/user">
								<User loading={loading} />
							</Route>
							<Route exact path="/user/dashboard">
								<UserDashboard loading={loading} />
							</Route>
							<Route exact path="/user/book">
								<Book loading={loading} />
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
