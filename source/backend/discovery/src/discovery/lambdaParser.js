const logger = require('./logger');
const rest = require('./rest');
const admZip = require('adm-zip');

const regions = ["us-east-1", "us-east-2", "us-west-1", "us-west-2", "ap-east-1", "ap-south-1", "ap-northeast-3", "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "	ca-central-1", "cn-north-1", "cn-northwest-1", "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1", "me-south-1", "sa-east-1", "us-gov-east-1", "us-gov-west-1"];
const supported = new Set(["nodejs8.10", "nodejs10.x", "nodejs12.x"]);

// A list of words that should be ignored.
const keywordsToIgnore = ["https", "http", "url", "content-type", "content-length", "error", "undefined",
    "account", "region", "vpc", "node", "undefined", "subnet", "db", "database",
    "eip", "ip", "string", "s3", "bucket", "select", "and", "where", "like", "from", "true", "false"];

// If any of the following appears on a line then remove the line.
const linesToRemove = ["require", "console.log", "switch", "case", "if", "for", "while", "return", "=>"];

const removeLines = code => {
    return code.split(/\r?\n/)
        .filter(line => {
            for (let test of linesToRemove) {
                if (line.indexOf(test) !== -1) {
                    return false;
                }
            }
            return true;
        })
        .join('\r\n');
};

const isSupported = (runtime) => {
    return supported.has(runtime);
}

const parse = (runtime, code) => {
    switch (runtime) {
        case "nodejs8.10":
            return parseNode(code);
        case "nodejs10.x":
            return parseNode(code);
        case "nodejs12.x":
            return parseNode(code);
        default:
            logger.error(`lambdaParser: ${runtime} not supported.`);
    }
}

const parseNode = (codeObject) => {
    // We only want to parse js files

    if (codeObject.file.endsWith(".js")) {
        logger.info("processing file: ", codeObject.file);
        let codeText = codeObject.code;

        // Remove all comments
        codeText = codeText.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "");

        codeText = removeLines(codeText);

        let externalDependencies = [];

        let doubleQuotes = codeText.match(/"[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*"/g);
        let singleQuotes = codeText.match(/'[^'\\\r\n]*(?:\\.[^'\\\r\n]*)*'/g);

        if (doubleQuotes) {
            externalDependencies = doubleQuotes;
        }

        if (singleQuotes) {
            externalDependencies.concat(singleQuotes);
        }

        externalDependencies = externalDependencies.map(strip).filter(filterRegions);

        let results = {
            validBuckets: unique(externalDependencies.filter(s3Buckets)).filter(exclude),
            connectionStrings: unique(externalDependencies.filter(connectionStrings).map(stripConnectionString)).filter(exclude)
        }

        // Make sure that any potential dynamotables have not already been found!
        results.dynamoTables = unique(externalDependencies.filter(element => {
            return notIn(results.validBuckets.concat(results.connectionStrings), element)
        }).filter(dynamoTables)).filter(exclude);

        return results;
    }

    return {
        validBuckets: [],
        connectionStrings: [],
        dynamoTables: []
    }
}

// Given the presigned URL of the code download the code into an array where each element
// is a file.  Ignore any subdirectories / dependencies.
const downloadCode = async (location) => {
    let code = [];
    let codeZip = await rest.arrayGet(location);
    const zip = new admZip(codeZip.data);
    let zipEntries = zip.getEntries();
    zipEntries.forEach(element => {
        // ignore dependecies in subdirs
        if (element.entryName.indexOf("/") === -1) {
            logger.info(element.entryName);
            let codeText = element.getData().toString('utf8');
            code.push({ file: element.entryName, code: codeText });
        }
    });

    return code;
}

const unique = (list) => {
    return [...new Set(list)];
}

const strip = (element) => {
    return element.substring(1, element.length - 1);
}

const filterRegions = (element) => {
    return !regions.includes(element);
}

const exclude = (element) => {
    return !keywordsToIgnore.includes(element);
}

const s3Buckets = (element) => {
    return /(?=^.{3,63}$)(?!^(\d+\.)+\d+$)(^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$)/g.test(element);
}

const dynamoTables = (element) => {
    return /(?=^.{3,255}$)(?!^(\d+\.)+\d+$)(^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$)/g.test(element);
}

const notIn = (list, element) => {
    return !list.includes(element);
}

const connectionStrings = (element) => {
    return element.indexOf("amazonaws.com") > 0;
}

const stripConnectionString = (connection) => {
    let firstIndex = connection.indexOf("://");

    if (firstIndex > 0) {
        connection = connection.substring(firstIndex + 3);

        let secondIndex = connection.indexOf(":");

        if (secondIndex > 0) {
            connection = connection.substring(0, secondIndex);
        }
    }

    return connection;
}

module.exports = {
    parseNode,
    isSupported,
    parse,
    downloadCode
};