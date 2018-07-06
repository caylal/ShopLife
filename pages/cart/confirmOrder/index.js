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
      shopsInfo:[], //已休息的门店
      allShopList:[],
      goodsList: [], //需要重新选择门店的商品
      isTimeOut: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddress().then(res => {
      this.getCartList() 
    })   
  },
  getAddress(){
    let _this = this
    return new Promise((resolve, reject) => {
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
        resolve(true)
      })    
    })
    
   
  },
  getCartList(){
    const list = wx.getStorageSync('checkOrder')
    let _this = this
    _this.setData({
      cartList: list
    })
    const shop = list.filter(res => {
      if (res.hasOwnProperty('shopid')){
        return res
      }
    }) 
    console.log("shop:" + JSON.stringify(shop))  
    if(shop.length > 0){
      // 获取所有门店信息
      let shoplist = wx.getStorageSync('allShop')
      let shopInfo = [] //已休息的门店  
      let goods = [] //需要重新选择门店的商品   
      shop.forEach(item => {
        console.log("currentShop:" + JSON.stringify(item))
        shoplist.forEach(val => {
          if (val.id == item.shopid) {
            let isOut = _this.isTimeOut({ closinghour: val.closinghour, openingtime: val.openingtime })
            if(isOut){
              goods.push(item.goodsid)
              shopInfo.push(val)
            }            
          }
        })
      })
      if (shopInfo.length > 0){
        console.log("shopInfo: " + JSON.stringify(shopInfo))
        _this.setData({
          isTimeOut: true,
          shopsInfo: shopInfo
        })
      }
      if (goods.length > 0){
        _this.setData({
          goodsList: goods
        })
        const goodsid = goods.join('|')
        console.log("商品集合：" +goodsid)
        console.log("addressid:" + _this.data.address.id)
        util.request(api.getShopByAddrWithGoods,{
          address: _this.data.address.id,
          goods: goodsid
        }).then(res => {
          console.log("门店：" + JSON.stringify(res))
        })
      }          
          
     
    }
   
  },
  isTimeOut(time){
    const { closinghour, openingtime } = time
    const close = closinghour.split(":")
    const open = openingtime.split(":")
   
    console.log("closehour:" + close)
    console.log("openhour:" + open)
    
    const date = new Date()
    const currenthour = date.toLocaleTimeString('chinese', { hour12: false })
    const current = currenthour.split(":")
    console.log("currenthour:" + current)
  
    const c_time = date.setHours("00","20")
    const op_time = date.setHours(open[0], open[1])
    const cl_time = date.setHours(close[0],close[1])
    
    console.log(op_time < c_time)
    console.log(cl_time > c_time)

    if ((op_time < c_time) && (cl_time > c_time)){
      return false
    }else{
      return true
    }   

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