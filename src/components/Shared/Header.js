import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ImportedURL from '../../common/api';

class Header extends Component {
	signOut = (e) => {
		e.preventDefault();
		localStorage.removeItem('acwtoken');
		window.location.href = "/login";
	}
	render() {
		const { fixNavbar, darkHeader, accountState } = this.props;
		const account = accountState.account
		return (
			<div>
				<div
					id="page_top"
					className={`section-body ${fixNavbar ? "sticky-top" : ""} ${darkHeader ? "top_dark" : ""}`}
				>
					<div className="container-fluid">
						<div className="page-header">
							<div className="left">
								<h1 className="page-title">
									{/* <div className="input-group">
										<div className="input-group-prepend">
											<div className="input-group-text custom-top-search">
												<i className='fa fa-search'></i>
											</div>
										</div>
										<input type="text" className="form-control custom-input" aria-label="Text input with checkbox" placeholder='Enter Your Keywords' />
									</div> */}
								</h1>
							</div>
							<div className="right">
								<div className="notification d-flex">
									<div className="dropdown d-flex">
										<a
											href="/#"
											className="nav-link icon d-none d-md-flex btn btn-default btn-icon ml-1"
											data-toggle="dropdown"
										>
											<i className="fa fa-envelope" />
											<span className="badge badge-primary nav-unread" />
										</a>
										<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
											<ul className="list-unstyled feeds_widget">
												<li>
													<div className="feeds-left">
														<i className="fa fa-user" />
													</div>
													<div className="feeds-body">
														<h4 className="title">
															New User{' '}
															<small className="float-right text-muted">10:45</small>
														</h4>
														<small>I feel great! Thanks team</small>
													</div>
												</li>
											</ul>
											<div className="dropdown-divider" />
											<Link to="/notifications"
												className="dropdown-item text-center text-muted-dark readall"
											>
												See all notifications
											</Link>
										</div>
									</div>
									<div className="dropdown d-flex">
										<a
											href="/#"
											className="nav-link icon d-none d-md-flex btn btn-default btn-icon ml-1"
											data-toggle="dropdown"
										>
											<i className="fa fa-bell" />
											<span className="badge badge-primary nav-unread" />
										</a>
										<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
											<ul className="list-unstyled feeds_widget">
												<li>
													<div className="feeds-left">
														<i className="fa fa-user" />
													</div>
													<div className="feeds-body">
														<h4 className="title">
															New User{' '}
															<small className="float-right text-muted">10:45</small>
														</h4>
														<small>I feel great! Thanks team</small>
													</div>
												</li>
											</ul>
											<div className="dropdown-divider" />
											<Link to="/notifications"
												className="dropdown-item text-center text-muted-dark readall"
											>
												See all notifications
											</Link>
										</div>
									</div>
									<div className="dropdown d-flex">
										<a
											href="/#"
											className="nav-link icon d-none d-md-flex btn btn-default btn-icon ml-1"
											data-toggle="dropdown"
										>
											<img className="avatar" src={account.image != '' ? ImportedURL.LIVEURL + account.image : "../assets/images/xs/avatar2.jpg"} data-toggle="tooltip" data-original-title="Avatar Name" alt="fake_url"></img>
										</a>
										<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
											<Link to="/admin/admin-setting" className="dropdown-item">
												<i className="dropdown-icon fe fe-settings" /> Settings
											</Link>
											<Link to="/login" className="dropdown-item" onClick={this.signOut}>
												<i className="dropdown-icon fe fe-log-out" /> Sign out
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div >
		);
	}
}
const mapStateToProps = state => ({
	fixNavbar: state.settings.isFixNavbar,
	darkHeader: state.settings.isDarkHeader,
	accountState: state.account,
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Header);