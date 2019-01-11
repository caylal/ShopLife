import { isEmpty, transExpiresDt } from '../utils/util.js';
import { logFactory } from '../utils/log/logFactory'
import { Auth } from '../utils/config.js'
import { Apis } from '../api/api.js'

const log = logFactory.get("HttpProxy")
let freshState = false
const get = (url, queryParams = {}, pathParams = {}) => {
  return request(url, 'GET', queryParams, undefined, pathParams);
}

const post = (url, data = {}, queryParams = {}, pathParams = {}) => {
  return request(url, 'POST', data, queryParams, pathParams);
}

const put = (url, data = {}, queryParams = {}, pathParams = {}) => {
  return request(url, 'PUT', data, queryParams, pathParams);
}

const deletes = (url, data = {}, queryParams = {}, pathParams = {}) => {
  return request(url, 'DELETE', data, queryParams, pathParams)
}

const buildUrl = (url, query = {}, path = {}) => {
  let result = url;
  if (!isEmpty(query)){
    Object.keys(query).forEach((key) => {
      if(result === url){
        result = result + '?' + key + '=' + query[key];
      }else {
        result = result + '&' + key + '=' + query[key];
      }
    })
  }
  if(!isEmpty(path)){
    Object.keys(path).forEach(function (key) {
      result = result.replace('{' + key + '}', path[key]);
    });
  }
  return result;
}

const doRequest = (url, method, tokenChenk, data = {}, queryParams = {}, pathParams = {}) => {
  url = buildUrl(url, queryParams, pathParams);
  if(tokenChenk){
    const token = wx.getStorageSync('token')
    Object.assign(data, { access_token: token.access_token})
  }
  log.log('requset: ' + method.toLowerCase() +' ' + url, data)
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        log.log('response: ' + method.toLowerCase() + ' ' + url ,res)
        if(!!res && res.data && res.data.code === 100){
          resolve(res.data.result);
        }else{
          reject(res)
        }
      },
      fail : res => {
        reject(res);
      }
    })
  })
}

const request = (url, method, data = {}, queryParams = {}, pathParams = {}) => {
  return new Promise((resolve, reject) => {
    if (guard(url)) {
      const token = wx.getStorageSync('token')
      const dtNow = new Date().valueOf()
      if (!!token && token.expired < dtNow) {
        if (!freshState) {
          freshState = true;
          doRequest(Apis.auth.refresh, 'GET', false, { refreshToken: token.refresh_token }).then(res => {
            if(res.token) {
              res.token.expired = transExpiresDt(res.token.expires_in)
              wx.setStorageSync('token', res.token)              
              freshState = false

              doRequest(url, method, true, data, queryParams, pathParams).then(res => {
                resolve(res)
              }).catch(err => reject(err))
            } 
          }).catch(err => reject(err))
        } else {
          // token处于刷新中
          let result = recurRequest(url, method, data, queryParams,pathParams)
          resolve(result)
        }
      } else {
        doRequest(url, method, true, data, queryParams,pathParams).then(res => {
          resolve(res)
        }).catch(err => reject(err))
      }
    } else {
      doRequest(url, method, false, data, queryParams, pathParams).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    }
  })
}
const recurRequest = (url, method, data = {}, queryParams = {}, pathParams = {}) => {
  let result;
  if(freshState){
    setTimeout(() => {
      recurRequest(url, method, data, queryParams, pathParams)
    },1000)
    
  } else {
    result = doRequest(url, method, true, data, queryParams, pathParams)
  }
  return result;
}

const guard = (api) => {
  let result = false;
  if (Auth.enable) {
    result = true
    if (api.indexOf(Auth.refreshTokenUrl) > 0) {
      result = false
    }else if(api.indexOf(Auth.login) > 0) {
      result = false
    }
  }
  return result
}

module.exports = {
  get,
  put,
  post,
  deletes
}