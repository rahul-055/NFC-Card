import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import axios from 'axios';
import { Link } from "react-router-dom";
import QRCode from 'qrcode.react';
import ImportedURL from "../../common/api";
import { Spinner } from "react-bootstrap";
import { AiOutlineAppstore, GrFormAdd } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import { Error, Success } from "../../common/swal";
import { Redirect } from 'react-router-dom';
import { useParams } from "react-router";
import { Emailvalidate, Imagevalidation } from "../../common/validate";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { AC_EMPTY_USER, AC_HANDLE_INPUT_CHANGE_PROFILE, AC_USER_SPINNER, AC_VIEW_USER } from "../../actions/profileAction";
import { Buffer } from 'buffer';

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

class AddApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalType: "Add",
            id: '',
            preview: [],
            username: '',
            email: '',
            password: '',
            usernameError: false,
            emailError: false,
            passwordError: false,
            hidepassword: false,
            emailValidError: false,
            barCodeValue: ''
        }
    }
    componentDidMount() {
        this.props.EmptyUser()
        const { params, path } = this.props.match;
        if (params.id) {
            this.props.UserSpinner();
            this.props.ViewUser(params.id);
            this.setState({ modalType: path === "/view-user/:id" ? "View" : "Edit", id: params.id })
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    submit = () => {
        const { profileState } = this.props;
        const data = profileState.profile

        let valid = 1;
        if (!data.username) {
            this.setState({ usernameError: true });
            valid = 0;
        }
        if (this.state.emailValidError) {
            valid = 0;
        }
        if (!data.email) {
            this.setState({ emailError: true });
            valid = 0;
        }
        if (this.state.modalType == "Add") {
            if (!data.password) {
                this.setState({ passwordError: true });
                valid = 0;
            }
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

        var formData = new FormData();
        formData.append("password", data.password);
        formData.append("uniqueid", data.uniqueid);
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("cardtype", data.cardtype);
        formData.append("barcodeQr", file);

        if (valid) {
            this.setState({ saving: true })
            if (this.state.modalType === "Add") {
                axios.post(ImportedURL.API.signup, formData)
                    .then((res) => {
                        console.log('----------res--------', res.data);
                        this.setState({ saving: false, ListState: true })
                        Success("User created successfully");
                    }).catch(({ response }) => {
                        this.setState({ saving: false })
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
                                Error('Email already exist')
                            } else if (response.status == 408) {
                                Error('Username already exist')
                            } else if (response.status == 407) {
                                Error('Uniqueid already exist')
                            } else if (response.status == 400) {
                                Error('Bad request')
                            }
                        }
                    });
            } else {
                axios.post(ImportedURL.API.updateUser + "/" + this.state.id, formData)
                    .then((res) => {
                        this.setState({ saving: false, ListState: true })
                        Success("User updated successfully");
                        this.props.HandleChange('cardtype', '');

                    }).catch(({ response }) => {
                        this.setState({ saving: false })
                        if (response) {
                            if (response.status == 401) {
                                Error('Something wrong, Retry again!')
                            } else if (response.status == 510) {
                                Error('Email does not exit')
                            } else if (response.status == 502) {
                                Error(response.status + ' Bad Gateway')
                            } else if (response.status == 500) {
                                Error('Internal Server Error')
                            } else if (response.status == 407) {
                                Error('Username already exist')
                            } else if (response.status == 408) {
                                Error('Email already exist')
                            } else if (response.status == 409) {
                                Error('Uniqueid already exist')
                            } else if (response.status == 400) {
                                Error('Bad request')
                            }
                        }
                    });
            }
        }
    }
    onChange = e => {
        const data = this.props.profileState.profile

        const { name, value } = e.target;
        const Error = name + "Error";
        const ValidError = name + "ValidError";
        this.setState({ [name]: value, [Error]: false })
        if (name === 'email') {
            this.props.HandleChange(name, value)
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
            this.props.HandleChange(name, value)
        }
        this.setState({ barCodeValue: ImportedURL.LIVEURL + '/?cardType=' + data.cardtype + "&uId=" + data.uniqueid })
        this.props.HandleChange('barcodeVal', ImportedURL.LIVEURL + '/?cardType=' + data.cardtype + "&uId=" + data.uniqueid)
    }
    eyeClick = () => {
        this.setState({ hidepassword: !this.state.hidepassword })
    }
    render() {
        console.log('------barCodeValue', this.state.barCodeValue);
        if (this.state.ListState) return <Redirect to={'/admin/list-user'} />

        const { accountState, profileState, } = this.props;
        const account = accountState.account
        const data = profileState.profile
        const spinner = profileState.spinner
        console.log('--------barcodeVal', data.barcodeVal);
        console.log('--------zzzzzzzzzzzzzzzzzz', data);
        return (
            <>
                <div class="container-fluid">
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <div class="col-12 breadcome_value">
                                    <ol class="breadcrumb float-sm-right">
                                        <li class="breadcrumb-item header_color_breadcome"> <Link to='/admin'>Dasboard</Link></li>
                                        <li class="breadcrumb-item active"><Link to='/admin/list-user'>List User</Link></li>
                                        <li class="breadcrumb-item active">{this.state.modalType} User</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card card-primary header_border" >
                            <div class="table-title">
                                <div className="card-header">
                                    <h3 className="card-title d-flex "> <div className='rounded_icon'> <AiOutlineAppstore className="mr-2 header_icon" /></div><h2 class="card-title header_title">{(this.state.modalType).toUpperCase()} USER</h2> </h3>
                                    <div className="card-options">
                                        <div className="d-flex justify-content-end">
                                            <div className="header-action mr-2">
                                                <Link to='/admin/list-user'><button type="button" className="btn btn-primary button_color" id='Add'> <i className="fa fa-arrow-left mr-2" id='Add' />Back</button></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <form id="quickForm" autoComplete="off">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Username<span className='ml-1' style={{ color: 'red' }}>*</span></label>
                                                    <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='username' value={data.username} onChange={this.onChange} placeholder="Username" />
                                                    <div className="invalid-feedback" style={{ display: this.state.usernameError ? "block" : 'none' }}>Username is required</div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Email<span className='ml-1' style={{ color: 'red' }}>*</span></label>
                                                    <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='email' value={data.email} onChange={this.onChange} placeholder="Email" />
                                                    <div className="invalid-feedback" style={{ display: this.state.emailError ? "block" : 'none' }}>Email is required</div>
                                                    <div className="invalid-feedback" style={{ display: this.state.emailValidError ? 'block' : 'none' }}>Enter valid email</div>
                                                </div>
                                            </div>
                                            {
                                                this.state.modalType == "Add"
                                                &&
                                                <div class="col-6">
                                                    <div class="form-group">
                                                        <label for="exampleInputEmail1">Password<span className='ml-1' style={{ color: 'red' }}>*</span></label>
                                                        <input type={this.state.hidepassword ? "text" : "password"} className="form-control" style={{ position: "relative" }} name='password' value={data.password} onChange={this.onChange} placeholder="Password" />
                                                        <div className="invalid-feedback" style={{ display: this.state.passwordError ? "block" : 'none' }}>Password is required</div>
                                                        {
                                                            (this.state.hidepassword)
                                                                ?
                                                                <BsFillEyeFill className="input_type_password" onClick={this.eyeClick} />
                                                                :
                                                                <BsFillEyeSlashFill className="input_type_password" onClick={this.eyeClick} />
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Unique ID</label>
                                                    <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='uniqueid' value={data.uniqueid ? (data.uniqueid).toUpperCase() : ''} onChange={this.onChange} placeholder="Unique ID" />
                                                    {/* <div className="invalid-feedback" style={{ display: this.state.uniqueidError ? "block" : 'none' }}>Unique ID is required</div> */}
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Card Type</label>
                                                    <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='cardtype' value={data.cardtype} onChange={this.onChange} placeholder="Card Type" />
                                                    {/* <div className="invalid-feedback" style={{ display: this.state.cardtypeError ? "block" : 'none' }}>Card Type is required</div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer submit_button">
                                        <button type="button" onClick={this.submit} className="btn btn-primary button_color" id='Add'> <BiSave className="mr-2 sidebar_icon" />Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {spinner ?
                    <div className='common_loader_ag_grid'>
                        <img className='loader_img_style_common_ag_grid' src='/assets/images/logo.jpg' />
                        <Spinner className='spinner_load_common_ag_grid' animation="border" variant="info" >
                        </Spinner>
                    </div>
                    : ""}
                <div style={{ display: 'none' }} className="HpQrcode">
                    <QRCode id="HpQrcode" value={data.barcodeVal} width="100px" height="100px" />
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountState: state.account,
        profileState: state.profile,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        HandleChange: AC_HANDLE_INPUT_CHANGE_PROFILE,
        ViewUser: AC_VIEW_USER,
        UserSpinner: AC_USER_SPINNER,
        EmptyUser: AC_EMPTY_USER,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(AddApp));