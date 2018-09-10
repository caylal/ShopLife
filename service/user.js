import util from '../utils/util.js'
import api from '../api/api.js'

const loginByCustom = () => { 
  return new Promise((resolve, reject) => {   
    wx.login({
      success: res => {
        util.request(api.AuthLogin, { code: res.code }).then(res => {
          // 存储用户信息
          if (!util.isEmpty(res)) {
            wx.setStorageSync('userInfo', res)
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(err => reject(err))
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
    const user = wx.getStorageSync('userInfo')
    if (user && user.id && user.appid){      
      resolve(true)
    }else{
      reject(false)
    }
  })
}
module.exports = {
  checkLogin: checkLogin,
  getUserInfo: getUserInfo,
  loginByCustom: loginByCustom
}