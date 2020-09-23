const gremlin = require('gremlin');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const { getUrlAndHeaders} = require('./sigV4Utils');
const WebSocket = require('ws');
const Connection = require('gremlin/lib/driver/connection');

class AgentConnection extends Connection {

  /**
   * Opens the connection, if its not already opened.
   * @returns {Promise}
   */
  open() {
    if (this.isOpen) {
      return Promise.resolve();
    }
    if (this._openPromise) {
      return this._openPromise;
    }

    this.emit('log', `ws open`);

    const opts = {
      headers: this.options.headers,
      ca: this.options.ca,
      cert: this.options.cert,
      pfx: this.options.pfx,
      rejectUnauthorized: this.options.rejectUnauthorized
    };

    if(this.options.agent) {
      opts.agent = this.options.agent;
    }

    this._ws = new WebSocket(this.url, opts);

    this._ws.on('message', (data) => this._handleMessage(data));
    this._ws.on('error', (err) => this._handleError(err));
    this._ws.on('close', (code, message) => this._handleClose(code, message));

    this._ws.on('pong', () => {
      this.emit('log', 'ws pong received');
      if (this._pongTimeout) {
        clearTimeout(this._pongTimeout);
        this._pongTimeout = null;
      }
    });
    this._ws.on('ping', () => {
      this.emit('log', 'ws ping received');
      this._ws.pong();
    });

    return this._openPromise = new Promise((resolve, reject) => {
      this._ws.on('open', () => {
        this.isOpen = true;
        if (this._pingEnabled) {
          this._pingHeartbeat();
        }
        resolve();
      });
    });
  }

}

class AwsSigV4DriverRemoteConnection extends gremlin.driver.RemoteConnection {
  constructor(host, port, options = {}, cbConnected = null, cbDisconnected = null, cbError = null) {
    const { url } = getUrlAndHeaders(host, port, options);
    super(url);

    this.host = host;
    this.port = port;
    this.options = options;

    this.cbConnected = cbConnected;
    this.cbDisconnected = cbDisconnected;
    this.cbError = cbError;
    this.connected = false;

    this.try = 0;
    this.submitTry = 0;
    this.maxRetry = this.options.maxRetry || 10;
    this.maxSubmitTry = 5;

    this.clientOptions = Object.assign({
      // if an agent is specified we need to handle opening ourselves
      connectOnStartup: this.options.agent == null,
      mimeType: 'application/vnd.gremlin-v2.0+json',
      pingEnabled: true,
      pingInterval: 1000,
      pongTimeout: 2000,
      port
    }, this.options);

    this._rejections = {};
  }

  async callUrl(opts) {
    if(this.options.agent) {
      opts.httpsAgent = this.options.agent;
    }
    const res = await axios.request(opts);
    return res.data;
  }

  // async sleep to throttle api calls 
  async asleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  async connect() {
    this.try += 1;
    try {
      const { url, headers } = getUrlAndHeaders(this.host, this.port, this.options, '/status', 'https');

      let callStatus = await this.callUrl({ url, headers, timeout: 3000 });
      if (callStatus.status === "healthy") {
        await this._connectSocket();
      }
    }
    catch (error) {
      console.log("Error connecting to neptune: ", error);

      if (error === "Invalid status code <403>") {
        throw error;
      }

      if (this.try <= this.maxRetry) {
        console.log("Connection retry:" + this.try);
        await this.asleep(100 * this.try);
        await this.connect();
      }
      else {
        throw new Error(`Connect failed after ${this.try} attempts `);
      }
    }
  }

  _connectSocket() {
    return new Promise((resolve, reject) => {
      try {
        const { url, headers } = getUrlAndHeaders(this.host, this.port, this.options);
        this._client = new gremlin.driver.Client(url, Object.assign({ headers }, this.clientOptions));

        if(this.options.agent) {
          this._client._connection = new AgentConnection(url, Object.assign({ headers }, {agent: this.options.agent}, this.clientOptions));
        }
        this._client._connection.on('log', log => this._logHandler(log));
        this._client._connection.on('close', (code, message) => this._closeHandler(code, message));
        this._client._connection.on('error', error => this._errorHandler(error));

        // because we overwrite the old connection when using an agent we need to open manually
        if(this.options.agent) {
          this._client._connection.open().then(() => this._connectHandler(resolve, reject));
        }
        else {
          this._client._connection._ws.on('open', () => this._connectHandler(resolve, reject));
        }
      }
      catch (error) {
        console.log("Websocket connect failed: ", error)
        reject(error);
      }

    });
  }

  _logHandler(log) {
    //console.log('connection event: log', { log });
  }

  _connectHandler(resolve, reject) {
    if (this._client._connection.isOpen) {
      this.try = 0;
      this.connected = true;
      console.log("connected");
      resolve(true);
    }
    reject("Could not connect to neptune")
  }

  _closeHandler(code, message) {
    console.log('connection event: close', { code, message });
    this.connected = false;
    this._cancelPendingQueries(new Error('Neptune connection is closed'));
    if (this.cbDisconnected) {
      this.cbDisconnected(code, message);
    }
    if (this.options.autoReconnect && this.try < this.maxRetry) {
      this.connect();
    }
  }

  _errorHandler(error) {
    console.log('connection event: error', { error });
    this.connected = false;
    this._cancelPendingQueries(error);
    if (this.cbError) {
      this.cbError(error);
    }
    if (this.options.autoReconnect && this.try < this.maxRetry) {
      this.connect();
    } else if (error instanceof Error) {
      throw error;
    }
  }

  _cancelPendingQueries(error) {
    Object.values(this._rejections).forEach(reject => reject(error));
    this._rejections = {};
  }

  /** @override */
  open() {
    return this._client.open();
  }

  /** @override */
  async submit(bytecode) {
    this.submitTry += 1;

    if (this.connected) {
      this.submitTry = 0;
      return new Promise((resolve, reject) => {
        const queryId = uuidv4();
        this._rejections[queryId] = reject;
        this._client.submit(bytecode)
          .then((result) => {
            delete this._rejections[queryId];
            resolve(new gremlin.driver.RemoteTraversal(result.toArray()));
          })
          .catch(err => (console.log(err), reject(err)));
      })
        .then(result => result);
    }
    else {
      //console.log("Not connected to neptune: submitTry: ", this.submitTry);
      if (this.submitTry <= this.maxSubmitTry) {
        await this.asleep(100 * submitTry);
        return await this.submit(bytecode);
      }
      else {
        throw new Error(`Submit failed after ${this.submitTry} attempts `);
      }
    }
  }

  /** @override */
  close() {
    this.options.autoReconnect = false;
    return this._client.close();
  }
}

module.exports = AwsSigV4DriverRemoteConnection;