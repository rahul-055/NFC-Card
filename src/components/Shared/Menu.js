import React, { Component } from 'react';
import { connect } from 'react-redux';
import MetisMenu from 'react-metismenu';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import DefaultLink from './DefaultLink';

import {
	darkModeAction, darkHeaderAction, fixNavbarAction,
	darkMinSidebarAction, darkSidebarAction, iconColorAction,
	gradientColorAction, rtlAction, fontAction,
	subMenuIconAction,
	menuIconAction,
	boxLayoutAction,
	statisticsAction, friendListAction,
	statisticsCloseAction, friendListCloseAction, toggleLeftMenuAction
} from '../../actions/settingsAction';
import Path from '../Route';

const masterNone = {
	display: 'none',
};

const masterBlock = {
	display: 'block',
};

const MissingRoute = () => {
	return <Redirect to='/notFound' />;
}

class Menu extends Component {
	constructor(props) {
		super(props);
		this.toggleLeftMenu = this.toggleLeftMenu.bind(this);
		this.toggleUserMenu = this.toggleUserMenu.bind(this);
		this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
		this.toggleSubMenu = this.toggleSubMenu.bind(this);
		this.handleDarkMode = this.handleDarkMode.bind(this);
		this.handleFixNavbar = this.handleFixNavbar.bind(this);
		this.handleDarkHeader = this.handleDarkHeader.bind(this);
		this.handleMinSidebar = this.handleMinSidebar.bind(this);
		this.handleSidebar = this.handleSidebar.bind(this);
		this.handleIconColor = this.handleIconColor.bind(this);
		this.handleGradientColor = this.handleGradientColor.bind(this);
		this.handleRtl = this.handleRtl.bind(this);
		this.handleFont = this.handleFont.bind(this);
		this.handleStatistics = this.handleStatistics.bind(this);
		this.handleFriendList = this.handleFriendList.bind(this);
		this.closeFriendList = this.closeFriendList.bind(this);
		this.closeStatistics = this.closeStatistics.bind(this);
		this.handleBoxLayout = this.handleBoxLayout.bind(this);
		this.handler = this.handler.bind(this);
		this.state = {
			isToggleLeftMenu: false,
			isOpenUserMenu: false,
			isOpenRightSidebar: false,
			isBoxLayout: false,
			parentlink: null,
			childlink: null,
		};
	}

	componentDidMount() {
		const { location } = this.props;
		const links = location.pathname.substring(1).split(/-(.+)/);
		const parentlink = links[0];
		const nochildlink = links[1];
		if (parentlink && nochildlink && nochildlink === 'dashboard') {
			this.handler(parentlink, `${parentlink}${nochildlink}`);
		} else if (parentlink && nochildlink && nochildlink !== 'dashboard') {
			this.handler(parentlink, nochildlink);
		} else if (parentlink) {
			this.handler(parentlink, '');
		} else {
			this.handler('hr', 'dashboard');
		}
	}

	componentDidUpdate(prevprops, prevstate) {
		const { location } = this.props;
		const links = location.pathname.substring(1).split(/-(.+)/);
		const parentlink = links[0];
		const nochildlink = links[1];
		if (prevprops.location !== location) {
			if (parentlink && nochildlink && nochildlink === 'dashboard') {
				this.handler(parentlink, `${parentlink}${nochildlink}`);
			} else if (parentlink && nochildlink && nochildlink !== 'dashboard') {
				this.handler(parentlink, nochildlink);
			} else if (parentlink) {
				this.handler(parentlink, '');
			} else {
				this.handler('hr', 'dashboard');
			}
		}
	}

	handler(parentlink, nochildlink) {
		this.setState({
			parentlink: parentlink,
			childlink: nochildlink,
		});
	}

