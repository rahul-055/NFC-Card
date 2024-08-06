const initialState = {
    viewSaveContactHistory: {},
    listSaveContactHistory: [],
    spinner: true,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LIST_SAVE_CONTACT_HISTORY':
            return {
                ...state,
                listSaveContactHistory: action.payload,
                spinner: false
            }
        case 'SAVE_CONTACT_HISTORY_SPINNER':
            return Object.assign({}, state, {
                spinner: true
            })
        case 'VIEW_SAVE_CONTACT_HISTORY':
            return Object.assign({}, state, {
                viewSaveContactHistory: action.payload,
                spinner: false
            })

        default:
            return state;
    }
}