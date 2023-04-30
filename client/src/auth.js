import axios from "axios";

// verify token from localStorage
export const verifyToken = async () => {
	if (localStorage.getItem('appToken') == null) {
		return false
	}
	return await axios.post(process.env.REACT_APP_API_URL + '/api/login/verify', { 
		withCredentials: true,
		appToken: localStorage.getItem('appToken') })
		.then((response) => {
			console.log(response);
			return true;
		}, (error) => {
			console.log(error);
			return false; //caso a resposta seja um erro, retornar falso, para que os dados sejam apagados do localstorage
		});	
};