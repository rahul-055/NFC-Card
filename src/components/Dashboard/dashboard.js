import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { AC_APP_SPINNER, AC_LIST_APP } from "../../actions/appAction";
import { AC_LIST_PROFILE } from "../../actions/profileAction";
import { Spinner } from "react-bootstrap";
import { AiOutlineAppstore, AiOutlineQuestionCircle } from "react-icons/ai";
import { BiLogIn, BiSave } from "react-icons/bi";
import { AC_LIST_LOGIN_HISTORY } from "../../actions/loginhistoryAction";
import Chart from 'react-apexcharts'
import axios from "axios";
import ImportedURL from "../../common/api";
import { AC_LIST_ENQUIRY } from "../../actions/enquiryAction";

const loaderStyle = {
    textAlign: 'center',
    position: 'absolute',
    zIndex: 1,
    top: '120px',
    left: '46%'
};
class ListHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userOptions: {
                chart: {
                    height: "100%",
                },
                labels: [],
                dataLabels: {
                    formatter: function (val, opts) {
                        return opts.w.config.series[opts.seriesIndex]
                    },
                },
            },
            userSeries: [],
        }
    }
    componentDidMount() {
        this.props.AppSpinner()
        this.props.ListUser()
        this.props.ListLoginHistory()
        this.props.ListEnquiry()
        axios.get(ImportedURL.API.countSaveContactDashboard)
            .then((res) => {
                let savercontact = Object.entries(res.data);
                let userNameArray = [];
                let countSerieslArray = [];
                for (let index = 0; index < savercontact.length; index++) {
                    userNameArray.push(savercontact[index][0])
                    countSerieslArray.push(savercontact[index][1].counter)
                }
                this.setState({ secSpinner: false, 'userSeries': countSerieslArray, userOptions: { ...this.state.userOptions, ...this.state.userOptions, labels: userNameArray } });
            }).catch((err) => { console.log(err); });
        this.props.ListApp()
    }
    render() {
        const { accountState, appState, profileState, loginhistoryState, enquiryState } = this.props;
        const account = accountState.account
        const listApp = appState.listApp
        const spinner = appState.spinner
        const listUser = profileState.listUser
        const listEnquiry = enquiryState.listEnquiry

        return (
            <>
                <div className="section-body mt-3">
                    <div className="container-fluid">
                        <div className="row clearfix">
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon">
                                        <div className="ribbon-box orange">{listUser.length > 0 ? listUser.length : 0}</div>
                                        <Link className="my_sort_cut text-muted" to="/admin/list-user">
                                            <i className="fe fe-search"></i><span>USER</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon">
                                        <div className="ribbon-box orange">{listApp.length > 0 ? listApp.length : 0}</div>
                                        <Link className="my_sort_cut text-muted" to="/admin/list-app">
                                            <i className="icon-globe"></i><span>APP</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon">
                                        <div className="ribbon-box orange">{listEnquiry.length > 0 ? listEnquiry.length : 0}</div>
                                        <Link className="my_sort_cut text-muted" to="/admin/list-enquiry">
                                            <i className="fa fa-copyright"></i><span>ENQUIRY</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row clearfix">
                            <div className="col-12 ">
                                <div className="card" style={{ height: '582px' }}>
                                    <div className="card-header">
                                        <h3 className="card-title d-flex "> <div className='rounded_icon'> <BiSave className="mr-2 header_icon" /></div><h2 class="card-title header_title">Save Contact</h2> </h3>
                                    </div>
                                    {this.state.userSeries.length > 0 ?
                                        <div className="chart_center">
                                            <Chart options={this.state.userOptions} series={this.state.userSeries} type="pie" width="700" height="500" />
                                        </div>
                                        :
                                        <div className="card-header pt-0">
                                            <div className="card-body text-center d-flex align-items-center justify-content-center pt-0">
                                                <div style={{ maxWidth: "340px" }}>
                                                    <img src="../assets/images/nothing-here.png" alt="..." className="img-fluid" style={{ maxWidth: "272px" }} />
                                                    <h5 className="mb-2">No record to display</h5>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        fixNavbar: state.settings.isFixNavbar,
        accountState: state.account,
        appState: state.app,
        profileState: state.profile,
        loginhistoryState: state.loginhistory,
        enquiryState: state.enquiry,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ListUser: AC_LIST_PROFILE,
        ListApp: AC_LIST_APP,
        AppSpinner: AC_APP_SPINNER,
        ListLoginHistory: AC_LIST_LOGIN_HISTORY,
        ListEnquiry: AC_LIST_ENQUIRY,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ListHistory);