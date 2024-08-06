import CONSTANTS from "../common/constants";
const initialState = {
	// account: {
	// 	name: '',
	// 	hotelid: '',
	// 	email: '',
	// 	location: '',
	// 	role: '',
	// 	status: '',
	// },

	account: {
		name: '',
		hotelid: '',
		email: '',
		location: '',
		_id: '',
	},
	username: "",
	role: '',
	loginHistory: [],
	spinner: true,
	previleges: CONSTANTS.previleges,

}

export default (state = initialState, action) => {

	switch (action.type) {
		case 'HANDLE_INPUT_CHANGE_PROFILE':
			return Object.assign({}, state, {
				account: {
					...state.account,
					[action.name]: action.value
				}
			})
		case 'HANDLE_INPUT_CHANGE_ADMIN':
			return Object.assign({}, state, {
				account: {
					...state.account,
					[action.name]: action.value
				}
			})
		case 'ACCOUNT_DETAILS':
			return Object.assign({}, state, {
				account: action.payload,
				username: action.payload.username ? action.payload.username : "",
				spinner: false
			})


		case 'ACCOUNT_DETAILS':
			return Object.assign({}, state, {
				account: action.payload
			})
		case 'PREVILEGE_DETAILS':
			return Object.assign({}, state, {
				previleges: action.payload.previleges
			})
		default:
			return state;
	}
}