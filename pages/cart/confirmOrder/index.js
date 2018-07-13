import util from '../../../utils/util.js';
import api from '../../../api/api.js';

const shops = [
{
    "id": "SG0000",
    "isactive": true,
    "shopid": "S0001",
    "goodsid": "G0000",
    "name": "易栈便利店",
    "retailprice": 6
  },
    {
      "id": "SG0001",
      "isactive": true,
      "shopid": "S0001",
      "goodsid": "G0001",
      "name": "易栈便利店",
      "retailprice": 4
    }
  ]
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
      closeGoods: [], //需要重新选择门店的商品
      isTimeOut: false,
      totalMoney:0

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
    wx.showLoading({
      title:'加载中',
    })
    return new Promise((resolve, reject) => {
      util.request(api.getAddressOfMy, { userid:'U000000000'}).then(res => {
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
      util.request(api.getShopByAddrWithGoods,{
        address: _this.data.address.id,
        goods: goodsStr
      }).then(res => {
        console.log("所有商品门店： " + JSON.stringify(res))
        res.map(ress => {
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

    
   
    // wx.hideLoading()
    // const shop = list.filter(res => {
    //   if (res.hasOwnProperty('shopid')){
    //     return res
    //   }
    // }) 
    // console.log("shop:" + JSON.stringify(shop))  
    // if(shop.length > 0){
    //   // 获取所有门店信息
    //   let shoplist = wx.getStorageSync('allShop') 
    //   let goods = [] //需要重新选择门店的商品 
    //   let goodList = []  
    //   shop.forEach(item => {
    //     console.log("currentShop:" + JSON.stringify(item))
    //     shoplist.forEach(val => {
    //       if (val.id == item.shopid) {
    //         let isOut = _this.isTimeOut({ closinghour: val.closinghour, openingtime: val.openingtime })
    //         if(isOut){
    //           goodList.push(item)
    //           goods.push(item.goodsid)                     
    //         }            
    //       }
    //     })
    //   })     
    //   if (goods.length > 0){        
    //     const goodsid = goods.join('|')
    //     console.log("商品集合：" +goodsid)
    //     console.log("addressid:" + _this.data.address.id)
    //     util.request(api.getShopByAddrWithGoods,{
    //       address: _this.data.address.id,
    //       goods: goodsid
    //     }).then(res => {
    //      shops.map(ress => {
    //        let timeout = _this.isTimeOut({ closinghour: ress.closinghour, openingtime: ress.openingtime })
    //        if (timeout) {
    //          ress.timeout = true
    //        } else {
    //          ress.timeout = false
    //        }
    //        if (ress.distance < 1000) {
    //          ress.distance = ress.distance.toFixed(1) + 'm'
    //        } else {
    //          ress.distance = (Math.round(ress.distance / 100) / 10).toFixed(1) + 'km'
    //        }
    //        ress.checked = false
    //        ress.checkshop = []
    //        ress.closeshop = []
    //      })
    //      console.log("allShop:" + JSON.stringify(shops))
    //      _this.setData({
    //         allShopList:shops,
    //         isTimeOut: true,
    //         closeGoods: goodList           
    //      })
    //     })
    //   }
    // }
   
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
          }else{
            shopsList[index].checkshop = list
            shopsList[index].originalshop = closelist
          }

          console.log("勾选的门店商品： " + JSON.stringify(shopsList[index].checkshop ))
        }
      }
      _this.setData({
        cartList: allCart,
        allShopList: shopsList           
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

    // let filtergoods = closegoods.filter(item => {
    //   let str = JSON.stringify(item)   
    //   let flag = true  
    //   shopsList[index].goods.forEach(val => {
    //     if(val.goodsid == item.goodsid){
    //       let gooditem = JSON.parse(str)          
    //       gooditem.shopid = val.shopid
    //       gooditem.shopgoodsid = val.id
    //       gooditem.goodsretailprice = val.retailprice 
    //       list.push(gooditem) 
    //       closelist.push(item)  
    //       flag = false           
    //     }
    //   })
    //   return flag
    // })
    // if(shopsList[index].checked){      
    //   if(list.length > 0){       
    //     shopsList[index].checkshop = list 
    //     shopsList[index].closeshop = closelist
    //     closelist.forEach(item => {
    //       allCart = allCart.filter(val => {
    //         if(val.goodsid != item.goodsid){
    //           return val
    //         }else{
    //           if(!val.hasOwnProperty('shopid') && val.shopid != item.shopid){
    //             return val
    //           }
    //         }
    //       }) 
    //     })
    //     console.log("所有购物车列表：" + JSON.stringify(allCart))    
    //     console.log("门店列表：" + JSON.stringify(shopsList)) 
    //     _this.setData({
    //       cartList: allCart,
    //       allShopList: shopsList,
    //       closeGoods: filtergoods
    //     })
    //   }
    // }else{
    //   let prevlist = shopsList[index].closeshop
    //   if(prevlist.length > 0){       
    //     let closeglist = _this.data.closeGoods
    //     closeglist =  closeglist.concat(prevlist)
    //     let list = allCart.concat(prevlist)
    //     shopsList[index].checkshop = []
    //     shopsList[index].closeshop = []
    //     _this.setData({
    //       cartList: list,
    //       allShopList: shopsList,
    //       closeGoods: closeglist
    //     })
    //   }
    // } 
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
      let slist = shoplist.filter(res => res.checked)
      console.log("选中的门店：" + JSON.stringify(slist))
      if(slist.length > 0) {
        slist.forEach(item => {
          if(item.checkshop.length > 0 ){
            list = list.concat(item.checkshop)
          }
        })
      }
      console.log("下单商品：" + JSON.stringify(list))
    }
    
    
  }
})