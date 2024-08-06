import axios from 'axios';
import ImportedURL from '../common/api';
// import { Success, Error } from '../common/swal';

export function AC_ACCOUNT_DETAILS() {
	return function (dispatch) {
		return axios.get(ImportedURL.API.accountDetails)
			.then((res) => {
				dispatch({ type: "ACCOUNT_DETAILS", payload: res.data })
			}).catch(({ response }) => { console.log(response); });
	};
}

export function AC_PREVILEGE_DETAILS() {
	return function (dispatch) {
		return axios.get(ImportedURL.API.getPrevileges)
			.then((res) => {
				dispatch({ type: "PREVILEGE_DETAILS", payload: res.data })
			}).catch(({ response }) => { console.log(response); });
	};
}

export function AC_HANDLE_INPUT_CHANGE(name, value) {
	return function (dispatch) {
		dispatch({ type: "HANDLE_INPUT_CHANGE", name: name, value: value });
	};
}

export function AC_HANDLE_INPUT_CHANGE_ADMIN(name, value) {
	return function (dispatch) {
		dispatch({ type: "HANDLE_INPUT_CHANGE_ADMIN", name: name, value: value });
	};
}