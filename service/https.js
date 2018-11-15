import { isEmpty } from '../utils/util.js';
import { logFactory } from '../utils/log/logFactory'

const log = logFactory.get("HttpProxy")
const get = (url, queryParams = {}, pathParams = {}) => {
  return request(url, 'GET',queryParams, pathParams);
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

const request = (url, method, data = {}, queryParams = {}, pathParams = {}) => {
  url = buildUrl(url, queryParams, pathParams);
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

/**封装微信的request */
// const request = (url, data = {}, method = "Get") => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: url,
//       data: data,
//       method: method,
//       header: {
//         'Content-Type': 'application/json'
//       },
//       success: res => {
//         console.log("success");
//         if (res.statusCode == 200 && res.data._wrapperCode == 200) {
//           resolve(res.data.result)
//         } else if (res.statusCode == 200 && res.data.result == null) {
//           resolve(res.data.result)
//         }
//         else {
//           reject(res.data.error)
//         }
//       },
//       fail: res => {
//         console.log("failed");
//         reject(res.errMsg);
//       }
//     })
//   })
// }
// const delOrPutRequest = (url, id, data = {}, method = "DELETE") => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: url + '/' + id,
//       method: method,
//       data: data,
//       success: res => {
//         if (res.statusCode == 200 && res.data._wrapperCode == 200) {
//           resolve(res.data.result)
//         } else {
//           reject(res.data.error)
//         }
//       },
//       fail: res => {
//         reject(res.errMsg)
//       }
//     })
//   })
// }

module.exports = {
  get,
  put,
  post,
  deletes
}