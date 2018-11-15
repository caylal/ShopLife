import util from '../../../utils/util.js';
import api from '../../../api/api.js'
import https from '../../../service/https.js'
import { filterGood, editCart, getMyCart } from '../../../service/service.js'
import { logFactory } from '../../../utils/log/logFactory.js'

const log = logFactory.get("Goods")
const app = getApp()
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
    wx.showLoading({
      title: '加载中',
    })
    // getMyCart(app.globalData.userInfo.id).then(res => {
    //   log.log(util.getPageUrl() + " 获取购物车成功：", res)
      
    // })
    this.getGoodsInfo(options)
  },
  getGoodsInfo(res){
    let _this = this
    const { id, url} = res
    https.get(url,{id: id}).then(res => {
      log.log(util.getPageUrl() + " goodsInfo: ", res)
      const info = res[0];
      let num = parseFloat(info.retailprice);
      num = num.toFixed(2);
      if (!info.hasOwnProperty("goodsid")){
        info.goodsid = info.id
      }
      if (info.shopid && !info.hasOwnProperty("shopgoodsid")){
        info.shopgoodsid = info.id
      }      
      let quantity = filterGood(info)
      if (quantity) {
        info.quantity = quantity
      }  
      info.retailprice = num
      info.days = util.numDate(info.effectivedt, info.expireddt) 
      log.log(util.getPageUrl() + " Info: ", info)    
      _this.setData({
        goodsInfo: info
      })
      wx.hideLoading()
    })
  },
  changeCart(e){
    let _this = this
    let data = e.currentTarget.dataset
    data.uid = getApp().globalData.userInfo.id
    editCart(data).then(res => { 
      log.log(util.getPageUrl() + " detail: ", res)
      const info = _this.data.goodsInfo
      info.quantity = res.quantity
      _this.setData({
        goodsInfo: info
      })
     })
  },  
  myCart(){
    wx.switchTab({
      url: '../../cart/index',
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