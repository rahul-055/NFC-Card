import axios from 'axios';
import ImportedURL from '../common/api';
import { Success, Error } from '../common/swal';

export function AC_LIST_ENQUIRY() {
	return function (dispatch) {
		return axios.get(ImportedURL.API.listEnquiry)
			.then((res) => {
				dispatch({ type: "LIST_ENQUIRY", payload: res.data })
			}).catch(({ response }) => { console.log(response); });
	};
}

export function AC_VIEW_ENQUIRY(id) {
    return function (dispatch) {
        axios.get(ImportedURL.API.viewEnquiry + "/" + id)
            .then(({ data }) => { 
                dispatch({ type: 'VIEW_ENQUIRY', payload: data });
            });
    }
}

export function AC_ENQUIRY_SPINNER() {
	return function (dispatch) {
		dispatch({ type: "ENQUIRY_SPINNER" })
	};
}