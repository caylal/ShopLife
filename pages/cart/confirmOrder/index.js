import util from '../../../utils/util.js';
import { Apis } from '../../../api/api.js';
import https from '../../../service/https.js'
import { logFactory } from '../../../utils/log/logFactory.js'

const log = logFactory.get("Cart")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {      
      cartList:[], // 购物车列表
      addressList:[], //地址列表
      address:{}, //当前地址     
      allShopList:[], // 门店列表
      isTimeOut: false,
      totalMoney:0,
      isFresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddress().then(res => {
      this.getCartList() 
    }).catch(err => {
      wx.navigateTo({
        url: '../../member/address/index',
      })
    })  
  },
  onShow(){
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    let checked = currPage.data.checked
    let addinfo = currPage.data.info
    if(util.isEmpty(currPage.data.isFresh) && currPage.data.isFresh){
      this.setData({
        isFresh: currPage.data.isFresh
      })          
    } 
    if(checked){
      let infoObj = JSON.parse(addinfo)
      this.setData({
        address: infoObj
      })
      this.getCartList()
    }else {
      this.onLoad();
    }
    
  },
  getAddress(){ //获取用户地址
    let _this = this 
    const store_addr = wx.getStorageSync('myAddress')
    return new Promise((resolve, reject) => {
      if(!_this.data.isFresh && !util.isEmpty(store_addr)){
        _this.setData({
          addressList: store_addr,
          address: store_addr[0]
        })
        resolve(true)
      }else{
        wx.showLoading({
          title:'加载中',
        })        
        https.get(Apis.addr.queryOfMy, { userid: app.globalData.userInfo.id}).then(res => {
          if(!util.isEmpty(res)){
            log.log(util.getPageUrl() + " getaddr: ", res)
            res.map(item => {
              item.lng = item.lng.toFixed(2)
              item.lat = item.lat.toFixed(2)
            })
            _this.setData({
              addressList: res,
              address: res[0]
            })
            wx.setStorage({
              key: 'myAddress',
              data: res,
            })
            resolve(true)
          }else{
            reject(false)
          }       
        })
      }
    });
  },
  editAddr(){
    wx.navigateTo({
      url: '../../member/mine/index?showInfo='+ false,
    })
  },
  getCartList(){ //根据用户地址及购物车商品获取门店
    let list = wx.getStorageSync('checkOrder')
    let _this = this
    let goodsid = [] //所有商品id
    let shop_goods = [] // 已选择门店得商品
    let total = list.reduce((pre,cur) => {
      return pre + (cur.goodsretailprice * cur.quantity)
    }, 0)

    list.forEach(res => {
      goodsid.push(res.goodsid)
    })
    if(goodsid.length > 0){
      let goodsStr = goodsid.join('|')
      https.get(Apis.shop.queryGoodsByAddress,{
        address: _this.data.address.id,
        goods: goodsStr
      }).then(res => {
        log.log(util.getPageUrl() + " 所有商品门店： ", res)      
       
        res.map(ress => { 
          ress.closinghour = util.formatTime(ress.closinghour, 2)
          ress.openingtime = util.formatTime(ress.openingtime, 2)
          let timeout = _this.isTimeOut({ closinghour: ress.closinghour, openingtime: ress.openingtime })
          if (timeout) {
            ress.timeout = true
          } else {
            ress.timeout = false
          }
          if (ress.distance < 1000) {
            ress.distance = ress.distance.toFixed(1) + 'm'
          } else {
            ress.distance = (Math.round(ress.distance / 100) / 10).toFixed(1) + 'km'
          }
          ress.checked = false
          ress.expanded = false
          ress.checkshop = []
          ress.originalshop = []
        })
        list = list.filter(item => {  
          let flag = true       
          res.forEach(val => {
            if(item.hasOwnProperty('shopid') && item.shopid == val.id){             
              val.checkshop.push(item)               
              if(val.timeout){               
                flag =  true
              }else{                               
                val.expanded = true
                val.checked = true
                flag = false
              }               
            }
          })
          return flag
        })
        _this.setData({
          cartList: list,
          totalMoney: total,
          allShopList:res            
        })
        wx.hideLoading()
      })
    }
  },
  isTimeOut(time){
    const { closinghour, openingtime } = time
    const close = closinghour.split(":")
    const open = openingtime.split(":")
   
    log.log(util.getPageUrl() + " closehour: " ,close)
    log.log(util.getPageUrl() + " openhour: " , open)
    
    const date = new Date()
    const currenthour = date.toLocaleTimeString('chinese', { hour12: false })
    const current = currenthour.split(":")
    log.log(util.getPageUrl() + " currenthour: " , current)
  
    const c_time = date.setHours(current[0], current[1])
    const op_time = date.setHours(open[0], open[1])
    const cl_time = date.setHours(close[0],close[1])
 
    if ((op_time < c_time) && (cl_time > c_time)){
      return false
    }else{
      return true
    }   

  },
  checkShop(e){
    let _this = this
    const { id, index } = e.currentTarget.dataset
    const shopsList = _this.data.allShopList // 所有门店
    let allCart = _this.data.cartList //所有购物车列表
    let checked = shopsList[index].checked
    shopsList[index].checked = !checked
    let checkgoods = shopsList[index].checkshop // 已选择商品
    let originalshop = shopsList[index].originalshop // 已替换商品
    let list = [] //替换后商品   
    let closelist = [] // 替换前的商品

    if(shopsList[index].checked ){
      if(allCart.length > 0){
        allCart = allCart.filter(item => {
          let str = JSON.stringify(item)
          let flag = true  
          shopsList[index].goods.forEach(val => {
            if(val.goodsid == item.goodsid){
              let gooditem = JSON.parse(str)
              gooditem.shopid =  val.shopid
              gooditem.shopgoodsid = val.id
              gooditem.goodsretailprice = val.retailprice 
              list.push(gooditem)
              closelist.push(item)
              flag = false
            }
          })
          return flag
        })

        if(list.length > 0){
          if(shopsList[index].checkshop.length > 0){
            shopsList[index].checkshop = shopsList[index].checkshop.concat(list)
            shopsList[index].originalshop = closelist.concat(checkgoods)
            shopsList[index].expanded = true
          }else{
            shopsList[index].checkshop = list
            shopsList[index].originalshop = closelist
            shopsList[index].expanded = true
          }

          log.log(util.getPageUrl() + " 勾选的门店商品： " ,shopsList[index].checkshop )
        }else{
          shopsList[index].checked = checked
          wx.showModal({
            title: '提示信息',
            content: '该门店没有以上商品，请重新选择门店',
          })
        }
      } else {
        shopsList[index].checked = checked
        wx.showModal({
          title: '提示信息',
          content: '无商品可分配',
        })
      }
      let clist = []
      shopsList.forEach(res => {
        if (res.checkshop.length > 0){
          clist = clist.concat(res.checkshop)
        }
      })
      if (allCart.length > 0){
        clist = clist.concat(allCart)
      }
      let total = clist.reduce((pre, cur) => {
        return pre + (cur.goodsretailprice * cur.quantity)
      }, 0)
      console.log(total)
      _this.setData({
        cartList: allCart,
        allShopList: shopsList,
        totalMoney: total         
      })
    }else{     
     
      if(originalshop.length > 0){
        if(allCart.length > 0){
          allCart = allCart.concat(originalshop)          
        }else{
          allCart = originalshop
        }        
       
      }else{
        if(allCart.length > 0){
          allCart = allCart.concat(checkgoods) 
        }else{
          allCart = checkgoods
        }         

      }
      shopsList[index].checkshop = []
      shopsList[index].originalshop = []
      _this.setData({
        cartList: allCart,
        allShopList: shopsList           
      })
    }
  },
  summitOrder(){
    let _this = this
    let list = _this.data.cartList
    const shoplist = _this.data.allShopList
    let isTimeOut = _this.data.isTimeOut
    const closegoods = _this.data.closeGoods
    if(list.length > 0){
      wx.showModal({
        title: '提示消息',
        content: '请选择门店',
      })
    }else{
      log.log(util.getPageUrl() + " 所有门店商品：" ,shoplist)
      let slist = []

      shoplist.forEach(res => {
        if(res.checkshop.length > 0){
          slist = slist.concat(res.checkshop)
        }
      })
      log.log(util.getPageUrl() + " 所选择的商品：" ,slist)
      let listMap = slist.map(item => {
        return{
          shoppingcartid: item.shoppingcartid,
          shopid: item.shopid,
          shopgoodsid: item.shopgoodsid,
          goodsid: item.goodsid,
          quantity: item.quantity,
          retailprice: item.goodsretailprice
        }
      })
      log.log(util.getPageUrl() + " 商品map: " ,listMap)
      let data = { 
        userid: app.globalData.userInfo.id,
        addressid: _this.data.address.id, 
        arrivalstart: "1", 
        arrivalend: "2",
        items:listMap
      }
      https.post(Apis.order.restful.post, data).then(res => {
        log.log(util.getPageUrl() + " 订单回调：" ,res)
        if(!util.isEmpty(res)){
          wx.redirectTo({
            url: '../../orders/detail/index?id=' + res.id,
          })
        }
      })
     
    }
    
    
  }
})