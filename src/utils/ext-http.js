import _ from 'lodash';

function isPresent (val) {
  return val !== undefined && val !== null;
}

export var ticketExpired = 'ticket-expired';

var RequestMethod = {
  Get: 'GET',
  Delete: 'DELETE',
  Head: 'HEAD',
  Jsonp: 'JSONP',
  Options: 'OPTIONS',
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH'
};

var HttpProviderOptions = (function () {
  function HttpProviderOptions (url, method) {
    if (method === void 0) {
      method = RequestMethod.Get;
    }
    this.body = null;
    this.params = {};
    this.header = {
      'Content-Type': 'application/json'
    };
    this.reportProgress = false;
    this.responseType = 'json';
    this.showLoading = true;
    this.loadingContent = '正在加载...';
    this.showErrorAlert = true;
    this.cache = false;
    this.cacheOnly = false;
    this.memCache = false;
    this.maxCacheAge = 1000 * 60 * 60 * 6;
    this.url = url;
    this.method = method;
  }
  HttpProviderOptions.prototype.merge = function (options) {
    this.url = isPresent(options.url) ? options.url : this.url;
    this.body = isPresent(options.body) ? options.body : this.body;
    this.header = isPresent(options.header) ? options.header : this.header;
    this.responseType = isPresent(options.responseType) ? options.responseType : this.responseType;
    this.method = isPresent(options.method) ? options.method : this.method;
    this.params = isPresent(options.params) ? options.params : this.params;
    this.showLoading = isPresent(options.showLoading) ? options.showLoading : this.showLoading;
    this.showErrorAlert = isPresent(options.showErrorAlert) ? options.showErrorAlert : this.showErrorAlert;
    this.loadingContent = options.loadingContent ? options.loadingContent : this.loadingContent;
    this.cache = isPresent(options.cache) ? options.cache : this.cache;
    this.cacheOnly = isPresent(options.cacheOnly) ? options.cacheOnly : this.cacheOnly;
    this.memCache = isPresent(options.memCache) ? options.memCache : this.memCache;
    this.maxCacheAge = isPresent(options.maxCacheAge) ? options.maxCacheAge : this.maxCacheAge;
    return this;
  };
  return HttpProviderOptions;
}());

var HttpProvider = (function () {
  function HttpProvider () {
  };
  HttpProvider.prototype.wxPromisify = function (fn) {
    return function (obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function (res) {
          resolve(res);
        };
        obj.fail = function (res) {
          reject(res);
        };
        fn(obj);
      });
    };
  };
  HttpProvider.prototype.wxRequest = function (url, options) {
    var getRequest = this.wxPromisify(wx.request);
    return getRequest({
      url: url,
      method: options.method,
      data: options.method === RequestMethod.Get ? options.params : options.body,
      header: options.header
    });
  };
  HttpProvider.prototype.post = function (url, options, foundCacheCallback) {
    options = { ...options, method: RequestMethod.Post };
    return this.request(url, options, foundCacheCallback);
  };
  HttpProvider.prototype.request = function (url, options, foundCacheCallback) {
    const _this = this;
    if (foundCacheCallback === void 0) {
      foundCacheCallback = function (_result) {};
    }

    var opts = new HttpProviderOptions(url).merge(options);
    const innerRequest = function (url, options) {
      if (options.showLoading) {
        wx.showLoading({
          title: options.loadingContent
        });
      }
      return _this.wxRequest(url, options, foundCacheCallback).then((wxResult) => {
        if (options.showLoading) {
          wx.hideLoading();
        }
        const result = wxResult.data;
        if (result.status === 1) {
          if (options.showErrorAlert) {
            wx.showModal({
              title: '系统提示',
              content: result.msg
            });
          }
          if (isPresent(result.data) && !_.isEqual({}, result.data)) {
            return Promise.reject(result);
          }
          return Promise.reject(result.msg);
        }
        if (options.cache && options.method === RequestMethod.Get && cacheKey) {
          var setStorage = _this.wxPromisify(wx.setStorage);
          return setStorage({
            key: cacheKey,
            data: {
              data: result.data,
              timeStr: new Date(),
              time: new Date().getTime()
            }
          }).then(() => {
            return result.data;
          }).catch((err) => {
            return Promise.reject(err);
          });
        }
        return result.data;
      }).catch(function (err) {
        if (opts.showLoading) {
          wx.hideLoading();
        }
        return Promise.reject(err);
      });
    };

    let cacheKey;
    if (opts.cache && opts.method === RequestMethod.Get) {
      cacheKey = this.hashUrl(url, opts.params);
      var getStorage = this.wxPromisify(wx.getStorage);
      return getStorage({
        key: cacheKey
      }).then((res) => {
        return res.data;
      }).then((data) => {
        var removeStorage = this.wxPromisify(wx.removeStorage);
        if (data && (new Date().getTime() - data.time) > opts.maxCacheAge) {
          return removeStorage({
            key: cacheKey
          }).then(() => {
            return data.data;
          });
        }
        return data.data;
      }).catch(() => {
        return innerRequest(url, opts);
      });
    }
    return innerRequest(url, opts);
  };
  HttpProvider.prototype.hashUrl = function (url, params) {
    var q = params ? params.toString() : '';
    return this.hash(url + q).toString();
  };
  HttpProvider.prototype.hash = function (str) {
    var hash = 0;
    if (str.length === 0) { return hash; }
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  };
  return HttpProvider;
}());

