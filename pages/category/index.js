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
    if (!util.isEmpty(options.itemId)){
      this.showShopInfo(options.itemId)
    }else{
      this.getNavList()
    }
   
  },
  switchRightTab(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      curId: id
    })
    getCateShop(this.data.pageIndex, this.data.pageSize, id).then(res =>{
      console.log("res:" + res) 
     this.setData({
        shopList: res
      })
    })
  },
  switchChildTab(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      childId: id
    })
    getCateShop(this.data.pageIndex, this.data.pageSize, id).then(res => {
      console.log("res:" + res)
      this.setData({
        shopList: res
      })
    })
  },
  getNavList(){
    let _this = this
    return new Promise((resolve,reject) => {
      util.request(api.getAllCategory).then(res =>{
        console.log("category:" + JSON.stringify(res.data.result))
        _this.setData({
          navList: res.data.result,
          curId: res.data.result[0].id
        })
        resolve(res.data.result[0].id)
      })
    }).then(id => {
      getCateShop(_this.data.pageIndex, _this.data.pageSize,id)
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
    util.request(api.getShopGoodCate,{id:id}).then(res => {
      console.log("shopCategory: " + JSON.stringify(res.data.result))
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
const getCateShop = (index, size, id) => {
  return new Promise((resolve, reject) => {
    util.request(api.goodsByCate, {
      pageIndex: index,
      pageSize: size,
      id: id
    }).then(data => {
      console.log("shopList:" + JSON.stringify(data.data.result))
      resolve(data.data.result)      
    })
  })
  
}