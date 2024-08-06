import React, { useEffect, useState, useRef } from 'react';
import { Modal, Ratio, Button } from 'react-bootstrap';

function MyVerticallyCenteredModal(props) {
    return (
        <>
            <>
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="example-custom-modal-styling-title"
                    centered
                    id={"modal_video"}
                    className='modal_video'
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Explore ACW Card - A Gen Z Digitalia Card
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ width: '100%', height: 'auto' }}>
                            <Ratio aspectRatio="16x9">
                                <video src="./assets/videos/acw-card-work-flow.mp4"
                                    controls autoPlay muted={props.muted} height="480" width="640" id="video1">
                                </video>
                            </Ratio>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
            {/* // ====== */}
            <>

            </>
        </>
    );
}

export default function Shop() {
    const [modalShow, setModalShow] = React.useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);

    };

    return (
        <>
            <section class="back_page minmum_size">
                <div class="container-fluid  mt-5 mb-5">
                    <div class="shop_section" data-aos="fade-up">
                        <div class="row">
                            <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                                <div class="shop_txt_1">
                                    <div class="txt_logo">
                                        <img src="./assets/images/logo_2.png" />
                                    </div>
                                    <ul>
                                        <li data-aos="fade-up">
                                            A cost-effective, scalable &
                                            timeless new-gen digital card.
                                        </li>
                                        <li data-aos="fade-up">
                                            A dynamic and safe place to save &
                                            share your contact information.
                                        </li>
                                        <li data-aos="fade-up">
                                            Play with multiple colors to brand
                                            your business & personal profiles.
                                        </li>
                                        <li data-aos="fade-up">
                                            Go paperless & download your
                                            contact database in a click.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                                <div className='acw_video'>
                                    <img src="./assets/images/video.png" />
                                    {isHovering ?
                                        <div className='youtube_img' onClick={() => setModalShow(true)} onMouseOver={() => handleMouseOver()} onMouseOut={() => handleMouseOut()}>
                                            <a href='javascript:void(0)'>
                                                <img src="./assets/images/youtubedark.png" />
                                            </a>
                                        </div>
                                        :
                                        <div className='youtube_img' onClick={() => setModalShow(true)}>
                                            <a href='javascript:void(0)'>
                                                <img src="./assets/images/youtubeblue.png" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} />
                                            </a>
                                        </div>
                                    }
                                    <MyVerticallyCenteredModal
                                        show={modalShow}
                                        muted={false}
                                        onHide={() => setModalShow(false)}
                                    />
                                </div>
                            </div>

                            {/* <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                                <div class="shop_txt_2 ml-3" data-aos="fade-up">
                                    <h1 class="head_txt">Shop</h1>
                                    <div class="txt_grp mt-3">
                                        <span class="txt_1">
                                            The only combined business &
                                        </span><br></br>
                                        <span class="txt_2">personal card you’ll ever need.</span>
                                    </div>
                                    <p class="txt_3">
                                        Lead the path to a new-gen networking
                                        proficiency.
                                    </p>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                                <div class="shop_card_img" div data-aos="zoom-in">
                                    <img src="./assets/images/shop_img.png" />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Inventory & Asset Management Video
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ width: '100%', height: 'auto' }}>
                        <Ratio aspectRatio="16x9">
                            <video src="../videos/inventory-and-asset.mp4"
                                controls autoPlay muted={props.muted} height="480" width="640" id="video1">
                            </video>
                        </Ratio>
                    </div>
                </Modal.Body>
            </Modal> */}
            {/* <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg video_modal_acwcard">
                    <div class="modal-content " style={{ borderRadius: "10px !important" }}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel" style={{ fontFamily: 'coolvetica-rg' }}>ACW Card Introducing Video</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div style={{ width: '100%', height: 'auto' }}>
                                <Ratio aspectRatio="16x9">
                                    <video src="../videos/01.MYHOTELAI.mp4"
                                        controls  muted={props.muted} height="480" width="640" id="video1">
                                    </video>
                                </Ratio>
                            </div>
                        </div>
                    </div>
                </div>
            </div > */}
        </>
    )
}