	handleDarkMode(e) {
		this.props.darkModeAction(e.target.checked)
	}
	handleFixNavbar(e) {
		this.props.fixNavbarAction(e.target.checked)
	}
	handleDarkHeader(e) {
		this.props.darkHeaderAction(e.target.checked)
	}
	handleMinSidebar(e) {
		this.props.darkMinSidebarAction(e.target.checked)
	}
	handleSidebar(e) {
		this.props.darkSidebarAction(e.target.checked)
	}
	handleIconColor(e) {
		this.props.iconColorAction(e.target.checked)
	}
	handleGradientColor(e) {
		this.props.gradientColorAction(e.target.checked)
	}
	handleRtl(e) {
		this.props.rtlAction(e.target.checked)
	}
	handleFont(e) {
		this.props.fontAction(e)
	}
	handleFriendList(e) {
		this.props.friendListAction(e)
	}
	handleStatistics(e) {
		this.props.statisticsAction(e)
	}
	closeFriendList(e) {
		this.props.friendListCloseAction(e)
	}
	closeStatistics(e) {
		this.props.statisticsCloseAction(e)
	}
	handleSubMenuIcon(e) {
		this.props.subMenuIconAction(e)
	}
	handleMenuIcon(e) {
		this.props.menuIconAction(e)
	}
	handleBoxLayout(e) {
		this.props.boxLayoutAction(e.target.checked)
	}
	toggleLeftMenu(e) {
		console.log(e, 'asdasdada')
		this.props.toggleLeftMenuAction(e)
	}
	toggleRightSidebar() {
		this.setState({ isOpenRightSidebar: !this.state.isOpenRightSidebar })
	}
	toggleUserMenu() {
		this.setState({ isOpenUserMenu: !this.state.isOpenUserMenu })
	}
	toggleSubMenu(e) {
		let menucClass = ''
		if (e.itemId) {
			const subClass = e.items.map((menuItem, i) => {
				if (menuItem.to === this.props.location.pathname) {
					menucClass = "in";
				} else {
					menucClass = "collapse";
				}
				return menucClass
			})
			return subClass
			// return "collapse";
		} else {
			return e.visible ? "collapse" : "metismenu";
		}
	}

