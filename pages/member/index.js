import util from '../../utils/util.js';

Page({
  data: {
    info: {}  
  }, 
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: util.pageTitle.member.index
    });
    const info = wx.getStorageSync('userInfo')
    this.setData({
      info: info
    })
  }
})
