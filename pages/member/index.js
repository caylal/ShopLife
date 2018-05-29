import util from '../../utils/util.js';

Page({
  data: {
    motto: '我的',   
  }, 
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: util.pageTitle.member.index
    });
  }
})
