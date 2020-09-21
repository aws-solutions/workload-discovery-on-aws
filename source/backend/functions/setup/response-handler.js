const https = require("https");
const url = require("url");

const request = options => {
  const requestOptions = Object.assign({}, url.parse(options.url), {
    method: options.method,
    headers: {
      "Content-Type": "",
      "Content-Length": Buffer.byteLength(options.body)
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, res => {
      const chunks = [];
      if (res.statusCode !== 200) return reject(res);
      res.setEncoding("utf8");
      res.on("data", chunk => chunks.push(chunk));
      res.on("error", reject);
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });

    req.write(options.body);
    req.end();
  });
};

module.exports = (event, context, callback) => {
  let timeout;
  const terminate = err => {
    clearTimeout(timeout);
    if (err) {
      console.error(err);
    }
    return callback(err);
  };

  const sendResponse = (status, data) => {
    const requestBody = JSON.stringify({
      Status: status,
      Reason: `Details: ${context.logStreamName}`,
      PhysicalResourceId: context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: data
    });

    const options = {
      url: event.ResponseURL,
      body: requestBody,
      method: "PUT"
    };

    console.log(`Making HTTP request to ${event.ResponseURL}: ${requestBody}`);

    return request(options)
      .then(res => {
        console.log(res);
        return terminate();
      })
      .catch(err => terminate(err));
  };

  const executionTimeoutHandler = () =>
    sendResponse("FAILED").then(() =>
      callback(new Error("Function timed out"))
    );

  timeout = setTimeout(
    executionTimeoutHandler,
    context.getRemainingTimeInMillis() - 1000
  );

  return { sendResponse };
};
