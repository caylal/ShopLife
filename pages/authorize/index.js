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
    canIUse: wx.canIUse('button.open-type.getUserInfo')   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称  
          wx.getUserInfo({
            success: res => {
              log.log(util.getPageUrl() + ' wx.getUserInfo: ', res)
              user.loginByCustom(res.userInfo).then(res => {
                app.globalData.userInfo = res
                log.log(util.getPageUrl() + ' loginByCustomer: ', res)
                let pages = getCurrentPages() // 获取当前页面
                let prevPage = pages[pages.length - 2]
                prevPage.setData({
                  back: true
                })
                wx.navigateBack()
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
        getApp().globalData.userInfo = res
        let pages = getCurrentPages() // 获取当前页面
        let prevPage = pages[pages.length - 2]
        prevPage.setData({
          back: true
        })
        wx.navigateBack()
      }).catch(err => {
        //登录失败
        wx.navigateBack()
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