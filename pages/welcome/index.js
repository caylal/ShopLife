import user from '../../service/user.js'
import util from '../../utils/util.js'
import api from '../../api/api.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')){
      //已登录 获取用户所在位置，用户购物车，订单信息等
    }
    else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            let info = wx.getStorageSync('userInfo')
            _this.setData({
              userInfo: info
            })
            console.log(info)
            // 直接登录
            user.loginByCustom().then(res => {
              //登录成功，获取用户所在位置，用户购物车，订单信息等
            }).catch(err => {
              //登录失败，重新登录
            })

          }
          else {
            //跳转授权并登录
            wx.navigateTo({
              url: "/pages/authorize/index"
            })
          }
        }
      })
    }    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },

  // 获取用户购物车信息
  // 获取用户订单信息
  // 获取用户所在位置
  getAllCity(){
    
  },
  onShow: function () {
    // 是否已有购物车信息，订单信息，用户信息等。没有就请求，有则无需请求

  },

  goToIndex(){
    wx.switchTab({
      url: '../home/index/index',
    })
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