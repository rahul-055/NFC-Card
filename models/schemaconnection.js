const mongoose = require('mongoose');

// importing schemas to create model
const importedSettingsSchema = require('../schemas/settings');
const importedUserSchema = require('../schemas/user');
const importedAppSchema = require('../schemas/app');
const importedLoginHistorySchema = require('../schemas/loginhistory');
const importedSaveContactHistorySchema = require('../schemas/savecontacthistory');
const importedEnquirySchema = require('../schemas/enquiry');
const importedcategorySchema = require('../schemas/category');

// Creating schema

const SettingsSchema = mongoose.Schema(importedSettingsSchema, { timestamps: true, versionKey: false });
const UserSchema = mongoose.Schema(importedUserSchema, { timestamps: true, versionKey: false });
const AppSchema = mongoose.Schema(importedAppSchema, { timestamps: true, versionKey: false });
const LoginHistorySchema = mongoose.Schema(importedLoginHistorySchema, { timestamps: true, versionKey: false });
const SaveContactHistorySchema = mongoose.Schema(importedSaveContactHistorySchema, { timestamps: true, versionKey: false });
const EnquirySchema = mongoose.Schema(importedEnquirySchema, { timestamps: true, versionKey: false });
const CategorySchema = mongoose.Schema(importedcategorySchema, { timestamps: true, versionKey: false });

// Creating models
const SettingsModel = mongoose.model('settings', SettingsSchema);
const UserModel = mongoose.model('users', UserSchema);
const AppModel = mongoose.model('apps', AppSchema);
const LoginHistoryModel = mongoose.model('loginhistories', LoginHistorySchema);
const SaveContactHistoryModel = mongoose.model('savecontacthistories', SaveContactHistorySchema);
const EnquiryModel = mongoose.model('enquires', EnquirySchema);
const CategoryModel = mongoose.model('categories', CategorySchema);


module.exports = {
  settings: SettingsModel,
  users: UserModel,
  apps: AppModel,
  loginhistories: LoginHistoryModel,
  savecontacthistories: SaveContactHistoryModel,
  enquires: EnquiryModel,
  categories: CategoryModel,
}
