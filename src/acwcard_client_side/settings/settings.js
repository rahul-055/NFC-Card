import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Container, Col, Spinner } from 'react-bootstrap';
import { BsFillEyeFill, BsFillEyeSlashFill, BsEye } from 'react-icons/bs';
import { AiOutlineMail, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { Link, Redirect } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';
import { AC_HANDLE_INPUT_CHANGE_BROCHURE, AC_HANDLE_INPUT_CHANGE_PROFILE, AC_VIEW_PROFILE } from '../../actions/profileAction';
import ImportedURL from '../../common/api';
import { Emailvalidate } from '../../common/validate';
import { Success, Error } from '../../common/swal';
import { AC_LIST_APP } from '../../actions/appAction';
import { BiBlock, BiSitemap } from 'react-icons/bi';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgimage: '',
            profileimg: '',
            skill: '',
            socialmediaSelect: {},
            urlError: false,
            emailValidError: false,
            updateSpinner: false,
            hidepassword: false,
            hidepasswordconfirm: false,
            isEmailShow: false,
            isUserNameShow: false,
            isPassShow: false,
            redirectLogin: false,
            brochure: false
        }
    }
    componentDidMount() {
        document.title = 'ACW CARD - Settings'
        document.description = 'ACW Card enables you to share your business and personal profiles along with digital uploads of key documents to strengthen your portfolio.'

        this.props.ViewProfile();
        this.props.ListApp()
    }
    eyeClick = () => {
        this.setState({ hidepassword: !this.state.hidepassword })
    }
    eyeClickConfirm = () => {
        this.setState({ hidepasswordconfirm: !this.state.hidepasswordconfirm })
    }
    submit = (e) => {
        const { ProfileState } = this.props;
        const data = ProfileState.profile
        let valid = true
        if (e == 'email') {
            if (this.state.emailValidError) {
                valid = false
            }
            if (!data.email) {
                this.setState({ emailError: true })
                valid = false
            }
        }
        if (e == 'username') {
            if (!data.username) {
                this.setState({ usernameError: true })
                valid = false
            }
        }
        if (e == 'password') {
            if (this.state.passwordValidError) {
                valid = false
            }
            if (!data.password) {
                this.setState({ passwordError: true })
                valid = false
            }
        }
        if (valid) {
            this.setState({ updateSpinner: true })
            var formData = { _id: data._id }
            if (e == 'email') formData['email'] = data.email
            if (e == 'username') formData['username'] = data.username
            if (e == 'password') formData['password'] = data.password
            axios.post(ImportedURL.API.updateaccountsetting, formData)
                .then((res) => {
                    this.setState({ updateSpinner: false })
                    if (res.data.logoutStatus != undefined && res.data.logoutStatus) {
                        if (e == 'email') {
                            localStorage.removeItem('acwtoken');
                            localStorage.removeItem('type');
                            window.location.href = "/login";
                            // this.setState({ redirectLogin: true })
                        }
                    }
                    if (e == 'password') {
                        localStorage.removeItem('acwtoken');
                        localStorage.removeItem('type');
                        window.location.href = "/login";
                        // this.setState({ redirectLogin: true })
                    }
                    Success('Saved');
                }).catch(({ response }) => {
                    this.setState({ updateSpinner: false })
                    if (response) {
                        if (response.status == 401) {
                            Error('Something wrong, Retry again!')
                        } else if (response.status == 510) {
                            Error('Email does not exit')
                        } else if (response.status == 502) {
                            Error(response.status + ' Bad Gateway')
                        } else if (response.status == 500) {
                            Error('Internal Server Error')
                        } else if (response.status == 409) {
                            Error('Username already exist')
                        } else if (response.status == 408) {
                            Error('Email already exist')
                        } else if (response.status == 400) {
                            Error('Bad request')
                        } else {
                            Error('Bad request')
                        }
                    }
                });
        }
    }


    Logout = (e) => {
        // this.setState({ updateSpinner: true })
        Swal.fire({
            title: 'Are you sure you want to logout?',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            imageUrl: 'assets/images/logout.png',
            customClass: {
                popup: 'swal_pop',
                title: 'swal_title',
                image: 'swal_image',
                actions: 'swal_action',
                confirmButton: 'swal_confirm',
                cancelButton: 'swal_close',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // this.setState({ updateSpinner: false })
                e.preventDefault();
                localStorage.removeItem('acwtoken');
                localStorage.removeItem('type');
                window.location.href = "/login";
            }
        })
    }
    Myhotelai = (e) => {
        this.props.HandleChangeBroche("settings")
        this.setState({ brochure: true })
    }
    disable = (e) => {
        const data = this.props.ProfileState.profile
        Swal.fire({
            title: 'Are you sure you want to disable your account ?',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            imageUrl: 'assets/images/disable.png',
            customClass: {
                popup: 'swal_pop',
                title: 'swal_title',
                image: 'swal_image',
                actions: 'swal_action',
                confirmButton: 'swal_confirm',
                cancelButton: 'swal_close',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(ImportedURL.API.statusChange, { id: data._id ? data._id : '', status: false, model: 'users' })
                    .then((data) => {
                        Success('Disable your account successfully')
                        localStorage.removeItem('acwtoken');
                        localStorage.removeItem('type');
                        window.location.href = "/login";
                    }).catch(({ response }) => {
                        if (response.status == 500) {
                            Error(response.status + ' Internal Server Error')
                        } else if (response.status == 502) {
                            Error(response.status + ' Bad Gateway')
                        } else {
                            Error(response.statusMessage)
                        }
                    });
            }
        })

    }
    onChange = e => {
        const data = this.props.ProfileState.profile
        const { name, value } = e.target;
        const Error = name + "Error";
        const ValidError = name + "ValidError";
        this.setState({ [name]: value, [Error]: false })

        if (name == 'email') {
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
            this.props.HandleInputChange(name, value)
        } else if (name == 'confirmpassword') {
            this.props.HandleInputChange(name, value)
            if (data.password != value) {
                this.setState({ passwordValidError: true })
            } else {
                this.setState({ passwordValidError: false })

            }
        } else {
            this.props.HandleInputChange(name, value)
        }
    }

    nameClick = (e) => {
        this.setState(prevState => ({
            isUserNameShow: !prevState.isUserNameShow
        }))
    }
    emailClick = (e) => {
        this.setState(prevState => ({
            isEmailShow: !prevState.isEmailShow
        }))
    }
    passClick = (e) => {
        this.setState(prevState => ({
            isPassShow: !prevState.isPassShow
        }))
    }
    render() {
        if (this.state.redirectLogin) return <Redirect to={'/login'} />
        if (this.state.brochure) return <Redirect to={'/brochure'} />


        const { isPassShow, isEmailShow, isUserNameShow } = this.state;
        const { socialmediaSelect } = this.state
        const { ProfileState, appState } = this.props;
        const listapp = appState.listApp
        const data = ProfileState.profile
        const settingOption = ProfileState.settingOption
        const options = [
            { value: 'instragram', label: 'instragram' },
            { value: 'linkedin', label: 'linkedin' },
            { value: 'facebook', label: 'facebook' }
        ]
        return (
            <div>
                <div className='home_section profile_section setting_sec gap_padding_space pro_bg' style={{ height: (isPassShow || isEmailShow || isUserNameShow ? "auto" : 'auto') }}>
                    <Container >
                        <Row className="justify-content-md-center">
                            <Col xs="12" lg="5" md="12" sm="12" >
                                <div className='acw_card_nav_images'>
                                    <div className='acw_card_logo'>
                                        <div className='acw_image1'>
                                            <a href='#'>
                                                <img src='../assets/images/acwlogo.png' />
                                            </a>
                                        </div>
                                        <div className='acw_vertical_line'></div>
                                        <div className='acw_image2'>
                                            <a href='#'>
                                                <img src='../assets/images/nfclogo.png' />
                                            </a>
                                        </div>
                                    </div>
                                    <div className='acw_card_setting'>
                                        <p className=''>
                                            <Link to="/accountsetting">
                                                <AiOutlineSetting />
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className='profile_header_text'>
                                    <p className='right_profile_icon'>
                                        <Link to={'/' + settingOption}><HiOutlineChevronLeft /></Link>
                                    </p>
                                    <Link to={'/' + settingOption}>
                                        <p className='back_text'>
                                            Go to edit profile
                                        </p>
                                    </Link>
                                </div>
                                <div className='home_sec setting_sec' style={{ height: (isPassShow || isEmailShow || isUserNameShow ? "auto" : '100vh') }}>
                                    <div className=''>
                                        <div className='account_settings'>
                                            <label for="floatingInput">Account Settings </label>
                                        </div>
                                        <div className='account_setting_part'>
                                            <div class="accordion" id='accordionExample'>
                                                <div class="accordion-item mt-3">
                                                    <h2 class="accordion-header" id="headingOne">
                                                        <button onClick={this.emailClick} class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                            <div className='account_profile_image'>
                                                                <div>
                                                                    <p className='circle_icon'>
                                                                        <AiOutlineMail />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='acc_text'>Edit Email ID</div>
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <div className='profile_images_box_shadow'>
                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Email ID</label>
                                                                    <input type="text" class="form-control" name='email' onChange={this.onChange} value={data.email} id="floatingInput" placeholder="Email" />
                                                                    <div className="invalid-feedback" style={{ display: this.state.emailError ? "block" : 'none' }}>Email is required</div>
                                                                    <div className="invalid-feedback" style={{ display: this.state.emailValidError ? 'block' : 'none' }}>Enter valid email</div>
                                                                </div>
                                                                <div className='profile_save_btn'>
                                                                    <button type="button" class="btn btn-primary" onClick={(e) => this.submit('email')}>Save</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div class="accordion mt-3" id="accordionExample2"> */}
                                                <div class="accordion-item mt-3">
                                                    <h2 class="accordion-header" id="headingTwo">
                                                        <button onClick={this.nameClick} class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            <div className='account_profile_image'>
                                                                <div>
                                                                    <p className='circle_icon'>
                                                                        <AiOutlineUser />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='acc_text'>Edit Username</div>
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <div className='profile_images_box_shadow'>
                                                                {/* <div class="form-floating  mb-3">
                                                                    <input type="text" class="form-control" name='username' onChange={this.onChange} value={data.username} id="floatingInput" placeholder="Company" />
                                                                    <label for="floatingInput">Username </label>
                                                                    <div className="invalid-feedback" style={{ display: this.state.usernameError ? "block" : 'none' }}>Username is required</div>
                                                                </div> */}
                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Username</label>
                                                                    <input type="text" class="form-control" name='username' onChange={this.onChange} value={data.username} id="floatingInput" placeholder="Username" />
                                                                    <div className="invalid-feedback" style={{ display: this.state.usernameError ? "block" : 'none' }}>Username is required</div>
                                                                </div>
                                                                <div className='profile_save_btn'>
                                                                    <button type="button" class="btn btn-primary" onClick={(e) => this.submit('username')}>Save</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                                {/* <div class="accordion mt-3" id="accordionExample3"> */}
                                                <div class="accordion-item mt-3">
                                                    <h2 class="accordion-header" id="headingThree">
                                                        <button onClick={this.passClick} class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                            <div className='account_profile_image'>
                                                                <div>
                                                                    <p className='circle_icon'>
                                                                        <BsEye />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='acc_text'>Change Password</div>
                                                        </button>
                                                    </h2>
                                                    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <div className='profile_images_box_shadow'>
                                                                {/* <div class="form-floating  mb-3">
                                                                    <input type="text" class="form-control" name='password' onChange={this.onChange} value={data.password} id="floatingInput" placeholder="Company" />
                                                                    <label for="floatingInput">New Password </label>
                                                                </div> */}
                                                                {/* <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >New Password</label>
                                                                    <input type="text" class="form-control" name='password' onChange={this.onChange} value={data.password} id="floatingInput" placeholder="New Password" />
                                                                </div> */}
                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >New Password</label>
                                                                    <div className='pwd_icons'>
                                                                        <input type={this.state.hidepassword ? "text" : "password"} class="form-control" name='password' onChange={this.onChange} value={data.password} id="floatingInput" placeholder="Password" />
                                                                        {
                                                                            (this.state.hidepassword)
                                                                                ?
                                                                                <BsFillEyeFill style={{ cursor: 'pointer' }} onClick={this.eyeClick} />
                                                                                :
                                                                                <BsFillEyeSlashFill style={{ cursor: 'pointer' }} onClick={this.eyeClick} />
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Confirm Password</label>
                                                                    <div className='pwd_icons'>
                                                                        <input type={this.state.hidepasswordconfirm ? "text" : "password"} class="form-control" name='confirmpassword' onChange={this.onChange} value={data.confirmpassword} id="floatingInput" placeholder="Password" />
                                                                        <div className="invalid-feedback" style={{ display: this.state.passwordError ? "block" : 'none' }}>Password is required</div>
                                                                        <div className="invalid-feedback" style={{ display: this.state.passwordValidError ? 'block' : 'none' }}>Password mismatch</div>
                                                                        {
                                                                            (this.state.hidepasswordconfirm)
                                                                                ?
                                                                                <BsFillEyeFill style={{ cursor: 'pointer' }} onClick={this.eyeClickConfirm} />
                                                                                :
                                                                                <BsFillEyeSlashFill style={{ cursor: 'pointer' }} onClick={this.eyeClickConfirm} />
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className='profile_save_btn'>
                                                                    <button type="button" class="btn btn-primary" onClick={(e) => this.submit('password')}>Save</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="accordion-item mt-3" onClick={this.Myhotelai}>
                                                    <h2 class="accordion-header" id="headingFour">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                            <div className='account_profile_image'>
                                                                <div>
                                                                    <p className='circle_icon_myhotelai'>
                                                                        <img className="" src="../assets/images/logo01.png" width={30} height={30} data-toggle="tooltip" data-original-title="Avatar Name" alt="" />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='acc_text'>MyHotel AI Brochure</div>
                                                        </button>
                                                    </h2>
                                                </div>
                                                {/* </div> */}
                                                {/* <div class="accordion mt-3" id='accordionExample4'> */}
                                                <div class="accordion-item mt-3" onClick={this.disable}>
                                                    <h2 class="accordion-header" id="headingFour">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                            <div className='account_profile_image'>
                                                                <div>
                                                                    <p className='circle_icon'>
                                                                        <BiBlock />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='acc_text'>Disable Account</div>
                                                        </button>
                                                    </h2>
                                                </div>
                                                {/* </div> */}
                                                {/* <div class="accordion mt-3" id='accordionExample5'> */}
                                                <div class="accordion-item mt-3" onClick={(e) => this.Logout(e)}>
                                                    <h2 class="accordion-header" id="headingFour">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                            <div className='account_profile_image'>
                                                                <div>
                                                                    <p className='circle_icon'>
                                                                        <FiLogOut />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='acc_text'>Logout</div>
                                                        </button>
                                                    </h2>
                                                </div>
                                                {/* </div> */}
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
                    : ""}
            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    ProfileState: state.profile,
    appState: state.app,
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        HandleInputChange: AC_HANDLE_INPUT_CHANGE_PROFILE,
        ListApp: AC_LIST_APP,
        ViewProfile: AC_VIEW_PROFILE,
        HandleChangeBroche: AC_HANDLE_INPUT_CHANGE_BROCHURE,
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings);