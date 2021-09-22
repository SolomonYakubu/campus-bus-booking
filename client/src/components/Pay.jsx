import { usePaystackPayment } from "react-paystack";
import { useEffect } from "react";
import axios from "axios";
export default function Pay({ amount, loading, setFund }) {
	const data = JSON.parse(localStorage.getItem("data"));
	const initializePayment = usePaystackPayment({
		reference: new Date().getTime().toString(),
		email: data.email,
		amount: amount,
		publicKey: "pk_test_0a4093b99f32878ae511ab0f19d32710c16702f8",
	});
	useEffect(() => {
		return () => setFund(false);
	}, [setFund]);
	const onSuccess = (reference) => {
		loading(true);
		const check = async () => {
			try {
				await axios.post(
					`http://localhost:8000/user/wallet/fund`,
					{ reference_id: reference.reference },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				loading(false);
				window.location.reload();
			} catch (error) {
				loading(false);
				window.location.reload();
			}
		};
		check();
	};

	const onClose = () => {
		loading(false);
		setFund(false);
		window.location.reload();
	};
	initializePayment(onSuccess, onClose);
	return <div>{loading(true)}</div>;
}
