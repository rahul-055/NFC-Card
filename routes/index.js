const BaseUrl = '/api/v1/admin/';
module.exports = function (app) {
	app.use(BaseUrl + "account", require("../controllers/admin/account"));
	app.use(BaseUrl + "user", require("../controllers/admin/user"));
	app.use(BaseUrl + "app", require("../controllers/admin/app"));
	app.use(BaseUrl + "common", require("../controllers/admin/common"));
	app.use(BaseUrl + "loginhistory", require("../controllers/admin/loginhistory"));
	app.use(BaseUrl + "dashboard", require("../controllers/admin/dashboard"));
	app.use(BaseUrl + "savecontacthistory", require("../controllers/admin/savecontacthistorys"));
	app.use(BaseUrl + "enquiry", require("../controllers/admin/enquiry"));
	app.use(BaseUrl + "category", require("../controllers/admin/category"));
}


