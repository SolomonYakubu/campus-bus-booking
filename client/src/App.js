import "./App.css";
import { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import User from "./components/UserLogin";
import Pay from "./components/Pay";
import QRCode from "qrcode.react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import UserDashboard from "./components/UserDashboard";
function App() {
	const [isLoading, setIsLoading] = useState(false);
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
				<Header />

				<Router>
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
					</Switch>
				</Router>
			</div>
		</>
	);
}

export default App;
