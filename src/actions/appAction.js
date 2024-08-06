import axios from 'axios';
import ImportedURL from '../common/api';
import { Success, Error } from '../common/swal';

export function AC_LIST_APP() {
	return function (dispatch) {
		return axios.get(ImportedURL.API.listApp)
			.then((res) => {
				dispatch({ type: "LIST_APP", payload: res.data })
			}).catch(({ response }) => { console.log(response); });
	};
}

export function AC_VIEW_APP(id) {
    return function (dispatch) {
        axios.get(ImportedURL.API.viewApp + "/" + id)
            .then(({ data }) => { 
                dispatch({ type: 'VIEW_APP', payload: data });
            });
    }
}

export function AC_APP_SPINNER() {
	return function (dispatch) {
		dispatch({ type: "APP_SPINNER" })
	};
}

export function AC_EMPTY_APP() {
	return function (dispatch) {
		dispatch({ type: "EMPTY_APP" })
	};
}

export function AC_HANDLE_INPUT_CHANGE_APP(name, value) {
	return function (dispatch) {
		dispatch({ type: "HANDLE_INPUT_CHANGE_APP", name: name, value: value });
	};
}