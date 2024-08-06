import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import axios from 'axios';
import { Link } from "react-router-dom";
import ImportedURL from "../../common/api";
import { Form, Spinner } from "react-bootstrap";
import { AiOutlineAppstore, AiOutlineSetting, GrFormAdd } from "react-icons/ai";
import { AC_APP_SPINNER, AC_EMPTY_APP, AC_HANDLE_INPUT_CHANGE_APP, AC_VIEW_APP } from "../../actions/appAction";
import { BiSave } from "react-icons/bi";
import { Error, Success } from "../../common/swal";
import { Redirect } from 'react-router-dom';
import { useParams } from "react-router";
import { Imagevalidation } from "../../common/validate";
import Select from 'react-select';
import { AC_ACCOUNT_DETAILS, AC_HANDLE_INPUT_CHANGE, AC_HANDLE_INPUT_CHANGE_ADMIN } from "../../actions/accountAction";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

class AdminSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalType: "Add",
            id: '',
            preview: [],
            arrayLogoError: [],
            arrayAppNameError: [],
            inputtypeError: [],
            preview: [],
            ListState: false,
            saving: false,
            eye: false,
            eyeCon: false,
        }
    }
    componentDidMount() {
        // this.props.EmptySpinner()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    submit = () => {
        const { appState, accountState } = this.props;
        const data = accountState.account
        let valid = 1;
        if (!data.username) {
            this.setState({ nameError: true });
            valid = 0;
        }
        if (data.newpassword) {
            if (!data.confirmpassword) {
                this.setState({ confirmpasswordError: true });
                valid = 0;
            }
        }
        if (this.state.matchPassword) {
            valid = 0;
        }
        if (valid) {
            this.setState({ saving: true })
            let formData = new FormData();
            formData.append("username", data.username ? JSON.stringify(data.username) : "")
            formData.append("image", data.image ? data.image : '')
            formData.append("password", data.newpassword ? JSON.stringify(data.newpassword) : '')

            axios.post(ImportedURL.API.updateProfileAdmin, formData)
                .then((res) => {
                    this.props.AccountDetails();
                    this.setState({ saving: false })
                    Success("Profile updated successfully");
                }).catch(({ response }) => {
                    this.setState({ saving: false })
                    if (response.status == 500) {
                        Error(response.status + ' Internal Server Error')
                    } else if (response.status == 502) {
                        Error(response.status + ' Bad Gateway')
                    } else if (response.status == 400) {
                        Error('Bad request')
                    } else if (response.status == 409) {
                        Error('Sort order already exist')
                    } else {
                        Error(response.statusMessage)
                    }
                });

        }
    }
    onChange = e => {
        const data = this.props.accountState.account
        const { name, value } = e.target;
        const Error = name + "Error";
        this.setState({ [Error]: false });
        if (name == 'confirmpassword') {
            if (data.newpassword != value) {
                this.setState({ matchPassword: true })
            } else {
                this.setState({ matchPassword: false })

            }
            this.props.HandleChange(name, value);
        } else {
            this.props.HandleChange(name, value);
        }

    }
    viewClick = () => {
        this.setState({ eye: !this.state.eye })
    }
    viewClickCon = () => {
        this.setState({ eyeCon: !this.state.eyeCon })
    }
    onChangeVendorImage = e => {
        const { name, value } = e.target;
        if (name == 'image') {
            const imgvalidate = Imagevalidation(e.target.files[0]);
            if (imgvalidate) {
                this.setState({ logo: e.target.files[0], localimage: true });
                var reader = new FileReader();
                var url = reader.readAsDataURL(e.target.files[0]);
                reader.onloadend = function (e) {
                    this.setState({
                        logoSrc: [reader.result],
                    })
                }.bind(this);
                this.props.HandleChange(name, e.target.files[0]);
            } else {
                Error('Invalid file extension');
            }
        }
    }
    render() {
        const { accountState, appState } = this.props;
        const account = accountState.account

        return (
            <>
                <div class="container-fluid">
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <div class="col-12 breadcome_value">
                                    <ol class="breadcrumb float-sm-right">
                                        <li class="breadcrumb-item header_color_breadcome"> <Link to='/admin'>Dasboard</Link></li>
                                        <li class="breadcrumb-item active"><Link to='/admin/setting'>Settings</Link></li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card card-primary header_border" style={{ paddingTop: '0px' }} >
                            <div class="table-title">
                                <div className="card-header">
                                    <h3 className="card-title d-flex "> <div className='rounded_icon'> <AiOutlineSetting className="mr-2 header_icon" /></div><h2 class="card-title header_title">{("Settings").toUpperCase()}</h2> </h3>
                                </div>
                                <form id="quickForm" autoComplete="off">
                                    <div class="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Name<span className='ml-1' style={{ color: 'red' }}>*</span></label>
                                                    <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='username' value={account.username} onChange={this.onChange} placeholder="Name" />
                                                    <div className="invalid-feedback" style={{ display: this.state.nameError ? "block" : 'none' }}>Name is required</div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Logo</label>
                                                    <Form.Group controlId="formFile" className="mb-3">
                                                        <Form.Control type="file" name='image' accept="image/jpg, image/jpeg, image/png" onChange={this.onChangeVendorImage} />
                                                    </Form.Group>
                                                    <div style={{ width: '100px', height: '100px', marginBottom: '20px' }}>
                                                        {this.state.logoSrc || account.image ?
                                                            <img src={this.state.logoSrc ? this.state.logoSrc : ImportedURL.LIVEURL + account.image} alt='' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            : <img className="avatar" src="../assets/images/user.png" data-toggle="tooltip" data-original-title="Avatar Name" alt="fake_url" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group ">
                                                <label for="exampleInputEmail1">New Password</label>
                                                <div className='site_pass'>
                                                    <input type={this.state.eye ? 'text' : 'password'} className="form-control" placeholder="New Password" name={'newpassword'} onChange={this.onChange} value={this.state.newpassword} />
                                                    <i class={this.state.eye ? "fa fa-eye" : "fa fa-eye-slash"} style={{ cursor: 'pointer', fontSize: '17px' }} onClick={this.viewClick}></i>
                                                </div>
                                            </div>
                                            <div className="form-group site_pass">
                                                <label for="exampleInputEmail1">Confirm Password</label>
                                                <div className='site_pass'>
                                                    <input type={this.state.eyeCon ? 'text' : 'password'} className="form-control" placeholder="Confirm  Password" name={'confirmpassword'} onChange={this.onChange} value={this.state.confirmpassword} />
                                                    <i class={this.state.eyeCon ? "fa fa-eye" : "fa fa-eye-slash"} style={{ cursor: 'pointer', fontSize: '17px' }} onClick={this.viewClickCon}></i>
                                                </div>
                                                <div className="invalid-feedback" style={{ display: this.state.confirmpasswordError ? "block" : 'none' }}>Confirm Password is required</div>
                                                <div className="invalid-feedback" style={{ display: this.state.matchPassword ? "block" : 'none' }}>Password mismatch</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer submit_button">
                                        <button type="button" onClick={this.submit} className="btn btn-primary button_color" id='Add'> <BiSave className="mr-2 sidebar_icon" />Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div >
                </div >
                {
                    (this.state.saving) ?
                        <div className='common_loader_ag_grid'>
                            < img className='loader_img_style_common_ag_grid' src='/assets/images/logo.jpg' />
                            <Spinner className='spinner_load_common_ag_grid' animation="border" variant="info" >
                            </Spinner>
                        </div >
                        : ""
                }
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountState: state.account,
        appState: state.app,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        HandleChange: AC_HANDLE_INPUT_CHANGE_ADMIN,
        ViewApp: AC_VIEW_APP,
        AppSpinner: AC_APP_SPINNER,
        EmptySpinner: AC_EMPTY_APP,
        AccountDetails: AC_ACCOUNT_DETAILS,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(AdminSetting));