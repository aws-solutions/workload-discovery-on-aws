const storeParse = (arn) => {

    if (arn) {
        let arnObject = {};

        let split = arn.split(":");
        // clear arn
        split.shift();
        arnObject.partition = split.shift();
        arnObject.service = split.shift();
        arnObject.region = split.shift();
        arnObject.accountId = split.shift();

        if (arnObject.accountId === undefined){
            arnObject.accountId = "";
        }

        let resourceInfo = split.shift();

        if (resourceInfo) {

            let trySlash = resourceInfo.split("/");

            if (trySlash.length === 3) {
                arnObject.resourceType = trySlash[0];
                arnObject.resource = trySlash[1];
                arnObject.qualifier = trySlash[2];
            }
            else if (trySlash.length === 2) {

                if (arnObject.service === "s3") {
                    arnObject.resource = trySlash[0];
                    arnObject.qualifier = trySlash[1];
                }
                else {
                    arnObject.resourceType = trySlash[0];
                    arnObject.resource = trySlash[1];
                    let qualifier = split.shift();
                    arnObject.qualifier = qualifier === undefined ? "" : qualifier;
                }
            }
            else if (trySlash.length === 1 && split.length === 0) {
                arnObject.resource = trySlash[0];
                arnObject.resourceType = "";
                arnObject.qualifier = "";
            }
            else if (trySlash.length === 1) {
                arnObject.resourceType = trySlash[0];
                arnObject.resource = split.shift();

                let qualifier = split.shift();
                arnObject.qualifier = qualifier === undefined ? "" : qualifier;
            }
        }
        else {
            arnObject.resource = "";
            arnObject.resourceType = "";
            arnObject.qualifier = "";
        }

        return arnObject;
    }
};

const createQuery = (arn, accountId) => {
    const arnObject = storeParse(arn);

    let query = {
        query: {
            bool: {
            }
        }
    };
    query.query.bool.must = [];

    Object.keys(arnObject).forEach(key => {
        let body = arnObject[key];

        if (body.length > 0) {
            let must = createMust(key, body, containsStar(body));
            if (must) {
                query.query.bool.must.push(must);
            }
        }
    });

    if (accountId) {
        let accountFilter = {
            term: {
                "properties.accountId.keyword": accountId
            }
        };

        query.query.bool.must.push(accountFilter);
    }

    return query;
};

const containsStar = (data) => {
    return (data.indexOf("*") > 0);
};

const createMust = (key, body, prefixOrTerm) => {
    return key === "qualifier"
        ? false
        : prefixOrTerm
            ? createPrefix(key, body)
            : createTerm(key, body);
};

const createPrefix = (key, body) => {
    let selector = "properties.parsedArn." + key;

    match_phrase_prefix = {
        match_phrase_prefix: {
        }
    };

    match_phrase_prefix.match_phrase_prefix[selector] = body;
    return match_phrase_prefix;
};

const createTerm = (key, body) => {
    let selector = "properties.parsedArn." + key + ".keyword";

    term = {
        term: {
        }
    };
    term.term[selector] = body;
    return term;
}

module.exports = {
    storeParse: storeParse,
    createQuery: createQuery
};