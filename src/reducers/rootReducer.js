import { combineReducers } from 'redux';
import settings from './settings';
import account from './account';
import profile from './profile';
import app from './app';
import loginhistory from './loginhistory';
import savecontacthistory from './savecontacthistory';
import enquiry from './enquiry';
import category from './category';

export default combineReducers({
    settings,
    account,
    profile,
    app,
    loginhistory,
    savecontacthistory,
    enquiry,
    category,
});