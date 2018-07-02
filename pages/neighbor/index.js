import util from '../../utils/util.js'
import api from '../../api/api.js'
const list = [
  { id: 1, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "120m"},
  { id: 2, name: "小白兔干洗店", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路21号", distance: "280m" },
  { id: 3, name: "链家(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "480m" },
  { id: 4, name: "百草园", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "510m" },
  { id: 5, name: "琴韵少儿舞蹈", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "580m" },
  { id: 6, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "620m" },
  { id: 7, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "1.2km" },
  { id: 8, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "1.4km" },
  { id: 9, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "2.4km" },
  { id: 10, name: "彩虹便利店(中央原著店)", time: "07:00 -- 02:00", addr: "深圳市龙华区人民路39号", distance: "2.7km" },
  ]

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