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
import { AC_ENQUIRY_SPINNER, AC_LIST_ENQUIRY, AC_VIEW_ENQUIRY } from "../../actions/enquiryAction";

class ListEnquiry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalType: "Add",
            columnDefs: [
                { headerName: '#', valueGetter: "node.rowIndex+1", width: 50, hide: true, sortable: false, filter: false, cellStyle: { 'text-align': 'center' } },
                {
                    headerName: 'Email', field: 'email', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    valueGetter: function (params) {
                        if (params.data.email) {
                            return params.data.email
                        } else {
                            return '---'
                        }
                    }
                },
                {
                    headerName: 'Name', field: 'firstname', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    valueGetter: function (params) {
                        if (params.data.firstname && params.data.lastname) {
                            return params.data.firstname + " " + params.data.lastname
                        } else {
                            return '---'
                        }
                    }
                },
                {
                    headerName: 'Phone No.', field: 'phonenumber', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    valueGetter: function (params) {
                        if (params.data.phonenumber) {
                            return params.data.phonenumber
                        } else {
                            return '---'
                        }
                    }
                },
                {
                    headerName: 'Message', field: 'message', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                    valueGetter: function (params) {
                        if (params.data.message) {
                            return params.data.message
                        } else {
                            return '---'
                        }
                    }
                },
                { headerName: 'Date & Time', field: 'createdAt', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true, },
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
            viewId: '',
            id: '',
            captcha: '',
            entercaptcha: ''
        }
    }
    componentDidMount() {
        this.props.EnquirySpinner()
        this.props.ListEnquiry()
    }
    onRowClicked = event => {
        const rowValue = event.event.target;
        const ID = event.data._id;
        const value = rowValue.getAttribute('data-action-type');
        if (value === 'View') {
            this.setState({ modalType: "View", id: ID, });
            this.props.ViewEnquiry(ID);
        }
    }
    onGridReady = (params) => {
        this.gridColumnApi = params.columnApi;
        this.gridApi = params.api;
        this.gridApi.sizeColumnsToFit();
    }
    exportToCSV = () => {
        this.gridApi.exportDataAsCsv({
            columnKeys: ['#', 'email', 'firstname', 'phonenumber', 'message', 'createdAt'],
            fileName: "enquirylist.csv",
            processCellCallback: function (params) {
                return params.value;
            }
        })
    }
    exportPDF = () => {
        const { enquiryState } = this.props;
        const exportData = enquiryState.listEnquiry;
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";
        const marginLeft = 15;
        var img = new Image();
        img.src = '../assets/images/logo-1.png';
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);

        const title = "Enquiry List";
        var headers = [['#', 'Email', 'Name', 'Phone No.', 'Message', 'Date & Time']];
        var data = exportData.map((elt, i) => [
            i + 1,
            (elt.email) ? elt.email : '---',
            (elt.firstname) ? elt.firstname + " " + (elt.firstname ? elt.firstname : '') : '---',
            (elt.phonenumber) ? elt.phonenumber : '---',
            (elt.message) ? elt.message : "---",
            (elt.createdAt) ? elt.createdAt : "---",
        ]);

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
        doc.save("enquirylist.pdf")
    }

    render() {
        const { accountState, enquiryState } = this.props;
        const account = accountState.account
        const rowData = enquiryState.listEnquiry
        const data = enquiryState.viewEnquiry;
        const spinner = enquiryState.spinner
        const template = '<div><button type="button" class="btn btn-icon" data-action-type="View"  data-toggle="modal" data-target=".bd-example-modal-lg"><i class="fa fa-eye"  data-action-type="View"></i></button></div>'
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
        return (
            <>
                <div class="container-fluid">
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <div class="col-12 breadcome_value">
                                    <ol class="breadcrumb ">
                                        <li class="breadcrumb-item header_color_breadcome"> <Link to='/admin'>Dasboard</Link></li>
                                        <li class="breadcrumb-item active">Enquiry List</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card card-primary header_border" >
                            <div class="table-title">
                                <div className="card-header">
                                    <h3 className="card-title d-flex "> <div className='rounded_icon'> <AiOutlineQuestionCircle className="mr-2 header_icon" /></div><h2 class="card-title header_title">ENQUIRY LIST</h2> </h3>
                                    <div className="card-options">
                                        <div className="d-flex justify-content-end">
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
                                                    className='limit_size'
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


                {/* View Enquiry modal  */}

                <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h3 className="card-title d-flex mb-0"> <div className='rounded_icon'> <AiOutlineQuestionCircle className="mr-2 header_icon" /></div><h2 class="card-title header_title">{this.state.modalType} ENQUIRY LIST</h2> </h3>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="card ">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-5 py-1">
                                                <strong>Name :</strong>
                                            </div>
                                            <div class="col-7 py-1">{data.firstname + ' ' + data.lastname}</div>
                                            <div class="col-5 py-1">
                                                <strong>Email:</strong>
                                            </div>
                                            <div class="col-7 py-1">{data.email}</div>
                                            <div class="col-5 py-1">
                                                <strong>Phone No :</strong>
                                            </div>
                                            <div class="col-7 py-1">{data.phonenumber}</div>
                                            <div class="col-5 py-1">
                                                <strong>Message:</strong>
                                            </div>
                                            <div class="col-7 py-1">{data.message ? data.message : '-------'}</div>
                                            <div class="col-5 py-1">
                                                <strong>Date & Time:</strong>
                                            </div>
                                            <div class="col-7 py-1">{data.createdAt ? data.createdAt : '-------'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountState: state.account,
        enquiryState: state.enquiry,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ListEnquiry: AC_LIST_ENQUIRY,
        ViewEnquiry: AC_VIEW_ENQUIRY,
        EnquirySpinner: AC_ENQUIRY_SPINNER,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ListEnquiry);