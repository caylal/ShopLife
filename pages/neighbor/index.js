import util from '../../utils/util.js';
const list = [
  { id: 1, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "120m"},
  { id: 2, name: "小白兔干洗店", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路21号", distance: "280m" },
  { id: 3, name: "链家(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "480m" },
  { id: 4, name: "百草园", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "510m" },
  { id: 5, name: "琴韵少儿舞蹈", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "580m" },
  { id: 6, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "620m" },
  { id: 7, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "1.2km" },
  { id: 8, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "1.4km" },
  { id: 9, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "2.4km" },
  { id: 10, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "2.7km" },
  ]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nbhdList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.nbhd.index
    });

    this.setData({
      nbhdList: list
    })
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