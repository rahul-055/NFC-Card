import React, { Component } from 'react'
import { Row, Container, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Link, Redirect } from "react-router-dom";
import { browserHistory, Router, Route } from 'react-router';
import { withRouter } from 'react-router-dom';

import introJs from 'intro.js';
import 'intro.js/introjs.css';
// import 'intro.js/introjs.js';

class Brochure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skip: false,
            profile: false,
            time: 10,
            setting: false,
            currentStep: 0
        }

    }
    // startIntro = () => {
    //     const intro = introJs();
    //     console.log('-intro-', intro);
    //     intro.oncomplete(() => {
    //         // Do something when the tour is complete
    //     }).start();
    //     setTimeout(() => {
    //         intro.next();
    //     }, 3000); // Change this delay to adjust the autoplay timing
    // }
    componentDidMount() {
        const { history } = this.props;
        const intro = introJs();
        intro.setOptions({
            tooltipClass: 'my-tooltip-class',
            steps: [
                {
                    intro: '<img src="./assets/images/brochure_01.jpg" alt="">',
                    position: 'top'
                },
                {
                    intro: '<img  src="./assets/images/brochure_02.jpg" alt="">',
                    position: 'top'
                },
                {
                    intro: '<img  src="./assets/images/brochure_03.jpg" alt="">',
                    position: 'top'
                },
                {
                    intro: '<img  src="./assets/images/brochure_04.jpg" alt="">',
                    position: 'top'
                },
                {
                    intro: '<img  src="./assets/images/brochure_05.jpg" alt="">',
                    position: 'top'
                },
            ],
            buttons: [
                {
                    text: 'Next',
                    className: 'my-next-button',
                    onClick: function () {
                        introJs().next();
                    }
                },
                {
                    text: 'Back',
                    className: 'my-back-button',
                    onClick: function () {
                        introJs().previous();
                    }
                }
            ],
            positionPrecedence: ['top', 'bottom', 'left', 'right'],
            nextLabel: 'Next',
            prevLabel: 'Back',
            // skipLabel: 'Skip',
            doneLabel: 'Done',
            showButtons: true,
            showStepNumbers: false,
            nextTooltipPosition: 'top',
            prevTooltipPosition: 'top',
            autoNext: true, // enable auto next
            autoNextTimeout: 1000, // auto next timeout (in milliseconds)
            exitOnOverlayClick: false,
            overlayOpacity: 0,
            showSkip: false,
            showSkipButton: false,
            keyboardNavigation: false,
            autoplay: true,
            onExit: () => {
                this.handleExit(); // call another function
            },
        });
        intro.start();
        intro.onexit(function () {
            history.push('/profile');
        });
        intro.oncomplete(function () {
            history.push('/profile');
        });
        // intro.onbeforechange(() => {
        //     const step = intro.getCurrentStep();
        //     setTimeout(() => {
        //         intro.goToStep(step + 1);
        //     }, 2000); // Automatically advance to the next step after a 2-second delay
        //   });

        this.timer = setInterval(() => {
            if (intro._currentStep < intro._options.steps.length - 1) {
                intro.nextStep();
                this.setState({ currentStep: intro._currentStep });
            } else {
                clearInterval(this.timer);
            }
        }, 5000);


        // this.timer = setInterval(() => {
        //     if (intro._currentStep < intro._options.steps.length - 1) {
        //         intro.nextStep();
        //     } else {
        //         console.log('===============intro._currentStep====', intro._currentStep);
        //         console.log('-err');
        //         // intro.exit();
        //     }
        // }, 5000); // Advance to the next step after a 3-second delay

        // this.timer = setInterval(() => {
        //     if (this.state.time > 0) {
        //         this.setState(prevState => ({ time: prevState.time - 1 }));
        //     } else {
        //         this.setState({ skip: true })
        //         clearInterval(this.timer);
        //     }
        // }, 1000);
    }
    // skipBrochure = () => {
    //     const { ProfileState } = this.props;
    //     let brochure = ProfileState.brochure
    //     const { time, } = this.state;
    //     if (brochure == 'settings') {
    //         this.setState({ setting: true })
    //     } else {
    //         if (time === 0) {
    //             this.setState({ profile: true })
    //         }
    //     }
    // }

    // handleExit = () => {
    //     console.log('----------dcdscscscsacasca');
    //     // do something else here
    // }
    render() {
        if (this.state.profile) return <Redirect to={'/profile'} />
        if (this.state.setting) return <Redirect to={'/accountsetting'} />

        const { images } = this.state;


        // const { ProfileState } = this.props;
        // let brochure = ProfileState.brochure
        // const { time } = this.state;
        let count
        // if (brochure == 'settings') {
        //     count = 'Back'
        // } else {
        //     if (time === 0) {
        //         count = "skip"
        //     } else {
        //         count = time
        //     }
        // }



        return (
            <div>

                <div className='home_section profile_section gap_padding_space pro_bg'>
                    {/* <Container>
                        <Row className="justify-content-md-center">
                            <Col xs="12" lg="5" md="12" sm="12">
                                <OwlCarousel items={1}
                                    className="owl-theme carouse_one owl-carousel"
                                    loop
                                    autoplayTimeout={10000}
                                    dots={false}
                                    autoplay={true}
                                    margin={8} >
                                    <div class="item Brochure_button_header" style={{ position: 'relative' }}>
                                        <img className="img" src={'./assets/images/brochure_01.jpg'} />
                                        <div class="Brochure_button">
                                            <button type="button" class="shopnow_btn btn btn-primary" onClick={this.skipBrochure}>{count}</button>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <img className="img" src={'./assets/images/brochure_02.jpg'} />
                                        <div class="Brochure_button">
                                            <button type="button" class="shopnow_btn btn btn-primary" onClick={this.skipBrochure}>{count}</button>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <img className="img" src={'./assets/images/brochure_03.jpg'} />
                                        <div class="color_duf_btn" >
                                            <button type="button" class="  shopnow_btn btn btn-primary " onClick={this.skipBrochure}>{count}</button>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <img className="img" src={'./assets/images/brochure_04.jpg'} />
                                        <div class="Brochure_button_left">
                                            <button type="button" class="shopnow_btn btn btn-primary" onClick={this.skipBrochure}>{count}</button>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <img className="img" src={'./assets/images/brochure_05.jpg'} />
                                        <div class="Brochure_button">
                                            <button type="button" class="shopnow_btn btn btn-primary" onClick={this.skipBrochure}>{count}</button>
                                        </div>
                                    </div>
                                    <div class="item">
                                        <img className="img" src={'./assets/images/brochure_06.jpg'} />
                                        <div class="Brochure_button">
                                            <button type="button" class="shopnow_btn btn btn-primary" onClick={this.skipBrochure}>{count}</button>
                                        </div>
                                    </div>
                                </OwlCarousel>
                            </Col>
                        </Row>
                    </Container> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    ProfileState: state.profile,
    appState: state.app,
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Brochure);