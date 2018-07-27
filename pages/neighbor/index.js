import util from '../../utils/util.js'
import api from '../../api/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nbhdList: [],
    showMap: false,
    isFresh: false,
    pageIndex: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.nbhd.index
    });   
    this.getNbhdShop();
  },
  getNbhdShop(){
    let _this = this  
    const data = {
      pi: _this.data.pageIndex,
      ps: _this.data.pageSize,
      nbhd: "N000",                //所在社区id
      lng: "22.6348928889",     //所在经纬度位置
      lat: "114.0321329018"
    }  
    const store_list = wx.getStorageSync('shopList')
    if(store_list.length > 0 && !_this.data.isFresh){
      _this.setData({
        nbhdList: store_list,
        showMap: true
      })
    }else{
      wx.showLoading({
        title: '加载中...'
      });
      util.request(api.getNeighborShop, data).then( res => {
        console.log("getNbhdShop:" + JSON.stringify(res))
        if(!util.isEmpty(res)){
          res.map(item => {
            item.distance = util.transDistance(item.distance)            
          })
          _this.setData({
            nbhdList:  _this.data.pageIndex != 1 ? _this.data.cart.concat(res) : res,
            showMap: true
          })
          wx.setStorage({
            key: 'shopList',
            data: _this.data.nbhdList,
          })
          wx.hideLoading()
        }
      })
    }   
  },
  showMapView(){
    const data = JSON.stringify(this.data.nbhdList)
    wx.navigateTo({
      url: '../neighbor/map/index?item=' + data,
    })
  },
  showShopView(event){
    console.log("itemId:" + event.currentTarget.dataset.id)
    let itemId = event.currentTarget.dataset.id    
    wx.navigateTo({
      url: '../category/index?itemId=' + itemId
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isFresh: false,
      pageIndex: this.data.pageIndex + 1
    })
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      isFresh: true,
      pageIndex: 1
    })
    this.onLoad()
  },
 
})