/**
 * NodeJS Wunderlist 2 API (v1)
 * @author Ruslan Khissamov
 * @author Neson <neson@dex.tw>
 * @class wl
 */

var request   = require('request')

var noOp = function(){};

var Wl = function(opts) {
  opts                    = opts            || {};
  this.api_key            = opts.api_key    || '';
  this.version_api        = '1'
};

var createInstance = function(opts) {
  return new Wl(opts);
};

/* For the sake of backwards compatibility I've made this method return an instance.
 * This particular instance has a createInstance factory method that can create other instances of the Wunderlist 2 class.
 * In a future version this should be updated to:
 *    module.exports = createInstance;
 * Set module.exports to the createInstance function
 */
module.exports = (function() {
  var wl = createInstance();
  wl.createInstance = createInstance;
  return wl;
})();

/**
 * Sets Access for Wunderlist 2 access.
 * @class Wunderlist 2
 * @method setApiKey
 * @param {api_key}
*/
Wl.prototype.setApiKey = function(api_key) {
  this.api_key = 'Bearer ' + api_key;
};

/**
 * Builds and executes a wl api call
 * @class wl
 * @private _request
 * @param {Object} options or just API URI Path for GET requests
 * @param {Function} callback Function to call upon error or success
 * @returns {Object} error, {Object} data
*/

Wl.prototype._request = function (options, callback) {
  var base = 'https://api.wunderlist.com';
  callback = callback || noOp;
  if (typeof(options) != "string") {
    options.uri = base + options.uri;
  }
  if (this.api_key) {
    options.headers.authorization = this.api_key;
  }
  return request(options, function(error, response, body) {
    if (error) {
      callback(error, null);
    } else {
      switch(response.statusCode) {
        case 404:
          callback(new Error('Path not found'), null);
          break;
        case 422:
          callback(new Error(response.body.message), null);
          break;
        default:
          try {
            var data = JSON.parse(body);
            if ('errors' in data) {
              callback(data, null);
            } else {
              callback(null, data);
            }
          } catch (error2) {
            callback(error2, null);
          }
      }
    }
  });
};

/**
 * Performs a GET
 * @class wl
 * @private _get
 * @param {String} path API endpoint
 * @param {Functon} callback Method to execute on completion
 */

Wl.prototype._get = function(path, callback) {
  return this._request({
    uri: path,
    headers: {
      'content-type':'application/json'
    }
  }, callback);
};

/**
 * Performs a PUT
 * @class wl
 * @private _put
 * @param {String} path API endpoint
 * @param {Object} body Data
 * @param {Functon} callback Method to execute on completion
 */

Wl.prototype._put = function(path, body, callback) {
  if (typeof body === 'undefined') {
    var body = '{}';
  } else {
    body = body || '{}';
  }

  return this._request({
    uri:path,
    method:"PUT",
    headers: {
      'content-type':'application/json',
    },
    body:body
  },
  callback);
};

/**
 * Performs a POST
 * @class wl
 * @private _post
 * @param {String} path API endpoint
 * @param {Object} body Data
 * @param {Functon} callback Method to execute on completion
 */

Wl.prototype._post = function(path, body, callback) {
  if (typeof body === 'undefined') {
    var body = '{}';
  } else {
    body = body || '{}';
  }

  return this._request({
    uri:path,
    method:"POST",
    headers: {
      'content-type':'application/json; charset=UTF-8',
    },
    body:body
  },
  callback);
};

Wl.prototype._delete = function(path, callback) {
  if (typeof body === 'undefined') {
    var body = '{}';
  } else {
    body = body || '{}';
  }

  return this._request({
    uri:path,
    method:"delete",
    headers: {
      'content-type':'application/json'
    }
  },
  callback);
};

/**
 * Check the options parameter
 * @class Wl
 * @private _getOptions
 * @param {String} Options pretty / fields / expand
 */

Wl.prototype._getOptions = function(options){
  if(options != null) {
    return '?' + options
  } else {
    return ''
  }
}


// ****** Login // Get token ***********

