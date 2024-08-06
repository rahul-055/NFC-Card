import axios from 'axios';
import ImportedURL from '../common/api';
import { Success, Error } from '../common/swal';

export function AC_HANDLE_INPUT_CHANGE_PROFILE(name, value) {
    return function (dispatch) {
        dispatch({ type: "HANDLE_INPUT_CHANGE_PROFILE", name: name, value: value });
    };
}

export function AC_VIEW_PROFILE(params = {}) {
    return function (dispatch) {
        return axios.get(ImportedURL.API.viewProfile, { params: params })
            .then((res) => {
                dispatch({ type: "VIEW_PROFILE", payload: res.data, socialmedia: (res.data.sociallink != undefined && res.data.sociallink && res.data.sociallink.length > 0) ? res.data.sociallink : [] })
            }).catch(({ response }) => { console.log(response); });
    };
}

export function AC_VIEW_PROFILE_UNIQUEID(id) {
    return function (dispatch) {
        return axios.get(ImportedURL.API.viewProfileUniqueId + "/" + id)
            .then((res) => {
                console.log('res.data', res.data);
                dispatch({ type: "VIEW_PROFILE_UNIQUEID", payload: res.data, })
            }).catch(({ response }) => { console.log(response); });
    };
}

export function AC_VIEW_PROFILE_USERNAME(id) {
    return function (dispatch) {
        return axios.get(ImportedURL.API.viewProfileUserName + "/" + id,)
            .then((res) => {
                dispatch({ type: "VIEW_PROFILE_USERNAME", payload: res.data, })
            }).catch(({ response }) => { console.log(response); });
    };
}

export function AC_VIEW_USER(id) {
    return function (dispatch) {
        return axios.get(ImportedURL.API.viewUser + "/" + id)
            .then((res) => {
                dispatch({ type: "VIEW_USER", payload: res.data, })
            }).catch(({ response }) => { console.log(response); });
    };
}

export function AC_DRAG_SOCIALMEDIA_LIST(formData) {
    return function (dispatch) {
        return axios.post(ImportedURL.API.listSocialMediaDrag, formData)
            .then((res) => {
                dispatch({ type: "DRAG_SOCIALMEDIA_LIST", payload: res.data })
            }).catch(({ response }) => { console.log(response); });
    };
}

export function AC_LIST_PROFILE(params = {}) {
    return function (dispatch) {
        return axios.get(ImportedURL.API.listUser, { params: params })
            .then((res) => {
                dispatch({ type: "LIST_PROFILE", payload: res.data })
            }).catch(({ response }) => { console.log(response); });
    };
}

export function AC_USER_SPINNER() {
    return function (dispatch) {
        dispatch({ type: "USER_SPINNER" })
    };
}

export function AC_PROFILE_SPINNER() {
    return function (dispatch) {
        dispatch({ type: "PROFILE_SPINNER" })
    };
}

export function AC_EMPTY_USER() {
    return function (dispatch) {
        dispatch({ type: "EMPTY_USER" })
    };
}

export function AC_HANDLE_INPUT_CHANGE_SETTINGS(value) {
    return function (dispatch) {
        dispatch({ type: "HANDLE_INPUT_CHANGE_SETTINGS", value: value });
    };
}

export function AC_HANDLE_INPUT_CHANGE_BROCHURE(value) {
    return function (dispatch) {
        dispatch({ type: "HANDLE_INPUT_CHANGE_BROCHURE", value: value });
    };
}