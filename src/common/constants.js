const CONSTANTS = {};

CONSTANTS.previleges = [
    { "name": "Category", "view": false, "add": false, "edit": false, },
    { "name": 'User', "view": false, "add": false, "edit": false, "delete": false },
]

CONSTANTS.allprevileges = [
    { "name": "Category", "view": true, "add": true, "edit": true, },
    { "name": 'User', "view": true, "add": true, "edit": true, "delete": true },
]

export default CONSTANTS;
