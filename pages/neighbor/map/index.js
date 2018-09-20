// pages/neighbor/map/index.js
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
    console.log("before:" + JSON.stringify(options.item))
    this.setData({
      latitude: app.globalData.location.lat,
      longitude: app.globalData.location.lon
    })
    this.getNbhdLocation(options.item)
  },

  getNbhdLocation(data){
    const arr = []
    const location = { 
      latitude: app.globalData.location.lat,
      longitude: app.globalData.location.lon, 
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
    console.log("markers: "+ JSON.stringify(arr))
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