import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import ImportedURL from "../../common/api";
import { Spinner } from "react-bootstrap";
import { AiOutlineAppstore, GrFormAdd } from "react-icons/ai";
import { AC_APP_SPINNER, AC_EMPTY_APP, AC_HANDLE_INPUT_CHANGE_APP, AC_VIEW_APP } from "../../actions/appAction";
import { Redirect } from 'react-router-dom';
import { useParams } from "react-router";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

class ViewApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalType: "Add",
            id: '',
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
    render() {
        if (this.state.ListState) return <Redirect to={'/admin/list-app'} />

        const { accountState, appState } = this.props;
        const account = accountState.account
        const data = appState.app
        const spinner = appState.spinner

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
                                            <div className="col-2">
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Name</label>
                                                </div>
                                            </div>
                                            <div className="col-1">:</div>
                                            <div className="col-7">
                                                <div className="form-group">
                                                    {data.name}
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            (data.types && data.types.length > 0)
                                            &&
                                            <table class="table table-borderless table_border">
                                                <thead className="table_header">
                                                    <tr style={{ textAlign: "center" }}>
                                                        <th style={{ width: '50%' }}><p>Logo</p></th>
                                                        <th style={{ width: '50%' }}><p>App Name</p></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table_body">
                                                    {
                                                        (data.types && data.types.length > 0)
                                                        &&
                                                        data.types.map((item, i) => {
                                                            let preview = (this.state.preview && this.state.preview.length > 0) ? this.state.preview.find((e, j) => j === i) : ''
                                                            return (
                                                                <>
                                                                    <tr key={i} sty>
                                                                        <td >
                                                                            <div className=" Center_display_table">
                                                                                {(item.logo) ?
                                                                                    <div className="form-group mt-2 ml-2">
                                                                                        <img src={(typeof item.logo != 'string') ? URL.createObjectURL(item.logo) : ImportedURL.LIVEURL + item.logo} width={"60px"} height={"60px"} alt='' />
                                                                                    </div>
                                                                                    :
                                                                                    "---"
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                        <td >
                                                                            <div className="Center_display_table">
                                                                                {item.appname}
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

export default connect(mapStateToProps, mapDispatchToProps)(withParams(ViewApp));