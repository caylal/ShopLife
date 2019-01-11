import util from '../utils/util.js'
import { Apis } from '../api/api.js'
import https from '../service/https.js'

const loginByCustom = (info) => {
  wx.showLoading({
    title: '登录中',
  })
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {  
        console.log("aaa:" + res.code)           
        https.get(Apis.auth.login, { code: res.code }).then(res => {
          // 存储用户信息          
          if (res && res.user) {
            res.token.expired = util.transExpiresDt(res.token.expires_in)
            const userid = res.user.id
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
            Object.assign(res.user, userInfo)
            if (!res.user.nickname) {
              https.put(Apis.user.restful.put, userInfo).then(ress => {                
                console.log("第三方用户信息更新: " + JSON.stringify(res.user))
                wx.setStorageSync('userInfo', res.user)
                wx.setStorageSync('token', res.token)
                resolve(res)
              })
            } else {
              wx.setStorageSync('userInfo', res.user)
              wx.setStorageSync('token', res.token)
              resolve(res)
            }
            
          } else {
            reject("服务器异常")
          }
          wx.hideLoading()
        }).catch(err => {
          wx.hideLoading()
          reject(err)
        })
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
    const token = wx.getStorageSync('token')
    if (user && token) {
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