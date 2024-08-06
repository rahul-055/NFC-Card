import React from 'react'

export default function KeyFeature() {
    return (
        <>
            <section class="Key_features_section mt-5 mb-5 minmum_size" id="features">
                <div class="container-fluid ">
                    <h1 class="title">Key features</h1>
                    <div class="row mt-5">
                        <div class="col-lg-3 col-md-6 col-sm-12 col-12">
                            <div class="card_body" data-aos="fade-up">
                                <div class="key_img">
                                    <img src="./assets/images/key_1.png" />
                                </div>
                                <p class="box_in_txt">
                                    Establish <span class="txt_color">multiple connections </span>with a
                                    single ACW card.
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-sm-12 col-12">
                            <div class="card_body" data-aos="fade-up">
                                <div class="key_img">
                                    <img src="./assets/images/key_2.png" />
                                </div>
                                <p class="box_in_txt">
                                    100% compatible with both   <span class="txt_color">iOS & Android.</span>
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-sm-12 col-12">
                            <div class="card_body" data-aos="fade-up">
                                <div class="key_img">
                                    <img src="./assets/images/key_3.png" />
                                </div>
                                <p class="box_in_txt">
                                    Eliminate App  dependency with<span class="txt_color"> browser-friendly </span>profile sharing.
                                </p>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-sm-12 col-12">
                            <div class="card_body" data-aos="fade-up">
                                <div class="key_img ">
                                    <img src="./assets/images/key_4.png" />
                                </div>
                                <p class="box_in_txt">
                                    A <span class="txt_color">timeless card  </span> that can be updated infinitely.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
