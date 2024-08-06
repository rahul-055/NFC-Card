const initialState = {
    app: {
        name: '',
        types: [
            {
                logo: '',
                appname: '',
            }
        ],
    },
    listApp: [],
    spinner: true,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'HANDLE_INPUT_CHANGE_APP':
            return Object.assign({}, state, {
                app: {
                    ...state.app,
                    [action.name]: action.value
                }
            })
        case 'LIST_APP':
            return {
                ...state,
                listApp: action.payload,
                spinner: false
            }
        case 'VIEW_APP':
            return Object.assign({}, state, {
                app: action.payload,
                spinner: false
            })
        case 'APP_SPINNER':
            return Object.assign({}, state, {
                spinner: true
            })
        case 'EMPTY_APP':
            return Object.assign({}, state, {
                app: {
                    name: '',
                    sortorder: '',
                    types: [
                        {
                            logo: '',
                            appname: '',
                            inputtype: '',
                        }
                    ],
                },
                spinner: false
            })

        default:
            return state;
    }
}