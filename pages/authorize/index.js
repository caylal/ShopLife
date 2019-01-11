import user from '../../service/user.js'
import util from '../../utils/util.js'
import {logFactory} from '../../utils/log/logFactory.js'

const log = logFactory.get("Authorize")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthed: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          _this.setData({
            isAuthed: true
          })          
          wx.getUserInfo({
            success: res => {
              log.log(util.getPageUrl() + ' wx.getUserInfo: ', res)
              user.loginByCustom(res.userInfo).then(res => {
                app.globalData.userInfo = res.user
                app.globalData.token = res.token
                log.log(util.getPageUrl() + ' loginByCustomer: ', res)
                wx.redirectTo({
                  url: "/pages/location/location"
                })
              }).catch(err => {
                log.log(util.getPageUrl(), err)               
                wx.showToast({
                  title: err,
                })                
              })
            }
          })
        }
      }
    })
    
  },
  bindGetUserInfo(e) {
    let _this = this
    if (e.detail.userInfo) {
      log.log(util.getPageUrl() + '用户信息：', e.detail.userInfo) 
      user.loginByCustom(e.detail.userInfo).then(res => {
        getApp().globalData.userInfo = res.user
        getApp().globalData.token = res.token
        wx.redirectTo({
          url: "/pages/location/location"
        })
      }).catch(err => {
        //登录失败,跳转错误页面       
        wx.showToast({
          title: err,
        })       
      })
    }else{
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            log.log(util.getPageUrl() + ' 用户点击了“返回授权”', res)
          }
        }
      })     
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})