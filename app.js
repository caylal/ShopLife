//app.js
import util from 'utils/util.js'
import api from 'api/api.js'
import user from 'service/user.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // user.checkLogin().then(res => {
    //   console.log('app login')
    //   this.globalData.userInfo = wx.getStorageSync('userInfo');
    //   this.globalData.token = wx.getStorageSync('token');
    // }).catch(() => {
    //   wx.navigateTo({
    //     url: "/pages/authorize/index"
    //   })
    // });
  
    // 获取所有购物车信息
    util.getMyCart().then(res => console.log("获取购物车成功：" + JSON.stringify(res)))    
  },
  globalData: {
    userInfo: null,
    token: null 
  }
})