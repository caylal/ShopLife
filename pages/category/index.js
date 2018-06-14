import util from '../../utils/util.js';
import api from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    shopList: [],
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
    if (this.showNbhd) {
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
    if (this.showNbhd) {
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
        console.log("category:" + JSON.stringify(res.data.result))
        _this.setData({
          navList: res.data.result,
          curId: res.data.result[0].id
        })
        resolve(res.data.result[0].id)
      })
    }).then(id => {
      let info = {}
      if (_this.showNbhd) {
        info = {shopid: _this.data.shop.id, cateid: id }
      }
      else {
        info = { id: id } 
      }     
      _this.getShopByCate(info)
    })
  },  
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
  getShopByCate(data){
    let _this = this
    let url = api.getGoodsByCate;
    if (_this.showNbhd){
      url = api.getShopGoodsByCate
    }
    Object.assign(data, { pageIndex: _this.data.pageIndex, pageSize: _this.data.pageSize})
    console.log("url:" + url + " data:" + JSON.stringify(data))
    util.request(url, data).then(res => {
      console.log("shopList:" + JSON.stringify(res.data.result))
      _this.setData({
        shopList: res.data.result || []
      })
      wx.hideLoading()
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
  } 
})
