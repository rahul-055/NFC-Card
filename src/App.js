import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import './assets/css/admin.css'
import Layout from './components/Shared/Layout';
import Login from './components/Authentication/login';
import ForgotPassword from './components/Authentication/forgotpassword';
import NotFound from './components/Authentication/404';
import InternalServer from './components/Authentication/500';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { AC_ACCOUNT_DETAILS, AC_PREVILEGE_DETAILS } from './actions/accountAction';
import Index from './acwcard_landing';
import axios from 'axios';
import ImportedURL from './common/api';
import { AC_VIEW_PROFILE, AC_VIEW_PROFILE_UNIQUEID, AC_VIEW_PROFILE_USERNAME } from './actions/profileAction';
import account from './acwcard_client_side/account/account';
import profile from './acwcard_client_side/profile/profile';
import preview from './acwcard_client_side/account/preview';
import settings from './acwcard_client_side/settings/settings';
import brochure from './acwcard_client_side/brochure/brochure';
import Uniqueid from './acwcard_client_side/uniqueid/uniqueid';
import Signup from './acwcard_client_side/auth/signup';
import Private from './acwcard_client_side/account/private';
import Invalid from './acwcard_client_side/account/invalid';

const token = localStorage.getItem("acwtoken");
const type = localStorage.getItem('type');
const urlPath = window.location.href.split('/')[3]
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initial: false,
			uniqueState: false,
			usernameStatus: false,
			privateStatus: false,
			notfoundStatus: false,
			uniqueSignUp: false,
			loginStatus: false,
			navigationLink: [
				"admin", "profile", 'account', "accountsetting", "signup", "login", "preview", "#works", "#", "#features", "#enquiry", "forgotpassword", "brochure"
			]
		}
	}
	componentDidMount() {
		// setTimeout(() => {
		// 	this.props.ViewProfile({ reverseStatus: true });
		// }, 300000);

		const unique = window.location.href.split('/')[3]
		if (unique) {
			if ((unique.includes('&uId=')) && (unique.includes('cardType='))) {
				let uniqueid = unique.split('&uId=')[1]
				if (uniqueid.length > 12) {
					let id = uniqueid.substring(0, 12);
					let cardtype = (unique.split('&uId=')[0]).split('cardType=')[1]
					window.location.href = "/?cardType=" + cardtype + "&uId=" + id;
				} else {
					axios.get(ImportedURL.API.viewProfileUniqueId + "/" + uniqueid, { params: { group: true } })
						.then((res) => {
							console.log('res.data.isinfostatus', res.data.isinfostatus);
							if (res.data.isinfostatus != undefined && res.data.isinfostatus) {
								// setTimeout(() => {
								// 	this.props.ProfileUnique(uniqueid)
								// 	this.props.ViewProfile({ reverseStatus: true });
								// }, 10000);
								axios.post(ImportedURL.API.updateTapCardStatus, { tapStatus: true })
									.then((res) => {
									}).catch(({ response }) => {
										if (response) {
											Error('Bad request')
										}
									});
							}
							if (res.data.uniqueid != undefined) {
								this.props.ProfileUnique(uniqueid)
								this.setState({ uniqueState: true, uniqueSignUp: false })
							} else {
								this.setState({ uniqueState: true, uniqueSignUp: true })
								if (token) {
									localStorage.removeItem('acwtoken');
									localStorage.removeItem('type');
									window.location.href = "/" + unique;
								}
							}
						}).catch(({ response }) => { console.log(response); });
				}
			} else {
				axios.get(ImportedURL.API.viewPrivateAccount + "/" + unique)
					.then((res) => {
						if (res.data.id != undefined && res.data.id) {
							this.props.ProfileUsername(res.data.id)
							this.setState({ usernameStatus: true, privateStatus: res.data.status })
						} else {
							if (this.state.navigationLink.includes(unique)) {
								if (token) {
									if (unique == 'login') {
										window.location.href = "/account";
									}
								}
								this.setState({ notfoundStatus: false })
							} else {
								const finalValue = window.location.href.split('/')[4]
								if (!finalValue) {
									this.setState({ notfoundStatus: true })
								}
							}
						}
					}).catch(({ response }) => { console.log(response); });
			}
		}

		if (token) {
			this.props.AccountDetails();
		}
	}
	render() {
		const { darkMode, boxLayout, darkSidebar, iconColor, gradientColor, rtl, fontType } = this.props;
		if (this.state.uniqueState) {
			return (
				<>
					<Router>
						{(this.state.uniqueSignUp) ? <Switch> <Signup /></Switch> : <Switch> <Uniqueid /></Switch>}
					</Router>
				</>
			)
		} else if (this.state.usernameStatus) {
			return (
				<>
					<Router>
						{(this.state.privateStatus) ? <Switch><Uniqueid /></Switch> : <Switch><Private /></Switch>}
					</Router>
				</>
			)
		} else if (this.state.notfoundStatus) {
			return (<><Router><Invalid /></Router></>)
		} else {
			return (
				<div className={`${darkMode ? "dark-mode" : ""}${darkSidebar ? "" : "sidebar_dark"} ${iconColor ? "iconcolor" : ""} ${gradientColor ? "gradient" : ""} ${rtl ? "rtl" : ""} ${fontType ? fontType : ""}${boxLayout ? "boxlayout" : ""}`}>
					<Router>
						{token ?
							<>
								{(type == 'admin') ?
									<>
										{urlPath ?
											<Switch>
												<Route path="/notfound" component={NotFound} />
												<Route path="/internalserver" component={InternalServer} />
												<Route path="/admin" component={Layout} />
											</Switch>
											:
											<Route path="/" component={Index} />
										}
									</>
									:
									<>
										<Switch>
											<Route path="/account" component={account} />
											<Route path="/profile" component={profile} />
											<Route path="/preview" component={preview} />
											<Route path="/accountsetting" component={settings} />
											<Route path="/brochure" component={brochure} />
											<Route path="/" component={Index} />
										</Switch>
									</>
								}
							</>
							:
							<Switch>
								<Route path="/login" component={Login}></Route>
								<Route path="/login/:id" component={Login}></Route>
								<Route path="/brochure" component={brochure} />
								<Route exact path="/forgotpassword" component={ForgotPassword} />
								<Route path="/" component={Index} />
							</Switch>
						}
					</Router>
				</div>
			);
		}
	}
}
const mapStateToProps = state => ({
	darkMode: state.settings.isDarkMode,
	darkSidebar: state.settings.isDarkSidebar,
	iconColor: state.settings.isIconColor,
	gradientColor: state.settings.isGradientColor,
	rtl: state.settings.isRtl,
	fontType: state.settings.isFont,
	boxLayout: state.settings.isBoxLayout,
	notification: state.notification
})

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		AccountDetails: AC_ACCOUNT_DETAILS,
		PrevilegesDetails: AC_PREVILEGE_DETAILS,
		ProfileUnique: AC_VIEW_PROFILE_UNIQUEID,
		ProfileUsername: AC_VIEW_PROFILE_USERNAME,
		ViewProfile: AC_VIEW_PROFILE,
	}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)