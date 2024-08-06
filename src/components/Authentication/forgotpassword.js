import React, { Component } from 'react'
import axios from 'axios';
import ImportedUrl from '../../common/api';
import { Row, Container, Col, Spinner } from 'react-bootstrap';
import { BiLogIn } from 'react-icons/bi';
import { BsArrowLeftCircle, BsFillSendFill } from 'react-icons/bs';
import { Link, Redirect } from "react-router-dom"
import { Success, Error } from '../../common/swal';
import { Emailvalidate } from '../../common/validate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { AiOutlineSetting } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';

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
            backLogin: false,
            updateSpinner: false,
        }
    }
    componentDidMount() {
        document.title = 'ACW CARD - Forgot password'
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
        }
    }
    submit = (e) => {
        const { email, emailValidError } = this.state
        let valid = true
        if (emailValidError) {
            valid = false
        }
        if (!email) {
            this.setState({ emailError: true })
            valid = false
        }
        if (valid) {
            this.setState({ updateSpinner: true })
            axios.post(ImportedUrl.API.forgotPassword, { email: email })
                .then((res) => {
                    if (res) {
                        this.setState({ updateSpinner: false })
                        Success('Check mail for new password');
                        this.setState({ backLogin: true })
                    }
                }).catch(({ response }) => {
                    this.setState({ updateSpinner: false })
                    if (response) {
                        if (response.status == 401) {
                            Error('Something wrong, Retry again!')
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
        if (this.state.backLogin) return <Redirect to={'/login'} />

        if (this.state.back) return <Redirect to={'/'} />
        if (this.state.uniqueIdBack) return <Redirect to={'/' + this.state.unique} />

        return (
            <div>
                <div className='home_section sign_section profile_section front_pag'>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col xs="12" lg="5" md="12" sm="12" className='home_sec front_page' style={{ height: '100vh' }}>
                                <div className='acw_card_nav_images'>
                                    <div className='acw_card_logo'>
                                        <div className='acw_image1'>
                                            <img src='../assets/images/acwlogo.png' />
                                        </div>
                                        <div className='acw_vertical_line'></div>
                                        <div className='acw_image2'>
                                            <img src='../assets/images/nfclogo.png' />
                                        </div>
                                    </div>
                                    <div className='acw_card_setting'>
                                        <p className='back_icon_signup'>
                                            <Link to="/login">
                                                <HiOutlineChevronLeft />
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className='page_header_login_signin'>
                                    <h4>FORGOT PASSWORD</h4>
                                    <p>A password recovery link will be sent to this Email ID</p>
                                </div>
                                <div className='mt-5 sign_up_gape sign_up_error'>
                                    <div class="mb-3 input_design">
                                        <label for="exampleFormControlInput1" class="form-label" placeholder="Password">Email<span className="ml-1" style={{ color: '#FF2511' }}>*</span></label>
                                        <input type="email" class="form-control" id="floatingInput" name='email' onChange={this.onChange} placeholder="Email" />
                                        <div className="invalid-feedback" style={{ display: this.state.emailError ? "block" : 'none' }}>Email is required</div>
                                        <div className="invalid-feedback" style={{ display: this.state.emailValidError ? 'block' : 'none' }}>Enter valid email</div>
                                    </div>
                                    <div className='sign_login_btn' style={{ marginTop: "60px" }}>
                                        <div className='login_btn mt-3'>
                                            <div className="error_clear" >
                                                <button type="button" onClick={this.submit} class="btn btn-primary">Send
                                                    <FiSend className='send_icons_padding' />
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
