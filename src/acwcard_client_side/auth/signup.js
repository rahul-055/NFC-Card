import React, { Component } from 'react'
import axios from 'axios';
import ImportedUrl from '../../common/api';
import { Row, Container, Col, Spinner } from 'react-bootstrap';
import { BiLogIn } from 'react-icons/bi';
import QRCode from 'qrcode.react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { Link, Redirect } from "react-router-dom"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { Success, Error } from '../../common/swal';
import { Emailvalidate } from '../../common/validate';
import { HiOutlineChevronRight, HiOutlineChevronLeft } from 'react-icons/hi';
import { useParams } from "react-router";
import { AiOutlineSetting } from 'react-icons/ai';
import ImportedURL from '../../common/api';
import { Buffer } from 'buffer';

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}
class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            usernameError: false,
            emailError: false,
            passwordError: false,
            hidepassword: false,
            emailValidError: false,
            uniqueIdBack: false,
            back: false,
            unique: '',
            barCodeValue: ''
        }
    }
    componentDidMount() {
        document.title = 'ACW CARD - Sign up'
        document.description = 'ACW Card enables you to share your business and personal profiles along with digital uploads of key documents to strengthen your portfolio.'
        let unique = window.location.href.split('/')[3];
        this.setState({ barCodeValue: ImportedURL.LOCALURL + unique })

    }
    submit = (e) => {
        const { username, email, password, emailValidError } = this.state
        let valid = true
        if (emailValidError) {
            valid = false
        }
        if (!username) {
            this.setState({ usernameError: true })
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

        const canvas = document.getElementById("HpQrcode");
        const base64Image = canvas.toDataURL("image/png");
        const fileType = base64Image.split(";")[0].split(":")[1];
        const buffer = Buffer.from(
            base64Image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );
        let fileName = "qr.jpeg"
        const file = new File([buffer], fileName, { type: fileType });

        if (valid) {
            this.setState({ updateSpinner: true })
            axios.get('https://ipapi.co/json/').then(async (response) => {
                let data = response.data;
                var formData = new FormData();
                formData.append("email", email);
                formData.append("password", password);
                formData.append("username", username);
                formData.append("time", new Date());
                formData.append("ip", data.ip);
                formData.append("city", data.city);
                formData.append("region", data.region);
                formData.append("country", data.country_name);
                formData.append("countrycode", data.country_code);
                formData.append("latitude", data.latitude);
                formData.append("longitude", data.longitude);
                formData.append("postal", data.postal);
                formData.append("currency", data.currency);
                const unique = window.location.href.split('/')[3];
                if (unique) {
                    if ((unique.includes('&uId=')) && (unique.includes('cardType='))) {
                        let uniqueid = unique.split('&uId=')[1]
                        let cardtype = (unique.split('&uId=')[0]).split('cardType=')[1]
                        formData.append("uniqueid", uniqueid);
                        formData.append("cardtype", cardtype);
                    }
                }
                formData.append("barcodeQr", file);
                axios.post(ImportedUrl.API.signup, formData)
                    .then((res) => {
                        this.setState({ updateSpinner: false })
                        if (res.data) {
                            Success('Registered successfully');
                            const { token, type } = res.data
                            localStorage.setItem('acwtoken', token);
                            localStorage.setItem('type', type);
                            if (type == "admin") {
                                window.location.href = "/admin";
                            } else {
                                window.location.href = "/brochure";
                            }
                        }
                    }).catch(({ response }) => {
                        this.setState({ updateSpinner: false })
                        if (response.status == 401) {
                            Error('Something wrong, Retry again!')
                        } else if (response.status == 510) {
                            Error('Email does not exit')
                        } else if (response.status == 502) {
                            Error(response.status + ' Bad Gateway')
                        } else if (response.status == 500) {
                            Error('Internal Server Error')
                        } else if (response.status == 409) {
                            Error('Email already exist')
                        } else if (response.status == 408) {
                            Error('Username already exist')
                        } else if (response.status == 407) {
                            Error('This account already exist')
                        } else if (response.status == 400) {
                            Error('Bad request')
                        }
                    });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    eyeClick = () => {
        this.setState({ hidepassword: !this.state.hidepassword })
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
        } else if (name === 'username') {
            this.setState({ username: value });
        } else {
            this.setState({ password: value });
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
            <div style={{ position: 'relative' }}>
                <div className='home_section sign_section profile_section front_pag' style={{ height: '100vh' }}>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col xs="12" lg="5" md="12" sm="12" className='home_sec front_page' style={{ height: '100vh' }}>
                                <div className='acw_card_nav_images'>
                                    <div className='acw_card_logo'>
                                        <div className='acw_image1'>
                                            {/* <Link to="/"> */}
                                            <img src='../assets/images/acwlogo.png' />
                                            {/* </Link> */}
                                        </div>
                                        <div className='acw_vertical_line'></div>
                                        <div className='acw_image2'>
                                            {/* <Link to="/"> */}
                                            <img src='../assets/images/nfclogo.png' />
                                            {/* </Link> */}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='profile_header_text'>
                                    <p className='right_profile_icon'>
                                        <Link to='/'><HiOutlineChevronLeft /></Link>
                                    </p>
                                </div> */}
                                <div className='page_header_login_signin'>
                                    <h4>SIGN UP</h4>
                                    <p>You are just one step away from exploring futuristic avenues in networking</p>
                                </div>
                                <div className='mt-5 sign_up_gape sign_up_error'>

                                    <div class="mb-3 input_design">
                                        <label for="exampleFormControlInput1" class="form-label" placeholder="Password">Username</label>
                                        <input type="text" class="form-control" id="floatingInput" name='username' onChange={this.onChange} placeholder="Username" />
                                        <div className="invalid-feedback" style={{ display: this.state.usernameError ? "block" : 'none' }}>Username is required</div>
                                    </div>

                                    <div class="mb-3 input_design">
                                        <label for="exampleFormControlInput1" class="form-label" placeholder="Password">Email</label>
                                        <input type="email" class="form-control" id="floatingInput" name='email' onChange={this.onChange} placeholder="Email" />
                                        <div className="invalid-feedback" style={{ display: this.state.emailError ? "block" : 'none' }}>Email is required</div>
                                        <div className="invalid-feedback" style={{ display: this.state.emailValidError ? 'block' : 'none' }}>Enter valid email</div>
                                    </div>


                                    <div class="mb-3 input_design">
                                        <label for="exampleFormControlInput1" class="form-label" placeholder="Password">Password</label>
                                        <div className='pwd_icons'>
                                            <input type={this.state.hidepassword ? "text" : "password"} class="form-control password_input" onChange={this.onChange} id="floatingPassword" name='Password' placeholder="Password" />
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


                                </div>
                                {/* <div className='sign_login_btn' style={{ marginTop: "50px" }}>
                                    <div className='sign_btn'>
                                        <div onClick={this.submit}>
                                            <button type="button" class="btn btn-primary"> Sign Up
                                                <BiLogIn />
                                            </button>
                                        </div>
                                    </div>
                                </div> */}
                                <div className='sign_login_btn' style={{ marginTop: "60px" }}>
                                    <div className='login_btn mt-3'>
                                        <div className="error_clear" >
                                            <button type="button" onClick={this.submit} class="btn btn-primary">Sign Up
                                                <BiLogIn />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                {(this.state.updateSpinner) ?
                    <div style={{ height: '100vh', position: 'fixed', width: '100%', top: '0px', }}>
                        <div style={{ position: 'relative' }}></div>
                        <div className='common_loader'>
                            <img className='loader_img_style_common' src='/assets/images/logo.jpg' />
                            <Spinner className='spinner_load_common' animation="border" variant="info" >
                            </Spinner>
                        </div>
                    </div>
                    : ""
                }
                <div style={{ display: 'none' }} className="HpQrcode">
                    <QRCode id="HpQrcode" value={this.state.barCodeValue} width="100px" height="100px" />
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch)
}
export default connect(mapDispatchToProps)(withParams(SignUp))
