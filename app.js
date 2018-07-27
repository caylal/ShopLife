//app.js
import util from 'utils/util.js'
import api from 'api/api.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  
    // 获取所有购物车信息
    util.getMyCart().then(res => console.log("获取购物车成功：" + JSON.stringify(res)))    
  },
  globalData: {
    userInfo: null,
    token: null 
  }
})