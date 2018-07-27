import util from '../utils/util.js'
import api from '../api/api.js'

const AuthLogin = () => {
  let code = null
  return new Promise((resolve, reject) => {
    return util.login().then(res => {
      code = res.code
      return util.getUserInfo()
    }).then(userinfo => {
      util.request(api.AuthLogin, {code: code,userInfo: userinfo}, 'POST').then(res => {
        // 存储用户信息
        if(!util.isEmpty(res)){
          wx.setStorageSync('userInfo', res.userinfo)
          wx.setStorageSync('token', res.token)
          resolve(res)
        }else{
          reject(res)
        }
        
      }).catch(err => reject(err))
    }).catch(err => reject(err))
  })
}
/**调用微信登录 */
const login = () => {
  return Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res);
          resolve(res);
        }
        else {
          reject(res);
        }
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

/**获取用户信息 */
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}
/**检查微信会话是否过期 */
const checkSession = () => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        reject(false);
      }
    })
  })
}
/**检查用户是否登录 */
const checkLogin = () => {
  return new Promise((resolve, reject) => {
    if(wx.getStorageSync('userInfo') && wx.getStorageSync('token')){
      checkSession().then(() => {
        resolve(true)
      }).catch(() => reject(false))
    }
  })
}
module.exports = {
  AuthLogin: AuthLogin
}