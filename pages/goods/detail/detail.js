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
    let _this = this
    const { id, url} = res
    util.request(url,{id: id}).then(res => {
      console.log("goodsInfo: " + JSON.stringify(res.data.result))
      const info = res.data.result;
      let num = parseFloat(info.retailprice);
      num = num.toFixed(2);
      info.retailprice = num
      info.days = util.numDate(info.effectivedt, info.expireddt) 
      console.log("Info: " + JSON.stringify(info))    
      _this.setData({
        goodsInfo: info
      })
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