const initialState = {
    viewEnquiry: {},
    listEnquiry: [],
    spinner: true,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LIST_ENQUIRY':
            return {
                ...state,
                listEnquiry: action.payload,
                spinner: false
            }
        case 'ENQUIRY_SPINNER':
            return Object.assign({}, state, {
                spinner: true
            })
        case 'VIEW_ENQUIRY':
            return Object.assign({}, state, {
                viewEnquiry: action.payload,
                spinner: false
            })

        default:
            return state;
    }
}