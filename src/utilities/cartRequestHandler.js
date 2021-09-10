import axios from "axios";
export async function cartHandler(query, productDetails, cartDispatch) {
	const accessToken = JSON.parse(localStorage.getItem("accessToken"));
	switch (query) {
		case "ADD_TO_CART":
			try {
				const serverReponse = await axios.post(
					process.env.REACT_APP_SERVER_URL + "/cart/add-to-cart",
					{
						product: productDetails,
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				cartDispatch(serverReponse.data.data);
			} catch (error) {
				console.log(error.response);
			}
			break;
		case "INCREASE_COUNT":
			try {
				alert("running");
				const serverReponse = await axios.post(
					process.env.REACT_APP_SERVER_URL + "/cart/increase-count",
					{
						product: productDetails,
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				cartDispatch(serverReponse.data.data);
			} catch (error) {
				console.log(error);
			}
			break;
		case "REMOVE_FROM_CART":
			try {
				alert("running");
				const serverReponse = await axios.post(
					process.env.REACT_APP_SERVER_URL + "/cart/decrease-count",
					{
						product: productDetails,
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				cartDispatch(serverReponse.data.data);
			} catch (error) {
				console.log(error);
			}
			break;

		case "DELETE_FROM_CART":
			try {
				const serverReponse = await axios.delete(
					process.env.REACT_APP_SERVER_URL + "/cart/delete-from-cart",

					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
						data: {
							product: productDetails,
						},
					}
				);

				cartDispatch(serverReponse.data.data);
			} catch (error) {
				console.log(error);
			}
			break;

		default:
			break;
	}
}
