import util from '../../../utils/util.js';
import api from '../../../api/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    isAdd: true
  },   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if(options.address){
      const addr = JSON.parse(options.address)
      this.setData({
        address: addr,
        isAdd: false
      })
    }   
  },

  bindName(e){
    let addr = this.data.address
    addr.username = e.detail.value
    this.setData({
      address: addr
    })
  },
  bindPhone(e){
    let addr = this.data.address
    addr.userphone = e.detail.value
    this.setData({
      address: addr
    })
  },
  bindAddress(e){
    let addr = this.data.address
    addr.address = e.detail.value
    this.setData({
      address: addr
    })
  },
  saveBtn(){
    let _this = this
    const areaNbhd = wx.getStorageSync('areaNbhd')
    let userId = "U00000000"
    const adr_data = this.data.address
    if(util.isEmpty(adr_data.username)){
      wx.showToast({
        title: '请输入姓名！',
        icon: 'none'
      })
      return false
    }
    if(util.isEmpty(adr_data.userphone)){
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'none'
      })
      return false
    }
    if(util.isEmpty(adr_data.address)){
      wx.showToast({
        title: '请输入地址！',
        icon: 'none'
      })
      return false
    }
    if(_this.data.isAdd){      
      util.request(api.setAddressOfMy,{
        userid: userId,
        neighborhoodid: areaNbhd[2].id,
        username: adr_data.username,
        userphone: adr_data.userphone,
        lng: "22.6348928889",     //所在经纬度位置
        lat: "114.0321329018",
        address: adr_data.address
      },"POST").then(res => {
        console.log("添加地址成功" + JSON.stringify(res))
        if(!util.isEmpty(res)){
          wx.showToast({
            title: '添加成功！',
            icon: 'none',
            success: function (res) {
             _this.cancelBtn(true)
            }
          })
        }      
      })
    }else{
      util.delOrPutRequest(api.setAddressOfMy,adr_data.id,{
        userid: userId,
        neighborhoodid: adr_data.neighborhoodid,
        username: adr_data.username,
        userphone: adr_data.userphone,
        lng: adr_data.lng,     //所在经纬度位置
        lat: adr_data.lat,
        address: adr_data.address
      },"PUT").then(res => {
        console.log("修改地址成功" + JSON.stringify(res))
        if(!util.isEmpty(res)){
          wx.showToast({
            title: '修改成功！',
            icon: 'none',
            success: function (res) {
             _this.cancelBtn(true)
            }
          })
        }      
      })
    }
   
  },
  cancelBtn(fresh = false){
    if(fresh){
      let pages = getCurrentPages() // 获取当前页面
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        isFresh: true
      })
    }   
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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