import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Container, Col, Button, Spinner } from 'react-bootstrap';
import { FiChevronRight, FiEdit } from 'react-icons/fi';
import { BiEdit, BiMap, BiSave } from 'react-icons/bi';
import { Link } from "react-router-dom";
import { AC_DRAG_SOCIALMEDIA_LIST, AC_HANDLE_INPUT_CHANGE_PROFILE, AC_VIEW_PROFILE } from '../../actions/profileAction';
import ImportedURL from '../../common/api';
import { Error } from '../../common/swal';
import { AiOutlinePhone, AiOutlineSetting } from 'react-icons/ai';
import { HiOutlineChevronLeft } from 'react-icons/hi';

class UniqueId extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateSpinner: false,
            matches: window.matchMedia("(min-width: 1100px)").matches,
        }
    }
    componentDidMount() {
        document.title = 'ACW CARD - A new-gen versatile digital card'
        document.description = 'ACW Card enables you to share your business and personal profiles along with digital uploads of key documents to strengthen your portfolio.'

        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 1100px)").addEventListener('change', handler);
    }
    vCard = () => {
        const unique = window.location.href.split('/')[3]
        const { ProfileState, accountState } = this.props;
        const uniqueData = ProfileState.profile
        const account = accountState.account
        this.setState({ updateSpinner: true })
        axios.get('https://ipapi.co/json/').then((response) => {
            let data = response.data;
            const formData = {
                time: new Date(),
                ip: data.ip,
                city: data.city,
                country: data.country_name,
                uniqueid: uniqueData.uniqueid ? uniqueData.uniqueid : "",
                id: uniqueData._id ? uniqueData._id : '',
                website: this.state.matches,
            }
            if (unique.includes('&uId=')) {
                formData['group'] = true
            } else {
                formData['group'] = false
            }
            if (account._id) {
                formData['saverId'] = account._id
            }
            axios.post(ImportedURL.API.vCardGenerate, formData)
                .then((res) => {
                    this.setState({ updateSpinner: false })
                    if (res.data) {
                        var url = 'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(res.data.vcard);
                        document.location.href = url;
                    }
                }).catch(({ response }) => {
                    this.setState({ updateSpinner: false })
                    if (response) {
                        if (response.status == 401) {
                            Error('Something wrong, Retry again!')
                        } else if (response.status == 502) {
                            Error(response.status + ' Bad Gateway')
                        } else if (response.status == 500) {
                            Error('Internal Server Error')
                        } else if (response.status == 400) {
                            Error('Bad request')
                        }
                    }
                });
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        const { ProfileState, accountState } = this.props;
        const data = ProfileState.profile
        const account = accountState.account
        const spinner = ProfileState.spinner
        let locationData = {}
        if (data.displayApp && data.displayApp.length > 0) {
            for (let i = data.displayApp.length; i > 0; i--) {
                if (data.displayApp[i] != undefined) {
                    if (data.displayApp[i].inputtype != undefined && data.displayApp[i].inputtype) {
                        if (data.displayApp[i].inputtype == 'address') {
                            locationData = data.displayApp[i]
                            break;
                        }
                    }
                }
            }
        }
        let displayLoc = ''
        if (locationData.inputtype != undefined && locationData.inputtype) {
            displayLoc = (locationData.street ? (locationData.street).replace(/,/g, "") + ',' : "") + (locationData.city ? (locationData.city).replace(/,/g, "") + ',' : "") + (locationData.state ? (locationData.state).replace(/,/g, "") + ',' : "") + (locationData.country ? (locationData.country).replace(/,/g, "") + ',' + ' ' : "") + (locationData.zip ? "- " + locationData.zip : "")
            var mapUrlDisplay = `https://www.google.com/maps/place/${encodeURIComponent(displayLoc)}`;
        }
        return (
            <div style={{ position: 'relative' }}>
                <div className='home_section account_section profile_section gap_padding_space'>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col xs="12" lg="5" md="12" sm="12">
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
                                <div className='profile_header_text'>
                                </div>
                                <div className='home_sec'>
                                    <div className='account_profile_sec'>
                                        <div className='account_profile'>
                                            {/* <div className='profile_header_text'>
                                                <p className='left_profile_icon'>
                                                    <Link to="/accountsetting">
                                                        <AiOutlineSetting />
                                                    </Link>
                                                </p>
                                                <div className='home_images mb-4' style={{ margin: "50px auto 0px" }}>
                                                    <Link to='/'>
                                                        <img src='../assets/images/acwcard.jpg' style={{ objectFit: 'cover' }} />
                                                    </Link>
                                                </div>
                                                <p className='right_profile_icon'>
                                                    <Link to='/profile'><HiOutlineChevronLeft /></Link>
                                                </p>
                                            </div> */}
                                            {/* <div className='progfile_images'>
                                                <div class="image-upload">
                                                    <div className='pro_bg_image'>
                                                        <img src={data.banner ? ImportedURL.LIVEURL + data.banner : '../assets/images/acwprofilebg.png'} />
                                                    </div>
                                                </div>
                                                <div class="image-upload">
                                                    <div className='round_profile'>
                                                        <img src={data.image ? ImportedURL.LIVEURL + data.image : '../assets/images/user.png'} />
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className='progfile_images'>
                                                <div class="image-upload">
                                                    <div className='pro_bg_image'>

                                                        {
                                                            (this.state.bgimage || data.banner) ?
                                                                <img src={this.state.bgimage ? URL.createObjectURL(this.state.bgimage) : ImportedURL.LIVEURL + data.banner} alt='' />
                                                                : <img className="avatar" src="../assets/images/acwprofilebg.png" data-toggle="tooltip" data-original-title="Avatar Name" alt="" />
                                                        }
                                                    </div>
                                                    <input id="file-input" type="file" name="banner" onChange={this.onChangeImage} />
                                                </div>
                                                <div class="image-upload">
                                                    <div className='round_profile'>
                                                        {(this.state.profileimg || data.image) ?
                                                            <>
                                                                <img src={this.state.profileimg ? URL.createObjectURL(this.state.profileimg) : ImportedURL.LIVEURL + data.image} />
                                                            </>
                                                            :
                                                            <>
                                                                <img src='../assets/images/user.png' />
                                                            </>
                                                        }
                                                        <input id="file-input1" type="file" style={{ display: 'none' }} name="image" onChange={this.onChangeImage} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='account_profile_text ' style={{ paddingTop: '60px ' }}>
                                                <h3>{data.displayname ? data.displayname : '---'}</h3>
                                                <h5>{data.headline ? data.headline : ''}</h5>
                                                <>
                                                    <div>
                                                        <p>{data.work ? data.work : ''}</p>
                                                        {
                                                            displayLoc
                                                                ?
                                                                <p>
                                                                    <a href={mapUrlDisplay} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                        <BiMap className='display_name_profile' />{displayLoc}
                                                                    </a>
                                                                </p>
                                                                : ""
                                                        }
                                                        {
                                                            data.phonenumber
                                                                ?
                                                                <p>
                                                                    <a href={"tel:" + ((data.cc.value != undefined && data.cc) ? data.cc.value + "" : "") + data.phonenumber} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                        <AiOutlinePhone className='display_name_profile' />
                                                                        <>
                                                                            {
                                                                                (data.cc.value != undefined && data.cc) ? data.cc.value + " " : ""
                                                                            }
                                                                        </>
                                                                        {data.phonenumber}
                                                                    </a>
                                                                </p>
                                                                : ""
                                                        }
                                                    </div>
                                                    <div className='mt-2'>
                                                        {
                                                            (data.skill && data.skill.length > 0)
                                                            &&
                                                            data.skill.map((item, i) => {
                                                                return (
                                                                    <>
                                                                        <Button variant="secondary" className='profile_account_badges'><span>{item}</span></Button>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </>
                                            </div>
                                            <div className='edit_contact_btn mt-4 mb-3'>
                                                <button onClick={() => this.vCard()} className="save_contact">
                                                    <BiSave className="sidebar_icon mr-2" style={{ position: 'relative', bottom: '2px' }} />Save Contact
                                                </button>
                                            </div>
                                            {
                                                (data.displayApp && data.displayApp.length > 0)
                                                    ?
                                                    <>
                                                        < div className='social_media_part mt-4'>
                                                            {
                                                                data.displayApp.map((item) => {
                                                                    let location = (item.street ? (item.street).replace(/,/g, "") + ',' : "") + (item.city ? (item.city).replace(/,/g, "") + "," : "") + (item.state ? (item.state).replace(/,/g, "") + ',' : "") + (item.country ? (item.country).replace(/,/g, "") : "")
                                                                    const mapUrl = `https://www.google.com/maps/place/${encodeURIComponent(location)}`;
                                                                    return (
                                                                        <>
                                                                            <div className='social_media mt-3'>
                                                                                <div className='social_media_logo'>
                                                                                    <img src={ImportedURL.LIVEURL + item.logo} />
                                                                                </div>
                                                                                <div className='social_media_text'>
                                                                                    <div>
                                                                                        {
                                                                                            (item.inputtype == 'document')
                                                                                                ?
                                                                                                <div className='d-flex' style={{ alignItems: 'center', height: '45px' }}>
                                                                                                    <a href={ImportedURL.FILEURL + item.value} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                        <h6>{item.name}</h6>
                                                                                                    </a>
                                                                                                </div>
                                                                                                :
                                                                                                <h6>{item.name}</h6>
                                                                                        }

                                                                                        {
                                                                                            (item.inputtype == 'address')
                                                                                            &&
                                                                                            <>
                                                                                                <p className='link_over_flow' >
                                                                                                    <a href={mapUrl} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                        {(item.street ? " " + item.street : "") + (item.city ? " " + item.city : "") + (item.state ? " " + item.state : "") + (item.country ? " " + item.country : "") + (item.zip ? " - " + item.zip : "")}
                                                                                                    </a>
                                                                                                </p>

                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'url')
                                                                                            &&
                                                                                            <>
                                                                                                <p className='link_over_flow'>
                                                                                                    <a href={item.link} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                        {item.link}
                                                                                                    </a>
                                                                                                </p>
                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'number')
                                                                                            &&
                                                                                            <>
                                                                                                <p className='link_over_flow'>
                                                                                                    <a href={"tel:" + ((item.cc.value != undefined && item.cc) ? item.cc.value + "" : "") + item.value} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                        {((item.cc.value != undefined && item.cc) ? item.cc.value + " " : "") + item.value}
                                                                                                    </a>
                                                                                                </p>
                                                                                            </>
                                                                                        }
                                                                                        {
                                                                                            (item.inputtype == 'email')
                                                                                            &&
                                                                                            <>
                                                                                                <p className='link_over_flow'>
                                                                                                    <a href={"mailto:" + item.link} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                        {item.value}
                                                                                                    </a>
                                                                                                </p>
                                                                                            </>
                                                                                        }
                                                                                        {/* {
                                                                                            (item.inputtype == 'document')
                                                                                            &&
                                                                                            <>
                                                                                                <p className='link_over_flow'>
                                                                                                    <a href={ImportedURL.FILEURL + item.value} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                        {(item.value).toLowerCase()}
                                                                                                    </a>
                                                                                                </p>
                                                                                            </>
                                                                                        } */}
                                                                                        {
                                                                                            (item.inputtype == 'none')
                                                                                            &&
                                                                                            <>
                                                                                                <p className='link_over_flow'>
                                                                                                    {item.value}
                                                                                                </p>
                                                                                            </>
                                                                                        }

                                                                                    </div>
                                                                                    <div className='social_media_right_icon'>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </>

                                                    :
                                                    <>
                                                        <div className='nothing_here_image'>
                                                            <img src="../assets/images/nothing-here.png" />
                                                        </div>
                                                        <div className='nothing_here_text'> No record to display</div>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                {(spinner || this.state.updateSpinner) ?
                    <div style={{ height: '100vh', position: 'fixed', width: '100%', top: '0px', }}>
                        <div style={{ position: 'relative' }}></div>
                        <div className='common_loader'>
                            <img className='loader_img_style_common' src='/assets/images/logo.jpg' />
                            <Spinner className='spinner_load_common' animation="border" variant="info" >
                            </Spinner>
                        </div>
                    </div>
                    : ""}
            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    ProfileState: state.profile,
    accountState: state.account,
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        HandleInputChange: AC_HANDLE_INPUT_CHANGE_PROFILE,
        ViewProfile: AC_VIEW_PROFILE,
        dragChange: AC_DRAG_SOCIALMEDIA_LIST,
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(UniqueId);