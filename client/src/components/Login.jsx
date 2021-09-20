const Login = ({ id, password, setId, setPassword, login, isLoginEmpty }) => {
	return (
		<>
			<input
				type="text"
				className="input"
				value={id}
				onChange={(e) => setId(e.target.value)}
				placeholder="Email or Matric No"
				required
			/>
			<input
				type="password"
				className="input"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				required
			/>
			<button
				className="button login-btn"
				onClick={login}
				style={{ opacity: isLoginEmpty ? "0.6" : "1" }}
			>
				Login
			</button>
		</>
	);
};

export default Login;
