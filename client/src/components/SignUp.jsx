const SignUp = ({
	name,
	matric,
	email,
	password,
	setName,
	setEmail,
	setMatric,
	setPassword,
	signUp,
	isSignUpEmpty,
}) => {
	return (
		<>
			<input
				type="text"
				className="input"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Name"
			/>
			<input
				type="text"
				className="input"
				value={matric}
				onChange={(e) => setMatric(e.target.value)}
				placeholder="Matric Number"
			/>
			<input
				type="email"
				className="input"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
			/>
			<input
				type="password"
				className="input"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
			/>
			<button
				className="button login-btn"
				onClick={signUp}
				style={{ opacity: isSignUpEmpty ? "0.6" : "1" }}
			>
				Sign Up
			</button>
		</>
	);
};
export default SignUp;
