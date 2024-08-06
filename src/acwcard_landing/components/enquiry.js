import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ImportedURL from "../../common/api";
import { Error, Success } from "../../common/swal";
import { Emailvalidate, Phonenumber } from '../../common/validate';

export default function Enquiry() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [captchaGenerate, setCaptchaGenerate] = useState('');

    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [messageError, setMessageError] = useState(false)
    const [captchaError, setCaptchaError] = useState(false);
    const [enterCaptchaError, setEnterCaptchaError] = useState(false);
    const [validEmailError, setValidEmailError] = useState(false);
    const [validPhoneError, setValidPhoneError] = useState(false);

    const [submitForm, setSubmitForm] = useState(true);

    useEffect(() => {
        if (submitForm) {
            createCaptcha()
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'firstname') {
            setFirstName(value)
            setFirstNameError(false)
        }
        if (name == 'lastname') {
            setLastName(value)
            setLastNameError(false)
        }
        if (name == 'phone') {
            setPhoneError(false)
            let val = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            setPhone(val)
            if (val) {
                if (Phonenumber(val)) {
                    setValidPhoneError(false)
                } else {
                    setValidPhoneError(true)
                }
            }
        }
        if (name == 'email') {
            setEmail(value)
            setEmailError(false)
            if (value) {
                if (Emailvalidate(value)) {
                    setValidEmailError(false)
                } else {
                    setValidEmailError(true)
                }
            }
        }

        if (name == 'message') {
            setMessage(value)
            setMessageError(false)
        }

        if (name == 'captcha_challenge') {
            setCaptcha(value)
            setCaptchaError(false)
            setEnterCaptchaError(false)
        }
    }
    const formSubmit = (e) => {
        let valid = 1
        if (!firstName) {
            setFirstNameError(true)
            valid = 0
        }
        if (!lastName) {
            setLastNameError(true)
            valid = 0
        }
        if (!phone) {
            setPhoneError(true)
            valid = 0
        }
        if (!email) {
            setEmailError(true)
            valid = 0
        }
        if (captcha) {
            if (captcha != captchaGenerate) {
                setCaptchaError(true)
                valid = 0
            }
        } else {
            setEnterCaptchaError(true)
            valid = 0
        }
        if (validEmailError) {
            valid = 0
        }
        if (validPhoneError) {
            valid = 0
        }
        if (valid) {
            const formData = {
                firstname: firstName,
                lastname: lastName,
                phonenumber: phone,
                email: email,
                message: message,
            }
            axios.post(ImportedURL.API.addEnquiry, formData)
                .then((res) => {
                    createCaptcha()
                    setSubmitForm(false)
                    setFirstName('')
                    setLastName('')
                    setPhone('')
                    setEmail('')
                    setMessage('')
                    setCaptcha('')
                }).catch(({ response }) => {
                    if (response.status == 500) {
                        Error(response.status + ' Internal Server Error')
                    } else if (response.status == 502) {
                        Error(response.status + ' Bad Gateway')
                    } else if (response.status == 400) {
                        Error('Bad request')
                    } else {
                        Error(response.statusMessage)
                    }
                });
        }
    }

    const createCaptcha = () => {
        var code;
        document.getElementById('captchaDisplay').innerHTML = "";
        var charsArray =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var lengthOtp = 6;
        var captcha = [];
        for (var i = 0; i < lengthOtp; i++) {
            var index = Math.floor(Math.random() * charsArray.length + 1);
            if (captcha.indexOf(charsArray[index]) == -1)
                captcha.push(charsArray[index]);
            else i--;
        }
        var canv = document.createElement("canvas");
        canv.id = "captchaDisplay";
        canv.width = 100;
        canv.height = 50;
        var ctx = canv.getContext("2d");
        ctx.font = "25px Georgia";
        ctx.strokeText(captcha.join(""), 0, 30);
        code = captcha.join("");
        setCaptchaGenerate(code)
        setCaptcha('')
        document.getElementById("captchaDisplay").appendChild(canv);
    }

    const back = () => {
        setSubmitForm(true)
        var i = setInterval(function () {
            createCaptcha()
        }, 100);
        setTimeout(function () { clearInterval(i); }, 150);
    }

    return (
        <>

            <section class="Enquiry_section py-5 minmum_size" id="enquiry">
                <div class="container-fluid ">
                    <h1 class="title">Enquiry</h1>
                    {
                        submitForm
                            ?
                            <>
                                <form id="enquiry" method="post">
                                    <div class="row mt-5">
                                        <div class="col-lg-6 col-md-6 col-sm-312 col-12">
                                            <div class="form">
                                                <input type="text" class="form-control" id="firstname" name="firstname" value={firstName} placeholder="First Name" required onChange={handleChange} />
                                            </div>
                                            {firstNameError ? <span class='error_msg'>First Name is required</span> : ''}
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                            <div class="form">
                                                <input type="text" class="form-control" id="lastname" name="lastname" value={lastName} placeholder="Last Name" required onChange={handleChange} />
                                            </div>
                                            {lastNameError ? <span class='error_msg'>Last Name is required</span> : ''}
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                            <div class="form">
                                                <input type="text" maxLength={10} class="form-control" id="phone" name="phone" placeholder="Phone Number" value={phone} required onChange={handleChange} />
                                            </div>
                                            {phoneError ? <span class='error_msg'>Phone Number is required</span> : ''}
                                            {validPhoneError ? <span class='error_msg'>Phone Number should contain 10 digits</span> : ''}
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                                            <div class="form">
                                                <input type="email" class="form-control" id="email" name="email" placeholder="Email" value={email} required onChange={handleChange} />
                                            </div>
                                            {emailError ? <span class='error_msg'>Email is required</span> : ''}
                                            {validEmailError ? <span class='error_msg'>Enter valid email</span> : ''}
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div class="form">
                                                <textarea placeholder="Message" id="message" name="message" class="form-control" rows={5} value={message} required onChange={handleChange} ></textarea>
                                            </div>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div class="form captacha_padding">
                                                <label for="captcha" class="custom-lable">Type the characters you see in the picture below</label><br />
                                                <div className='captcha-arrange'>
                                                    <div id="captchaDisplay"></div>
                                                    <div className='ml-4'>
                                                        <img src="assets/images/refresh-btn.png" style={{ cursor: 'pointer' }} onClick={createCaptcha} class="refresh-captcha" />
                                                    </div>
                                                </div>
                                                <br></br>
                                                <input type="text" class="form-control cs_form" id="captcha_challenge" value={captcha} onChange={handleChange} name="captcha_challenge" required />
                                                {enterCaptchaError ? <span class='error_msg'>Enter the captcha</span> : ''}
                                                {captchaError ? <span class='error_msg'>Invalid Captcha</span> : ''}
                                            </div>
                                        </div>
                                        <div class="btn mt-4">
                                            <button type="button" onClick={formSubmit} class="submit_btn" >Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </>
                            :
                            <>
                                <div className="vendor-thanks" data-aos="zoom-in">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-4">
                                        <div className="form-group">
                                            <p style={{ color: '#1c3078', fontWeight: '600', fontSize: '35px', textAlign: 'center' }}>Thank you for your submission!</p>
                                            <div className='thumcsup'>
                                                <div class="btn thumcsup">
                                                    <button type="button" onClick={back} class="submit_btn" >back</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </section>
        </>
    )
}
