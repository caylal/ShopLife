import util from '../utils/util.js'
import { Apis } from '../api/api.js'
import https from '../service/https.js'

const loginByCustom = (info) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        https.get(Apis.auth.login, { code: res.code }).then(res => {
          // 存储用户信息
          if (res && res.user_model) {
            res.user_model.expired = util.transExpiresDt(res.user_model.expires_in)
            if (!res.user_model.nickname) {
              const userid = res.user_model.id
              const userInfo = {
                id: userid,
                name: info.nickName,
                nickname: info.nickName,
                avatar: info.avatarUrl,
                gender: info.gender === 1 ? "male" : "female",
                language: info.language,
                country: info.country,
                province: info.province,
                city: info.city
              }

              https.put(Apis.user.restful.put, userInfo, undefined, { id: userid }).then(ress => {
                Object.assign(res.user_model, userInfo)
                console.log("第三方用户信息更新: " + JSON.stringify(res.user_model))
                wx.setStorageSync('userInfo', res)
                resolve(res.user_model)
              })
            } else {
              wx.setStorageSync('userInfo', res.user_model)
              resolve(res.user_model)
            }
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
    if (user && user.id && user.appid) {
      resolve(true)
    } else {
      reject(false)
    }
  })
}
module.exports = {
  checkLogin: checkLogin,
  getUserInfo: getUserInfo,
  loginByCustom: loginByCustom
}