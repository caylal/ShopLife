import util from '../../utils/util.js';
import api from '../../api/api.js'
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
    this.countMoney()
    if (!util.isEmpty(options.itemId)){
      this.showShopInfo(options.itemId)
    }else{
      this.getNavList({ url: api.getAllCategory, data:{}})
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
      info = { shopid: this.data.shop.id, cateid: id }
    }
    else {
      info = { id: id }
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
      info = { shopid: this.data.shop.id, cateid: id }
    }
    else {
      info = { id: id }
    }
    this.getShopByCate(info)
  },
  // 获取所有或门店的类别
  getNavList(req){
    let _this = this
    let { url, data } = req
    return new Promise((resolve,reject) => {
      util.request(url, data).then(res =>{
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
        info = {shopid: _this.data.shop.id, cateid: id }
      }
      else {
        info = { id: id } 
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
    let data = { url: api.getShopGoodAll, data: { id: id}} // 门店id
    _this.getNavList(data)
  },
  // 获取分类的商品
  getShopByCate(data){
    let _this = this
    let url = api.getGoodsByCate;
    if (_this.data.showNbhd){
      url = api.getShopGoodsByCate
    }
    Object.assign(data, { pageIndex: _this.data.pageIndex, pageSize: _this.data.pageSize})
    console.log("url:" + url + " data:" + JSON.stringify(data))  
   
    util.request(url, data).then(res => {
      console.log("goodsList:" + JSON.stringify(res))
      const result = res
      result.map(item => {
        let quantity;
        if(_this.data.showNbhd){        
          item.url = `/pages/goods/detail/detail?url=${api.getShopGood}&&id=${item.id}`
        } 
        else{         
          item.url = `/pages/goods/detail/detail?url=${api.getGood}&&id=${item.id}`
        }   
        quantity = _this.filterGood(item)    
        if (quantity){
          item.quantity = quantity
        }        
        return item
      })     
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
    let data = {},
        quantity = 1
    if (btn == "cut") {
      quantity = -1
    }
    if (!_this.data.showNbhd){
        data = {
          userid: "U000000000",
          goodsid: id,
          quantity: quantity
        }
    }else{
      data = {
        userid: "U000000000",
        shopgoodsid: id,
        quantity: quantity
      }
    }
    util.request(api.createCart, data, "POST").then(res => {
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
    })
  },
  countMoney(){
    util.getMyCart(this.data.pageIndex, this.data.pageSize).then(res => {
      const list = wx.getStorageSync('myCart')
      console.log("resss======:" + JSON.stringify(list))
      let total = list.reduce((pre, cur) => {
        return pre + (cur.goodsretailprice * cur.quantity)
      }, 0)
      console.log(total)
      this.setData({
        cartList: list,
        checkedGoodsAmount: total
      })
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
    });
    _this.countMoney()
  } 
})
