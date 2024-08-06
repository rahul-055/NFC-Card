
import React, { Component } from 'react'
import axios from 'axios';
import ImportedUrl from '../../common/api';
import { Row, Container, Col, Spinner } from 'react-bootstrap';
import { BiLogIn } from 'react-icons/bi';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { Link, Redirect } from "react-router-dom"
import { Success, Error } from '../../common/swal';
import { Emailvalidate } from '../../common/validate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { AiOutlineSetting } from 'react-icons/ai';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			emailError: false,
			passwordError: false,
			hidepassword: false,
			emailValidError: false,
			uniqueIdBack: false,
			back: false,
			unique: '',
			updateSpinner: false,
		}
	}
	eyeClick = () => {
		this.setState({ hidepassword: !this.state.hidepassword })
	}
	componentDidMount() {
		document.title = 'ACW CARD - Login'
		document.description = 'ACW Card enables you to share your business and personal profiles along with digital uploads of key documents to strengthen your portfolio.'
	}
	onChange = e => {
		const { name, value } = e.target;
		const Error = name + "Error";
		const ValidError = name + "ValidError";
		this.setState({ [name]: value, [Error]: false })
		if (name === 'email') {
			this.setState({ email: value });
			var email = value;
			if (email) {
				if (Emailvalidate(email)) {
					this.setState({ [ValidError]: false, [Error]: false })
				} else {
					this.setState({ [ValidError]: true })
				}
			}
			else {
				this.setState({ emailError: true, [ValidError]: false });
			}
		} else {
			this.setState({ password: value });
		}
	}
	submit = (e) => {
		const { username, email, password, emailValidError } = this.state
		let valid = true
		if (emailValidError) {
			valid = false
		}
		if (!email) {
			this.setState({ emailError: true })
			valid = false
		}
		if (!password) {
			this.setState({ passwordError: true })
			valid = false
		}
		if (valid) {
			this.setState({ updateSpinner: true })
			axios.get('https://ipapi.co/json/').then((response) => {
				let data = response.data;
				const formData = {
					email: (email).toLowerCase(),
					password: password,
					time: new Date(),
					ip: data.ip,
					city: data.city,
					region: data.region,
					country: data.country_name,
					countrycode: data.country_code,
					latitude: data.latitude,
					longitude: data.longitude,
					postal: data.postal,
					currency: data.currency
				}
				axios.post(ImportedUrl.API.login, formData)
					.then((res) => {
						if (res.data) {
							this.setState({ updateSpinner: false })
							Success('Logged in successfully');
							const { token, type } = res.data
							localStorage.setItem('acwtoken', token);
							localStorage.setItem('type', type);
							if (type == "admin") {
								window.location.href = "/admin";
							} else {
								window.location.href = "/account";
							}
						}
					}).catch(({ response }) => {
						if (response) {
							this.setState({ updateSpinner: false })
							if (response.status == 401) {
								Error('Invalid email')
							} else if (response.status == 402) {
								Error('Invalid password')
							} else if (response.status == 510) {
								Error('Email does not exit')
							} else if (response.status == 502) {
								Error(response.status + ' Bad Gateway')
							} else if (response.status == 500) {
								Error('Internal Server Error')
							} else if (response.status == 400) {
								Error('Bad request')
							} else if (response.status == 409) {
								Error('Block your account please contact admin')
							}
						}
					});
			}).catch((error) => {
				console.log(error);
			});
		}
	}
	Back = () => {
		const unique = window.location.href.split('/')[4]
		if (unique) {
			if ((unique.includes('&uId=')) && (unique.includes('cardType='))) {
				this.setState({ uniqueIdBack: true, unique: unique })
			} else {
				this.setState({ back: true })
			}
		} else {
			this.setState({ back: true })
		}
	}
	render() {
		if (this.state.back) return <Redirect to={'/'} />
		if (this.state.uniqueIdBack) return <Redirect to={'/' + this.state.unique} />

		return (
			<div>
				<div className='home_section sign_section profile_section web_space front_pag'>
					<Container>
						<Row className="justify-content-md-center">
							<Col xs="12" lg="5" md="12" sm="12" className='home_sec front_page web_space'>
								<div className='acw_card_nav_images'>
									<div className='acw_card_logo'>
										<div className='acw_image1'>
											<Link to="/">
												<img src='../assets/images/acwlogo.png' />
											</Link>
										</div>
										<div className='acw_vertical_line'></div>
										<div className='acw_image2'>
											<Link to="/">
												<img src='../assets/images/nfclogo.png' />
											</Link>
										</div>
									</div>
									<div className='acw_card_setting'>
										<p className='back_icon_signup'>
											<Link to="/">
												<HiOutlineChevronLeft />
											</Link>
										</p>
									</div>
								</div>
								<div className='page_header_login_signin'>
									<h4>Log In </h4>
									<p>Signed up already? Log in to your ACW Card account using your User Credentials</p>
								</div>
								<div className='mt-5 sign_up_gape sign_up_error'>
									<div class="mb-3 input_design">
										<label for="exampleFormControlInput1" class="form-label" placeholder="Password">Login ID (Email)<span className="ml-1" style={{ color: '#FF2511' }}>*</span></label>
										<input type="email" class="form-control" id="floatingInput" name='email' onChange={this.onChange} placeholder="Email" />
										<div className="invalid-feedback" style={{ display: this.state.emailError ? "block" : 'none' }}>Email is required</div>
										<div className="invalid-feedback" style={{ display: this.state.emailValidError ? 'block' : 'none' }}>Enter valid email</div>
									</div>
									<div class="mb-3 input_design pt-3">
										<label for="exampleFormControlInput1" class="form-label pt-0" placeholder="Password">Password<span className="ml-1" style={{ color: '#FF2511' }}>*</span></label>
										<span className='forgot_password'>
											<Link className="" to="/forgotpassword">
												Forgot Password?
											</Link>
										</span>
										<div className='pwd_icons'>
											<input type={this.state.hidepassword ? "text" : "password"} name='password' onChange={this.onChange} class="form-control" id="floatingPassword" placeholder="Password" />
											<div className="invalid-feedback" style={{ display: this.state.passwordError ? "block" : 'none' }}>Password is required</div>
											{
												(this.state.hidepassword)
													?
													<BsFillEyeFill style={{ cursor: 'pointer' }} onClick={this.eyeClick} />
													:
													<BsFillEyeSlashFill style={{ cursor: 'pointer' }} onClick={this.eyeClick} />
											}
										</div>
									</div>
									<div className='sign_login_btn' style={{ marginTop: "60px" }}>
										<div className='login_btn mt-3'>
											<div className="error_clear" >
												<button type="button" onClick={this.submit} class="btn btn-primary">Login
													<BiLogIn />
												</button>
											</div>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
				{(this.state.updateSpinner) ?
					<div className='common_loader_ag_grid'>
						<img className='loader_img_style_common_ag_grid' src='/assets/images/logo.jpg' />
						<Spinner className='spinner_load_common_ag_grid' animation="border" variant="info" >
						</Spinner>
					</div>
					: ""
				}
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	}, dispatch)
}
export default connect(mapDispatchToProps)(Login)
