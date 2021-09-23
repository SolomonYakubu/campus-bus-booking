// import { ReactPropTypes } from "react";
import axios from "axios";

const useQuery = (option, auth, loading) => {
	// const [token, setToken] = useState("");

	// const [loading, setLoading] = useState(true);
	let token;
	const runQuery = async () => {
		// let response;
		if (auth.auth) {
			switch (auth.type) {
				case "user":
					token = localStorage.getItem("token");
					break;
				case "driver":
					token = localStorage.getItem("driverToken");
					break;
				case "admin":
					token = localStorage.getItem("adminToken");
					break;
				default:
					token = "";
			}
		}

		switch (option.method) {
			case "post":
				try {
					loading(true);
					const response = await axios.post(
						// "user/login",
						option.url,
						option.body,
						auth.auth
							? {
									headers: {
										Authorization: `Bearer ${token}`,
									},
							  }
							: null
					);
					loading(false);
					return { data: response.data, status: response.status };
				} catch (error) {
					loading(false);
					const err = error.message.split(" ")[5];
					throw new Error(err);
				}
				break;
			case "get":
				try {
					loading(true);
					const response = await axios.get(
						// "user/login",
						option.url,
						auth.auth
							? {
									headers: {
										Authorization: `Bearer ${token}`,
									},
							  }
							: null
					);
					loading(false);
					return { data: response.data, status: response.status };
				} catch (error) {
					loading(false);
					const err = error.message.split(" ")[5];

					throw new Error(+err);
				}
			default:
				return null;
		}
	};
	// useEffect(() => runQuery, [runQuery]);
	return runQuery;
};

export default useQuery;
