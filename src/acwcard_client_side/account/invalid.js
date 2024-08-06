import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Container, Col, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { FiEdit, FiLogOut } from 'react-icons/fi';
import { AC_HANDLE_INPUT_CHANGE_PROFILE, AC_VIEW_PROFILE } from '../../actions/profileAction';
import { AC_LIST_APP } from '../../actions/appAction';
import { AiOutlineSetting } from 'react-icons/ai';

class Invalid extends Component {
    home = () => {
        localStorage.removeItem('acwtoken');
        localStorage.removeItem('type');
        window.location.href = "/";
    }
    componentDidMount() {
        document.title = 'ACW CARD - A new-gen versatile digital card'
        document.description = 'ACW Card enables you to share your business and personal profiles along with digital uploads of key documents to strengthen your portfolio.'
    }
    render() {
        const { ProfileState, appState } = this.props;

        return (
            <div>
                <div className='home_section profile_section'>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col xs="12" lg="5" md="12" sm="12" className='home_sec front_page' style={{height : '100vh'}}>
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
                                <div className='private_acc'>
                                    <div className='does_not mt-5 pt-5'>
                                        <h5>This username does not exist.</h5>
                                    </div>
                                </div>
                                <div className='edit_contact_btn does_home_btn mt-4 mb-3'>
                                    {/* <Link to='/'> */}
                                    <div>
                                        <button onClick={this.home} className='save_contact'>
                                            <FiEdit className='mr-2' />Home
                                        </button>
                                    </div>
                                    {/* </Link> */}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                {false ?
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
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Invalid);