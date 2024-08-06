import React from 'react'

export default function Footer() {
    var year = new Date().getFullYear();
    return (
        <>
            <section class="footer_section pt-5 pb-2 minmum_size" >
                <div class="container-fluid " data-aos="fade-up">
                    <div class="footer_logo"  >
                        <img src="./assets/images/acw_card_logo.png" />
                    </div>
                    
                    <div class="social_icon">
                        <ul>
                            <a href="https://www.facebook.com/Acwcard-107091532345323/" target="_blank"><li><i class="fa-brands fa-facebook-f fb_icons"></i></li></a>
                            <a href="https://www.youtube.com/@acwcard" target="_blank"> <li className='youtube_icons_li'><i class="fa-brands fa-youtube youtube_icons "></i></li></a>
                            <a href="https://www.pinterest.com/acwcard/" target="_blank"><li><i class="fa-brands fa-pinterest-p foot_social_icons"></i></li></a>
                            <a href="https://twitter.com/acwcardcom" target="_blank"> <li><i class="fa-brands fa-twitter foot_social_icons"></i></li></a>
                            <a href="https://www.linkedin.com/company/acwcard/" target="_blank"> <li><i class="fa-brands fa-linkedin-in foot_social_icons"></i></li></a>
                            <a href="https://www.instagram.com/acwcard/" target="_blank"> <li><i class="fa-brands fa-instagram foot_social_icons"></i></li></a>
                        </ul>
                    </div>
                    <div class="copy_right">
                        <p class="cr_txt">Copyright © {year} <span id="demo"></span> <a href='https://www.acwcircle.com/' target="_blank">Aries Connects World</a></p>
                    </div>
                </div>
            </section>
        </>
    )
}
