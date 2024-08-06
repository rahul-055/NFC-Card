import axios from 'axios';
import ImportedURL from '../common/api';
import { Success, Error } from '../common/swal';

export function AC_LIST_LOGIN_HISTORY() {
	return function (dispatch) {
		return axios.get(ImportedURL.API.getLoginHistory)
			.then((res) => {
				dispatch({ type: "LIST_LOGIN_HISTORY", payload: res.data })
			}).catch(({ response }) => { console.log(response); });
	};
}

export function AC_LOGIN_HISTORY_SPINNER() {
	return function (dispatch) {
		dispatch({ type: "LOGIN_HISTORY_SPINNER" })
	};
}