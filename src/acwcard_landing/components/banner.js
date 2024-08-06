import React, { useEffect } from 'react';
import OwlCarousel from 'react-owl-carousel';

export default function Banner() {

    return (
        <>
            <section class="carousel_section minmum_size">
                <div>
                    <div class='container-fluid ' >
                        <OwlCarousel items={1}
                            className="owl-theme carouse_one owl-carousel"
                            loop
                            nav
                            dots={false}
                            autoplay
                            margin={8} >
                            <div class="item">
                                <img className="img" src={'./assets/images/sliderimage1.png'} />
                                {/* <div className='overlay'></div> */}
                                <div class="banner_txt">
                                    <h1>A pathbreaking<br /> Gen Z Digital Card</h1>
                                    <button type='button' className='shopnow_btn'>Shop Now</button>
                                </div>
                            </div>
                            <div class="item">
                                <img className="img" src={'./assets/images/sliderimage2.png'} />
                                {/* <div className='overlay'></div> */}
                                <div class="banner_txt">
                                    <h1>Networking <br /> – Redefined </h1>
                                    <button type='button' className='shopnow_btn'>Shop Now</button>
                                </div>
                            </div>
                            <div class="item">
                                <img className="img" src={'./assets/images/sliderimage3.png'} />
                                {/* <div className='overlay'></div> */}
                                <div class="banner_txt">
                                    <h1>
                                        A clever way<br />  to connect
                                    </h1>
                                    <button type='button' className='shopnow_btn'>Shop Now</button>
                                </div>
                            </div>
                        </OwlCarousel>
                    </div>
                </div>
            </section>
        </>
    )
}
