const createResponse = (response, error) => {
    return {
        promise: (() => {
            return new Promise((resolve, reject) => {
                if (!error) {
                    resolve(response);
                } else {
                    console.log("reject")
                    reject(error);
                }
            });
        })
    }
}

module.exports = {
    createResponse: createResponse
}