Wl.prototype.login = function(ref, callback){
  callback = callback || noOp;
  return this._post('/login', ref, function(error, login) {
    if (login) this.setApiKey(login.token);
    callback(error, login);
  }.bind(this));
};

// ****** USER ***********
/**
 * Get info about me
 * @class Wl
 * @method getMe
 * @apiRequest GET /me
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMe = function(callback){
  return this._get('/me', callback);
};

/**
 * Get
 * @class Wl
 * @method getMeSettings
 * @apiRequest GET /me/settings
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeSettings = function(callback){
  return this._get('/me/settings', callback);
};

/**
 * Get
 * @class Wl
 * @method getMeEvents
 * @apiRequest GET /me/events
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeEvents = function(callback){
  return this._get('/me/events', callback);
};

/**
 * Get
 * @class Wl
 * @method getMeFriends
 * @apiRequest GET /me/friends
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeFriends = function(callback){
  return this._get('/me/friends', callback);
};

/**
 * Get
 * @class Wl
 * @method getMeServices
 * @apiRequest GET /me/services
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeServices = function(callback){
  return this._get('/me/services', callback);
};

/**
 * Get
 * @class Wl
 * @method getMeShares
 * @apiRequest GET /me/shares
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeShares = function(callback){
  return this._get('/me/shares', callback);
};

/**
 * Get
 * @class Wl
 * @method getMeReminders
 * @apiRequest GET /me/reminders
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeReminders = function(callback){
  return this._get('/me/reminders', callback);
};


/**
 * Get
 * @class Wl
 * @method getMeTasks
 * @apiRequest GET /me/tasks
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeTasks = function(callback){
  return this._get('/me/tasks', callback);
};

/**
 * Get
 * @class Wl
 * @method getMeTasksInList
 * @apiRequest GET /me/tasks
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeTasksInList = function(listId, callback){
  return this._get('/me/tasks?list_id=' + listId, callback);
};

/**
 * Get
 * @class Wl
 * @method getMeTask
 * @apiRequest GET /<task_id>
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeTask = function(task_id, callback){
  return this._get('/' + task_id , callback);
};

/**
 * Creating
 * @class Wl
 * @method createMeTask
 * @apiRequest POST /me/tasks
 * @param {String} Task ID
 * @param {JSON} Data
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.createMeTask = function(ref, callback){
  return this._post('/me/tasks/', JSON.stringify(ref), callback);
};

/**
 * Updating
 * @class Wl
 * @method updateMeTask
 * @apiRequest PUT /<task_id>
 * @param {String} Task ID
 * @param {JSON} Data
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.updateMeTask = function(task_id, ref, callback){
  return this._put('/' + task_id, JSON.stringify(ref), callback);
};

/**
 * Delete
 * @class Wl
 * @method deleteMeTask
 * @apiRequest DELETE /<task_id>
 * @param {String} Task ID
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.deleteMeTask = function(task_id, callback){
  return this._delete('/' + task_id, callback);
};


/**
 * Get
 * @class Wl
 * @method getMeLists
 * @apiRequest GET /me/lists
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.getMeLists = function(callback){
  return this._get('/me/lists', callback);
};

/**
 * Creating
 * @class Wl
 * @method createMeList
 * @apiRequest POST /me/lists
 * @param {JSON} Data
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.createMeList = function(ref, callback){
  return this._post('/me/lists/', JSON.stringify(ref), callback);
};

/**
 * Updating
 * @class Wl
 * @method updateMeList
 * @apiRequest PUT /<list_id>
 * @param {String} List ID
 * @param {JSON} Data
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.updateMeList = function(list_id, ref, callback){
  return this._put('/' + task_id, JSON.stringify(ref), callback);
};

/**
 * Delete
 * @class Wl
 * @method deleteMeList
 * @apiRequest DELETE /<list_id>
 * @param {String} List ID
 * @param {Functon} callback Method to execute on completion
 */
Wl.prototype.deleteMeList = function(list_id, callback){
  return this._delete('/' + list_id, callback);
};
