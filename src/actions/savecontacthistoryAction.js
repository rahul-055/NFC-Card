import axios from 'axios';
import ImportedURL from '../common/api';
import { Success, Error } from '../common/swal';

export function AC_LIST_SAVE_CONTACT_HISTORY() {
	return function (dispatch) {
		return axios.get(ImportedURL.API.getSaveContactHistory)
			.then((res) => {
				dispatch({ type: "LIST_SAVE_CONTACT_HISTORY", payload: res.data })
			}).catch(({ response }) => { console.log(response); });
	};
}

export function AC_VIEW_SAVE_CONTACT_HISTORY(id) {
    return function (dispatch) {
        axios.get(ImportedURL.API.ViewSaveContactHistory + "/" + id)
            .then(({ data }) => { 
                dispatch({ type: 'VIEW_SAVE_CONTACT_HISTORY', payload: data });
            });
    }
}

export function AC_SAVE_CONTACT_HISTORY_SPINNER() {
	return function (dispatch) {
		dispatch({ type: "SAVE_CONTACT_HISTORY_SPINNER" })
	};
}