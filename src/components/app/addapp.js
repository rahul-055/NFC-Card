import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import axios from 'axios';
import { Link } from "react-router-dom";
import ImportedURL from "../../common/api";
import { Spinner } from "react-bootstrap";
import { AiOutlineAppstore, GrFormAdd } from "react-icons/ai";
import { AC_APP_SPINNER, AC_EMPTY_APP, AC_HANDLE_INPUT_CHANGE_APP, AC_VIEW_APP } from "../../actions/appAction";
import { BiSave } from "react-icons/bi";
import { Error, Success } from "../../common/swal";
import { Redirect } from 'react-router-dom';
import { useParams } from "react-router";
import { Imagevalidation } from "../../common/validate";
import Select from 'react-select';

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
            arrayLogoError: [],
            arrayAppNameError: [],
            inputtypeError: [],
            preview: [],
            ListState: false,
            saving: false,
        }
    }
    componentDidMount() {
        this.props.EmptySpinner()
        const { params, path } = this.props.match;
        if (params.id) {
            this.props.AppSpinner();
            this.props.ViewApp(params.id);
            this.setState({ modalType: path == "/admin/view-app/:id" ? "View" : "Edit", id: params.id })
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    submit = () => {
        const { appState } = this.props;
        const data = appState.app
        let valid = 1;
        if (!data.name) {
            this.setState({ nameError: true });
            valid = 0;
        }
        if (!data.sortorder) {
            this.setState({ sortorderError: true });
            valid = 0;
        }
        if (data.types && data.types.length > 0) {
            let logoError = []
            let appnameError = []
            let typeError = []
            data.types.map((item, i) => {
                if (!item.logo) {
                    logoError.push(i)
                    valid = 0;
                }
                if (!item.appname) {
                    appnameError.push(i)
                    valid = 0;
                }
                if (!item.inputtype) {
                    typeError.push(i)
                    valid = 0;
                }
            })
            this.setState({ arrayLogoError: logoError })
            this.setState({ arrayAppNameError: appnameError })
            this.setState({ inputtypeError: typeError })
        }
        if (valid) {
            this.setState({ saving: true })
            if (this.state.modalType === "Add") {
                let formData = new FormData();
                formData.append("name", data.name)
                formData.append("sortorder", data.sortorder)
                let appname = []
                let inputtype = []
                for (let i = 0; i < data.types.length; i++) {
                    formData.append("logo", data.types[i].logo)
                    appname.push(data.types[i].appname)
                    inputtype.push(data.types[i].inputtype)
                }
                formData.append("appname", JSON.stringify(appname))
                formData.append("inputtype", JSON.stringify(inputtype))
                axios.post(ImportedURL.API.addApp, formData)
                    .then((res) => {
                        this.setState({ saving: false, ListState: true })
                        Success("App created successfully");
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
            } else {
                let formData = new FormData();
                formData.append("name", data.name)
                formData.append("sortorder", data.sortorder)
                let arr = []
                let appname = []
                let inputtype = []
                let id = []
                for (let i = 0; i < data.types.length; i++) {
                    if (typeof data.types[i].logo == 'string') {
                        arr.push(data.types[i])
                    } else {
                        formData.append("logo", data.types[i].logo)
                        appname.push(data.types[i].appname)
                        inputtype.push(data.types[i].inputtype)
                        id.push(data.types[i].id)
                    }
                }
                formData.append("existsArr", JSON.stringify(arr))
                formData.append("appname", JSON.stringify(appname))
                formData.append("inputtype", JSON.stringify(inputtype))

                formData.append("id", JSON.stringify(id))
                axios.post(ImportedURL.API.updateApp + "/" + this.state.id, formData)
                    .then((res) => {
                        this.setState({ saving: false, ListState: true })
                        Success("App updated successfully");
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
    }
    onChange = e => {
        const { name, value } = e.target;
        const Error = name + "Error";
        this.setState({ [Error]: false });
        this.props.HandleChange(name, value);

    }
    addFormFields = (e) => {
        const data = this.props.appState.app
        let types = [...data.types]
        this.props.HandleChange('types', [...types, { logo: '', appname: '', }])
    }
    removeFormFields = (id) => {
        const data = this.props.appState.app
        let types = [...data.types]
        this.props.HandleChange('types', [...types.filter((e, i) => i !== id)])
        this.setState({ preview: [...this.state.preview.filter((e, i) => i !== id)] })
        this.setState({ arrayLogoError: [...this.state.arrayLogoError.filter(e => e != id)] })
        this.setState({ arrayAppNameError: [...this.state.arrayAppNameError.filter(e => e != id)] })
    }
    changeArrayImage = (e, i) => {
        const { name, files } = e.target
        const data = this.props.appState.app;
        if (this.state.arrayLogoError && this.state.arrayLogoError.length > 0) {
            this.setState({ arrayLogoError: [...this.state.arrayLogoError.filter(id => id != i)] })
        }
        if (e.target.files[0] != undefined) {
            const imgvalidate = Imagevalidation(e.target.files[0]);
            if (imgvalidate) {
                let types = data.types;
                this.setState({ preview: [...this.state.preview, e.target.files[0]] })
                types = [
                    ...types.slice(0, i),
                    { ...types[i], [name]: files[0] },
                    ...types.slice(i + 1)
                ]
                this.props.HandleChange('types', types)
            } else {
                Error('Invalid file extension');
            }
        }
    }
    changeArray = (e, i) => {
        const { name, value } = e.target
        const data = this.props.appState.app;
        let types = data.types;
        if (this.state.arrayAppNameError && this.state.arrayAppNameError.length > 0) {
            this.setState({ arrayAppNameError: [...this.state.arrayAppNameError.filter(id => id != i)] })
        }
        types = [
            ...types.slice(0, i),
            { ...types[i], [name]: value },
            ...types.slice(i + 1)
        ]
        this.props.HandleChange('types', types)
    }
    changeSelectArray = (e, i) => {
        const { name, value } = e
        const data = this.props.appState.app;
        let types = data.types;
        if (this.state.inputtypeError && this.state.inputtypeError.length > 0) {
            this.setState({ inputtypeError: [...this.state.inputtypeError.filter(id => id != i)] })
        }
        types = [
            ...types.slice(0, i),
            { ...types[i], [name]: value },
            ...types.slice(i + 1)
        ]
        this.props.HandleChange('types', types)
    }
    logoError = (i) => {
        const { arrayLogoError } = this.state
        if (arrayLogoError && arrayLogoError.length > 0) {
            if (arrayLogoError.includes(i)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    appnameError = (i) => {
        const { arrayAppNameError } = this.state
        if (arrayAppNameError && arrayAppNameError.length > 0) {
            if (arrayAppNameError.includes(i)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    inputtypeError = (i) => {
        const { inputtypeError } = this.state
        if (inputtypeError && inputtypeError.length > 0) {
            if (inputtypeError.includes(i)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    render() {
        if (this.state.ListState) return <Redirect to={'/admin/list-app'} />

        const { accountState, appState } = this.props;
        const account = accountState.account
        const data = appState.app
        const spinner = appState.spinner
        const limitOptions = [
            { value: '25', label: '25' },
            { value: '50', label: '50' },
            { value: '100', label: '100' }
        ]
        let inputTypeList = [
            { label: "URL", value: "url", name: "inputtype" },
            { label: "Number", value: "number", name: "inputtype" },
            { label: "Email", value: "email", name: "inputtype" },
            { label: "Address", value: "address", name: "inputtype" },
            { label: "Document", value: "document", name: "inputtype" },
            { label: "None", value: "none", name: "inputtype" },
        ]
        return (
            <>
                <div class="container-fluid">
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <div class="col-12 breadcome_value">
                                    <ol class="breadcrumb float-sm-right">
                                        <li class="breadcrumb-item header_color_breadcome"> <Link to='/admin'>Dasboard</Link></li>
                                        <li class="breadcrumb-item active"><Link to='/admin/list-app'>List App</Link></li>
                                        <li class="breadcrumb-item active">{this.state.modalType} App</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card card-primary header_border" >
                            <div class="table-title">
                                <div className="card-header">
                                    <h3 className="card-title d-flex "> <div className='rounded_icon'> <AiOutlineAppstore className="mr-2 header_icon" /></div><h2 class="card-title header_title">{(this.state.modalType).toUpperCase()} APP</h2> </h3>
                                    <div className="card-options">
                                        <div className="d-flex justify-content-end">
                                            <div className="header-action mr-2">
                                                <Link to='/admin/list-app'><button type="button" className="btn btn-primary button_color" id='Add'> <i className="fa fa-arrow-left mr-2" id='Add' />Back</button></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <form id="quickForm" autoComplete="off">
                                    <div class="card-body">
                                        <div className="row">
                                            <div className="col-6">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Name<span className='ml-1' style={{ color: 'red' }}>*</span></label>
                                                    <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='name' value={data.name} onChange={this.onChange} placeholder="Name" />
                                                    <div className="invalid-feedback" style={{ display: this.state.nameError ? "block" : 'none' }}>Name is required</div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Sort Order<span className='ml-1' style={{ color: 'red' }}>*</span></label>
                                                    <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='sortorder' value={data.sortorder} onChange={this.onChange} placeholder="Sort Order" />
                                                    <div className="invalid-feedback" style={{ display: this.state.sortorderError ? "block" : 'none' }}>Sort Order is required</div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                {
                                                    (data.types && data.types.length > 0)
                                                    &&
                                                    <table class="table table-borderless table_border">
                                                        <thead className="table_header">
                                                            <tr style={{ textAlign: "center" }}>
                                                                <th style={{ width: '30%' }}><p>Logo</p></th>
                                                                <th style={{ width: '30%' }}><p>App Name</p></th>
                                                                <th style={{ width: '30%' }}><p>Input Type</p></th>
                                                                <th style={{ width: "10%" }}>
                                                                    <div className='todo_increment' style={{ marginTop: '0px' }}>
                                                                        <span className='plus_minus'><i className="fa fa-plus-circle" aria-hidden="true" onClick={(e) => this.addFormFields(e)}></i></span>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="table_body">
                                                            {
                                                                (data.types && data.types.length > 0)
                                                                &&
                                                                data.types.map((item, i) => {
                                                                    let preview = (this.state.preview && this.state.preview.length > 0) ? this.state.preview.find((e, j) => j === i) : ''
                                                                    let logoError = this.logoError(i)
                                                                    let appnameError = this.appnameError(i)
                                                                    let inputtypeError = this.inputtypeError(i)
                                                                    let inputTypeValue = inputTypeList.find((e) => e.value == item.inputtype)
                                                                    return (
                                                                        <>
                                                                            <tr key={i}>
                                                                                <td >
                                                                                    <div className="form-group">
                                                                                        <input type="file" accept="image/jpg, image/jpeg, image/png" className="form-control" placeholder="Icon" name='logo' onChange={(e) => this.changeArrayImage(e, i)} id="imageSet" />
                                                                                        <div className="invalid-feedback" style={{ display: logoError ? "block" : 'none' }}>Logo is required</div>

                                                                                        {(item.logo) ?
                                                                                            <div className="form-group mt-2 ml-2">
                                                                                                <img src={(typeof item.logo != 'string') ? URL.createObjectURL(item.logo) : ImportedURL.LIVEURL + item.logo} width={"60px"} height={"60px"} alt='' />
                                                                                            </div>
                                                                                            :
                                                                                            ""
                                                                                        }
                                                                                    </div>
                                                                                </td>
                                                                                <td >
                                                                                    <div className="form-group">
                                                                                        <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='appname' value={item.appname} onChange={(e) => this.changeArray(e, i)} placeholder="Name" />
                                                                                        <div className="invalid-feedback" style={{ display: appnameError ? "block" : 'none' }}>App Name is required</div>
                                                                                    </div>
                                                                                </td>
                                                                                <td >
                                                                                    <div className="form-group">
                                                                                        <Select
                                                                                            className='overall_select_option'
                                                                                            value={inputTypeValue ? { label: inputTypeValue.label, value: inputTypeValue.value } : ''}
                                                                                            onChange={(e) => this.changeSelectArray(e, i)}
                                                                                            options={inputTypeList && inputTypeList.map(e => {
                                                                                                return {
                                                                                                    label: e.label,
                                                                                                    value: e.value,
                                                                                                    name: 'inputtype'
                                                                                                }
                                                                                            })}
                                                                                            menuPortalTarget={document.body}
                                                                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                        />
                                                                                        <div className="invalid-feedback" style={{ display: inputtypeError ? "block" : 'none' }}>Input Type is required</div>
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="col-sm-6 col-md-3">
                                                                                        <div className='todo_decrement' style={{ marginTop: '0px' }}>
                                                                                            {(data.types && data.types.length > 1) ?
                                                                                                < span className='plus_minus' > <i className="fa fa-minus-circle" aria-hidden="true" onClick={() => this.removeFormFields(i)}></i></span>
                                                                                                : ''}
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                }
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
        HandleChange: AC_HANDLE_INPUT_CHANGE_APP,
        ViewApp: AC_VIEW_APP,
        AppSpinner: AC_APP_SPINNER,
        EmptySpinner: AC_EMPTY_APP,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withParams(AddApp));