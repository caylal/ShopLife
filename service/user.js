import util from '../utils/util.js'
import api from '../api/api.js'
import https from '../service/https.js'

const loginByCustom = (info) => { 
  return new Promise((resolve, reject) => {   
    wx.login({
      success: res => {
        https.get(api.AuthLogin, { code: res.code }).then(res => {
          // 存储用户信息

          wx.setStorageSync('userInfo', res.user_model)
          resolve(res.user_model)
          //   resolve(res.user_model)

          // if(!res.user_model.nickname) {
          //   const userid = res.user_model.id
          //   const userInfo = {
          //     id: userid,
          //     name: info.nickName,
          //     nickname: info.nickName,
          //     avatar: info.avatarUrl,
          //     gender: info.gender,
          //     language: info.language,
          //     country: info.country,
          //     province: info.province,
          //     city: info.city
          //   }            
          //   https.put(api.updateUserInfo, userInfo, undefined, { id: userid}).then(res => {
          //     console.log("第三方用户信息更新: " + JSON.stringify(res))
          //     wx.setStorageSync('userInfo', res)
          //     resolve(res.user_model)
          //   })
          // }else{
          //   wx.setStorageSync('userInfo', res.user_model)
          //   resolve(res.user_model)
          // }         
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