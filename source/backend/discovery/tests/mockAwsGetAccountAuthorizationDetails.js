const fs = require('fs');
const zoomTestUtils = require('./zoomTestUtils');

const getAccountAuthorizationDetails = (parameters) => {   
    if (parameters.Filter){
        if (parameters.Filter.includes("AWSManagedPolicy")){
            return readFile(__dirname + '/get-account-authorization-AWSManagedPolicy.json');
        }
        else if (parameters.Filter.includes("LocalManagedPolicy")){
            return readFile(__dirname + '/get-account-authorization-LocalManagedPolicy.json');
        }
    }
    else {
        return readFile(__dirname + '/get-account-authorization-all.json');
    }
}

const readFile = (fileName) => {
    return zoomTestUtils.createResponse(JSON.parse(fs.readFileSync(fileName, 'utf8')));
}

module.exports = {
    getAccountAuthorizationDetails: getAccountAuthorizationDetails
}