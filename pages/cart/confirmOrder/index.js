import util from '../../../utils/util.js';
import api from '../../../api/api.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cartList:[], // 购物车列表
      addressList:[], //地址列表
      address:{}, //当前地址
      shopList:[], // 门店列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCartList()
    this.getAddress()
  },

  getAddress(){
    let _this = this
    util.request(api.getAddressOfMy, { userid:'U000000001'}).then(res => {
      console.log("addr:=====" + JSON.stringify(res))
      _this.setData({
        addressList: res,
        address: res[0]
      })
      wx.setStorage({
        key: 'myAddress',
        data: res,
      })
    })
  },
  getCartList(){
    const list = wx.getStorageSync('checkOrder')
    this.setData({
      cartList: list
    })
    const shop = list.filter(res => {
      if (res.hasOwnProperty('shopid')){
        return res
      }
    })   
    if(shop.length > 0){
      // 获取所有门店信息
      const shopAll = app.globalData.shopAll
      console.log("allShop: " + JSON.stringify(shopAll))
      let shopInfo = []

      shop.forEach(item => {
        console.log("currentShop:" + JSON.stringify(item))
          shopAll.forEach(val => { 
            if (val.id == item.shopid ){
              shopInfo.push(val)
            }
          }) 
      })
      console.log("currentShopInfo:" + JSON.stringify(shopInfo))
      let cur_time = util.formatTime(new Date());
      console.log("cur_time: " + cur_time)
      this.isTimeOut()
    }
   
  },
  isTimeOut(time){
    const { closinghour, openhour } = time
    const data = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()
    console.log("hour:" + hour +" min: " + minute)
    if(closinghour){}

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