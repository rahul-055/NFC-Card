const initialState = {
	profile: {
		username: '',
		email: '',
		password: '',
		displayname: '',
		headline: '',
		image: '',
		banner: '',
		workcompany: '',
		worktitle: '',
		qualification: '',
		course: '',
		location: '',
		skill: [],
		applink: [],
		applinkstatus: [],
		ispublicprofile: false,
		iswork: false,
		iseducation: false,
		islocation: false,
		isskills: false,
		issociallinks: false,
		hotelid: '',
		email: '',
		barcodeQr : '',
		barcodeVal : ''
	},
	listUser: [],
	socailmedialist: [],
	role: '',
	spinner: true,
	settingOption: 'account',
	brochure: 'signup',
}

export default (state = initialState, action) => {
	switch (action.type) {
		case 'HANDLE_INPUT_CHANGE_PROFILE':
			return Object.assign({}, state, {
				profile: {
					...state.profile,
					[action.name]: action.value
				}
			})
		case 'HANDLE_INPUT_CHANGE_SETTINGS':
			return Object.assign({}, state, {
				settingOption: action.value
			})
		case 'HANDLE_INPUT_CHANGE_BROCHURE':
			return Object.assign({}, state, {
				brochure: action.value
			})
		case "VIEW_PROFILE":
			return Object.assign({}, state, {
				profile: action.payload,
				socailmedialist: action.socialmedia,
				spinner: false
			});
		case "VIEW_PROFILE_UNIQUEID":
			return Object.assign({}, state, {
				profile: action.payload,
				spinner: false
			});
		case "VIEW_PROFILE_USERNAME":
			return Object.assign({}, state, {
				profile: action.payload,
				spinner: false
			});
		case "VIEW_USER":
			return Object.assign({}, state, {
				profile: action.payload,
				spinner: false
			});
		case "DRAG_SOCIALMEDIA_LIST":
			return Object.assign({}, state, {
				socailmedialist: action.payload,
				spinner: false
			});
		case 'LIST_PROFILE':
			return {
				...state,
				listUser: action.payload,
				spinner: false
			}
		case 'USER_SPINNER':
			return Object.assign({}, state, {
				spinner: true
			})
		case 'PROFILE_SPINNER':
			return Object.assign({}, state, {
				spinner: true
			})
		case 'EMPTY_USER':
			return Object.assign({}, state, {
				profile: {
					username: '',
					email: '',
					password: '',
					displayname: '',
					headline: '',
					image: '',
					banner: '',
					workcompany: '',
					worktitle: '',
					qualification: '',
					course: '',
					location: '',
					skill: [],
					sociallink: [],
					ispublicprofile: false,
					iswork: false,
					iseducation: false,
					islocation: false,
					isskills: false,
					issociallinks: false,
					hotelid: '',
					email: '',
				},
				spinner: false

			})

		default:
			return state;
	}
}