import util from '../../utils/util.js';
import api from '../../api/api.js'
import https from '../../service/https.js'
import { editCart } from '../../service/service.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [],  // 左侧分类栏
    goodsList: [], // 右侧商品
    cartList: [], //我的购物车
    checkedGoodsAmount: 0,
    curId: '',
    childId: '',
    srollHeight: 300,
    shop: {},
    showNbhd:false,
    pageIndex:1,
    pageSize: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.goods.list
    });
    wx.showLoading({
      title: '加载中...'
    });
    if (!util.isEmpty(options.itemId)){
      this.showShopInfo(options.itemId)
    }else{
      this.getNavList({ url: api.getAllCategory, data:{pi: this.data.pageIndex,ps: this.data.pageSize, ob:'sort', rs:1}})
    }
    
  },
  // 右侧分类tab点击
  switchRightTab(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      curId: id
    })
    wx.showLoading({
      title: '加载中...'
    });
    let info = {}
    if (this.data.showNbhd) {
      info = { shop: this.data.shop.id, cate: id }
    }
    else {
      info = { cate: id }
    }
    this.getShopByCate(info)
  },
  // 二级分类tab点击
  switchChildTab(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      childId: id
    })
    let info = {}
    if (this.data.showNbhd) {
      info = { shop: this.data.shop.id, cate: id }
    }
    else {
      info = { cate: id }
    }
    this.getShopByCate(info)
  },
  // 获取所有或门店的类别
  getNavList(req){
    let _this = this
    let { url, data } = req
    return new Promise((resolve,reject) => {
      https.get(url, data).then(res =>{
        console.log("category:" + JSON.stringify(res))
        _this.setData({
          navList: res,
          curId: res[0].id
        })
        resolve(res[0].id)
      })
    }).then(id => {
      let info = {}
      if (_this.data.showNbhd) {
        info = {shop: _this.data.shop.id, cate: id }
      }
      else {
        info = { cate: id } 
      }     
      _this.getShopByCate(info)
    })
  },  
  // 显示已选择门店商品
  showShopInfo(id){
    let _this = this
    const shop = wx.getStorageSync('shopList')
    const item = shop.filter(item => { return item.id === id })
    console.log("item:" + JSON.stringify(item))       
    _this.setData({
      shop: item[0],
      showNbhd:true
    })
    console.log("shop: " + JSON.stringify(this.data.shop))
    let data = { url: api.getShopGoodAll, data: { shop: id}} // 门店id
    _this.getNavList(data)
  },
  // 获取分类的商品
  getShopByCate(data){
    let _this = this
    let url = api.getGoodsByCate;
    if (_this.data.showNbhd){
      url = api.getShopGoodsByCate
    }
    Object.assign(data, { pi: _this.data.pageIndex, ps: _this.data.pageSize})
    console.log("url:" + url + " data:" + JSON.stringify(data))  
   
    https.get(url, data).then(res => {
      console.log("goodsList:" + JSON.stringify(res))
      const result = res
      if(!util.isEmpty(res)){
        result.map(item => {
          let quantity;
          if (_this.data.showNbhd) {
            item.url = `/pages/goods/detail/detail?url=${api.getShopGood}&&id=${item.id}`
          }
          else {
            item.url = `/pages/goods/detail/detail?url=${api.getGood}&&id=${item.id}`
          }
          quantity = _this.filterGood(item)
          if (quantity) {
            item.quantity = quantity
          }
          return item
        })   
      }       
      _this.setData({
        goodsList: result || []
      })
      wx.hideLoading()
    })
  },
  filterGood(good){
    const list = this.data.cartList
    let res = list.filter(item => {
      if (!this.data.showNbhd){
        if (!item.hasOwnProperty("shopid")){
          return item.goodsid == good.id
        }        
      }else{
        return item.shopid == good.shopid && item.goodsid == good.goodsid
      }
    })    
    if (res.length > 0){
      return res[0].quantity
    }
    else{
      return false
    }
  },
  // 添加购物车
  changeCart(e){
    const { id, btn, index } = e.currentTarget.dataset
    let _this = this
    let goodsid,
        shopgoodsid; 
      
    if (!_this.data.showNbhd){
        goodsid = id       
    }else{
      shopgoodsid = id     
    }
    editCart({ uid: app.globalData.userInfo.id, goodsid: goodsid, shopgoodsid: shopgoodsid, btn: btn }).then(res => {
      if (res != null) {
        console.log(JSON.stringify(res))
        const list = res
        if (list != null) {
          const goodslist = _this.data.goodsList
          goodslist[index].quantity = list.quantity
          _this.setData({
            goodsList: goodslist
          })
          _this.countMoney()
        }
      }
    })  
    
  },
  countMoney(){
    let _this = this 
    const list = wx.getStorageSync('myCart')
    console.log("lastList======:" + JSON.stringify(list))
    let total = list.reduce((pre, cur) => {
      return pre + (cur.goodsretailprice * cur.quantity)
    }, 0)
    console.log(total)
    _this.setData({
      cartList: list,
      checkedGoodsAmount: total
    })
  },
  onShow(){
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        let height = res.windowHeight - 45; //footerpannelheight为底部组件的高度
        _this.setData({
          srollHeight: height
        });
      }
    })
    _this.countMoney()
  },
  goCart(){
    wx.switchTab({
      url: '../cart/index',
    })
  }
 
})
