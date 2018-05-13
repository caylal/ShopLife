//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    loadingHidden: false , // loading
    interval: 3000,
    duration: 1000,
    imagesUrl:[
      'http://img.ithome.com/newsuploadfiles/focus/81c82dc3-ce78-47bc-9860-4ab4e60e61aa.jpg',
      'http://img.ithome.com/newsuploadfiles/focus/d1695f8b-4da3-4b0f-9808-47e229bec851.jpg',
      'http://img.ithome.com/newsuploadfiles/focus/00861095-32e2-42bb-9568-12c664941bc9.jpg',
      'http://img.ithome.com/newsuploadfiles/focus/d167fd30-f5ce-44b1-ab2d-acd1a22d7ef1.jpg'
    ]
  },
  // 搜索入口  
  Search: function () {
    wx.redirectTo({
      url: '../component/search/search'
    })
  }
})
