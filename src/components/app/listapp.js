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
import { AiOutlineAppstore, GrFormAdd } from "react-icons/ai";
import { Redirect } from 'react-router-dom';
import { AC_APP_SPINNER, AC_LIST_APP } from "../../actions/appAction";
import { Error, Success } from '../../common/swal';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

class ListApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalType: "Add",
            columnDefs: [
                { headerName: '#', valueGetter: "node.rowIndex+1", width: 50, hide: true, sortable: false, filter: false, cellStyle: { 'text-align': 'center' } },
                {
                    headerName: 'Name', field: 'name', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true,
                },
                { headerName: 'Type', field: 'types', width: 200, cellStyle: { 'text-align': 'left' }, floatingFilter: true },
                {
                    headerName: 'Status', width: 250, field: 'status', cellStyle: { 'text-align': 'center' }, headerClass: 'ag-center-header', suppressMenu: true,
                    cellRenderer: function (params) {
                        if (params.data.status) {
                            return `<span type="button" class="tag tag-green active_status" data-action-type="Status">Active</span>`;
                        } else if (!params.data.status) {
                            return '<span type="button" class="tag tag-danger inactive_status" data-action-type="Status">Inactive</span>';
                        }
                    }
                },
                {
                    headerName: 'Action', width: 100, field: 'actions', cellStyle: { 'text-align': 'center' }, headerClass: 'ag-center-header', suppressMenu: true, sortable: false, filter: false, cellStyle: { 'text-align': 'center' },
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
            pdfUrl: '',
            numPages: ''
        }
    }
    componentDidMount() {
        this.props.AppSpinner()
        this.props.ListApp()
    }
    onRowClicked = event => {
        const rowValue = event.event.target;
        const value = rowValue.getAttribute('data-action-type');
        if (value === 'View') {
            this.setState({ modalType: "View", nameError: false, id: event.data._id, });
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
                            this.props.ListApp({ hotel: this.state.searchhotel })
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
                    axios.post(ImportedURL.API.statusChange, { id: event.data._id, status: !event.data.status, model: 'apps' })
                        .then((data) => {
                            this.setState({ searchhoteloption: '', searchhotel: '' })
                            this.props.ListApp({ hotel: this.state.searchhotel })
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
            columnKeys: ['#', 'name', 'types'],
            fileName: "applist.csv",
            processCellCallback: function (params) {
                return params.value;
            }
        })
    }
    exportPDF = () => {
        const { appState } = this.props;
        const exportData = appState.listApp;
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";
        const marginLeft = 15;
        var img = new Image();
        img.src = '../assets/images/logo-1.png';
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);

        const title = "App List";
        var headers = [['#', "Name", "Type",]];
        var data = exportData.map((elt, i) => [
            i + 1,
            (elt.name) ? elt.name : '---',
            (elt.types) ? elt.types : "---",
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
        doc.save("applist.pdf")
    }
    render() {
        if (this.state.modalType === "View") return <Redirect to={'/admin/view-app/' + this.state.id} />
        if (this.state.modalType === "Edit") return <Redirect to={'/admin/edit-app/' + this.state.id} />

        const { accountState, appState } = this.props;
        const account = accountState.account
        const rowData = appState.listApp
        const spinner = appState.spinner
        const editOption = '<button type="button" class="btn btn-icon" data-action-type="Edit"><i class="fa fa-edit"  data-action-type="Edit"></i></button>'
        const deleteOption = account.role == 'admin' ? '<button type="button" class="btn btn-icon js-sweetalert" title="Delete" data-action-type="Delete"><i class="fa fa-trash-o text-danger" style="color: red !important" data-action-type="Delete"/></button>' : '';
        const template = '<div><button type="button" class="btn btn-icon" data-action-type="View" ><i class="fa fa-eye"  data-action-type="View"></i></button>'
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
        return (
            <>
                <div class="container-fluid">
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <div class="col-12 breadcome_value">
                                    <ol class="breadcrumb ">
                                        <li class="breadcrumb-item header_color_breadcome"> <Link to='/admin'>Dasboard</Link></li>
                                        <li class="breadcrumb-item active">List App</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="card card-primary header_border" >
                            <div class="table-title">
                                <div className="card-header">
                                    <h3 className="card-title d-flex "> <div className='rounded_icon'> <AiOutlineAppstore className="mr-2 header_icon" /></div><h2 class="card-title header_title">LIST APP</h2> </h3>
                                    <div className="card-options">
                                        <div className="d-flex justify-content-end">
                                            <div className="header-action mr-2">
                                                <Link to='/admin/add-app'><button type="button" className="btn btn-primary button_color" id='Add'> <i className="fa fa-plus mr-2" id='Add' />Add</button></Link>
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
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountState: state.account,
        appState: state.app,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ListApp: AC_LIST_APP,
        AppSpinner: AC_APP_SPINNER,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ListApp);