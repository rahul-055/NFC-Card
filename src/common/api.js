// const LIVEURL = "http://localhost:9000/";
// const ROOTURL = LIVEURL + 'api/v1/admin/';

const LIVE = false;
const LIVEURL = LIVE ? "https://acwcard.com/" : "http://localhost:9000/"
const ROOTURL = LIVEURL + 'api/v1/admin/';
const LOCALURL = LIVE ? "https://acwcard.com/" : "http://localhost:3000/"
const FILEURL = "https://acwcircle-bucket.s3.amazonaws.com/";

const API = {
  // -------------Common Status Call URL 
  statusChange: ROOTURL + 'common/statusChange',

  accountDetails: ROOTURL + 'account/accountDetails',
  updateProfileAdmin: ROOTURL + 'account/updateProfileAdmin',

  login: ROOTURL + 'account/login',
  signup: ROOTURL + 'user/signup',
  updateProfile: ROOTURL + 'user/updateProfile',
  updateaccountsetting: ROOTURL + 'user/updateaccountsetting',
  viewProfile: ROOTURL + 'user/viewProfile',
  listSocialMediaDrag: ROOTURL + 'user/listSocialMediaDrag',
  listUser: ROOTURL + 'user/listUser',
  viewUser: ROOTURL + 'user/viewUser',
  updateUser: ROOTURL + 'user/updateUser',
  viewProfileUniqueId: ROOTURL + 'user/viewProfileUniqueId',
  vCardGenerate: ROOTURL + 'user/vCardGenerate',
  viewPrivateAccount: ROOTURL + 'user/viewPrivateAccount',
  viewProfileUserName: ROOTURL + 'user/viewProfileUserName',
  vCardGenerateOwner: ROOTURL + 'user/vCardGenerateOwner',
  forgotPassword: ROOTURL + 'user/forgotPassword',
  updateProfileAppLinks: ROOTURL + 'user/updateProfileAppLinks',
  updateProfileAppStatus: ROOTURL + 'user/updateProfileAppStatus',
  updateProfileOtherStatus: ROOTURL + 'user/updateProfileOtherStatus',
  updateInfoStatus: ROOTURL + 'user/updateInfoStatus',
  userCardCount: ROOTURL + 'user/userCardCount',
  updateTapCardStatus: ROOTURL + 'user/updateTapCardStatus',


  addApp: ROOTURL + 'app/addApp',
  listApp: ROOTURL + 'app/listApp',
  viewApp: ROOTURL + 'app/viewApp',
  updateApp: ROOTURL + 'app/updateApp',
  softDeleteApp: ROOTURL + 'app/softDeleteApp',


  getLoginHistory: ROOTURL + 'loginhistory/getLoginHistory',

  countSaveContactDashboard: ROOTURL + 'dashboard/countSaveContactDashboard',

  getSaveContactHistory: ROOTURL + 'savecontacthistory/getSaveContactHistory',
  ViewSaveContactHistory: ROOTURL + 'savecontacthistory/ViewSaveContactHistory',

  addEnquiry: ROOTURL + 'enquiry/addEnquiry',
  listEnquiry: ROOTURL + 'enquiry/listEnquiry',
  viewEnquiry: ROOTURL + 'enquiry/viewEnquiry',

}

const ImportedURL = {
  API: API,
  LIVEURL: LIVEURL,
  LOCALURL: LOCALURL,
  FILEURL: FILEURL,
}
export default ImportedURL;
