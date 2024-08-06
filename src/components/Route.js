import Login from './Authentication/login';
import Signup from './Authentication/signup';
import ForgotPassword from './Authentication/forgotpassword';
import NotFound from './Authentication/404';
import InternalServer from './Authentication/500';
import Dashboard from './Dashboard/dashboard'
import adduser from './user/adduser';
import listuser from './user/listuser';
import viewuser from './user/viewuser';
import addapp from './app/addapp';
import listapp from './app/listapp';
import viewapp from './app/viewapp';
import listenquiry from './enquiry/listenquiry';
import AdminSetting from './adminsetting/setting'
import listcategory from './Category/listcategory';

const Routes = [
    {
        path: "/login",
        name: 'login',
        exact: true,
        pageTitle: "Tables",
        component: Login
    },
    {
        path: "/signup",
        name: 'signup',
        exact: true,
        pageTitle: "Tables",
        component: Signup
    },
    {
        path: "/forgotpassword",
        name: 'forgotpassword',
        exact: true,
        pageTitle: "Tables",
        component: ForgotPassword
    },
    {
        path: "/notfound",
        name: 'notfound',
        exact: true,
        pageTitle: "Tables",
        component: NotFound
    },
    {
        path: "/internalserver",
        name: 'internalserver',
        exact: true,
        pageTitle: "Tables",
        component: InternalServer
    },
    {
        path: "/admin",
        name: 'Dashboard',
        exact: true,
        pageTitle: "Dashboard",
        component: Dashboard
    },

    {
        path: "/admin/add-user",
        name: 'user',
        exact: true,
        pageTitle: "Add User",
        component: adduser
    },
    {
        path: "/admin/list-user",
        name: 'user',
        exact: true,
        pageTitle: "List User",
        component: listuser
    },
    {
        path: "/admin/view-user/:id",
        name: 'user',
        exact: true,
        pageTitle: "View User",
        component: viewuser
    },
    {
        path: "/admin/edit-user/:id",
        name: 'user',
        exact: true,
        pageTitle: "Add User",
        component: adduser
    },

    {
        path: "/admin/add-app",
        name: 'app',
        exact: true,
        pageTitle: "Add App",
        component: addapp
    },
    {
        path: "/admin/list-app",
        name: 'app',
        exact: true,
        pageTitle: "List App",
        component: listapp
    },
    {
        path: "/admin/view-app/:id",
        name: 'app',
        exact: true,
        pageTitle: "View App",
        component: viewapp
    },
    {
        path: "/admin/edit-app/:id",
        name: 'app',
        exact: true,
        pageTitle: "Edit App",
        component: addapp
    },
    {
        path: "/admin/list-enquiry",
        name: 'app',
        exact: true,
        pageTitle: "List Enquiry",
        component: listenquiry
    },
    {
        path: "/admin/admin-setting",
        name: 'admin setting',
        exact: true,
        pageTitle: "Setting",
        component: AdminSetting
    },
    {
        path: "/admin/list-category",
        name: 'list category',
        exact: true,
        pageTitle: "Category",
        component: listcategory
    },
];


export default Routes;