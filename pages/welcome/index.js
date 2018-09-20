import user from '../../service/user.js'
import util from '../../utils/util.js'
import api from '../../api/api.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this       
    if (app.globalData.userInfo) {
      //已登录 获取用户所在位置，用户购物车，订单信息等
      console.log("个人信息：" + JSON.stringify(app.globalData.userInfo))
      _this.setData({
        userInfo: app.globalData.userInfo
      })
      
      Promise.all([
        _this.getAllCity(),
        _this.setLocation()
      ]).then(res => {
        _this.setData({
          remind: ''
        })
        _this.getCart()
      })
      
    }
    else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            // wx.getUserInfo({
            //   success: function (res) {
            //     console.log(res.userInfo)
            //     user.loginByCustom().then(res => {})
            //   }
            // })
            user.loginByCustom().then(res => {
              app.globalData.userInfo = res
             
              _this.setData({
                userInfo: res
              })
              console.log(info)   
              Promise.all([
                _this.getAllCity(),
                _this.setLocation()
              ]).then(res => {
                _this.setData({
                  remind: ''
                })
                _this.getCart()
              })
            })
              

          }
          else {
            //跳转授权并登录
            wx.navigateTo({
              url: "/pages/authorize/index"
            })
          }
        }
      })
    }    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // setTimeout(function () {
    //   that.setData({
    //     remind: ''
    //   });
    // }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },

  // 获取所有城市信息
  // 获取用户所在位置
  getAllCity(){
    const storeAll = wx.getStorageSync('allCitys')
    let _this = this  
    return new Promise((resolve,reject) => {
      if (!storeAll) {
        util.request(api.getAllCity).then(res => {         
          if (res) {
            wx.setStorage({
              key: 'allCitys',
              data: res,
            })
            resolve(true)
          }
        })
      } else{
        resolve(true)
      }   
    })
    
  },
  getLocation(){
    const nearestNbhd = wx.getStorageSync('nearestNbhd')
    let _this = this
    return new Promise((resolve,reject) => {
      if (!nearestNbhd) {
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            wx.setStorage({
              key: 'location',
              data: { "lon": longitude, "lat": latitude},
            })
            app.globalData.location = { "lon": longitude, "lat": latitude }
            util.request(api.getLngLat, {
              pi: 1,
              ps: 20,
              lng: longitude,
              lat: latitude,
              dis: 20
            }).then(res => {
              if(res){
                wx.setStorage({
                  key: 'nearestNbhd',
                  data: res,
                })
                resolve(true)
              }else{
                reject(false)
              }
              
            })
          }
        })
      }else{
        app.globalData.location = wx.getStorageSync('location')
        resolve(true)
      }
    })
    
    
  },
  setLocation(){
    const areaNbhd = wx.getStorageSync('areaNbhd')
    return new Promise((resolve, reject) => {
      if (!areaNbhd) {
        this.getLocation().then(res => {
          const nearestNbhd = wx.getStorageSync('nearestNbhd')
          util.request(api.getArea, { id: nearestNbhd[0].areaid }).then(res => {
            console.log("当前区域:" + JSON.stringify(res))
            let city = []
            let c = res[0].hierarchy.split('|')
            let n = res[0].hierarchyname.split('|')
            city.push({ id: c[1], name: n[1] })
            city.push({ id: c[2], name: n[2] })
            city.push({ id: nearestNbhd[0].id, name: nearestNbhd[0].name })
            wx.setStorage({
              key: 'areaNbhd',
              data: city,
            })
            app.globalData.Nbhd = city
            resolve(true)
          })
        })
      }else{
        app.globalData.Nbhd = areaNbhd
        resolve(true)
      }
    })
  },
  getCart(){
    // 获取所有购物车信息
    util.getMyCart(app.globalData.userInfo.id).then(res => console.log("获取购物车成功：" + JSON.stringify(res)))  
  },
  onShow: function () {   
    this.onLoad()    
  },

  goToIndex(){
    wx.switchTab({
      url: '../home/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})