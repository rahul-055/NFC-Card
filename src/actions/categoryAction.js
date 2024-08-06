import axios from 'axios';
import ImportedURL from '../common/api';
import { Success, Error } from '../common/swal';

export function AC_HANDLE_CATEGORY_CHANGE(name, value) {
	return function (dispatch) {
		dispatch({ type: "HANDLE_CATEGORY_CHANGE", name: name, value: value })
	};
}

export function AC_HANDLE_CATEGORY_SEARCH(value) {
	return function (dispatch) {
		dispatch({ type: "HANDLE_CATEGORY_SEARCH", value: value })
	};
}

export function AC_RESET_CATEGORY() {
	return function (dispatch) {
		dispatch({ type: "RESET_CATEGORY" })
	};
}

export function AC_ADD_CATEGORY(formData) {
	return function (dispatch) {
		return axios.post(ImportedURL.API.addCategory, formData)
			.then((res) => {
				Success('Category created successfully');
				// Success(res.statusText);
				dispatch({ type: "LIST_CATEGORY", payload: res.data })
				dispatch({ type: "RESET_CATEGORY" })
			}).catch(({ response }) => {
				if (response.status == 409) {
					Error('Category already exist')
				} else if (response.status == 400) {
					Error('Bad request')
				}
				// Error(response.statusText)
			});
	};
}

export function AC_LIST_CATEGORY() {
	return function (dispatch) {
		return axios.get(ImportedURL.API.listCategory)
			.then((res) => {
				dispatch({ type: "LIST_CATEGORY", payload: res.data, spinner: false })
			}).catch((err) => { console.log(err); });
	};
}



export function AC_LIST_CATEGORY_DRAG_DROP(formData) {
	return function (dispatch) {
		return axios.post(ImportedURL.API.listCategoryDragDrop, formData)
			.then((res) => {
				dispatch({ type: "LIST_CATEGORY", payload: res.data, spinner: false })
			}).catch((err) => { console.log(err); });
	};
}

export function AC_VIEW_CATEGORY(id) {
	return function (dispatch) {
		return axios.get(ImportedURL.API.viewCategory + "/" + id)
			.then((res) => {
				dispatch({ type: "VIEW_CATEGORY", payload: res.data, spinner: false })
			}).catch((err) => { console.log(err); });
	};
}

export function AC_UPDATE_CATEGORY(formData, id) {
	return function (dispatch) {
		return axios.post(ImportedURL.API.updateCategory + "/" + id, formData)
			.then((res) => {
				Success('Category updated successfully');
				// Success(res.statusText);
				dispatch({ type: "LIST_CATEGORY", payload: res.data })
			}).catch((err) => { console.log(err); });
	};
}

// export function AC_DELETE_CATEGORY(id) {
// 	return function (dispatch) {
// 		return axios.get(ImportedURL.API.deleteCategory + "/" + id)
// 			.then((res) => {
// 				Success(res.statusText);
// 				dispatch({ type: "LIST_CATEGORY", payload: res.data })
// 			}).catch((err) => { console.log(err); });
// 	};
// }

export function AC_CHANGE_PREVILEGE(index, key) {
	return function (dispatch) {
		dispatch({ type: "CHANGE_PREVILEGE_CATEGORY", index, key });
	};
}
export function AC_EMPTY_CATEGORY() {
	return function (dispatch) {
		dispatch({ type: "EMPTY_CATEGORY" })
	};
}