import util from '../../../utils/util.js';
import api from '../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.goods.detail
    });
    this.getGoodsInfo(options)
  },
  getGoodsInfo(res){
    const { id, getapi} = res
    util.request(api.getapi,{id: id}).then(res => {
      console.log("goodsInfo: " + res.data.result)
    })
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