	render() {

		const { AccountState } = this.props;
		const role = AccountState.account ? AccountState.account.role : '';
		const previleges = AccountState.previleges;
		let innercontent = []

		let content = [
			{
				"id": 'SiteManagement',
				"label": "Site Management"
			},
		];

		content.push(
			{
				"id": 0,
				"label": "Dashboard",
				"icon": "fa fa-gear",
				"to": "/admin"
			},
			{
				"id": 1,
				"label": "User",
				"icon": "fa fa-users",
				"to": "/admin/list-user"
			},
			{
				"id": 2,
				"label": "App",
				"icon": "fa fa-th-large",
				"to": "/admin/list-app"
			},
			{
				"id": 3,
				"label": "Enquiry",
				"icon": "fa fa-question-circle",
				"to": "/admin/list-enquiry"
			},
			{
				"id": 4,
				"label": "Settings",
				"icon": "fa fa-cog",
				"to": "/admin/admin-setting"
			},
			// {
			// 	"id": 4,
			// 	"label": "Category",
			// 	"icon": "fa fa-cog",
			// 	"to": "/admin/list-category"
			// },
		)

		let Routes = Path;

		const { isOpenRightSidebar, isOpenUserMenu } = this.state
		const { darkMinSidebar, istoggleLeftMenu, friendListOpen, statisticsOpen, statisticsClose, friendListClose } = this.props
		const pageHeading = Routes.filter((route) => route.path === this.props.location.pathname)
		return (
			<>
				<div className={`${istoggleLeftMenu ? "offcanvas-active" : ""}`}>
					<div style={this.state.parentlink === 'login' ? masterNone : masterBlock}>
						<div id="header_top" className={`header_top ${!darkMinSidebar && 'dark'}`}>
							{/* <div id="header_top" className="header_top dark"> */}
							<div className="container">
								<div className="hleft">
									<NavLink
										to="/admin"
										onClick={() => this.handler('hr', 'dashboard')}
										className="header-brand"
									>
										<img className="avatar custom-sidebar-logo" src="../assets/images/logo-1.png" data-toggle="tooltip" data-original-title="Avatar Name" alt="fake_url" style={{ border: '2px solid #AEE5FF ' }} />
									</NavLink>
								</div>
								<div className="hright">
									<div className="dropdown">
										<span className="nav-link icon settingbar" onClick={this.toggleRightSidebar}>
											<i
												className="fa fa-gear fa-spin"
												data-toggle="tooltip"
												data-placement="right"
												title="Settings"
											/>
										</span>
										<p className="nav-link icon menu_toggle" onClick={() => this.toggleLeftMenu(!istoggleLeftMenu)}>
											<i className="fa  fa-align-left" />
										</p>
									</div>
								</div>
							</div>
						</div>
						<div id="rightsidebar" className={`right_sidebar ${isOpenRightSidebar && "open"}`}>
							<span className="p-3 settingbar float-right" onClick={this.toggleRightSidebar}>
								<i className="fa fa-close" />
							</span>
							<ul className="nav nav-tabs" role="tablist">
								<li className="nav-item">
									<a className="nav-link active" data-toggle="tab" href="#Settings" aria-expanded="true">
										Settings
									</a>
								</li>
							</ul>
							<div className="tab-content">
								<div
									role="tabpanel"
									className="tab-pane vivify fadeIn active"
									id="Settings"
									aria-expanded="true"
								>
									<div className="mb-4">
										<h6 className="font-14 font-weight-bold text-muted">Font Style</h6>
										<div className="custom-controls-stacked font_setting">
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="font"
													defaultChecked
													defaultValue="font-opensans"
													onChange={() => this.handleFont('font-opensans')}
												/>
												<span className="custom-control-label">Open Sans Font</span>
											</label>
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="font"
													defaultValue="font-montserrat"
													onChange={() => this.handleFont('font-montserrat')}
												/>
												<span className="custom-control-label">Montserrat Google Font</span>
											</label>
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="font"
													onChange={() => this.handleFont('font-roboto')}
												/>
												<span className="custom-control-label">Robot Google Font</span>
											</label>
										</div>
									</div>
									<div className="mb-4">
										<h6 className="font-14 font-weight-bold text-muted">Selected Menu Icon</h6>
										<div className="custom-controls-stacked arrow_option">
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="marrow"
													defaultValue="arrow-a"
													onChange={() => this.handleMenuIcon('list-a')}
												/>
												<span className="custom-control-label">A</span>
											</label>
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="marrow"
													defaultValue="arrow-b"
													onChange={() => this.handleMenuIcon('list-b')}
												/>
												<span className="custom-control-label">B</span>
											</label>
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="marrow"
													defaultValue="arrow-c"
													defaultChecked
													onChange={() => this.handleMenuIcon('list-c')}
												/>
												<span className="custom-control-label">C</span>
											</label>
										</div>

										<h6 className="font-14 font-weight-bold mt-4 text-muted">SubMenu List Icon</h6>
										<div className="custom-controls-stacked list_option">
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="listicon"
													defaultValue="list-a"
													defaultChecked
													onChange={() => this.handleSubMenuIcon('list-a')}
												/>
												<span className="custom-control-label">A</span>
											</label>
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="listicon"
													defaultValue="list-b"
													onChange={() => this.handleSubMenuIcon('list-b')}
												/>
												<span className="custom-control-label">B</span>
											</label>
											<label className="custom-control custom-radio custom-control-inline">
												<input
													type="radio"
													className="custom-control-input"
													name="listicon"
													defaultValue="list-c"
													onChange={() => this.handleSubMenuIcon('list-c')}
												/>
												<span className="custom-control-label">C</span>
											</label>
										</div>
									</div>
									<div>
										<h6 className="font-14 font-weight-bold mt-4 text-muted">General Settings</h6>
										<ul className="setting-list list-unstyled mt-1 setting_switch">
											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">Night Mode</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-darkmode"
														onChange={(e) => this.handleDarkMode(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>
											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">Fix Navbar top</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-fixnavbar"
														onChange={(e) => this.handleFixNavbar(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>
											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">Header Dark</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-pageheader"
														onChange={(e) => this.handleDarkHeader(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>
											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">Min Sidebar Light</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-min_sidebar"
														onChange={(e) => this.handleMinSidebar(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>
											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">Sidebar Dark</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-sidebar"
														onChange={(e) => this.handleSidebar(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>
											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">Icon Color</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-iconcolor"
														onChange={(e) => this.handleIconColor(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>
											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">Gradient Color</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-gradient"
														onChange={(e) => this.handleGradientColor(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>

											<li>
												<label className="custom-switch">
													<span className="custom-switch-description">RTL Support</span>
													<input
														type="checkbox"
														name="custom-switch-checkbox"
														className="custom-switch-input btn-rtl"
														onChange={(e) => this.handleRtl(e)}
													/>
													<span className="custom-switch-indicator" />
												</label>
											</li>

										</ul>
									</div>
									<hr />
								</div>
							</div>
						</div>
						<div className="theme_div">
							<div className="card">
								<div className="card-body">
									<ul className="list-group list-unstyled">
										<li className="list-group-item mb-2">
											<p>Default Theme</p>
											<a href="../main/index.html">
												<img
													src="/assets/images/themes/default.png"
													className="img-fluid"
													alt="fake_url"
												/>
											</a>
										</li>
										<li className="list-group-item mb-2">
											<p>Night Mode Theme</p>
											<a href="../dark/index.html">
												<img
													src="/assets/images/themes/dark.png"
													className="img-fluid"
													alt="fake_url"
												/>
											</a>
										</li>
										<li className="list-group-item mb-2">
											<p>RTL Version</p>
											<a href="../rtl/index.html">
												<img
													src="/assets/images/themes/rtl.png"
													className="img-fluid"
													alt="fake_url"
												/>
											</a>
										</li>
										<li className="list-group-item mb-2">
											<p>Theme Version2</p>
											<a href="../theme2/index.html">
												<img
													src="/assets/images/themes/theme2.png"
													className="img-fluid"
													alt="fake_url"
												/>
											</a>
										</li>
										<li className="list-group-item mb-2">
											<p>Theme Version3</p>
											<a href="../theme3/index.html">
												<img
													src="/assets/images/themes/theme3.png"
													className="img-fluid"
													alt="fake_url"
												/>
											</a>
										</li>
										<li className="list-group-item mb-2">
											<p>Theme Version4</p>
											<a href="../theme4/index.html">
												<img
													src="/assets/images/themes/theme4.png"
													className="img-fluid"
													alt="fake_url"
												/>
											</a>
										</li>
										<li className="list-group-item mb-2">
											<p>Horizontal Version</p>
											<a href="../horizontal/index.html">
												<img
													src="/assets/images/themes/horizontal.png"
													className="img-fluid"
													alt="fake_url"
												/>
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div id="left-sidebar" className="sidebar ">
							<h5 className="brand-name">ACWcard<h6>A Gen Z Card Digitalia</h6></h5>
							<nav id="left-sidebar-nav" className="sidebar-nav">
								<MetisMenu className=""
									content={content}
									noBuiltInClassNames={true}
									classNameContainer={(e) => this.toggleSubMenu(e)}
									classNameContainerVisible="in"
									classNameItemActive="active"
									classNameLinkActive="active"
									classNameItemHasVisibleChild="active"
									classNameLink="has-arrow arrow-c"
									iconNamePrefix=""
									LinkComponent={(e) => <DefaultLink itemProps={e} />}
								/>
							</nav>
						</div>
					</div>

					<div className="page">
						<Header dataFromParent={this.props.dataFromParent} dataFromSubParent={pageHeading[0] ? pageHeading[0].pageTitle : ''} />
						<Switch>
							{Routes.map((layout, i) => {
								return <Route key={i} exact={layout.exact} path={layout.path} component={layout.component}></Route>
							})}
							<Route path="*" component={MissingRoute} />
						</Switch>
						<Footer />
					</div>
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	darkMinSidebar: state.settings.isMinSidebar,
	statisticsOpen: state.settings.isStatistics,
	friendListOpen: state.settings.isFriendList,
	statisticsClose: state.settings.isStatisticsClose,
	friendListClose: state.settings.isFriendListClose,
	istoggleLeftMenu: state.settings.isToggleLeftMenu,
	AccountState: state.account,
})

const mapDispatchToProps = dispatch => ({
	darkModeAction: (e) => dispatch(darkModeAction(e)),
	darkHeaderAction: (e) => dispatch(darkHeaderAction(e)),
	fixNavbarAction: (e) => dispatch(fixNavbarAction(e)),
	darkMinSidebarAction: (e) => dispatch(darkMinSidebarAction(e)),
	darkSidebarAction: (e) => dispatch(darkSidebarAction(e)),
	iconColorAction: (e) => dispatch(iconColorAction(e)),
	gradientColorAction: (e) => dispatch(gradientColorAction(e)),
	rtlAction: (e) => dispatch(rtlAction(e)),
	fontAction: (e) => dispatch(fontAction(e)),
	subMenuIconAction: (e) => dispatch(subMenuIconAction(e)),
	menuIconAction: (e) => dispatch(menuIconAction(e)),
	boxLayoutAction: (e) => dispatch(boxLayoutAction(e)),
	statisticsAction: (e) => dispatch(statisticsAction(e)),
	friendListAction: (e) => dispatch(friendListAction(e)),
	statisticsCloseAction: (e) => dispatch(statisticsCloseAction(e)),
	friendListCloseAction: (e) => dispatch(friendListCloseAction(e)),
	toggleLeftMenuAction: (e) => dispatch(toggleLeftMenuAction(e))
})
export default connect(mapStateToProps, mapDispatchToProps)(Menu);