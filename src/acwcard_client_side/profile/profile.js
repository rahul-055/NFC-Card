import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Container, Col, Spinner } from 'react-bootstrap';
import { AiFillCamera, AiOutlinePlus, AiOutlineSetting } from 'react-icons/ai';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import Select from 'react-select'
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { FiEdit } from 'react-icons/fi';
import { AC_HANDLE_INPUT_CHANGE_PROFILE, AC_HANDLE_INPUT_CHANGE_SETTINGS, AC_PROFILE_SPINNER, AC_VIEW_PROFILE } from '../../actions/profileAction';
import ImportedURL from '../../common/api';
import { Emailvalidate, FileAndImagevalidation, GetAge, Imagevalidation, Phonenumber, Urlvalidate, dataURLtoFile } from '../../common/validate';
import { Success, Error } from '../../common/swal';
import { AC_LIST_APP } from '../../actions/appAction';
import CountryCodeJson from '../../common/countrycode.json';
import DatePicker from "react-multi-date-picker"
import moment from "moment";
import { Modal } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Buffer } from 'buffer';

const crop = {
    unit: 'px',
    x: 130,
    y: 50,
};

class Profile extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.fileInputBanner = React.createRef();
        this.state = {
            bgimage: '',
            profileimg: '',
            skill: '',
            socialmediaSelect: {},
            socialmediaValue: [],
            urlError: false,
            emailError: false,
            updateSpinner: false,
            phoneNoPatternError: false,
            busPhoneNoPatternError: false,
            phoneNoPatternArrayError: false,
            name: 'React',
            src: null,
            crop: {
                unit: 'px',
                x: 130,
                y: 50,
                width: 200,
                height: 200
            },
            croppedImageUrl: null,
            showModal: false,
            typeImage: '',
            onChangeHeight: false,
            profileImage: ''
        }
    }


    componentDidMount() {
        document.title = 'ACW CARD - Profile'
        document.description = 'ACW Card enables you to share your business and personal profiles along with digital uploads of key documents to strengthen your portfolio.'

        this.props.SpinnerProfile();
        this.props.ViewProfile({ reverseStatus: true });
        this.props.ListApp()
    }
    submit = (e) => {
        const { busPhoneNoPatternError, phoneNoPatternError, ageError } = this.state;
        const { ProfileState } = this.props;
        const data = ProfileState.profile
        let listAppLink = [...data.applink]

        let valid = true
        if (busPhoneNoPatternError) {
            valid = false
        }
        if (phoneNoPatternError) {
            valid = false
        }
        if (ageError) {
            valid = false
        }
        if (valid) {
            this.setState({ updateSpinner: true })
            const formData = new FormData();
            for (let key in data) {
                if (key == 'skill') formData.append(key, JSON.stringify(data[key]));
                else if (key == 'applink') continue;
                else if (key == 'applinkstatus') formData.append(key, JSON.stringify(data[key]));
                else if (key == 'cc') formData.append(key, JSON.stringify(data[key]));
                else if (key == 'businesscc') formData.append(key, JSON.stringify(data[key]));
                else formData.append(key, data[key])
            }
            axios.post(ImportedURL.API.updateProfile, formData)
                .then((res) => {
                    this.setState({ updateSpinner: false })
                    this.props.ViewProfile({ reverseStatus: true });
                    Success('Saved');
                }).catch(({ response }) => {
                    this.setState({ updateSpinner: false })
                    if (response) {
                        if (response.status == 401) {
                            Error('Something wrong, Retry again!')
                        } else if (response.status == 510) {
                            Error('Email does not exit')
                        } else if (response.status == 502) {
                            Error(response.status + ' Bad Gateway')
                        } else if (response.status == 500) {
                            Error('Internal Server Error')
                        } else if (response.status == 409) {
                            Error('Already exist')
                        } else if (response.status == 400) {
                            Error('Bad request')
                        }
                    }
                });
        }
    }

    submitApp = (e) => {
        const { busPhoneNoPatternError, phoneNoPatternError } = this.state;
        const { ProfileState } = this.props;
        const data = ProfileState.profile

        let listAppLink = [...e]
        let valid = true
        if (busPhoneNoPatternError) {
            valid = false
        }
        if (phoneNoPatternError) {
            valid = false
        }
        if (valid) {
            this.setState({ updateSpinner: true })
            const formDataS3 = new FormData();
            let othersArr = []
            let documentArr = []
            let existImageArr = []
            let imagesDataArr = []
            if (listAppLink.length > 0) {
                for (let i = 0; i < listAppLink.length; i++) {
                    if (listAppLink[i].inputtype != "document") {
                        othersArr.push(listAppLink[i])
                    }
                }
                for (let i = 0; i < listAppLink.length; i++) {
                    if (listAppLink[i].inputtype == "document") {
                        documentArr.push(listAppLink[i])
                    }
                }
            }
            if (documentArr.length > 0) {
                for (let i = 0; i < documentArr.length; i++) {
                    if (typeof documentArr[i].value == 'string') {
                        existImageArr.push(documentArr[i])
                    } else {
                        formDataS3.append("documents", documentArr[i].value)
                        imagesDataArr.push(documentArr[i])
                    }
                }
            }
            formDataS3.append("othersArr", JSON.stringify(othersArr))
            formDataS3.append("existImageArr", JSON.stringify(existImageArr))
            formDataS3.append("imagesDataArr", JSON.stringify(imagesDataArr))
            axios.post(ImportedURL.API.updateProfileAppLinks, formDataS3)
                .then((res) => {
                    this.props.ViewProfile({ reverseStatus: true });
                    this.setState({ updateSpinner: false })
                    Success('Saved');
                }).catch(({ response }) => {
                    this.setState({ updateSpinner: false })
                    if (response) {
                        if (response.status == 401) {
                            Error('Something wrong, Retry again!')
                        } else if (response.status == 510) {
                            Error('Email does not exit')
                        } else if (response.status == 502) {
                            Error(response.status + ' Bad Gateway')
                        } else if (response.status == 500) {
                            Error('Internal Server Error')
                        } else if (response.status == 409) {
                            Error('Already exist')
                        } else if (response.status == 400) {
                            Error('Bad request')
                        }
                    }
                });
        }
    }

    submitStatus = (e) => {
        this.setState({ updateSpinner: true })
        axios.post(ImportedURL.API.updateProfileAppStatus, { applinkstatus: e })
            .then((res) => {
                this.props.ViewProfile({ reverseStatus: true });
                this.setState({ updateSpinner: false })
                Success('Saved');
            }).catch(({ response }) => {
                this.setState({ updateSpinner: false })
                if (response) {
                    if (response.status == 401) {
                        Error('Something wrong, Retry again!')
                    } else if (response.status == 510) {
                        Error('Email does not exit')
                    } else if (response.status == 502) {
                        Error(response.status + ' Bad Gateway')
                    } else if (response.status == 500) {
                        Error('Internal Server Error')
                    } else if (response.status == 409) {
                        Error('Already exist')
                    } else if (response.status == 400) {
                        Error('Bad request')
                    }
                }
            });
    }
    removeImages = (e) => {
        this.setState({ profileimg: "" })
        this.props.HandleInputChange("image", "");
    }
    removeBanner = (e) => {
        this.setState({ bgimage: "" })
        this.props.HandleInputChange("banner", "");
    }
    onChangeImage = e => {
        const { name, value } = e.target;
        if (name == 'image') {
            if (e.target.files[0] != undefined) {
                const imgvalidate = Imagevalidation(e.target.files[0]);
                if (imgvalidate) {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        this.setState(prevState => ({
                            ...prevState,
                            src: reader.result
                        }))
                    }
                    );
                    reader.readAsDataURL(e.target.files[0]);
                    this.setState({ showModal: true, typeImage: 'image' });
                    // this.props.HandleInputChange(name, e.target.files[0]);
                } else {
                    Error('Invalid file extension');
                }
            }
        } else if (name == 'banner') {
            if (e.target.files[0] != undefined) {
                const imgvalidate = Imagevalidation(e.target.files[0]);
                if (imgvalidate) {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        this.setState(prevState => ({
                            ...prevState,
                            src: reader.result
                        }))
                    }
                    );
                    reader.readAsDataURL(e.target.files[0]);
                    this.setState({ showModal: true, typeImage: 'banner' });
                    // this.setState({ bgimage: e.target.files[0] });
                    // this.props.HandleInputChange(name, e.target.files[0]);
                } else {
                    Error('Invalid file extension');
                }
            }
        }
    }


    Logout = (e) => {
        Swal.fire({
            title: 'Are you sure want to logout ?',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            imageUrl: '../../assets/images/signout.png',
            customClass: {
                popup: 'swal_pop',
                title: 'swal_title',
                image: 'swal_image',
                actions: 'swal_action',
                confirmButton: 'swal_confirm',
                cancelButton: 'swal_close',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                e.preventDefault();
                localStorage.removeItem('acwtoken');
                window.location.href = "/";
            }
        })

    }
    onChange = e => {
        const { name, value } = e.target;
        const Error = name + "Error";
        this.setState({ [Error]: false });
        if (name === 'phonenumber') {
            let val = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            if (val) {
                if (Phonenumber(val)) {
                    this.setState({ phoneNoPatternError: false })

                } else {
                    this.setState({ phoneNoPatternError: true })
                }
            } else {
                this.setState({ phoneNoPatternError: false })
            }
            this.props.HandleInputChange(name, val);
        } else if (name === 'businessphonenumber') {
            let val = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            if (val) {
                if (Phonenumber(val)) {
                    this.setState({ busPhoneNoPatternError: false })

                } else {
                    this.setState({ busPhoneNoPatternError: true })
                }
            } else {
                this.setState({ busPhoneNoPatternError: false })
            }
            this.props.HandleInputChange(name, val);
        } else {
            this.props.HandleInputChange(name, value)
        }
    }
    onClickSkill = (e) => {
        const data = this.props.ProfileState.profile
        if (this.state.skill) {
            let skill = [...data.skill]
            this.props.HandleInputChange("skill", [...skill, this.state.skill])
            this.setState({ skill: '' })
        }
    }
    removeSkill = (id) => {
        const data = this.props.ProfileState.profile
        let skill = [...data.skill]
        this.props.HandleInputChange("skill", [...skill.filter((e, i) => i !== id)])
    }
    heightPerpose = () => {
        this.setState({ onChangeHeight: false })
    }
    socialmediaSelect = (e, parentId) => {
        const { socialmediaValue, onChangeHeight } = this.state;
        const { value, logo, id, inputtype } = e;
        if (value) {

            let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
            if (index != -1) {
                socialmediaValue[index] = { logo: logo, name: value, Uid: parentId, parentId: parentId, id: id, inputtype: inputtype }
                this.setState({ socialmediaValue: socialmediaValue });
            } else {
                this.setState({ socialmediaValue: [...socialmediaValue, { logo: logo, name: value, Uid: parentId, parentId: parentId, id: id, inputtype: inputtype }] });
            }
        }
    }
    onClickSocialMedia = (parentId, type) => {
        const { urlError, socialmediaValue, emailError, phoneNoPatternArrayError } = this.state
        const data = this.props.ProfileState.profile
        let status = socialmediaValue.find((e) => e.Uid == parentId)
        if (type == 'url') {
            if (status != undefined && status && !urlError) {
                if (status.name != undefined && status.link != undefined && status.link) {
                    let applink = [...data.applink]
                    var form = status
                    form.index = Math.floor((Math.random() * 10000000000000) + 1);
                    this.props.HandleInputChange("applink", [...applink, form])
                    this.setState({ socialmediaValue: [...socialmediaValue.filter((e) => e.Uid != parentId)] })
                    let sendData = [...applink, form]
                    this.submitApp(sendData)
                }
            }
        } else if (type == 'email') {
            if (status != undefined && status && !emailError) {
                if (status.name != undefined && status.value != undefined && status.value) {
                    let applink = [...data.applink]
                    var form = status
                    form.index = Math.floor((Math.random() * 10000000000000) + 1);
                    this.props.HandleInputChange("applink", [...applink, form])
                    this.setState({ socialmediaValue: [...socialmediaValue.filter((e) => e.Uid != parentId)] })
                    let sendData = [...applink, form]
                    this.submitApp(sendData)
                }
            }
        } else if (type == 'number') {
            if (status != undefined && status && !phoneNoPatternArrayError) {
                if (status.name != undefined && status.value != undefined && status.value) {
                    let applink = [...data.applink]
                    var form = status
                    form.index = Math.floor((Math.random() * 10000000000000) + 1);
                    this.props.HandleInputChange("applink", [...applink, form])
                    this.setState({ socialmediaValue: [...socialmediaValue.filter((e) => e.Uid != parentId)] })
                    let sendData = [...applink, form]
                    this.submitApp(sendData)
                }
            }
        } else {
            if (status != undefined && status) {
                if (status.name != undefined && status.value != undefined && status.value) {
                    let applink = [...data.applink]
                    var form = status
                    form.index = Math.floor((Math.random() * 10000000000000) + 1);
                    this.props.HandleInputChange("applink", [...applink, form])
                    this.setState({ socialmediaValue: [...socialmediaValue.filter((e) => e.Uid != parentId)] })
                    let sendData = [...applink, form]
                    this.submitApp(sendData)
                }
            }
        }

    }
    documentStatus = (e, item, id, type) => {
        const { socialmediaValue } = this.state
        const { value, name, checked } = e.target

        const data = this.props.ProfileState.profile
        let applink = [...data.applink]

        let index = applink.findIndex((e) => e.Uid == item.Uid)
        if (index != -1) {
            applink[index] = {
                ...applink[index],
                ["documentstatus"]: checked,
            }
            this.props.HandleInputChange("applink", applink)
            this.submitApp(applink)
        }
    }
    onChangeImageArray = (e, parentId, type) => {
        const { socialmediaValue } = this.state
        const { value, name } = e.target
        let files = e.target.files[0]
        if (files != undefined) {
            let data = FileAndImagevalidation(files)
            if (data.allow != undefined && data.allow) {
                let previewType = 'doc'
                if (data.type == 'jpg' || data.type == 'jpeg' || data.type == 'png') {
                    previewType = 'image'
                }
                if (data.type == 'pdf') {
                    previewType = 'pdf'
                }
                let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
                if (index != -1) {
                    socialmediaValue[index] = {
                        ...socialmediaValue[index],
                        ["address"]: '',
                        ['link']: "",
                        ["value"]: files,
                        ["documentstatus"]: true,
                        ["previewtype"]: previewType,
                    }
                    this.setState({ socialmediaValue: socialmediaValue });
                }
            } else {
                Error('Invalid file extension');
            }
        }
    }
    onClickSocialMediaAddress = (parentId) => {
        const { urlError, socialmediaValue } = this.state
        const data = this.props.ProfileState.profile
        let status = socialmediaValue.find((e) => e.Uid == parentId)
        if (status != undefined && status && !urlError) {
            if (status.name != undefined && status.country != undefined && status.country) {
                let applink = [...data.applink]
                var form = status
                form.address = {
                    street: status.street,
                    city: status.city,
                    state: status.state,
                    zip: status.zip,
                    country: status.country,
                }
                form.index = Math.floor((Math.random() * 10000000000000) + 1);
                this.props.HandleInputChange("applink", [...applink, form])
                this.setState({ socialmediaValue: [...socialmediaValue.filter((e) => e.Uid != parentId)] })
                let sendData = [...applink, form]
                this.submitApp(sendData)
            }
        }

    }

    onClickIAddImageArray = (parentId) => {
        const { urlError, socialmediaValue } = this.state
        const data = this.props.ProfileState.profile
        let status = socialmediaValue.find((e) => e.Uid == parentId)
        if (status != undefined && status) {
            if (status.value != undefined && status.value) {
                let applink = [...data.applink]
                var form = status
                form.index = Math.floor((Math.random() * 10000000000000) + 1);
                this.props.HandleInputChange("applink", [...applink, form])
                this.setState({ socialmediaValue: [...socialmediaValue.filter((e) => e.Uid != parentId)] })
                let sendData = [...applink, form]
                this.submitApp(sendData)
            }
        }
    }

    onChangeAddress = (e, parentId, type) => {
        const { socialmediaValue } = this.state
        const { value, name } = e.target
        let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
        if (index != -1) {
            socialmediaValue[index] = {
                ...socialmediaValue[index],
                [name]: value,
                ['value']: '',
                ['link']: '',
            }
            this.setState({ socialmediaValue: socialmediaValue });
        }

    }
    removeSocailMedia = (id) => {
        Swal.fire({
            title: 'Are you sure want to delete?',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            imageUrl: 'assets/images/delete.png',
            customClass: {
                container: 'delete_swal_image',
                popup: 'swal_pop',
                title: 'swal_title',
                image: 'swal_image',
                actions: 'swal_action',
                confirmButton: 'swal_confirm',
                cancelButton: 'swal_close',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const data = this.props.ProfileState.profile
                let applink = [...data.applink]
                let app = [...applink.filter((e, i) => e.index !== id)]
                this.props.HandleInputChange("applink", app)
                this.submitApp(app)
            }
        })


    }
    editSocailMedia = (e, id, type) => {
        const { socialmediaValue } = this.state
        const data = this.props.ProfileState.profile
        let applink = [...data.applink]
        if (type == 'address') {
            const form = {
                id: e.id,
                logo: e.logo,
                name: e.name,
                parentId: e.parentId,
                address: e.address,
                street: e.address.street,
                city: e.address.city,
                state: e.address.state,
                zip: e.address.zip,
                country: e.address.country,
                Uid: e.parentId,
                inputtype: e.inputtype
            }
            this.setState({ socialmediaValue: [...socialmediaValue, form] });
            let app = [...applink.filter((a, i) => (a.index !== e.index))]
            this.props.HandleInputChange("applink", app)
        } else if (type == "document") {
            let previewType = 'doc'
            if (typeof e.value == "string") {
                previewType = 'alldata'
            } else {
                let data = FileAndImagevalidation(e.value)
                if (data.allow != undefined && data.allow) {
                    if (data.type == 'jpg' || data.type == 'jpeg' || data.type == 'png') {
                        previewType = 'image'
                    }
                    if (data.type == 'pdf') {
                        previewType = 'pdf'
                    }
                }
            }
            const form = {
                id: e.id,
                logo: e.logo,
                name: e.name,
                parentId: e.parentId,
                Uid: e.parentId,
                link: e.link,
                value: e.value,
                inputtype: e.inputtype,
                previewtype: previewType,
            }
            this.setState({ socialmediaValue: [...socialmediaValue, form] });
            let app = [...applink.filter((a, i) => (a.index !== e.index))]
            this.props.HandleInputChange("applink", app)
        } else {
            this.setState({ socialmediaValue: [...socialmediaValue, { id: e.id, logo: e.logo, name: e.name, parentId: e.parentId, link: e.link, Uid: e.parentId, value: e.value, inputtype: e.inputtype, cc: e.cc }] });
            let app = [...applink.filter((a, i) => (a.index !== e.index))]
            this.props.HandleInputChange("applink", app)
        }
    }
    onChangeLinkCC = (e, parentId, type) => {
        const { socialmediaValue } = this.state
        const { value, name, label } = e
        let data = {
            name: value,
            value: label,
        }
        let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
        if (index != -1) {
            socialmediaValue[index] = {
                ...socialmediaValue[index],
                ["address"]: '',
                ['link']: "",
                ["cc"]: data,
            }
            this.setState({ socialmediaValue: socialmediaValue });
        }
    }
    onChangeLink = (e, parentId, type) => {
        const { socialmediaValue } = this.state
        const { value, name } = e.target
        if (type == 'url') {
            if (value) {
                if (!Urlvalidate(value)) {
                    this.setState({ urlError: true })
                } else {
                    this.setState({ urlError: false })
                }
            } else {
                this.setState({ urlError: false })
            }
            let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
            if (index != -1) {
                socialmediaValue[index] = {
                    ...socialmediaValue[index],
                    ["address"]: '',
                    ['value']: '',
                    ['link']: value,
                }
                this.setState({ socialmediaValue: socialmediaValue });
            }
        } else if (type == 'number') {
            let val = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            if (val) {
                if (Phonenumber(val)) {
                    this.setState({ phoneNoPatternArrayError: false })

                } else {
                    this.setState({ phoneNoPatternArrayError: true })
                }
            } else {
                this.setState({ phoneNoPatternArrayError: false })
            }
            let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
            if (index != -1) {
                socialmediaValue[index] = {
                    ...socialmediaValue[index],
                    ["address"]: '',
                    ['value']: val,
                    ['link']: "",
                }
                this.setState({ socialmediaValue: socialmediaValue });
            }
        } else if (type == 'email') {
            if (value) {
                if (Emailvalidate(value)) {
                    this.setState({ emailError: false })
                } else {
                    this.setState({ emailError: true })
                }
            } else {
                this.setState({ emailError: false })
            }
            let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
            if (index != -1) {
                socialmediaValue[index] = {
                    ...socialmediaValue[index],
                    ["address"]: '',
                    ['link']: "",
                    ["value"]: value
                }
                this.setState({ socialmediaValue: socialmediaValue });
            }
        } else if (type == 'none') {
            let index = socialmediaValue.findIndex((e) => e.Uid == parentId)
            if (index != -1) {
                socialmediaValue[index] = {
                    ...socialmediaValue[index],
                    ["address"]: '',
                    ['link']: "",
                    ["value"]: value
                }
                this.setState({ socialmediaValue: socialmediaValue });
            }
        }

    }
    appLinkStatus = (e, app, index) => {
        const data = this.props.ProfileState.profile
        let applinkstatus = [...data.applinkstatus]
        let status = applinkstatus.findIndex((r) => r.appid == app._id)
        if (status !== -1) {
            applinkstatus[status] = { appid: app._id, status: e.target.checked }
            this.props.HandleInputChange("applinkstatus", applinkstatus)
            this.submitStatus(applinkstatus)
        } else {
            let value = [...applinkstatus, { appid: app._id, status: e.target.checked }]
            this.props.HandleInputChange("applinkstatus", value)
            this.submitStatus(value)
        }
    }
    onSelectFlag = (e) => {
        const { name, value, label } = e;
        let data = {
            name: value,
            value: label,
        }
        this.props.HandleInputChange("cc", data)
    }
    onSelectFlagBusiness = (e) => {
        const { name, value, label } = e;
        let data = {
            name: value,
            value: label,
        }
        this.props.HandleInputChange("businesscc", data)
    }
    onChangeDate = e => {
        let date = moment(e?.toDate?.().toString()).format("YYYY-MM-DD")
        this.props.HandleInputChange('dob', date);
        let age = GetAge(date)
        if (age >= 15) {
            this.setState({ ageError: false })
        } else {
            this.setState({ ageError: true })
        }
    }
    taggleStatus = (e) => {
        const data = this.props.ProfileState.profile
        const { value, name, checked } = e.target
        const formData = {}
        if (name == 'ispublicprofile') {
            this.props.HandleInputChange("ispublicprofile", checked)
            formData['ispublicprofile'] = checked
            formData['ispersonaldetails'] = data.ispersonaldetails ? data.ispersonaldetails : false
            formData['isbusinessdetails'] = data.isbusinessdetails ? data.isbusinessdetails : false
        }
        if (name == 'ispersonaldetails') {
            this.props.HandleInputChange("ispersonaldetails", e.target.checked)
            formData['ispublicprofile'] = data.ispublicprofile ? data.ispublicprofile : false
            formData['ispersonaldetails'] = checked
            formData['isbusinessdetails'] = data.isbusinessdetails ? data.isbusinessdetails : false
        }
        if (name == 'isbusinessdetails') {
            this.props.HandleInputChange("isbusinessdetails", e.target.checked)
            formData['ispublicprofile'] = data.ispublicprofile ? data.ispublicprofile : false
            formData['ispersonaldetails'] = data.ispersonaldetails ? data.ispersonaldetails : false
            formData['isbusinessdetails'] = checked
        }
        this.setState({ updateSpinner: true })
        axios.post(ImportedURL.API.updateProfileOtherStatus, formData)
            .then((res) => {
                this.props.ViewProfile({ reverseStatus: true });
                this.setState({ updateSpinner: false })
                Success('Saved');
            }).catch(({ response }) => {
                this.setState({ updateSpinner: false })
                if (response) {
                    if (response.status == 401) {
                        Error('Something wrong, Retry again!')
                    } else if (response.status == 510) {
                        Error('Email does not exit')
                    } else if (response.status == 502) {
                        Error(response.status + ' Bad Gateway')
                    } else if (response.status == 500) {
                        Error('Internal Server Error')
                    } else if (response.status == 409) {
                        Error('Already exist')
                    } else if (response.status == 400) {
                        Error('Bad request')
                    }
                }
            });

    }
    ModalImages = (e) => {
        this.setState({ showModal: false })
        if (this.state.typeImage == 'image') {
            this.fileInputRef.current.value = "";
        } else {
            this.fileInputBanner.current.value = "";
        }
    }
    CropImages = (e) => {
        let value = this.state.croppedImageUrl
        this.setState({
            croppedImageUrl: '', showModal: false, src: null, crop: {
                unit: 'px',
                x: 130,
                y: 50,
                width: 200,
                height: 200
            }
        })
        if (this.state.typeImage == 'image') {
            this.setState({ profileimg: URL.createObjectURL(value) })
            this.props.HandleInputChange("image", value);
            this.fileInputRef.current.value = "";
        } else {
            this.setState({ bgimage: value })
            this.props.HandleInputChange("banner", value);
            this.fileInputBanner.current.value = "";
        }
    }
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }
    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        const base64Image = canvas.toDataURL("image/png");
        if (base64Image) {
            const fileType = base64Image.split(";")[0].split(":")[1];
            const buffer = Buffer.from(
                base64Image.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );
            const file = new File([buffer], fileName, { type: fileType });
            return file
        } else {
            return ''
        }
    }

    taggleStatusFiles = (e) => {
        const data = this.props.ProfileState.profile
        const { value, name, checked } = e.target
        const formData = {
            isinfostatus: checked
        }
        this.setState({ updateSpinner: true })
        axios.post(ImportedURL.API.updateInfoStatus, formData)
            .then((res) => {
                this.props.ViewProfile({ reverseStatus: true });
                this.setState({ updateSpinner: false })
                Success('Saved');
            }).catch(({ response }) => {
                this.setState({ updateSpinner: false })
                if (response) {
                    if (response.status == 401) {
                        Error('Something wrong, Retry again!')
                    } else if (response.status == 510) {
                        Error('Email does not exit')
                    } else if (response.status == 502) {
                        Error(response.status + ' Bad Gateway')
                    } else if (response.status == 500) {
                        Error('Internal Server Error')
                    } else if (response.status == 409) {
                        Error('Already exist')
                    } else if (response.status == 400) {
                        Error('Bad request')
                    }
                }
            });
    }
    render() {
        const { crop, croppedImageUrl, src } = this.state;
        const { socialmediaSelect } = this.state
        const { ProfileState, appState } = this.props;
        const listapp = appState.listApp;


        listapp?.sort((a, b) => Number(a.sortorder) - Number(b.sortorder));
        const spinner = ProfileState.spinner
        const data = ProfileState.profile
        const options = [
            { value: 'instragram', label: 'instragram' },
            { value: 'linkedin', label: 'linkedin' },
            { value: 'facebook', label: 'facebook' }
        ]
        const dobDate = data.dob ? moment(data.dob).format('MM-DD-YYYY') : ''
        return (
            <>
                <div style={{ position: 'relative' }}>
                    <div className='home_section profile_section gap_padding_space pro_bg'>
                        <Container>
                            <Row className="justify-content-md-center">
                                <Col xs="12" lg="5" md="12" sm="12" >
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
                                        <div>
                                            <div class="profile_toggle">
                                                <label class="toggle">
                                                    <input type="checkbox" name="ispublicprofile" checked={data.ispublicprofile} onClick={this.taggleStatus} />
                                                    <span class="slider"></span>
                                                    <span class="labels" data-on="Public" data-off="Private"></span>
                                                </label>
                                            </div>
                                            <div class="profile_toggle_Account">
                                                <label class="toggle">
                                                    <input type="checkbox" name="ispublicprofile" checked={data.isinfostatus} onClick={this.taggleStatusFiles} />
                                                    <span class="slider"></span>
                                                    <span class="labels" data-on="Files On" data-off="Files Off"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='profile_header_text d-flex' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p className='right_profile_icon'>
                                                <Link to='/account'><HiOutlineChevronLeft /></Link>
                                            </p>
                                            <Link to='/account'>
                                                <p className='back_text'>
                                                    Go to edit account
                                                </p>
                                            </Link>
                                        </div>
                                        {/* <div class="form-check form-switch">
                                            <input class="form-check-input form-check-input-public" type="checkbox" id="custom-switch1" name="ispublicprofile" checked={data.ispublicprofile} onClick={this.taggleStatus} />
                                        </div> */}

                                        <div className='acw_card_setting'>
                                            <p className='mr-3 mt-1'>
                                                <Link style={{ color: '#fff' }} to="/accountsetting" onClick={(e) => this.props.HandleChangesSetting('profile')}>
                                                    <AiOutlineSetting className='acoount_setting' />
                                                </Link>
                                            </p>
                                        </div>

                                    </div>
                                    <div className='home_sec'>
                                        {/* <div className='home_images mb-4' style={{ margin: "50px auto 0px" }}>
                                        <Link to='/'>
                                            <img src='../assets/images/acwcard.jpg' />
                                        </Link>
                                    </div> */}
                                        <div className='progfile_images'>
                                            <div class="image-upload">
                                                <div className='pro_bg_image'>

                                                    {
                                                        (this.state.bgimage || data.banner) ?
                                                            <img src={this.state.bgimage ? URL.createObjectURL(this.state.bgimage) : ImportedURL.LIVEURL + data.banner} alt='' />
                                                            : <img className="avatar" src="../assets/images/acwprofilebg.png" data-toggle="tooltip" data-original-title="Avatar Name" alt="" />
                                                    }
                                                    {/* <label for="file-input" >
                                                        <span className='upload_banner_text'>Change Banner</span>
                                                    </label> */}
                                                    <label for="file-input" className='profile_camera_banner'>
                                                        <span >
                                                            <AiFillCamera onChange={this.onChangeImage} />
                                                        </span>
                                                    </label>
                                                    {
                                                        data.banner
                                                        &&
                                                        <label for="file-input-0" className='profile_camera_banner_Cancel'>
                                                            <span >
                                                                <i class="fa fa-times-circle" aria-hidden="true" onClick={this.removeBanner}></i>
                                                            </span>
                                                        </label>
                                                    }
                                                </div>
                                                <input id="file-input" ref={this.fileInputBanner} accept="image/jpg, image/jpeg, image/png" type="file" name="banner" onChange={this.onChangeImage} />
                                            </div>
                                            <div class="image-upload">
                                                <div className='round_profile'>
                                                    {(this.state.profileimg || data.image) ?
                                                        <>
                                                            <img src={this.state.profileimg ? this.state.profileimg : ImportedURL.LIVEURL + data.image} />
                                                        </>
                                                        :
                                                        <>
                                                            <img src='../assets/images/user.png' />
                                                        </>
                                                    }

                                                    <label for="file-input1" className='profile_camera' name="circle_image">
                                                        <span >
                                                            <AiFillCamera onChange={this.onChangeImage} />
                                                        </span>
                                                    </label>
                                                    {
                                                        data.image
                                                        &&
                                                        <label for="file-input2" className='profile_camera_cancel' name="circle_image">
                                                            <span >
                                                                <i class="fa fa-times-circle" aria-hidden="true" onClick={this.removeImages}></i>
                                                            </span>
                                                        </label>
                                                    }

                                                    <input id="file-input1" ref={this.fileInputRef} accept="image/jpg, image/jpeg, image/png" type="file" style={{ display: 'none' }} name="image" onChange={this.onChangeImage} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='profile_images_box_shadow prof_dis_name'>
                                            <div class="mb-3 input_design">
                                                <label for="exampleFormControlInput1" class="form-label" >Full Name</label>
                                                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Full Name" name='displayname' value={data.displayname} onChange={this.onChange} />
                                            </div>
                                            <div class="mb-3 input_design">
                                                <label for="exampleFormControlInput1" class="form-label" placeholder="Password">Headline</label>
                                                <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Headline" name='headline' value={data.headline} onChange={this.onChange} />
                                            </div>
                                            <div className='profile_save_btn' style={{ marginTop: "35px" }}>
                                                <button type="button" class="btn btn-primary" onClick={this.submit}>Save</button>
                                            </div>
                                        </div>

                                        <div className='accordian_sec'>
                                            <div class="accordion mt-3" id="accordionExample">
                                                {/* <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingOne">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" id="custom-switch1" name="ispublicprofile" checked={data.ispublicprofile} onClick={this.taggleStatus} />
                                                        </div>
                                                        <label className='form-label mb-0 px-0'>Public Profile</label>
                                                    </button>
                                                </h2>
                                                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body profile_acc_body">
                                                        Your profile will be made visible to all.
                                                    </div>
                                                </div>
                                            </div> */}

                                                {/* <div class="accordion  "> */}
                                                <div class="accordion-item phoneNumber_inp mt-3">
                                                    <h2 class="accordion-header" id="headingTwo">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            <label class="switch">
                                                                <input type="checkbox" id="togBtn" checked={data.ispersonaldetails} name='ispersonaldetails' onClick={this.taggleStatus} />
                                                                <div class="slider round"></div>
                                                            </label>
                                                            <label className='form-label mb-0 px-0 ml-3 '>Personal Details</label>
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <div className='profile_images_box_shadow'>
                                                                <div class=" input_design mb-3">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Date of Birth</label>
                                                                    <DatePicker
                                                                        inputClass="form-control  input_date_field w-100"
                                                                        value={dobDate}
                                                                        format="MM-DD-YYYY"
                                                                        onChange={this.onChangeDate}
                                                                        placeholder={"Date of Birth"}
                                                                    />
                                                                    <div className="invalid-feedback" style={{ display: this.state.ageError ? "block" : 'none' }}>Age should be greater than 15</div>
                                                                </div>
                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Blood Group</label>
                                                                    <input type="text" class="form-control" name='bloodgroup' onChange={this.onChange} value={data.bloodgroup} id="floatingInput" placeholder="Blood Group" />
                                                                </div>

                                                                {/* <div class="mb-3 input_design">
                                                                <label for="exampleFormControlInput1" class="form-label" >Location</label>
                                                                <input type="text" class="form-control" name='location' onChange={this.onChange} value={data.location} id="floatingInput" placeholder="Loaction" />
                                                            </div> */}
                                                                <div class="form-floating-cc">
                                                                    <label for="exampleFormControlInput1" class="form-label">Contact Number</label>
                                                                    <div className='row'>
                                                                        <div className='col-5 '>
                                                                            <Select
                                                                                value={(data.cc && data.cc.value != undefined) ? { label: data.cc.value, value: data.cc.name, flag: data.cc.name.toLowerCase(), } : ''}
                                                                                onChange={this.onSelectFlag}
                                                                                options={CountryCodeJson && CountryCodeJson.map(item => {
                                                                                    return {
                                                                                        label: item.dial_code,
                                                                                        flag: item.code.toLowerCase(),
                                                                                        value: item.code,
                                                                                        name: 'cc'
                                                                                    }
                                                                                })}
                                                                                formatOptionLabel={(e) => {
                                                                                    return (
                                                                                        <div style={{ display: 'block', alignItems: 'center' }}>
                                                                                            {
                                                                                                e.flag ? <img src={'../assets/images/flags/' + e.flag + '.svg'} style={{ height: '20px', width: '25px', objectFit: 'contain' }} className="contain_image" /> : ''
                                                                                            }
                                                                                            <span style={{ marginLeft: 5 }}>{e.label}</span>
                                                                                        </div>
                                                                                    )
                                                                                }}
                                                                                menuPortalTarget={document.body}
                                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                            />
                                                                        </div>
                                                                        <div className='col-7'>
                                                                            <div class="mb-3 input_design form-floating-phone-number">
                                                                                <input type="text" class="form-control" maxLength={10} name='phonenumber' onChange={this.onChange} value={data.phonenumber} id="floatingPassword" placeholder="Contact Number" />
                                                                                <div className="invalid-feedback" style={{ display: this.state.phoneNoPatternError ? "block" : 'none' }}>Phone Number should contain 10 digits</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Educational Qualification</label>
                                                                    <input type="text" class="form-control" name='education' onChange={this.onChange} value={data.education} id="floatingPassword" placeholder="Educational Qualification" />
                                                                </div>


                                                                <div className='input_design' >
                                                                    <label for="exampleFormControlInput1" class="form-label" >Skills</label>
                                                                    {
                                                                        (data.skill && data.skill.length > 0)
                                                                        &&
                                                                        <div className='skill_badge_group input_design mt-2'>
                                                                            {
                                                                                (data.skill && data.skill.length > 0)
                                                                                &&
                                                                                data.skill.map((data, i) => {
                                                                                    return (
                                                                                        <>
                                                                                            <span className='skill_badges mb-3' onClick={(e) => this.removeSkill(i)}>{data}</span>
                                                                                        </>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    }
                                                                    <div class="input_design  skill_plus" style={{ marginBottom: '35px', marginLeft: "0px !important", marginRight: "0px !important" }}>
                                                                        <input type="text" class="form-control" id="floatingInput" value={this.state.skill} onChange={(e) => this.setState({ skill: e.target.value })} placeholder="Skills" />
                                                                        <AiOutlinePlus onClick={this.onClickSkill} />
                                                                    </div>
                                                                </div>

                                                                <div className='profile_save_btn' style={{ marginTop: "35px" }}>
                                                                    <button type="button" class="btn btn-primary" onClick={this.submit}>Save</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                                {/* <div class="accordion  "> */}
                                                <div class="accordion-item phoneNumber_inp mt-3">
                                                    <h2 class="accordion-header" id="headingFour">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                            {/* <Form>
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch2"
                                                                label="Professional Details"
                                                                checked={data.isbusinessdetails}
                                                                onClick={(e) => { this.props.HandleInputChange("isbusinessdetails", e.target.checked) }}
                                                            />
                                                        </Form> */}
                                                            <label class="switch">
                                                                <input type="checkbox" id="togBtn" checked={data.isbusinessdetails} name="isbusinessdetails" onClick={this.taggleStatus} />
                                                                <div class="slider round"></div>
                                                            </label>
                                                            <label className='form-label mb-0 px-0 ml-3 '>Business Details</label>

                                                            {/* <div class="form-check form-switch">
                                                                <input class="form-check-input" type="checkbox" id="custom-switch3" checked={data.isbusinessdetails} name="isbusinessdetails" onClick={this.taggleStatus} />
                                                            </div>
                                                            <label className='form-label mb-0 px-0'>Business Details</label> */}
                                                        </button>
                                                    </h2>
                                                    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                        <div class="accordion-body">
                                                            <div className='profile_images_box_shadow'>

                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Designation</label>
                                                                    <input type="text" class="form-control" name='designation' onChange={this.onChange} value={data.designation} id="floatingInput" placeholder="Designation" />
                                                                </div>

                                                                <div class="mb-3 input_design">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Name of the Company</label>
                                                                    <input type="text" class="form-control" name='work' onChange={this.onChange} value={data.work} id="floatingInput" placeholder="Name of the Company" />
                                                                </div>

                                                                {/* <div class="mb-3 input_design">
                                                                <label for="exampleFormControlInput1" class="form-label" >Location</label>
                                                                <input type="text" class="form-control" name='businesslocation' onChange={this.onChange} value={data.businesslocation} id="floatingInput" placeholder="Location" />
                                                            </div> */}

                                                                <div class="form-floating-cc mb-3">
                                                                    <label for="exampleFormControlInput1" class="form-label" >Contact Number</label>
                                                                    <div className='row'>
                                                                        <div className='col-5 '>
                                                                            <Select
                                                                                value={(data.businesscc && data.businesscc.value != undefined) ? { label: data.businesscc.value, value: data.businesscc.name, flag: data.businesscc.name.toLowerCase(), } : ''}
                                                                                onChange={this.onSelectFlagBusiness}
                                                                                options={CountryCodeJson && CountryCodeJson.map(item => {
                                                                                    return {
                                                                                        label: item.dial_code,
                                                                                        flag: item.code.toLowerCase(),
                                                                                        value: item.code,
                                                                                        name: 'businesscc'
                                                                                    }
                                                                                })}
                                                                                formatOptionLabel={(e) => {
                                                                                    return (
                                                                                        <div style={{ display: 'block', alignItems: 'center' }}>
                                                                                            {
                                                                                                e.flag ? <img src={'../assets/images/flags/' + e.flag + '.svg'} style={{ height: '20px', width: '25px', objectFit: 'contain' }} className="contain_image" /> : ''
                                                                                            }
                                                                                            <span style={{ marginLeft: 5 }}>{e.label}</span>
                                                                                        </div>
                                                                                    )
                                                                                }}
                                                                                menuPortalTarget={document.body}
                                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                            />
                                                                        </div>
                                                                        <div className='col-7'>
                                                                            <div class="mb-3 input_design form-floating-phone-number">
                                                                                <input type="text" class="form-control" name='businessphonenumber' maxLength={10} onChange={this.onChange} value={data.businessphonenumber} id="floatingPassword" placeholder="Contact Number" />
                                                                                <div className="invalid-feedback" style={{ display: this.state.busPhoneNoPatternError ? "block" : 'none' }}>Phone Number should contain 10 digits</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='profile_save_btn' style={{ marginTop: "35px" }}>
                                                                    <button type="button" class="btn btn-primary" onClick={this.submit}>Save</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* </div> */}
                                                </div>
                                                {
                                                    (listapp != undefined && listapp.length > 0)
                                                    &&
                                                    listapp.filter(e => e.status == true).map((app, i) => {
                                                        let { socialmediaValue } = this.state
                                                        let toggleStatus = (data.applinkstatus && data.applinkstatus.length > 0) ? (data.applinkstatus).find((e) => e.appid == app._id) : ""
                                                        let status = (socialmediaValue && socialmediaValue.length > 0) ? (socialmediaValue.reverse()).find((e) => e.Uid == app._id) : ''

                                                        let link = ''
                                                        let valueData = ''
                                                        if (status != undefined && status) {
                                                            link = status.link
                                                            valueData = status.value
                                                        }
                                                        return (
                                                            <>
                                                                <div class="accordion-item mt-3">
                                                                    <h2 class="accordion-header" id="headingSix">
                                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapseSix" + (i + 10)} onClick={(e) => this.setState({ socialmedialink: '', socialmediaSelect: "" })} aria-expanded="false" aria-controls="collapseSix">
                                                                            {app.name != ('Documents') ?
                                                                                <>
                                                                                    <label class="switch">
                                                                                        <input type="checkbox" id="togBtn" checked={toggleStatus ? toggleStatus.status : false} onClick={(e) => { this.appLinkStatus(e, app, i) }} />
                                                                                        <div class="slider round"></div>
                                                                                    </label>
                                                                                </> : ''}
                                                                            <label className={app.name != ('Documents') ? 'form-label mb-0 px-0 ml-3 mb-0' : 'ml-0 mb-0'}>{app.name == 'Documents' ? <i class="fa fa-file-text mr-1" aria-hidden="true" style={{ fontSize: '18px', color: '#1c3078' }}></i> : ''} {app.name}</label>

                                                                            {/* <div class="form-check form-switch">
                                                                                <input class="form-check-input" type="checkbox" id="custom-switch" checked={toggleStatus ? toggleStatus.status : false} onClick={(e) => { this.appLinkStatus(e, app, i) }} />
                                                                            </div>
                                                                            <label className='form-label mb-0 px-0'>{app.name}</label> */}
                                                                        </button>
                                                                    </h2>
                                                                    <div id={"collapseSix" + (i + 10)} class="accordion-collapse collapse collapseSix" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                                        <div class="accordion-body">
                                                                            <div className='profile_images_box_shadow'>
                                                                                <div className='row social_media_field'>
                                                                                    <div className='col-12'>
                                                                                        <div className='form-group'>
                                                                                            <Select
                                                                                                onClick={this.heightPerpose}
                                                                                                value={(status != undefined && status) ? { label: status.name, logo: status.logo } : ""}
                                                                                                options={(app.typesList && app.typesList.length > 0) ? app.typesList.map(item => {
                                                                                                    return {
                                                                                                        label: item.appname, value: item.appname, logo: item.logo, id: item.id, inputtype: item.inputtype
                                                                                                    }
                                                                                                }) : ''}
                                                                                                onChange={e => this.socialmediaSelect(e, app._id)}
                                                                                                formatOptionLabel={(e) => (
                                                                                                    <div style={{ display: 'block', alignItems: 'center', zIndex: 2 }}>
                                                                                                        {
                                                                                                            e.logo ? <img src={ImportedURL.LIVEURL + e.logo} style={{ height: '25px', width: '30px', objectFit: 'contain' }} className="contain_image" /> : ''
                                                                                                        }
                                                                                                        <span style={{ marginLeft: 5 }}>{e.label}</span>
                                                                                                    </div>
                                                                                                )}
                                                                                                menuPortalTarget={document.body}
                                                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    {
                                                                                        (status != undefined && status)
                                                                                        &&
                                                                                        <>
                                                                                            {
                                                                                                status.inputtype == 'address'
                                                                                                &&
                                                                                                <>
                                                                                                    {/* <div class="mb-3 mt-3 input_design p-0"> */}
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group'>
                                                                                                            <label for="exampleFormControlInput1" class="form-label" >Street</label>
                                                                                                            <input type="text" class="form-control" name='street' onChange={(e) => this.onChangeAddress(e, app._id, 'address')} value={status.street ? status.street : ""} id="floatingInput" placeholder="Street" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {/* </div> */}
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group'>
                                                                                                            <label for="exampleFormControlInput1" class="form-label" >City</label>
                                                                                                            <input type="text" class="form-control" name='city' onChange={(e) => this.onChangeAddress(e, app._id, 'address')} value={status.city ? status.city : ""} id="floatingInput" placeholder="City" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group'>
                                                                                                            <label for="exampleFormControlInput1" class="form-label" >State</label>
                                                                                                            <input type="text" class="form-control" name='state' onChange={(e) => this.onChangeAddress(e, app._id, 'address')} value={status.state ? status.state : ""} id="floatingInput" placeholder="State" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group'>
                                                                                                            <label for="exampleFormControlInput1" class="form-label" >ZIP Code</label>
                                                                                                            <input type="text" class="form-control" name='zip' onChange={(e) => this.onChangeAddress(e, app._id, 'address')} value={status.zip ? status.zip : ""} id="floatingInput" placeholder="ZIP Code" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group'>
                                                                                                            <label for="exampleFormControlInput1" class="form-label" >Country</label>
                                                                                                            <input type="text" class="form-control" name='country' onChange={(e) => this.onChangeAddress(e, app._id, 'address')} value={status.country ? status.country : ""} id="floatingInput" placeholder="Country" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                status.inputtype == 'url'
                                                                                                &&
                                                                                                <>
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group' style={{ marginTop: "10px" }}>
                                                                                                            <input type="text" class="form-control " id="floatingInput" value={link} name="socialmedialink" onChange={(e) => this.onChangeLink(e, app._id, "url")} placeholder={status.name} />
                                                                                                            {/* <AiOutlinePlus onClick={(e) => this.onClickSocialMedia(app._id, "url")} /> */}
                                                                                                            <div className="invalid-feedback" style={{ display: this.state.urlError ? "block" : 'none' }}>URL is not valid</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                status.inputtype == 'number'
                                                                                                &&
                                                                                                <>
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group' style={{ marginTop: "10px" }}>
                                                                                                            <div className='row'>
                                                                                                                <div className='col-5 '>
                                                                                                                    <Select
                                                                                                                        value={(status.cc && status.cc.value != undefined) ? { label: status.cc.value, value: status.cc.name, flag: status.cc.name.toLowerCase(), } : ''}
                                                                                                                        onChange={(e) => this.onChangeLinkCC(e, app._id, "cc")}
                                                                                                                        options={CountryCodeJson && CountryCodeJson.map(item => {
                                                                                                                            return {
                                                                                                                                label: item.dial_code,
                                                                                                                                flag: item.code.toLowerCase(),
                                                                                                                                value: item.code,
                                                                                                                                name: 'cc'
                                                                                                                            }
                                                                                                                        })}
                                                                                                                        formatOptionLabel={(e) => {
                                                                                                                            return (
                                                                                                                                <div style={{ display: 'block', alignItems: 'center' }}>
                                                                                                                                    {
                                                                                                                                        e.flag ? <img src={'../assets/images/flags/' + e.flag + '.svg'} style={{ height: '20px', width: '25px', objectFit: 'contain' }} className="contain_image" /> : ''
                                                                                                                                    }
                                                                                                                                    <span style={{ marginLeft: 5 }}>{e.label}</span>
                                                                                                                                </div>
                                                                                                                            )
                                                                                                                        }}
                                                                                                                        menuPortalTarget={document.body}
                                                                                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <div className='col-7'>
                                                                                                                    <div class="mb-3 input_design form-floating-phone-number">
                                                                                                                        <input type="text" class="form-control " id="floatingInput" maxLength={10} value={status.value} name="socialmedialink" onChange={(e) => this.onChangeLink(e, app._id, "number")} placeholder={status.name} />
                                                                                                                        <div className="invalid-feedback" style={{ display: this.state.phoneNoPatternArrayError ? "block" : 'none' }}>Phone Number should contain 10 digits</div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            {/* <AiOutlinePlus onClick={(e) => this.onClickSocialMedia(app._id, "number")} /> */}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                status.inputtype == 'email'
                                                                                                &&
                                                                                                <>
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group' style={{ marginTop: "10px" }}>
                                                                                                            <input type="text" class="form-control " id="floatingInput" value={status.value} name="socialmedialink" onChange={(e) => this.onChangeLink(e, app._id, "email")} placeholder={status.name} />
                                                                                                            {/* <AiOutlinePlus onClick={(e) => this.onClickSocialMedia(app._id, "email")} /> */}
                                                                                                            <div className="invalid-feedback" style={{ display: this.state.emailError ? "block" : 'none' }}>Email is not valid</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                status.inputtype == 'document'
                                                                                                &&
                                                                                                <>
                                                                                                    <div className='col-12'>
                                                                                                        <div class="mt-3 input_design  skill_plus social_Select_Media">
                                                                                                            <div class="doc_img">
                                                                                                                <div className='document_upload'>
                                                                                                                    <div className='row'>
                                                                                                                        <div className='col-lg-8'>
                                                                                                                            <div className='document_img'>
                                                                                                                                {
                                                                                                                                    (status.value != undefined && status.value)
                                                                                                                                        ?
                                                                                                                                        <>
                                                                                                                                            {
                                                                                                                                                (typeof status.value == 'string')
                                                                                                                                                    ?
                                                                                                                                                    <>
                                                                                                                                                        <a href={ImportedURL.FILEURL + status.value} target="_blank" style={{ color: 'black', textDecoration: 'none', objectFit: 'contain' }}>
                                                                                                                                                            <img src={'../assets/images/all_images.jpg'} />
                                                                                                                                                        </a>
                                                                                                                                                    </>
                                                                                                                                                    :
                                                                                                                                                    <>
                                                                                                                                                        {
                                                                                                                                                            status.previewtype == 'image'
                                                                                                                                                            &&
                                                                                                                                                            <img src={URL.createObjectURL(status.value)} />
                                                                                                                                                        }
                                                                                                                                                        {
                                                                                                                                                            status.previewtype == 'pdf'
                                                                                                                                                            &&
                                                                                                                                                            <a href={URL.createObjectURL(status.value)} target="_blank" style={{ color: 'black', textDecoration: 'none' }}>
                                                                                                                                                                <embed src={URL.createObjectURL(status.value)}></embed>
                                                                                                                                                            </a>
                                                                                                                                                        }
                                                                                                                                                        {
                                                                                                                                                            status.previewtype == 'doc'
                                                                                                                                                            &&
                                                                                                                                                            <a href={URL.createObjectURL(status.value)} target="_blank" style={{ color: 'black', textDecoration: 'none', objectFit: 'contain' }}>
                                                                                                                                                                <img src={'../assets/images/doc_img.png'} />
                                                                                                                                                            </a>
                                                                                                                                                        }
                                                                                                                                                    </>
                                                                                                                                            }

                                                                                                                                        </>
                                                                                                                                        :
                                                                                                                                        <>
                                                                                                                                            <img src='../assets/images/doucumet_dummy.png' />
                                                                                                                                        </>
                                                                                                                                }
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className='col-lg-4'>
                                                                                                                            <div className='document_icon'>
                                                                                                                                <label for="file-input2" className='document_camera' name="circle_image">
                                                                                                                                    <span style={{ color: '#fff' }}>
                                                                                                                                        <AiFillCamera onChange={(e) => this.onChangeImageArray(e, app._id, "document")} style={{ color: '#fff' }} />
                                                                                                                                    </span>
                                                                                                                                </label>
                                                                                                                                <input id="file-input2" accept="application/pdf,application/doc,application/docx,application/csv,application/msword,image/jpg, image/jpeg, image/png" type="file" style={{ display: 'none' }} name="image" onChange={(e) => this.onChangeImageArray(e, app._id, "document")} />
                                                                                                                            </div>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                status.inputtype == 'none'
                                                                                                &&
                                                                                                <>
                                                                                                    <div className='col-12'>
                                                                                                        <div className='form-group' style={{ marginTop: "10px" }}>
                                                                                                            <input type="text" class="form-control " id="floatingInput" value={status.value} name="socialmedialink" onChange={(e) => this.onChangeLink(e, app._id, "none")} placeholder={status.name} />
                                                                                                            {/* <AiOutlinePlus onClick={(e) => this.onClickSocialMedia(app._id, "none")} /> */}
                                                                                                            {/* <div className="invalid-feedback" style={{ display: this.state.urlError ? "block" : 'none' }}>Link is not valid</div> */}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                </div>

                                                                                {
                                                                                    (status != undefined && status.inputtype == 'address')
                                                                                    &&
                                                                                    <div className='form-group'>
                                                                                        <div className='profile_save_btn' style={{ marginTop: "10px" }}>
                                                                                            <button type="button" class="btn btn-primary " onClick={(e) => this.onClickSocialMediaAddress(app._id)}>Add</button>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    (status != undefined && status.inputtype == 'document')
                                                                                    &&
                                                                                    <div className='form-group'>
                                                                                        <div className='profile_save_btn' style={{ marginTop: "25px" }}>
                                                                                            <button type="button" class="btn btn-primary " onClick={(e) => this.onClickIAddImageArray(app._id)}>Add</button>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    (status != undefined && status.inputtype == 'none')
                                                                                    &&
                                                                                    <div className='form-group'>
                                                                                        <div className='profile_save_btn' style={{ marginTop: "10px" }}>
                                                                                            <button type="button" class="btn btn-primary " onClick={(e) => this.onClickSocialMedia(app._id, "none")}>Add</button>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    (status != undefined && status.inputtype == 'number')
                                                                                    &&
                                                                                    <div className='form-group'>
                                                                                        <div className='profile_save_btn' style={{ marginTop: "10px" }}>
                                                                                            <button type="button" class="btn btn-primary " onClick={(e) => this.onClickSocialMedia(app._id, "number")}>Add</button>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    (status != undefined && status.inputtype == 'email')
                                                                                    &&
                                                                                    <div className='form-group'>
                                                                                        <div className='profile_save_btn' style={{ marginTop: "10px" }}>
                                                                                            <button type="button" class="btn btn-primary " onClick={(e) => this.onClickSocialMedia(app._id, "email")}>Add</button>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    (status != undefined && status.inputtype == 'url')
                                                                                    &&
                                                                                    <div className='form-group'>
                                                                                        <div className='profile_save_btn' style={{ marginTop: "10px" }}>
                                                                                            <button type="button" class="btn btn-primary " onClick={(e) => this.onClickSocialMedia(app._id, "url")}>Add</button>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    (data.applink && data.applink.length > 0)
                                                                                    &&
                                                                                    data.applink.map((item, i) => {
                                                                                        if (item.parentId == app._id) {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className='social_media' style={{ cursor: "pointer", marginTop: "20px" }}>
                                                                                                        <div className='social_media_logo'>
                                                                                                            <div style={{ width: '55px', height: '55px' }}>
                                                                                                                <img src={ImportedURL.LIVEURL + item.logo} />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className='social_media_text'>
                                                                                                            <div className='social_media_text1' >
                                                                                                                {
                                                                                                                    (item.inputtype == 'document')
                                                                                                                        ?
                                                                                                                        <>
                                                                                                                            <div className='d-flex mr-2' style={{ justifyContent: 'space-between', alignItems: 'center', height: '45px' }}>
                                                                                                                                <div onClick={(e) => this.removeSocailMedia(item.index)}>
                                                                                                                                    <h6 className='document_header'>{item.name}</h6>
                                                                                                                                </div>
                                                                                                                                <label class="switch">
                                                                                                                                    <input type="checkbox" id="togBtn" checked={(item.documentstatus != undefined && item.documentstatus) ? item.documentstatus : false} name="isbusinessdetails" onClick={(e) => this.documentStatus(e, item, item.id, item.inputtype)} />
                                                                                                                                    <div class="slider round"></div>
                                                                                                                                </label>
                                                                                                                                {/* <div class="form-check form-switch">
                                                                                                                                    <input class="form-check-input" type="checkbox" id="custom-switch3" checked={(item.documentstatus != undefined && item.documentstatus) ? item.documentstatus : false} name="isbusinessdetails" onClick={(e) => this.documentStatus(e, item, item.id, item.inputtype)} />
                                                                                                                                </div> */}
                                                                                                                            </div>
                                                                                                                        </>
                                                                                                                        :
                                                                                                                        <>
                                                                                                                            <h6 onClick={(e) => this.removeSocailMedia(item.index)}>{item.name}</h6>
                                                                                                                        </>
                                                                                                                }
                                                                                                                <p className='link_over_flow' onClick={(e) => this.removeSocailMedia(item.index)}>
                                                                                                                    {
                                                                                                                        (item.inputtype == 'address')
                                                                                                                        &&
                                                                                                                        <>
                                                                                                                            {(item.street ? " " + item.street : "") + (item.city ? " " + item.city : "") + (item.state ? " " + item.state : "") + (item.country ? " " + item.country : "") + (item.zip ? " - " + item.zip : "")}
                                                                                                                        </>
                                                                                                                    }
                                                                                                                    {
                                                                                                                        (item.inputtype == 'url')
                                                                                                                        &&
                                                                                                                        <>
                                                                                                                            {item.link}
                                                                                                                        </>
                                                                                                                    }
                                                                                                                    {/* {
                                                                                                                    (item.inputtype == 'document')
                                                                                                                    &&
                                                                                                                    <>
                                                                                                                        {
                                                                                                                            (typeof item.value == 'string')
                                                                                                                                ?
                                                                                                                                <>{item.value.toLowerCase()}</>
                                                                                                                                :
                                                                                                                                <> {item.previewtype}</>
                                                                                                                        }
                                                                                                                    </>
                                                                                                                } */}
                                                                                                                    {
                                                                                                                        (item.inputtype == 'number')
                                                                                                                        &&
                                                                                                                        <>
                                                                                                                            {((item.cc.value != undefined && item.cc) ? item.cc.value + " " : "") + item.value}
                                                                                                                        </>
                                                                                                                    }
                                                                                                                    {
                                                                                                                        (item.inputtype == 'email')
                                                                                                                        &&
                                                                                                                        <>
                                                                                                                            {item.value}
                                                                                                                        </>
                                                                                                                    }
                                                                                                                    {
                                                                                                                        (item.inputtype == 'none')
                                                                                                                        &&
                                                                                                                        <>
                                                                                                                            {item.value}
                                                                                                                        </>
                                                                                                                    }
                                                                                                                </p>
                                                                                                            </div>
                                                                                                            <div className='social_media_text2'>
                                                                                                                <FiEdit onClick={(e) => this.editSocailMedia(item, item.id, item.inputtype)} />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div >
                    <div className='crop_model_section'>
                        <Modal className={'info-modal crop_modal'} show={this.state.showModal}  >

                            <div className="modal-header">
                                <Modal.Title>{"Crop Image"}</Modal.Title>
                                <button type="button" id="closeModal" onClick={this.ModalImages} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ fontSize: "23px" }}>
                                        <img src='../../assets/images/cancel.png' />
                                    </span>
                                </button>
                            </div>
                            {/* <Modal.Header closeButton>
                                <Modal.Title>{"Crop Image"}</Modal.Title>
                            </Modal.Header> */}
                            <div class="modal-body">
                                <div class="crop_Images">
                                    {(this.state.src) && (
                                        <ReactCrop
                                            src={this.state.src}
                                            crop={this.state.crop}
                                            onImageLoaded={this.onImageLoaded}
                                            onComplete={this.onCropComplete}
                                            onChange={this.onCropChange}
                                        />
                                    )}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div className=''>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={this.ModalImages}>Close</button>
                                </div>
                                <div className='profile_save_btn'>
                                    <button type="button" class="btn" onClick={this.CropImages}>Crop</button>
                                </div>
                            </div>
                        </Modal>
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
                        : ""
                    }
                </div >
            </>


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
        SpinnerProfile: AC_PROFILE_SPINNER,
        HandleChangesSetting: AC_HANDLE_INPUT_CHANGE_SETTINGS,
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);