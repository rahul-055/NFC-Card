import React, { Component } from 'react'
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CKEditor from "react-ckeditor-component";
import { bindActionCreators } from 'redux';
import { AC_ADD_CATEGORY, AC_HANDLE_CATEGORY_CHANGE, AC_LIST_CATEGORY, AC_RESET_CATEGORY, AC_UPDATE_CATEGORY, AC_VIEW_CATEGORY, AC_EMPTY_CATEGORY, AC_LIST_CATEGORY_DRAG_DROP, AC_HANDLE_CATEGORY_SEARCH } from '../../actions/categoryAction';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import ImportedURL from '../../common/api';
import { Error, Success } from '../../common/swal';
import Select from 'react-select';
import jsPDF from 'jspdf';
import Spinner from 'react-bootstrap/Spinner';
// import RLDD from 'react-list-drag-and-drop/lib/RLDD';

const initialState = {
    modalType: "Add",
    gridApi: '',
    columnDefs: [
        { headerName: '#', valueGetter: "node.rowIndex+1", width: 100, sortable: false, filter: false, headerClass: 'ag-center-header', cellStyle: { 'text-align': 'center' }, hide: 'true' },
        { headerName: 'Category', field: 'name', width: 300, floatingFilter: true, headerClass: 'ag-center-header' },
        {
            headerName: 'Status', width: 200, field: 'status', headerClass: 'ag-center-header', suppressMenu: true,
            cellRenderer: function (params) {
                if (params.data.status) {
                    return `<div class="status_style"><span type="button" class="tag tag-green" data-action-type="Status">Active</span></div>`;
                } else {
                    return '<div class="status_style"><span type="button" class="tag tag-danger" data-action-type="Status">Inactive</span></div>';
                }
            }
        },
        {
            headerName: 'Actions', width: 300, field: 'actions', sortable: 'false', headerClass: 'ag-center-header', suppressMenu: true, sortable: false, filter: false,
            cellRenderer: function (params) {
                return params.value;
            }
        },
    ],
    defaultColumDef: {
        "width": 200,
        "filter": true,
        "sortable": true,
        "resizable": true
    },
    nameError: false,
    id: '',
    serachValue: '',
    pagination: 1,
    paginationLimit: 25,
    startLimit: 1,
    endLimit: 25,
}
class ListCategory extends Component {
    constructor(props) {
        super(props);
        this.state = initialState
    }

    changeModal = (e) => {
        this.props.EmptyCategory();
        this.setState({ modalType: e.target.id });
        this.props.ResetCategory();
    }

    onRowClicked = event => {
        this.setState({ spinner: false })
        const rowValue = event.event.target;
        const value = rowValue.getAttribute('data-action-type');
        if (value === 'View') {
            this.setState({ modalType: "View", nameError: false, id: event.data._id, });
            // window.open('/view-category/' + event.data._id).focus();
            // this.props.ViewCategory(event.data._id);
        }
        if (value === 'Edit') {
            this.props.EmptyCategory();
            this.setState({ modalType: "Edit", id: event.data._id, nameError: false });
            // this.props.ViewCategory(event.data._id);
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
                    axios.get(ImportedURL.API.softDeleteCategory + '/' + event.data._id)
                        .then((res) => {
                            Success('Category deleted successfully');
                            this.props.ListCategory();
                        }).catch(({ response }) => {
                            if (response.status == 409) {
                                Error("If you can't delete this field, because,this is currently connected with another management!")
                            } else if (response.status == 400) {
                                Error('Bad request')
                            }
                            else if (response.status == 500) {
                                Error(response.status + ' Internal Server Error')
                            } else if (response.status == 502) {
                                Error(response.status + ' Bad Gateway')
                            } else {
                                Error(response.statusMessage)
                            }
                        });
                    // this.props.DeleteCategory(event.data._id)
                }
            })
        }
        if (value === 'Status') {
            Swal.fire({
                title: 'Are you sure to change the status?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Ok',
                imageUrl: '../../assets/images/status.png',
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
                    axios.post(ImportedURL.API.statusChange, { id: event.data._id, status: !event.data.status, model: 'categories' })
                        .then((data) => {
                            this.props.ListCategory();
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

    onChange = e => {
        this.setState({ spinner: false })
        const { name, value } = e.target;
        const Error = name + "Error";
        this.setState({ [Error]: false });
        this.props.HandleInputChange(name, value);
    }

    submit = () => {
        this.setState({ spinner: false })
        const data = this.props.CategoryState.category;
        if (!data.name) this.setState({ nameError: true });
        else {
            if (this.state.modalType === "Add") {
                axios.post(ImportedURL.API.addCategory, data)
                    .then((res) => {
                        // Success(res.statusText);
                        Success('Category created successfully');
                        this.props.ListCategory();
                        this.props.ResetCategory();
                        let btn = document.getElementById("closeModal");
                        btn.click();
                    }).catch(({ response }) => {
                        if (response) {
                            if (response.status == 409) {
                                Error('Category already exist')
                            } else if (response.status == 400) {
                                Error('Bad request')
                            }
                            else if (response.status == 500) {
                                Error(response.status + ' Internal Server Error')
                            } else if (response.status == 502) {
                                Error(response.status + ' Bad Gateway')
                            } else {
                                Error(response.statusMessage)
                            }
                            // Error(response.statusText) 
                        }
                    });
            } else {
                // this.props.UpdateCategory(data, this.state.id);
                axios.post(ImportedURL.API.updateCategory + "/" + this.state.id, data)
                    .then((res) => {
                        // Success(res.statusText);
                        Success('Category updated successfully');
                        this.props.ListCategory();
                        let btn = document.getElementById("closeModal");
                        btn.click();
                    }).catch(({ response }) => {
                        if (response) {
                            if (response.status == 400) {
                                Error('Bad request')
                            }
                            this.setState({ saving: false })
                            // Error(response.statusText)
                        }
                    });
            }
        }
    }

    componentDidMount() {
        this.props.ListCategory();
        this.props.EmptyCategory();
        const { AccountState } = this.props;
        // this.setState({ hotelName: AccountState.account.hotelName })
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    onGridReady = (params) => {
        this.gridColumnApi = params.columnApi;
        this.gridApi = params.api;
        this.gridApi.sizeColumnsToFit();
    }

    exportToCSV = () => {
        this.gridApi.exportDataAsCsv({
            columnKeys: ['name'],
            fileName: 'categories.csv',
            processCellCallback: function (params) {
                return params.value;
            }
        })
    }

    handleRLDDChange = (e) => {
        if (e && e.length > 0) {
            const formData = {
                category: e
            }
            this.props.CategoryDragDrop(formData)
        }
    }

    exportPDF = () => {
        const { CategoryState, AccountState } = this.props;
        const exportData = CategoryState.listcategories;
        const topHotelName = AccountState.account.hotelName;

        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";

        const marginLeft = 15;

        var img = new Image();
        img.src = '../../assets/images/logo.png';
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = topHotelName ? topHotelName + ' ' + '-' + ' ' + "Category List" : "Category List";
        if (topHotelName) {
            var headers = [['#', 'Category']];
            var data = exportData.map((elt, i) => [
                i + 1,
                elt.name,
            ]);
        } else {
            var headers = [['#', 'Category']];
            var data = exportData.map((elt, i) => [
                i + 1,
                elt.name,
            ]);
        };
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
        doc.setTextColor(28, 48, 120);
        // doc.text('MyHotel AI', 710, 40)
        doc.autoTable(content);
        var totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(11);
            doc.setTextColor(110);
            doc.text('Page ' + i + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 20);
            doc.setFontSize(11);
            doc.text('This is an auto-generated report from MyHotel AI (www.myhotelai.com) ', 20, 575);
        }
        doc.save("categories.pdf")
    }
    changeStatus = (id, value) => {
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
                axios.post(ImportedURL.API.statusChange, { id: id, status: value, model: 'categories' })
                    .then((data) => {
                        this.props.ListCategory();
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
    changeAction = (id, value) => {
        if (value === 'View') {
            this.setState({ modalType: "View", nameError: false, id: id, });
        }
        if (value === 'Edit') {
            this.props.EmptyCategory();
            this.setState({ modalType: "Edit", id: id, nameError: false });
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
                    axios.get(ImportedURL.API.softDeleteCategory + '/' + id)
                        .then((res) => {
                            Success('Category deleted successfully');
                            this.props.ListCategory();
                        }).catch(({ response }) => {
                            if (response.status == 409) {
                                Error("If you can't delete this field, because,this is currently connected with another management!")
                            } else if (response.status == 400) {
                                Error('Bad request')
                            }
                            else if (response.status == 500) {
                                Error(response.status + ' Internal Server Error')
                            } else if (response.status == 502) {
                                Error(response.status + ' Bad Gateway')
                            } else {
                                Error(response.statusMessage)
                            }
                        });
                    // this.props.DeleteCategory(event.data._id)
                }
            })
        }
    }

    handleSearch = (e) => {
        var value = e.target.value
        const rowData = this.props.CategoryState.listfilter;
        this.setState({ serachValue: value })
        if (value) {
            if (rowData != undefined && rowData.length > 0) {
                const data = rowData.filter((item) =>
                    item.name.toLowerCase().includes(value.toLowerCase())
                )
                this.props.searchCategoryList(data)
            } else {
                this.props.searchCategoryList([])
            }
        } else {
            this.props.ListCategory();
        }
    }

    render() {
        if (this.state.modalType === "View") return <Redirect to={'view-category/' + this.state.id} />
        if (this.state.modalType === "Edit") return <Redirect to={'edit-category/' + this.state.id} />
        const { fixNavbar, CategoryState, AccountState } = this.props;
        const rowData = CategoryState.listcategories;
        const data = CategoryState.category;
        const spinner = CategoryState.spinner;
        const previleges = AccountState.previleges;
        const Previlege = previleges.find(obj => { return obj.name == "Category" });
        const editOption = Previlege?.edit ? '<button type="button" class="btn btn-icon" data-action-type="Edit"><i class="fa fa-edit" style="color: #2196F3 !important; margin-top: 28px;" data-action-type="Edit"></i></button>' : '';
        const deleteOption = AccountState.role == 'admin' ? '<button type="button" class="btn btn-icon js-sweetalert" title="Delete" data-action-type="Delete"><i class="fa fa-trash-o text-danger" style="color: red !important; margin-top: 28px;" data-action-type="Delete"/></button>' : '';
        const template = '<div class="userlist_view"><button type="button" class="btn btn-icon" data-action-type="View" ><i class="fa fa-eye" style="color: #1DC9B7 !important; margin-top: 28px;" data-action-type="View"></i></button>'
            + editOption
            // + deleteOption
            + '</div>'
        rowData.forEach(object => {
            object.actions = template;
        });
        const limitOptions = [
            { value: '25', label: '25' },
            { value: '50', label: '50' },
            { value: '100', label: '100' }
        ]
        return (
            <>
                <div>
                    <div>
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
                        <div className="section-body pt-3">
                            <div className="container-fluid">
                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="Departments-list" role="tabpanel">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className='rounded_icon'><i className="icon-bar-chart mr-2 "></i></div>
                                                <h3 className="card-title"> Category List</h3>
                                                <div className="card-options">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <ul className="nav nav-tabs page-header-tab">
                                                        </ul>
                                                        <div className="header-action">
                                                            {Previlege?.add ? <Link to='add-category'><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" id='Add' onClick={(e) => this.changeModal(e)}><i className="fe fe-plus mr-2" id='Add' />Add</button></Link> : ''}
                                                        </div>
                                                    </div>
                                                    {rowData.length > 0 ?
                                                        <>
                                                            <a className="btn btn-primary btn-sm nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-download mr-2" aria-hidden="true"></i>Export</a>
                                                            <div className="dropdown-menu">
                                                                <a className="dropdown-item" type='button' onClick={this.exportToCSV}><i className="dropdown-icon fa fa-file-excel-o"></i> Excel</a>
                                                                <a className="dropdown-item" type='button' onClick={this.exportPDF}><i className="dropdown-icon fa fa-file-pdf-o"></i> PDF</a>
                                                            </div>
                                                        </>
                                                        : []}
                                                </div>
                                            </div>
                                            <div className="card-body" style={{ padding: "20px 20px 0px 20px" }}>
                                                <div className="row">
                                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xl-3">
                                                        <label className="form-label">Limit</label>
                                                        <div className="form-group">
                                                            <Select
                                                                // onChange={(e) => this.gridApi.paginationSetPageSize(Number(e.value))}
                                                                onChange={(e) => this.handleLimit(Number(e.value))}
                                                                options={limitOptions}
                                                                defaultValue={limitOptions[0]}
                                                                className='limit_size'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xl-3">
                                                        <label className="form-label">Category Search</label>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="Category Search" name="categorysearch" disabled={this.state.modalType == "View"} onChange={this.handleSearch} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <div className="ag-theme-alpine">
                                                        <AgGridReact
                                                            rowHeight={82}
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
                                                </div>
                                                {spinner ?
                                                    <div className='common_loader_ag_grid'>
                                                        <img className='loader_img_style_common_ag_grid' src='../assets/images/logo.jpg' />
                                                        <Spinner className='spinner_load_common_ag_grid' animation="border" variant="info" >
                                                        </Spinner>
                                                    </div>
                                                    : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Modal */}
                    <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">{this.state.modalType} Category</h5>
                                    <button type="button" className="close" id='closeModal' data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" style={{ fontSize: "23px" }}>
                                            <img src='../../assets/images/cancel.png' />
                                        </span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row clearfix">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <input type="text" className="form-control" disabled={this.state.modalType == "View"} name='name' onChange={this.onChange} value={data.name} placeholder="Category name*" />
                                                <div className="invalid-feedback" style={{ display: this.state.nameError ? "block" : 'none' }}>Category name is required</div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <select className="form-control" disabled={this.state.modalType == "View"} name='status' onChange={this.onChange}>
                                                    <option defaultValue={1} selected={data.status == 1}>Active</option>
                                                    <option defaultValue={0} selected={data.status == 0}>Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.modalType !== "View" ? <div className="modal-footer" >
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={this.submit}>Save</button>
                                </div> : ""}
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }
}
const mapStateToProps = state => ({
    fixNavbar: state.settings.isFixNavbar,
    CategoryState: state.category,
    AccountState: state.account,

})

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ searchCategoryList: AC_HANDLE_CATEGORY_SEARCH, CategoryDragDrop: AC_LIST_CATEGORY_DRAG_DROP, EmptyCategory: AC_EMPTY_CATEGORY, HandleInputChange: AC_HANDLE_CATEGORY_CHANGE, AddCategory: AC_ADD_CATEGORY, ListCategory: AC_LIST_CATEGORY, ViewCategory: AC_VIEW_CATEGORY, ResetCategory: AC_RESET_CATEGORY, UpdateCategory: AC_UPDATE_CATEGORY, }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCategory);