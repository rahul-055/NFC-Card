import CONSTANTS from "../common/constants";
const initialState = {
	category: {
		name: '',
		id: '',
		previleges: CONSTANTS.previleges,
		status: 1,
	},
	listcategories: [],
	listfilter: [],
	spinner: true
}

export default (state = initialState, action) => {
	switch (action.type) {
		case 'HANDLE_CATEGORY_CHANGE':
			return Object.assign({}, state, {
				category: {
					...state.category,
					[action.name]: action.value
				}
			})
		case 'RESET_CATEGORY':
			return Object.assign({}, state, {
				category: initialState.category
			})
		case 'HANDLE_CATEGORY_SEARCH':
			return Object.assign({}, state, {
				listcategories: action.value
			})
		case 'LIST_CATEGORY':
			return Object.assign({}, state, {
				listcategories: action.payload,
				listfilter: action.payload,
				spinner: action.spinner,
			})
		case 'VIEW_CATEGORY':
			return Object.assign({}, state, {
				category: action.payload,
				spinner: action.spinner,

			})
		case 'EMPTY_CATEGORY':
			return Object.assign({}, state, {
				category: {
					name: '',
					previleges: CONSTANTS.previleges,
				},
				spinner: true
			})
		case "CHANGE_PREVILEGE_CATEGORY":
			var _i = action.index;
			return {
				...state,
				category: {
					...state.category,
					previleges: [
						...state.category.previleges.slice(0, _i),
						{
							...state.category.previleges[_i],
							[action.key]: !state.category.previleges[_i][action.key]
						},
						...state.category.previleges.slice(_i + 1),
					]
				}
			}
			break;
		default:
			return state;
	}
}