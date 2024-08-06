import AOS from 'aos';
import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { AgGridReact } from 'ag-grid-react';
import Select from 'react-select';
import axios from 'axios';
import moment from 'moment';
import { Link } from "react-router-dom";
import ImportedURL from "../../common/api";
import { Currency } from "../../common/validate";
import { Spinner } from "react-bootstrap";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AiOutlineAppstore, AiOutlineQuestionCircle, GrFormAdd } from "react-icons/ai";
import { Redirect } from 'react-router-dom';
import { AC_APP_SPINNER, AC_LIST_APP } from "../../actions/appAction";
import { Error, Success } from '../../common/swal';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { AC_LIST_PROFILE, AC_USER_SPINNER } from "../../actions/profileAction";
import user from '../../assets/images/people.png';

class ListUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalType: "Add",
            columnDefs: [
                { headerName: '#', valueGetter: "node.rowIndex+1", width: 50, hide: true, sortable: false, filter: false, cellStyle: { 'text-align': 'center' } },
                {
                    headerName: 'Unique ID', field: 'uniqueid', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    cellRenderer: function (params) {
                        if (params.data.uniqueid && params.data.cardtype) {
                            return ` <span style="cursor: pointer;" data-action-type="copycardtype"> <i class="fa fa-clone mr-2" data-action-type="copycardtype"></i>` + params.data.uniqueid + `</span>`
                        } else if (params.data.uniqueid) {
                            return params.data.uniqueid
                        } else {
                            return '---'
                        }
                    }
                },
                {
                    headerName: 'Username', field: 'username', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    cellRenderer: function (params) {

                        let image = ``

                        if (params.data.cardtype == '1') {
                            image = `<img class=" user_profile" style="vertical-align: middle;margin-right:10px" src=${ImportedURL.LIVEURL + 'public/assets/images/Type1.jpg'} alt='' width='50px' height='30px'/>`
                        }
                        if (params.data.cardtype == '2') {
                            image = `<img class=" user_profile" style="vertical-align: middle;margin-right:10px" src=${ImportedURL.LIVEURL + 'public/assets/images/Type2.jpg'} alt='' width='50px' height='30px'/>`
                        }
                        if (params.data.cardtype == '3') {
                            image = `<img class=" user_profile" style="vertical-align: middle;margin-right:10px" src=${ImportedURL.LIVEURL + 'public/assets/images/Type3.jpg'} alt='' width='50px' height='30px'/>`
                        }
                        if (params.data.cardtype == '4') {
                            image = `<img class=" user_profile" style="vertical-align: middle;margin-right:10px" src=${ImportedURL.LIVEURL + 'public/assets/images/Type4.jpg'} alt='' width='50px' height='30px'/>`
                        }
                        if (params.data.cardtype == '5') {
                            image = `<img class=" user_profile" style="vertical-align: middle;margin-right:10px" src=${ImportedURL.LIVEURL + 'public/assets/images/Type5.jpg'} alt='' width='50px' height='30px'/>`
                        }
                        if (params.data.cardtype == '6') {
                            image = `<img class=" user_profile" style="vertical-align: middle;margin-right:10px" src=${ImportedURL.LIVEURL + 'public/assets/images/Type6.jpg'} alt='' width='50px' height='30px'/>`
                        }
                        if (params.data.cardtype == '7') {
                            image = `<img class=" user_profile" style="vertical-align: middle;margin-right:10px" src=${ImportedURL.LIVEURL + 'public/assets/images/Type7.jpg'} alt='' width='50px' height='30px'/>`
                        }
                        return `<span style="position:absolute;bottom:7px"">` + image + params.data.username + `</span>`

                    }
                },
                { headerName: 'Name', field: 'displayname', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true, hide: true },
                { headerName: 'Phone No', field: 'phonenumber', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true, hide: true },
                { headerName: 'Headline', field: 'headline', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true, hide: true },
                { headerName: 'Address', field: 'address', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true, hide: true },
                {
                    headerName: 'Email', field: 'email', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    cellRenderer: function (params) {
                        return ` <span style="cursor: pointer;" data-action-type="copyemail"> <i class="fa fa-clone mr-2" data-action-type="copyemail"></i>` + params.data.email + `</span>`
                    }
                },
                {
                    headerName: 'Save Contact', field: 'countsave', width: 150, cellStyle: { 'text-align': 'center' }, floatingFilter: true, cellStyle: { 'text-align': 'center' },
                    valueGetter: function (params) {
                        if (params.data.countsave) {
                            return params.data.countsave
                        } else {
                            return '0'
                        }
                    },
                },
                {
                    headerName: 'Login Count', field: 'loginsave', width: 150, cellStyle: { 'text-align': 'center' }, floatingFilter: true, cellStyle: { 'text-align': 'center' },
                    valueGetter: function (params) {
                        if (params.data.loginsave) {
                            return params.data.loginsave
                        } else {
                            return '0'
                        }
                    },
                },
                {
                    headerName: 'Last Login Date', field: 'lastlogindate', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    cellRenderer: function (params) {
                        if (params.data.lastlogindate) {
                            return `<span >` + params.data.lastlogindate + `</span>`;
                        } else {
                            return '<span > ------- </span>';
                        }
                    }
                },
                {
                    headerName: 'Status', width: 150, field: 'status', cellStyle: { 'text-align': 'center' }, headerClass: 'ag-center-header', suppressMenu: true,
                    cellRenderer: function (params) {
                        if (params.data.status) {
                            return `<span type="button" class="tag tag-green active_status" data-action-type="Status">Active</span>`;
                        } else if (!params.data.status) {
                            return '<span type="button" class="tag tag-danger inactive_status" data-action-type="Status">Inactive</span>';
                        }
                    }
                },
                {
                    headerName: 'Action', width: 150, field: 'actions', cellStyle: { 'text-align': 'center' }, headerClass: 'ag-center-header', suppressMenu: true, sortable: false, filter: false,
                    cellRenderer: function (params) {
                        return params.value;
                    }
                },
            ],
            defaultColumDef: {
                editable: false,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100,
            },
            editStatus: false,
            editId: '',
            viewStatus: false,
            allcardStatus: true,
            card1Status: false,
            card2Status: false,
            card3Status: false,
            card4Status: false,
            card5Status: false,
            card6Status: false,
            card7Status: false,
            cardTypeCount: {},
            viewId: '',
            id: ''
        }
    }
    componentDidMount() {
        this.props.UserSpinner()
        this.props.ListUser()
        axios.get(ImportedURL.API.userCardCount)
            .then((res) => {
                this.setState({ cardTypeCount: res.data })
            }).catch(({ response }) => {
                if (response) {
                    if (response.status == 401) {
                        Error('Something wrong, Retry again!')
                    } else if (response.status == 510) {
                        Error('Email does not exit')
                    } else if (response.status == 502) {
                        Error(response.status + ' Bad Gateway')
                    } else if (response.status == 500) {
                        Error('Internal Server Error')
                    } else if (response.status == 400) {
                        Error('Bad request')
                    }
                }
            });
    }
    onRowClicked = event => {
        const rowValue = event.event.target;
        const value = rowValue.getAttribute('data-action-type');
        if (value === 'View') {
            this.setState({ modalType: "View", nameError: false, id: event.data._id, });
        }
        if (value === 'copycardtype') {
            let copy = ImportedURL.LOCALURL + '?cardType=' + event.data.cardtype + "&uId=" + event.data.uniqueid
            navigator.clipboard.writeText(copy);
            Swal.fire({ title: 'Copied', showConfirmButton: false, timer: 500 })
        }
        if (value === 'copyemail') {
            let copy = event.data.email;
            navigator.clipboard.writeText(copy);
            Swal.fire({ title: 'Copied', showConfirmButton: false, timer: 500 })
        }
        if (value === 'Edit') {
            this.setState({ modalType: "Edit", id: event.data._id, nameError: false });
        }
        if (value === 'Delete') {
            Swal.fire({
                title: 'Are you sure want to delete?',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok',
                imageUrl: 'assets/images/delete.png',
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
                    axios.get(ImportedURL.API.softDeleteMinutesOfMeeting + "/" + event.data._id)
                        .then((res) => {
                            Success("Check in deleted successfully");
                            this.props.ListUser()
                        }).catch((err) => { console.log(err); });
                }
            })
        }
        if (value === 'Status') {
            Swal.fire({
                title: 'Are you sure to change the status?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Ok',
                imageUrl: 'assets/images/status.png',
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
                    axios.post(ImportedURL.API.statusChange, { id: event.data._id, status: !event.data.status, model: 'users' })
                        .then((data) => {
                            this.props.ListUser()
                            Success('Status updated successfully')
                        }).catch(({ response }) => {
                            if (response.status == 500) {
                                Error(response.status + ' Internal Server Error')
                            } else if (response.status == 502) {
                                Error(response.status + ' Bad Gateway')
                            } else {
                                Error(response.statusMessage)
                            }
                        });
                }
            })
        }
    }
    onGridReady = (params) => {
        this.gridColumnApi = params.columnApi;
        this.gridApi = params.api;
        this.gridApi.sizeColumnsToFit();
    }
    exportToCSV = () => {
        this.gridApi.exportDataAsCsv({
            columnKeys: ['#', 'username', 'displayname', 'headline', 'email', 'phonenumber', 'address', 'lastlogindate'],
            fileName: "userlist.csv",
            processCellCallback: function (params) {
                return params.value;
            }
        })
    }
    exportPDF = () => {
        const { profileState } = this.props;
        const exportData = profileState.listUser;
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";
        const marginLeft = 15;
        var img = new Image();
        img.src = '../assets/images/logo-1.png';
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);

        const title = "User List";
        var headers = [['#', 'Username', 'Name', 'Headline', ' Email', 'Phone Number', 'Address', 'Last Login Date']];
        var data = exportData.map((elt, i) => {
            return [
                i + 1,
                (elt.username) ? elt.username : "---",
                (elt.displayname) ? elt.displayname : "---",
                (elt.headline) ? elt.headline : "---",
                (elt.email) ? elt.email : "---",
                (elt.phonenumber) ? elt.phonenumber : "---",
                (elt.address) ? elt.address : "---",
                (elt.lastlogindate) ? elt.lastlogindate : "---",
            ]
        });

        let content = {
            startY: 70,
            head: headers,
            headStyles: { fillColor: [215, 234, 255], textColor: [28, 48, 120], },
            body: data,
            styles: {
                rowHeight: 30,
                valign: 'middle',
                lineWidth: 0.5,
            },
            margin: {
                left: 10,
                right: 10
            },
            autoPaging: "text",
        };
        doc.addImage(img, 'png', 780, 6, 50, 50);
        doc.setTextColor(28, 48, 120);
        doc.text(title, marginLeft, 40);
        doc.setTextColor(28, 48, 120)
        autoTable(doc, content);
        var totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(11);
            doc.setTextColor(110);
            doc.text('Page ' + i + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 20);
            doc.setFontSize(11);
            doc.text('This is an auto-generated report from ACWcard (www.acwcard.com)', 20, 575)
        }
        doc.save("userlist.pdf")
    }
    searchcardtype = e => {
        const { name, value, label } = e;
        this.props.ListUser({ cardtype: value });
        this.setState({ searchcardoption: e, cardtypefilter: value })
    }
    CardType = e => {
        this.props.ListUser()
        this.setState({ allcardStatus: true, card1Status: false, card2Status: false, card3Status: false, card4Status: false, card5Status: false, card6Status: false, card7Status: false })
        this.setState({ cardtypefilter: '' })
    }
    CardType1 = e => {
        this.setState({ allcardStatus: false, card1Status: true, card2Status: false, card3Status: false, card4Status: false, card5Status: false, card6Status: false, card7Status: false })
        this.props.ListUser({ cardtype: '1' })
        this.setState({ cardtypefilter: '1' })
    }
    CardType2 = e => {
        this.setState({ allcardStatus: false, card1Status: false, card2Status: true, card3Status: false, card4Status: false, card5Status: false, card6Status: false, card7Status: false })
        this.props.ListUser({ cardtype: '2' })
        this.setState({ cardtypefilter: '2' })
    }
    CardType3 = e => {
        this.setState({ allcardStatus: false, card1Status: false, card2Status: false, card3Status: true, card4Status: false, card5Status: false, card6Status: false, card7Status: false })
        this.props.ListUser({ cardtype: '3' })
        this.setState({ cardtypefilter: '3' })
    }
    CardType4 = e => {
        this.setState({ allcardStatus: false, card1Status: false, card2Status: false, card3Status: false, card4Status: true, card5Status: false, card6Status: false, card7Status: false })
        this.props.ListUser({ cardtype: '4' })
        this.setState({ cardtypefilter: '4' })
    }
    CardType5 = e => {
        this.setState({ allcardStatus: false, card1Status: false, card2Status: false, card3Status: false, card4Status: false, card5Status: true, card6Status: false, card7Status: false })
        this.props.ListUser({ cardtype: '5' })
        this.setState({ cardtypefilter: '5' })
    }
    CardType6 = e => {
        this.setState({ allcardStatus: false, card1Status: false, card2Status: false, card3Status: false, card4Status: false, card5Status: false, card6Status: true, card7Status: false })
        this.props.ListUser({ cardtype: '6' })
        this.setState({ cardtypefilter: '6' })
    }
    CardType7 = e => {
        this.setState({ allcardStatus: false, card1Status: false, card2Status: false, card3Status: false, card4Status: false, card5Status: false, card6Status: false, card7Status: true })
        this.props.ListUser({ cardtype: '7' })
        this.setState({ cardtypefilter: '7' })
    }
    render() {
        if (this.state.modalType === "View") return <Redirect to={'/admin/view-user/' + this.state.id} />
        if (this.state.modalType === "Edit") return <Redirect to={'/admin/edit-user/' + this.state.id} />

        const { accountState, profileState } = this.props;
        const { cardTypeCount } = this.state;
        const account = accountState.account;
        const rowData = profileState.listUser;
        const spinner = profileState.spinner;
        const editOption = '<button type="button" class="btn btn-icon" data-action-type="Edit"><i class="fa fa-edit" data-action-type="Edit"></i></button>'
        const deleteOption = account.role == 'admin' ? '<button type="button" class="btn btn-icon js-sweetalert" title="Delete" data-action-type="Delete"><i class="fa fa-trash-o text-danger" style="color: red !important" data-action-type="Delete"/></button>' : '';
        const template = '<div><button type="button" class="btn btn-icon" data-action-type="View" ><i class="fa fa-eye" data-action-type="View"></i></button>'
            + editOption
            // + deleteOption
            + '</div>'
        if (rowData.length > 0) {
            rowData.forEach(object => {
                object.actions = template;
            });
        }
        const limitOptions = [
            { value: '25', label: '25' },
            { value: '50', label: '50' },
            { value: '100', label: '100' }
        ]
        const cardtypeList = [
            { label: 'All', value: '', logo: "" },
            { label: 'Type 1', value: '1', logo: 'public/assets/images/Type1.jpg' },
            { label: 'Type 2', value: '2', logo: 'public/assets/images/Type2.jpg' },
            { label: 'Type 3', value: '3', logo: 'public/assets/images/Type3.jpg' },
            { label: 'Type 4', value: '4', logo: 'public/assets/images/Type4.jpg' },
            { label: 'Type 5', value: '5', logo: 'public/assets/images/Type5.jpg' },
            { label: 'Type 6', value: '6', logo: 'public/assets/images/Type6.jpg' },
            { label: 'Type 7', value: '7', logo: 'public/assets/images/Type7.jpg' },
        ]
        return (
            <>
                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-12 breadcome_value">
                                <ol class="breadcrumb ">
                                    <li class="breadcrumb-item header_color_breadcome"> <Link to='/admin'>Dasboard</Link></li>
                                    <li class="breadcrumb-item active">List User</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-body mt-3">
                    <div className="container-fluid">
                        <div className="row clearfix">
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType} style={{ cursor: 'pointer', borderRadius: this.state.allcardStatus ? '10px' : '', boxShadow: this.state.allcardStatus ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.allcard ? cardTypeCount.allcard : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image rounded-circle' src={user} />
                                            <span>ALL</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType1} style={{ cursor: 'pointer', borderRadius: this.state.card1Status ? '10px' : '', boxShadow: this.state.card1Status ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.cardtype1 ? cardTypeCount.cardtype1 : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image' src={ImportedURL.LIVEURL + 'public/assets/images/Type1.jpg'} />
                                            <span>CARD TYPE 1</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType2} style={{ cursor: 'pointer', borderRadius: this.state.card2Status ? '10px' : '', boxShadow: this.state.card2Status ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.cardtype2 ? cardTypeCount.cardtype2 : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image' src={ImportedURL.LIVEURL + 'public/assets/images/Type2.jpg'} />
                                            <span>CARD TYPE 2</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType3} style={{ cursor: 'pointer', borderRadius: this.state.card3Status ? '10px' : '', boxShadow: this.state.card3Status ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.cardtype3 ? cardTypeCount.cardtype3 : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image' src={ImportedURL.LIVEURL + 'public/assets/images/Type3.jpg'} />
                                            <span>CARD TYPE 3</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType4} style={{ cursor: 'pointer', borderRadius: this.state.card4Status ? '10px' : '', boxShadow: this.state.card4Status ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.cardtype4 ? cardTypeCount.cardtype4 : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image' src={ImportedURL.LIVEURL + 'public/assets/images/Type4.jpg'} />
                                            <span>CARD TYPE 4</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType5} style={{ cursor: 'pointer', borderRadius: this.state.card5Status ? '10px' : '', boxShadow: this.state.card5Status ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.cardtype5 ? cardTypeCount.cardtype5 : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image' src={ImportedURL.LIVEURL + 'public/assets/images/Type5.jpg'} />
                                            <span>CARD TYPE 5</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType6} style={{ cursor: 'pointer', borderRadius: this.state.card6Status ? '10px' : '', boxShadow: this.state.card6Status ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.cardtype6 ? cardTypeCount.cardtype6 : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image' src={ImportedURL.LIVEURL + 'public/assets/images/Type6.jpg'} />
                                            <span>CARD TYPE 6</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-xl-3">
                                <div className="card">
                                    <div className="card-body ribbon" onClick={this.CardType7} style={{ cursor: 'pointer', borderRadius: this.state.card7Status ? '10px' : '', boxShadow: this.state.card7Status ? 'rgb(204, 215, 223) 5px 5px 5px' : '' }}>
                                        <div className="ribbon-box orange">{cardTypeCount.cardtype7 ? cardTypeCount.cardtype7 : "0"}</div>
                                        <a className="my_sort_cut text-muted" href="#">
                                            <img className='all_search_image_size_card contain_image' src={ImportedURL.LIVEURL + 'public/assets/images/Type7.jpg'} />
                                            <span>CARD TYPE 7</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-fluid">
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row clearfix">
                                <div class="col-md-12">
                                    <div class="card card-primary header_border" >
                                        <div class="table-title">
                                            <div className="card-header">
                                                <h3 className="card-title d-flex "> <div className='rounded_icon'> <AiOutlineAppstore className="mr-2 header_icon" /></div><h2 class="card-title header_title">LIST USER</h2> </h3>
                                                <div className="card-options">
                                                    <div className="d-flex justify-content-end">
                                                        <div className="header-action mr-2">
                                                            <Link to='/admin/add-user'><button type="button" className="btn btn-primary button_color" id='Add'> <i className="fa fa-plus mr-2" id='Add' />Add</button></Link>
                                                        </div>
                                                        <div>
                                                            {(rowData.length > 0) ? <>
                                                                <a className="btn btn-primary btn-sm nav-link dropdown-toggle button_export" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-download mr-2" aria-hidden="true"></i>Export</a>
                                                                <div className="dropdown-menu">
                                                                    <a className="dropdown-item" type='button' onClick={this.exportToCSV}><i className="dropdown-icon fa fa-file-excel-o"></i> Excel</a>
                                                                    <a className="dropdown-item" type='button' onClick={this.exportPDF}><i className="dropdown-icon fa fa-file-pdf-o"></i> PDF</a>
                                                                </div>
                                                            </> : []}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body ">
                                                <div className="row">
                                                    <div className="col-3">
                                                        <label for="exampleInputEmail1">Limit</label>
                                                        <div className="form-group">
                                                            <Select
                                                                onChange={(e) => this.gridApi.paginationSetPageSize(Number(e.value))}
                                                                options={limitOptions}
                                                                defaultValue={limitOptions[0]}
                                                                className='limit_size overall_select_option'
                                                                menuPortalTarget={document.body}
                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <label for="exampleInputEmail1">Card Type</label>
                                                        <div className="form-group">
                                                            <Select
                                                                className='overall_select_option'
                                                                value={this.state.searchcardoption}
                                                                onChange={this.searchcardtype}
                                                                options={cardtypeList}
                                                                defaultValue={cardtypeList[0]}
                                                                formatOptionLabel={(e) => (
                                                                    <div style={{ display: 'block', alignItems: 'center' }}>
                                                                        {e.label != 'All' && <img className='all_search_image_size contain_image' src={ImportedURL.LIVEURL + e.logo} />}
                                                                        <span className='all_search_text_size' >{e.label}</span>
                                                                    </div>
                                                                )}
                                                                menuPortalTarget={document.body}
                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                                    <div className="ag-theme-alpine">
                                                        <AgGridReact
                                                            rowHeight={75}
                                                            paginationPageSize={25}
                                                            pagination={true}
                                                            onRowClicked={this.onRowClicked}
                                                            domLayout={"autoHeight"}
                                                            defaultColDef={this.state.defaultColumDef}
                                                            rowData={rowData}
                                                            rowDragManaged={true}
                                                            animateRows={true}
                                                            columnDefs={this.state.columnDefs}
                                                            onGridReady={this.onGridReady}
                                                        >
                                                        </AgGridReact>
                                                    </div>
                                                    {spinner ?
                                                        <div className='common_loader_ag_grid'>
                                                            <img className='loader_img_style_common_ag_grid' src='../assets/images/logo.jpg' />
                                                            <Spinner className='spinner_load_common_ag_grid' animation="border" variant="info" >
                                                            </Spinner>
                                                        </div>
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountState: state.account,
        profileState: state.profile,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ListUser: AC_LIST_PROFILE,
        UserSpinner: AC_USER_SPINNER,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUser);