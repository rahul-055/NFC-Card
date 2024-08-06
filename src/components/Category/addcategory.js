import React, { Component } from "react";
import { connect } from "react-redux";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { bindActionCreators } from "redux";
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { AC_CHANGE_PREVILEGE, AC_DELETE_CATEGORY, AC_EMPTY_CATEGORY, AC_HANDLE_CATEGORY_CHANGE, AC_LIST_CATEGORY, AC_RESET_CATEGORY, AC_UPDATE_CATEGORY, AC_VIEW_CATEGORY } from '../../actions/categoryAction';
import CONSTANTS from "../../common/constants";
import ImportedURL from "../../common/api";
import { Error, Success } from "../../common/swal";
import Spinner from 'react-bootstrap/Spinner';

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalType: "Add",
      id: "",
      previlegeupdated: false,
      saving: false,
      spinner: false,
      oldprevileges: '',
      initialchange: true,
    };
  }

  onChange = e => {
    this.setState({ spinner: false })
    const { name, value } = e.target;
    const Error = name + "Error";
    this.props.HandleInputChange(name, value);
    this.setState({ [Error]: false });
  }
  changePrevilege = (index, key) => {
    this.setState({ spinner: false })
    this.props.ChangePrevilege(index, key);
    this.setState({ previlegeupdated: true })

    if (this.state.initialchange && this.state.modalType == 'Edit') {
      const { CategoryState } = this.props;
      this.setState({ oldprevileges: CategoryState.category.previleges, initialchange: false });
    }
  }

  setAll = e => {
    this.setState({ spinner: false })
    const { checked } = e.target;
    let previleges = checked ? CONSTANTS.allprevileges : CONSTANTS.previleges;


    this.props.HandleInputChange('previleges', previleges);
    this.setState({ previlegeupdated: true })


    if (this.state.initialchange && this.state.modalType == 'Edit') {
      const { CategoryState } = this.props;
      this.setState({ oldprevileges: CategoryState.category.previleges, initialchange: false });
    }

  }

  fetchPermissions = () => {
    this.setState({ spinner: false })
    const { CategoryState } = this.props;
    let categoryprevileges = CategoryState.category && CategoryState.category.previleges ? [...CategoryState.category.previleges] : [];
    let previleges = CONSTANTS.previleges;
    for (let i = 0; i < previleges.length; i++) {
      let Previlege = categoryprevileges.find(obj => { return obj.name == previleges[i].name });
      if (!Previlege) categoryprevileges.push(previleges[i])
    }
    this.props.HandleInputChange('previleges', categoryprevileges);
    this.setState({ previlegeupdated: true })
  }
  submit = () => {
    const { history } = this.props;
    const data = this.props.CategoryState.category;
    if (!data.name) {
      if (!data.name) {
        this.setState({ nameError: true });
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
    else {
      const formData = {
        previleges: JSON.stringify(data.previleges),
        name: data.name,
        status: data.status,
        previlegeupdated: this.state.previlegeupdated,
      }
      if (this.state.modalType === "Add") {
        this.setState({ saving: true })
        axios.post(ImportedURL.API.addCategory, formData)
          .then((res) => {
            this.setState({ saving: false })
            // Success(res.statusText);
            Success('Category created successfully');
            this.props.ResetCategory();
            history.push("/list-category");
          }).catch(({ response }) => {
            if (response) {
              this.setState({ saving: false })
              if (response.status == 409) {
                Error('Category already exist')
              } else if (response.status == 400) {
                Error('Bad request')
              } else if (response.status == 500) {
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
        this.setState({ saving: true })
        // this.props.UpdateCategory(data, this.state.id);
        axios.post(ImportedURL.API.updateCategory + "/" + this.state.id, formData)
          .then((res) => {
            this.setState({ saving: false })
            // Success(res.statusText);
            Success('Category updated successfully');
            history.push("/list-category");
            this.setState({ previlegeupdated: false })
          }).catch(({ response }) => {
            if (response) {
              if (response.status == 500) {
                Error(response.status + ' Internal Server Error')
              } else if (response.status == 502) {
                Error(response.status + ' Bad Gateway')
              } else {
                Error(response.statusMessage)
              }
              this.setState({ saving: false })
              // Error(response.statusText)
            }
          });
      }
    }
  }

  componentDidMount() {
    this.props.EmptyCategory();
    const { params, path } = this.props.match;
    if (params.id) {
      this.props.ViewCategory(params.id);
      this.setState({ modalType: path === "/view-category/:id" ? "View" : "Edit", id: params.id, spinner: true })
    } else {
      this.props.ResetCategory();
    }
    // const email = this.props.match.params.email;
    // this.props.ViewSubadmin({ email: email, update: 0 });
    //default scroll top the page
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
  render() {


    const { CategoryState, AccountState } = this.props;
    const data = CategoryState.category;
    const dataSpinner = CategoryState.spinner;
    const previleges = data.previleges ? data.previleges : CONSTANTS.previleges;
    return (
      <>
        <div>
          <div>
            <div className="breadcrump">
              <p> <Link to="/"><h6>Dashboard</h6></Link>  <span><i className="fa fa-angle-right" aria-hidden="true"></i> </span>  <Link to="/list-category"><h6> Category List</h6></Link> <span><i className="fa fa-angle-right" aria-hidden="true"></i> </span>  <h6 className="highlights_breadcrump" style={{ cursor: "pointer" }}>{this.state.modalType} Category</h6></p>
            </div>
            {/* <div className="section-body pt-3">
              <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center">
                  <ul className="nav nav-tabs page-header-tab">
                  </ul>
                  <div className="header-action" style={{ marginTop: '5px' }}>
                    <Link to='/list-category'><button type="button" className="btn btn-primary" id='Add'><i className="fa fa-arrow-left mr-2" data-toggle="tooltip" title="fa fa-arrow-left"></i>Back</button></Link>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="section-body pt-3">
              <div className="container-fluid">
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="Departments-list"
                    role="tabpanel"
                  >
                    <div className="card">
                      <div className="card-header">
                        <div className='rounded_icon'><i className="icon-bar-chart mr-2 "></i></div>
                        <h3 className="card-title">{this.state.modalType} Category</h3>
                        <div className="header-action" style={{ marginTop: '5px', marginLeft: 'auto' }}>
                          <Link to='/list-category'><button type="button" className="btn btn-primary" id='Add'><i className="fa fa-arrow-left mr-2" data-toggle="tooltip" title="fa fa-arrow-left"></i>Back</button></Link>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-6 col-md-6">
                            <div className="form-group" style={this.state.modalType == "View" ? { display: "inline-flex", fontSize: "18px" } : {}}>
                              <label className="form-label" style={this.state.modalType ? { fontSize: "18px" } : {}}>Category Name<span className="ml-1" style={this.state.modalType == "View" ? { padding: "0px 20px", } : {}}>{this.state.modalType == "View" ? <span>:</span> : <span style={{ color: "red" }}>*</span>}</span></label>
                              {this.state.modalType == "View" ? <label>{data.name}</label> : <input type="text" className="form-control" placeholder="Category Name" name="name" disabled={this.state.modalType == "View"} onChange={this.onChange} value={data.name} />}
                              <div className="invalid-feedback" style={{ display: this.state.nameError ? "block" : 'none' }}>Category Name is required</div>
                            </div>
                          </div>
                        </div>

                        {this.state.modalType == "View" ?
                          <div className="card set_permission">
                            <div className="cord-body py-4">
                              <div className="category_previleges">
                                <h5> Set Permissons  </h5>
                              </div>
                              {
                                previleges.map((data, index) => {
                                  if (data.add || data.edit || data.view || data.invite || data.share) {
                                    return (
                                      <>
                                        <div className="category_prev_list pt-3">
                                          <div className="row">
                                            <div className="col-lg-3">
                                              <div className="mainten_name">
                                                <h6>{data.name}</h6>
                                              </div>
                                            </div>
                                            <div className="col-lg-1">
                                              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                                            </div>
                                            <div className="col-lg-8">
                                              <div className="category_access">
                                                <ul>
                                                  {data.add ? <li><span className="tag tag-blue mb-3">ADD</span></li> : ''}
                                                  {data.view ? <li><span className="tag tag-pink mb-3">VIEW</span></li> : ''}
                                                  {data.edit ? <li><span className="tag mb-3" style={{ background: "#5a5278", color: "white" }}>EDIT</span></li> : ''}
                                                  {data.share ? <li><span className="tag tag-gray mb-3" style={{ background: "#e4bd51", color: "white" }}>SHARE</span></li> : ''}
                                                  {data.invite ? <li><span className="tag mb-3" style={{ background: "#cedd7a", color: "white" }}>INVITE</span></li> : ''}
                                                </ul>
                                              </div>
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
                          :
                          <div className="col-lg-12 category_pad px-0">
                            <div className="card add_category">
                              <div className="card-header px-0">
                                <h3 className="card-title">Set Permissons</h3>
                                <div className="card-options">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <ul className="nav nav-tabs page-header-tab"></ul>
                                    <div className="header-action">
                                      {/* <button type="button" className="btn btn-primary" onClick={this.fetchPermissions}>
                                    <i className="fe fe-plus mr-2" id="Add"></i>Fetch All </button> */}
                                      <div className="input-group">
                                        {AccountState.role == 'admin' && <> {this.state.oldprevileges && <span className="input-group-btn mr-2">
                                          <button className="btn btn-icon btn-sm show-fetch" type="submit" onClick={() => { this.props.HandleInputChange('previleges', this.state.oldprevileges); this.setState({ initialchange: true, oldprevileges: '', previlegeupdated: false }) }} >
                                            <span className="fa fa-refresh mr-2"></span>Reset old permissions
                                          </button>
                                        </span>}
                                          <span className="input-group-btn mr-2">
                                            <button className="btn btn-icon btn-sm fetch_btn" type="submit" onClick={this.fetchPermissions} >
                                              <span className="fa fa-refresh mr-2" style={{ position: 'relative', top: '3px' }}></span>Fetch Permissons
                                            </button>
                                          </span>
                                        </>}
                                        <label className="custom-switch">
                                          <input
                                            type="checkbox"
                                            name="custom-switch-checkbox"
                                            className="custom-switch-input"
                                            onChange={this.setAll}
                                          />
                                          <span className="custom-switch-indicator"></span>
                                          <span className="custom-switch-description">
                                            Set All
                                          </span>
                                        </label>
                                      </div>
                                      <div className="input-group">

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div className=" text-right">
                            <label className="custom-switch">
                              <input
                                type="checkbox"
                                name="custom-switch-checkbox"
                                className="custom-switch-input"
                                onChange={this.setAll}
                                disabled={this.state.modalType == "View"}
                              />
                              <span className="custom-switch-indicator"></span>
                              <span className="custom-switch-description">
                                Set All
                              </span>
                            </label>
                          </div> */}
                              <div className="table-responsive edit_user_table">
                                <table className="table table-striped mb-0 ">
                                  <thead>
                                    <tr>
                                      <th>Management</th>
                                      <th>View</th>
                                      <th>Add</th>
                                      <th>Edit</th>
                                      {/* <th>Delete</th> */}
                                      <th>Share</th>
                                      <th>Invite</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {previleges.map((data, index) => {
                                      return <tr key={index}>
                                        <td style={{ position: 'relative' }}>
                                          {/* <label className="user_previligies">{data.name == "Ticket" ? "Tickets" : ''}</label> */}
                                          <p className="user_permission">
                                            {
                                              data.name == "Ticket" ? 'Tickets'
                                                : data.name == "Review" ? 'Reviews'
                                                  : data.name == "Guest" ? 'Guest'
                                                    : data.name == "Minutes_Of_Meeting" ? 'Meeting Minutes'
                                                      : data.name == "Job" ? 'Careers'
                                                        : data.name == "Inspection" ? 'Inspection'
                                                          : data.name == "Notification" ? 'Notification'
                                                            : data.name == "Todo_List" ? 'To-Do List'
                                                              : data.name == "Petty_Cash" ? 'Petty Cash'
                                                                : data.name == "Asset_Name" ? 'Manage Assets'
                                                                  : data.name == "Food_Category" ? 'Breakfast'
                                                                    : data.name == "Enquiry" ? 'Enquiries'
                                                                      : data.name == "Cash_Count_Logsheet" ? 'Cash Count'
                                                                        : data.name == "Category" ? 'Setup'
                                                                          : ''
                                            }
                                          </p>
                                          <p style={{ marginTop: "revert", textAlign: 'center' }}>
                                            {data.name
                                              .replace('Ticket', 'List Tickets')
                                              .replace('Hotel', 'Hotels')
                                              .replace('User', 'Users')
                                              .replace('List Tickets_Report', 'User Reports')
                                              .replace('All_Reports', 'Ticket Reports, Hotel Reports')
                                              .replace('Meeting_Minutes_Report', 'Report')
                                              .replace('Todo_List', 'To-Do-List')
                                              .replace('To-Do-List_Report', 'Report')
                                              .replace('Review_Report', 'Reports')
                                              .replace('Enquiry', 'Enquiries')
                                              .replace('Room', 'Rooms')
                                              .replace('Public_Area', 'Public Areas')
                                              .replace('Inspection', 'Room Area')
                                              .replace('Public_Room Area', 'Public Area')
                                              .replace('Order_List', 'Food Order List')
                                              .replace('Food', 'List Food')
                                              .replace('List Food Order List', 'Food Order List')
                                              .replace('List Food_Order_Report', 'Guest Report')
                                              .replace('Job', 'Jobs')
                                              .replace('Jobs_Applicant', 'Job Applicants')
                                              .replace('Review', 'Send Review')
                                              .replace('Social_Send Review', 'Social Reviews')
                                              .replace('Minutes_Of_Meeting', 'List of MOM')
                                              .replace('Feedback', 'Client Feedbacks')
                                              .replace('Currency', 'Currencies')
                                              .replace('Jobs_Title', 'Job Templates')
                                              .replace('To-Do-List_Item', 'Todo-List Items')
                                              .replace('Area_Amenity', 'Area Amenities')
                                              .replace('Public Areas_Amenity', 'Public Area Amenities')
                                              .replace('Rooms_Area', 'Room Areas')
                                              .replace('Rooms_type', 'Room Types')
                                              .replace('Group', 'Groups')
                                              .replace('Country', 'Countries')
                                              .replace('Category', 'Categories')
                                              .replace('Add_Dynamic_Categories', 'Add Dynamic Category')
                                              .replace('List Food_Categories', 'Food Category')
                                              .replace('Sub_List Food_Categories', 'Sub Food Category')
                                              .replace('Cash_Count_Logsheet', 'Cash Count')
                                              .replace(/_/g, ' ')}
                                          </p>
                                        </td>
                                        <td>
                                          {
                                            data.view != undefined ?
                                              <label className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" name="example-checkbox1" checked={data.view} onChange={(event) => this.changePrevilege(index, 'view')} />
                                                <span className="custom-control-label"></span>
                                              </label>
                                              : "---"
                                          }
                                        </td>

                                        <td>
                                          {data.name !== "History" ?
                                            (
                                              data.add != undefined ?
                                                <label className="custom-control custom-checkbox">
                                                  <input type="checkbox" className="custom-control-input" name="example-checkbox1" checked={data.add} onChange={(event) => this.changePrevilege(index, 'add')} />
                                                  <span className="custom-control-label"></span>
                                                </label>
                                                : '---'
                                            )
                                            : '---'
                                          }
                                        </td>
                                        <td>
                                          {data.name !== "History" && data.name !== "Setting" ?
                                            (
                                              data.edit != undefined ?
                                                <label className="custom-control custom-checkbox">
                                                  <input type="checkbox" className="custom-control-input" name="example-checkbox1" checked={data.edit} onChange={(event) => this.changePrevilege(index, 'edit')} />
                                                  <span className="custom-control-label"></span>
                                                </label>
                                                : '---'
                                            )
                                            : '---'}
                                        </td>
                                        {/* <td>
                                        {data.name !== "History" ?
                                          <label className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" disabled={this.state.modalType == "View"} name="example-checkbox1" checked={data.delete} onChange={(event) => this.changePrevilege(index, 'delete')} />
                                            <span className="custom-control-label"></span>
                                          </label>
                                          : '---'}
                                      </td> */}
                                        <td>
                                          {data.name == "Job" ?
                                            (
                                              data.share != undefined ?
                                                <label className="custom-control custom-checkbox">
                                                  <input type="checkbox" className="custom-control-input" name="example-checkbox1" checked={data.share} onChange={(event) => this.changePrevilege(index, 'share')} />
                                                  <span className="custom-control-label"></span>
                                                </label>
                                                : '---'
                                            )
                                            : '---'}
                                        </td>
                                        <td>
                                          {data.name == "User" ?
                                            (
                                              data.invite != undefined ?
                                                <label className="custom-control custom-checkbox">
                                                  <input type="checkbox" className="custom-control-input" name="example-checkbox1" checked={data.invite} onChange={(event) => this.changePrevilege(index, 'invite')} />
                                                  <span className="custom-control-label"></span>
                                                </label>
                                                : '---'
                                            )
                                            : '---'}
                                        </td>
                                      </tr>
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                          </div>
                        }
                      </div>

                      {
                        this.state.modalType == 'View' ?
                          ""
                          :
                          (this.state.modalType == 'Edit' ?
                            <div className="card-footer text-right mandatory">
                              <label className="form-label text-left mandatory-label"><span className="mr-1" style={{ color: 'red' }}>*</span>fields are mandatory </label>
                              <div className="text-right">
                                {
                                  this.state.saving ?
                                    <button type="button" className="btn commor_save" ><i className="fa fa-spinner fa-spin mr-2"></i>Updating</button>
                                    :
                                    <button type="submit" className="btn commor_save" onClick={this.submit}>
                                      <i className="fe fe-save mr-2"></i>Update
                                    </button>
                                }
                              </div>
                            </div>
                            :
                            <div className="card-footer text-right mandatory">
                              <label className="form-label text-left mandatory-label"><span className="mr-1" style={{ color: 'red' }}>*</span>fields are mandatory </label>
                              <div className="text-right">
                                {
                                  this.state.saving ?
                                    <button type="button" className="btn commor_save" ><i className="fa fa-spinner fa-spin mr-2"></i>Saving</button>
                                    :
                                    <button type="submit" className="btn commor_save" onClick={this.submit}>
                                      <i className="fe fe-save mr-2"></i>Save
                                    </button>
                                }
                              </div>
                            </div>)
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div id="overlay" style={{ display: Object.keys(data.name && data.previleges).length <= 0 && (this.state.modalType == 'Edit' || this.state.modalType == 'View') ? 'block' : 'none' }}></div> */}
        </div>
        <div id="overlay" style={{ display: this.state.spinner ? (dataSpinner ? 'block' : 'none') : 'none' }}></div>
        {this.state.spinner && (dataSpinner &&
          <div className="common_loader">
            <img className='loader_img_style_common' src='../../assets/images/load.png' />
            <Spinner className='spinner_load_common' animation="border" variant="info" >
            </Spinner>
          </div>)
        }
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  fixNavbar: state.settings.isFixNavbar,
  SubadminState: state.subadmin,
  CategoryState: state.category,
  AccountState: state.account,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      EmptyCategory: AC_EMPTY_CATEGORY,
      // ChangePrevilege: AC_CHANGE_PREVILEGE,
      HandleInputChange: AC_HANDLE_CATEGORY_CHANGE,
      // SetAllPrevileges: AC_SET_ALL_PREVILEGES,
      ViewCategory: AC_VIEW_CATEGORY,
      UpdateCategory: AC_UPDATE_CATEGORY,
      ResetCategory: AC_RESET_CATEGORY,
      ChangePrevilege: AC_CHANGE_PREVILEGE,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(AddCategory);
