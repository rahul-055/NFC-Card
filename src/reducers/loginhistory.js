const initialState = {
    listLoginHistory: [],
    spinner: true,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LIST_LOGIN_HISTORY':
            return {
                ...state,
                listLoginHistory: action.payload,
                spinner: false
            }
        case 'LOGIN_HISTORY_SPINNER':
            return Object.assign({}, state, {
                spinner: true
            })

        default:
            return state;
    }
}