var CorsHttpProvider = (function () {
  function CorsHttpProvider (httpProvider, loginUrl, loginOutUrl, appId) {
    this.http = httpProvider;
    this.loginUrl = loginUrl;
    this.loginOutUrl = loginOutUrl;
    this.appId = appId;
  };
  CorsHttpProvider.prototype.login = function (options) {
    return this.http.post(this.loginUrl, {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'lx-login': true,
        'lx-uuid': wx.getSystemInfoSync().model,
        'lx-model': wx.getSystemInfoSync().model
      },
      body: options
    }).then(function (result) {
      return this.setTicketStorage(result.successToken);
    });
  };
  CorsHttpProvider.prototype.logout = function () {
    return this.http.request(this.loginOutUrl, {
      cache: false,
      header: {
        'lx-logout': 'true'
      }
    }).then(function (result) {
      return result;
    });
  };
  CorsHttpProvider.prototype.setTicketStorage = function (ticket) {
    var setStorage = this.http.wxPromisify(wx.setStorage);
    return setStorage({
      key: 'lx-ticket',
      data: ticket
    }).then(() => {
      return ticket;
    }).catch((err) => {
      return Promise.reject(err);
    });
  };
  CorsHttpProvider.prototype.post = function (url, options, foundCacheCallback) {
    options = { ...options, method: RequestMethod.Post };
    return this.http.post(url, options, foundCacheCallback);
  };
  CorsHttpProvider.prototype.request = function (url, options, foundCacheCallback) {
    if (foundCacheCallback === void 0) {
      foundCacheCallback = function (_result) {};
    };
    var opts = new HttpProviderOptions(url).merge(options);
    opts.params['lx-cors-request'] = true;
    opts.header['lx-app-key'] = this.appId;
    opts.header['lx-dev-mode'] = wx.getSystemInfoSync().model;
    var lxTicket = wx.getStorageSync('lx-ticket');
    opts.header['lx-ticket'] = lxTicket;
    return this.http.request(url, opts, foundCacheCallback).then((result) => {
      return result;
    }).catch((err) => {
      if (err && ((_.isString(err) && err.toString() === ticketExpired) ||
          (_.isString(err.data) && err.data.toString() === ticketExpired))) {
        this.logout();
      }
      return Promise.reject(err);
    });
  };
  return CorsHttpProvider;
}());

export { CorsHttpProvider, HttpProvider, HttpProviderOptions };
