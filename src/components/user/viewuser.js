import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { AiOutlineAppstore } from "react-icons/ai";
import { useParams } from "react-router";
import { AC_EMPTY_USER, AC_HANDLE_INPUT_CHANGE_PROFILE, AC_USER_SPINNER, AC_VIEW_USER } from "../../actions/profileAction";
import ImportedURL from "../../common/api";
import moment from "moment";
import { Capitalize } from "../../common/validate";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

class ViewUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personalDetailStatus: false,
            businessDetailsStatus: false,
            appLinkStatus: false,
            saveContactStatus: false,
            loginHistoryStatus: false,
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
    render() {
        const { profileState } = this.props;
        const data = profileState.profile
        const spinner = profileState.spinner
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
                                        <li class="breadcrumb-item active">View User</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card card-primary header_border" >
                            <div class="table-title">
                                <div className="card-header">
                                    <h3 className="card-title d-flex "> <div className='rounded_icon'> <AiOutlineAppstore className="mr-2 header_icon" /></div><h2 class="card-title header_title">VIEW USER</h2> </h3>
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
                                        <div className="row">
                                            {
                                                (data.banner)
                                                &&
                                                <>
                                                    <div className="col-3" style={{ paddingTop: '15px' }}>
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Banner Image</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2" style={{ paddingTop: '15px' }}>:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            <a href={ImportedURL.LIVEURL + data.banner} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                <img src={ImportedURL.LIVEURL + data.banner} width={100} height={60} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {
                                                (data.image)
                                                &&
                                                <>
                                                    <div className="col-3" style={{ paddingTop: '15px' }}>
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Image</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2" style={{ paddingTop: '15px' }}>:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            <a href={ImportedURL.LIVEURL + data.image} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                <img src={ImportedURL.LIVEURL + data.image} width={60} height={60} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Username</label>
                                                </div>
                                            </div>
                                            <div className="col-2">:</div>
                                            <div className="col-7">
                                                <div className="form-group">
                                                    {data.username}
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Email</label>
                                                </div>
                                            </div>
                                            <div className="col-2">:</div>
                                            <div className="col-7">
                                                <div className="form-group">
                                                    {data.email}
                                                </div>
                                            </div>
                                            {
                                                (data.uniqueid)
                                                &&
                                                <>
                                                    <div className="col-3">
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Unique ID</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2">:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            {data.uniqueid}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {
                                                (data.cardtype)
                                                &&
                                                <>
                                                    <div className="col-3" style={{ paddingTop: '15px' }}>
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Card Type</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2" style={{ paddingTop: '15px' }}>:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            {
                                                                (data.cardtype == "1" || data.cardtype == "2" || data.cardtype == "3" || data.cardtype == "4" || data.cardtype == "5" || data.cardtype == "6" || data.cardtype == "7")
                                                                    ?
                                                                    <>
                                                                        {data.cardtype == "1" && <img src={ImportedURL.LIVEURL + 'public/assets/images/Type1.jpg'} width={100} height={60} />}
                                                                        {data.cardtype == "2" && <img src={ImportedURL.LIVEURL + 'public/assets/images/Type2.jpg'} width={100} height={60} />}
                                                                        {data.cardtype == "3" && <img src={ImportedURL.LIVEURL + 'public/assets/images/Type3.jpg'} width={100} height={60} />}
                                                                        {data.cardtype == "4" && <img src={ImportedURL.LIVEURL + 'public/assets/images/Type4.jpg'} width={100} height={60} />}
                                                                        {data.cardtype == "5" && <img src={ImportedURL.LIVEURL + 'public/assets/images/Type5.jpg'} width={100} height={60} />}
                                                                        {data.cardtype == "6" && <img src={ImportedURL.LIVEURL + 'public/assets/images/Type6.jpg'} width={100} height={60} />}
                                                                        {data.cardtype == "7" && <img src={ImportedURL.LIVEURL + 'public/assets/images/Type7.jpg'} width={100} height={60} />}
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <p style={{ paddingTop: '15px' }}>
                                                                            {data.cardtype}
                                                                        </p>
                                                                    </>
                                                            }

                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {
                                                (data.displayname)
                                                &&
                                                <>
                                                    <div className="col-3">
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Display Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2">:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            {data.displayname}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {
                                                (data.headline)
                                                &&
                                                <>
                                                    <div className="col-3">
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Headline</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2">:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            {data.headline}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {
                                                (data.ispublicprofile)
                                                &&
                                                <>
                                                    <div className="col-3">
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Public Profile</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2">:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            {data.ispublicprofile ? "Yes" : "No"}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {
                                                (data.countContactSaver)
                                                &&
                                                <>
                                                    <div className="col-3">
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Save Contact</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2">:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            {data.countContactSaver}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {
                                                (data.countLoginHistory)
                                                &&
                                                <>
                                                    <div className="col-3">
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Login Histories</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2">:</div>
                                                    <div className="col-7">
                                                        <div className="form-group">
                                                            {data.countLoginHistory}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        {
                                            (data.dob || data.bloodgroup || data.location || data.phonenumber || data.education || (data.skill && data.skill.length > 0))
                                            &&
                                            <div className='row ticket_history'>
                                                <div className='col-lg-12'>
                                                    <div className="card">
                                                        <div className="card-header" style={{ cursor: 'pointer' }} onClick={(e) => { this.setState({ personalDetailStatus: !this.state.personalDetailStatus }) }}>
                                                            <h3 className="card-title">Personal Details</h3>
                                                            <div className="card-options">
                                                            </div>
                                                        </div>
                                                        {
                                                            (this.state.personalDetailStatus)
                                                            &&
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    {
                                                                        (data.dob)
                                                                        &&
                                                                        <>
                                                                            <div className="col-3">
                                                                                <div className="form-group">
                                                                                    <label for="exampleInputEmail1">D.O.B</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2">:</div>
                                                                            <div className="col-7">
                                                                                <div className="form-group">
                                                                                    {data.dob}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {
                                                                        (data.bloodgroup)
                                                                        &&
                                                                        <>
                                                                            <div className="col-3">
                                                                                <div className="form-group">
                                                                                    <label for="exampleInputEmail1">Blood Group</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2">:</div>
                                                                            <div className="col-7">
                                                                                <div className="form-group">
                                                                                    {data.bloodgroup}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {
                                                                        (data.location)
                                                                        &&
                                                                        <>
                                                                            <div className="col-3">
                                                                                <div className="form-group">
                                                                                    <label for="exampleInputEmail1">Loaction</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2">:</div>
                                                                            <div className="col-7">
                                                                                <div className="form-group">
                                                                                    {data.location}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {
                                                                        (data.phonenumber)
                                                                        &&
                                                                        <>
                                                                            <div className="col-3">
                                                                                <div className="form-group">
                                                                                    <label for="exampleInputEmail1">Phone Number</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2">:</div>
                                                                            <div className="col-7">
                                                                                <div className="form-group">
                                                                                    {((data.cc != undefined && data.cc && data.cc.name != undefined) ? data.cc.value : "") + " " + data.phonenumber}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {
                                                                        (data.education)
                                                                        &&
                                                                        <>
                                                                            <div className="col-3">
                                                                                <div className="form-group">
                                                                                    <label for="exampleInputEmail1">Education</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2">:</div>
                                                                            <div className="col-7">
                                                                                <div className="form-group">
                                                                                    {data.education}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {
                                                                        (data.skill && data.skill.length > 0)
                                                                        &&
                                                                        <>
                                                                            <div className="col-3">
                                                                                <div className="form-group">
                                                                                    <label for="exampleInputEmail1">Skill</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2">:</div>
                                                                            <div className="col-7">
                                                                                <div className="form-group">
                                                                                    {data.skill.join(", ")}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            (data.designation || data.work || data.businesslocation || data.businessphonenumber)
                                            &&
                                            <>
                                                <div className='row ticket_history'>
                                                    <div className='col-lg-12'>
                                                        <div className="card">
                                                            <div className="card-header" style={{ cursor: 'pointer' }} onClick={(e) => { this.setState({ businessDetailsStatus: !this.state.businessDetailsStatus }) }}>
                                                                <h3 className="card-title">Business Details</h3>
                                                                <div className="card-options">
                                                                </div>
                                                            </div>
                                                            {
                                                                (this.state.businessDetailsStatus)
                                                                &&
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        {
                                                                            (data.designation)
                                                                            &&
                                                                            <>
                                                                                <div className="col-3">
                                                                                    <div className="form-group">
                                                                                        <label for="exampleInputEmail1">Designation </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2">:</div>
                                                                                <div className="col-7">
                                                                                    <div className="form-group">
                                                                                        {data.designation}
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        {
                                                                            (data.work)
                                                                            &&
                                                                            <>
                                                                                <div className="col-3">
                                                                                    <div className="form-group">
                                                                                        <label for="exampleInputEmail1">Work </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2">:</div>
                                                                                <div className="col-7">
                                                                                    <div className="form-group">
                                                                                        {data.work}
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        {
                                                                            (data.businesslocation)
                                                                            &&
                                                                            <>
                                                                                <div className="col-3">
                                                                                    <div className="form-group">
                                                                                        <label for="exampleInputEmail1">Loaction </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2">:</div>
                                                                                <div className="col-7">
                                                                                    <div className="form-group">
                                                                                        {data.businesslocation}
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        {
                                                                            (data.businessphonenumber)
                                                                            &&
                                                                            <>
                                                                                <div className="col-3">
                                                                                    <div className="form-group">
                                                                                        <label for="exampleInputEmail1">Phone Number </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2">:</div>
                                                                                <div className="col-7">
                                                                                    <div className="form-group">
                                                                                        {((data.businesscc != undefined && data.businesscc && data.businesscc.name != undefined) ? data.businesscc.value : "") + " " + data.businessphonenumber}
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        {
                                            (data.applink && data.applink.length > 0)
                                            &&
                                            <>
                                                <div className='row ticket_history'>
                                                    <div className='col-lg-12'>
                                                        <div className="card">
                                                            <div className="card-header" style={{ cursor: 'pointer' }} onClick={(e) => { this.setState({ appLinkStatus: !this.state.appLinkStatus }) }}>
                                                                <h3 className="card-title">App Links</h3>
                                                                <div className="card-options">
                                                                </div>
                                                            </div>
                                                            {
                                                                (this.state.appLinkStatus)
                                                                &&
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        {
                                                                            (data.applink && data.applink.length > 0)
                                                                            &&
                                                                            data.applink.map((item) => {
                                                                                let location = (item.street ? (item.street).replace(/,/g, "") + ', ' : "") + (item.city ? (item.city).replace(/,/g, "") + ", " : "") + (item.state ? " " + (item.state).replace(/,/g, "") + ', ' : "") + (item.country ? " " + (item.country).replace(/,/g, "") : "")
                                                                                const mapUrl = `https://www.google.com/maps/place/${encodeURIComponent(location)}`;
                                                                                return (
                                                                                    <>
                                                                                        <div className="col-3">
                                                                                            <div className="form-group">
                                                                                                <img className="mr-2" src={ImportedURL.LIVEURL + item.logo} width={40} height={40} />
                                                                                                <label for="exampleInputEmail1">{item.name} </label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-2">:</div>
                                                                                        {
                                                                                            (item.inputtype == 'address')
                                                                                            &&
                                                                                            <>
                                                                                                <div className="col-7">
                                                                                                    <div className="form-group link_preview_status">
                                                                                                        <a href={mapUrl} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                            {(item.street ? " " + item.street : "") + (item.city ? " " + item.city : "") + (item.state ? " " + item.state : "") + (item.country ? " " + item.country : "") + (item.zip ? " - " + item.zip : "")}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'url')
                                                                                            &&
                                                                                            <>
                                                                                                <div className="col-7">
                                                                                                    <div className="form-group link_preview_status">
                                                                                                        <a href={item.link} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                            {item.link}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'number')
                                                                                            &&
                                                                                            <>
                                                                                                <div className="col-7">
                                                                                                    <div className="form-group link_preview_status">
                                                                                                        <a href={"tel:" + ((item.cc.value != undefined && item.cc) ? item.cc.value + "" : "") + item.value} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                            {((item.cc.value != undefined && item.cc) ? item.cc.value + " " : "") + item.value}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'email')
                                                                                            &&
                                                                                            <>
                                                                                                <div className="col-7">
                                                                                                    <div className="form-group link_preview_status">
                                                                                                        <a href={"mailto:" + item.link} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                            {item.value}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'document')
                                                                                            &&
                                                                                            <>
                                                                                                <div className="col-7">
                                                                                                    <div className="form-group link_preview_status">
                                                                                                        <a href={ImportedURL.FILEURL + item.value} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                        {(item.value).toLowerCase()}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'none')
                                                                                            &&
                                                                                            <>
                                                                                                <div className="col-7">
                                                                                                    <div className="form-group link_preview_status">
                                                                                                        {item.value}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                    </>
                                                                                )
                                                                            })

                                                                        }
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        {
                                            (data.loginHistory != undefined && data.loginHistory.length > 0)
                                            &&
                                            < div className='row ticket_history'>
                                                <div className='col-lg-12'>
                                                    <div className="card">
                                                        <div className="card-header" style={{ cursor: 'pointer' }} onClick={(e) => { this.setState({ loginHistoryStatus: !this.state.loginHistoryStatus }) }}>
                                                            <h3 className="card-title">Login History</h3>
                                                            <div className="card-options">
                                                            </div>
                                                        </div>
                                                        {
                                                            (this.state.loginHistoryStatus)
                                                            &&
                                                            <div className="card-body">
                                                                <table class="table table-borderless table_border">
                                                                    <thead className="table_header">
                                                                        <tr style={{ textAlign: "center" }}>
                                                                            <th ><p>Ip Address</p></th>
                                                                            <th ><p>Login Device</p></th>
                                                                            <th ><p>Login Address</p></th>
                                                                            <th ><p>Last Login</p></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="table_body">
                                                                        {
                                                                            (data.loginHistory && data.loginHistory.length > 0)
                                                                            &&
                                                                            data.loginHistory.map((item, i) => {
                                                                                return (
                                                                                    <>
                                                                                        <tr key={i} sty>
                                                                                            <td >
                                                                                                <div className=" Center_display_table">
                                                                                                    {item.ip}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td >
                                                                                                <div className="Center_display_table">
                                                                                                    {Capitalize(item.device)}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td >
                                                                                                <div className="Center_display_table">
                                                                                                    {item.addresss}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td >
                                                                                                <div className="Center_display_table">
                                                                                                    {moment(item.time).format("MM/DD/YYYY ddd hh:mm A")}
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            (data.saverHistory != undefined && data.saverHistory.length > 0)
                                            &&
                                            <>
                                                <div className='row ticket_history'>
                                                    <div className='col-lg-12'>
                                                        <div className="card">
                                                            <div className="card-header" style={{ cursor: 'pointer' }} onClick={(e) => { this.setState({ saveContactStatus: !this.state.saveContactStatus }) }}>
                                                                <h3 className="card-title">Save Contact History</h3>
                                                                <div className="card-options">
                                                                </div>
                                                            </div>
                                                            {
                                                                this.state.saveContactStatus
                                                                &&
                                                                <div className="card-body">
                                                                    {
                                                                        data.saverHistory ? data.saverHistory.map((item, i) => {
                                                                            return (
                                                                                <>
                                                                                    <div className="timeline_item ">
                                                                                        <img className="tl_avatar" src={item.saverimage ? ImportedURL.LIVEURL + item.saverimage : "/assets/images/avatar2.jpg"} />
                                                                                        <span >
                                                                                            <span className="font600" >{item.saverusername ? item.saverusername : 'Unknown Person'}</span>
                                                                                            <small className="float-right text-right">{moment(item.time).format("MM-DD-YYYY")}</small>
                                                                                        </span>
                                                                                        <div className="row">
                                                                                            {item.ip
                                                                                                &&
                                                                                                <>
                                                                                                    <div className="col-2"><div className="form-group">Ip Address</div></div>
                                                                                                    <div className="col-1"><div className="form-group">:</div></div>
                                                                                                    <div className="col-9"> <div className="form-group">{item.ip}</div></div>
                                                                                                </>
                                                                                            }
                                                                                            {item.addresss
                                                                                                &&
                                                                                                <>
                                                                                                    <div className="col-2"><div className="form-group">Address</div></div>
                                                                                                    <div className="col-1"><div className="form-group">:</div></div>
                                                                                                    <div className="col-9"> <div className="form-group">{item.addresss}</div></div>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                item.device
                                                                                                &&
                                                                                                <>
                                                                                                    <div className="col-2"><div className="form-group">Device</div></div>
                                                                                                    <div className="col-1"><div className="form-group">:</div></div>
                                                                                                    <div className="col-9"> <div className="form-group">{item.device}</div></div>
                                                                                                </>

                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        }) : ''
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                            </>
                                        }


                                    </div>
                                </form>
                            </div>
                        </div>
                    </div >
                </div >
                {
                    spinner ?
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

export default connect(mapStateToProps, mapDispatchToProps)(withParams(ViewUser));