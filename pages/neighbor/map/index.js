// pages/neighbor/map/index.js
import { logFactory }  from '../../../utils/log/logFactory.js'

const log = logFactory.get("Neighbor")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,   
    markers: [],   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log.log(util.getPageUrl() + " before:" ,options.item)
    this.setData({
      latitude: app.globalData.location.lat,
      longitude: app.globalData.location.lng
    })
    this.getNbhdLocation(options.item)
  },

  getNbhdLocation(data){
    const arr = []
    const location = { 
      latitude: app.globalData.location.lat,
      longitude: app.globalData.location.lng, 
      iconPath: "/images/location-icon.png",
      width: 25, 
      height: 25, 
      label: { fontSize: 12, content: "当前位置" }
    }
    arr.push(location)
    const res  = JSON.parse(data)
    res.forEach(item => {     
      const obj = { iconPath: "/images/position-fill.png", width: 25, height: 25, label: { fontSize:12}}     
      obj.id = item.id
      obj.latitude = item.lat
      obj.longitude = item.lng
      obj.title = item.name  
      obj.label.content = item.name      
      arr.push(obj)
    })
    log.log(util.getPageUrl() + " markers: ",arr)
    this.setData({
      markers: arr,     
    })
  },
  showShopView(e){
    wx.navigateTo({
      url: '../../category/index?itemId=' + e.markerId
    })
  }
})