import React from 'react';
import OwlCarousel from 'react-owl-carousel';

export default function Customer() {
    return (
        <>
            <section class="customers_section minmum_size">
                <div class="container-fluid ">
                    <div class="down_sec">
                        <h1 class="title">Hear it from our <span>customers</span></h1>
                        <OwlCarousel items={1}
                            className="owl-carousel owl-theme carouse_two mt-5"
                            loop
                            nav
                            dots={false}
                            autoplay
                            margin={8} >
                            <div class="item">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="customer_body" data-aos="fade-up">
                                            <div class="row">
                                                <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                                                    <div class="cus_img">
                                                        <img src="./assets/images/customer_img_1.png" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-8 col-8">
                                                    <div class="cus_txt">
                                                        <p class="txt_1">
                                                            ACW Cards are super-handy. It has changed the way I make new friends in the industry. My business has got bigger.
                                                        </p>
                                                        <div class="txt_2">
                                                            <p class="rat_img"><img src="./assets/images/rating_star.png" /></p>
                                                            <p class="sub_txt">Robert</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="customer_body" data-aos="fade-up">
                                            <div class="row">
                                                <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                                                    <div class="cus_img">
                                                        <img src="./assets/images/customer_img_3.png" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-8 col-8">
                                                    <div class="cus_txt">
                                                        <p class="txt_1">
                                                            I’m glad I found a cool way to network using ACW Cards. Building connections and getting new business used to be tough. ACW Cards have made it easy.
                                                        </p>
                                                        <div class="txt_2">
                                                            <p class="rat_img"><img src="./assets/images/rating_star.png" /></p>
                                                            <p class="sub_txt">Christopher</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="customer_body" data-aos="fade-up">
                                            <div class="row">
                                                <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                                                    <div class="cus_img">
                                                        <img src="./assets/images/customer_img_4.png" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-8 col-8">
                                                    <div class="cus_txt">
                                                        <p class="txt_1">
                                                            ACW Cards has helped my team find new customers at business events in the city. The fact that our profiles can be customized makes it worth every dollar.
                                                        </p>
                                                        <div class="txt_2">
                                                            <p class="rat_img"><img src="./assets/images/rating_star.png" /></p>
                                                            <p class="sub_txt">Jennifer</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="customer_body" data-aos="fade-up">
                                            <div class="row">
                                                <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                                                    <div class="cus_img">
                                                        <img src="./assets/images/customer_img_2.png" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-8 col-md-8 col-sm-8 col-8">
                                                    <div class="cus_txt">
                                                        <p class="txt_1">
                                                            ACW Cards are a classy concept. I’ve been in the industry for 30+ years and I haven’t come across anything as useful as these for building new connections out here.
                                                        </p>
                                                        <div class="txt_2">
                                                            <p class="rat_img"><img src="./assets/images/rating_star.png" /></p>
                                                            <p class="sub_txt">Patricia</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </OwlCarousel>
                    </div>
                </div>
            </section>
        </>
    )
}
