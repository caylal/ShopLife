import util from '../../utils/util.js'
import api from '../../api/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nbhdList: [],
    showMap: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.nbhd.index
    });
    wx.showLoading({
      title: '加载中...'
    });
    this.getNbhdShop();
  },
  getNbhdShop(){
    let _this = this  
    const data = {
      pi: 1,
      ps: 10,
      nbhd: "N000",                //所在社区id
      lng: "22.6348928889",     //所在经纬度位置
      lat: "114.0321329018"
    }  
    util.request(api.getNeighborShop, data).then( res => {
      console.log("getNbhdShop:" + JSON.stringify(res))
      const data = res
      data.map(item => {
        if(item.distance < 1000){
          item.distance = item.distance.toFixed(2) +'m'
        }else{           
          item.distance = (Math.round(item.distance /100 ) / 10).toFixed(1) + 'km'
        }
        return item
      })
      _this.setData({
        nbhdList: data,
        showMap: true
      })
      wx.setStorage({
        key: 'shopList',
        data: data,
      })
      wx.hideLoading()
    })
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
  }

 
})