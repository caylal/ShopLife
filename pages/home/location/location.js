
const areal = [{id:"01",name:"宝安区"},{id:"02",name:"南山区"}];
const cityl = [{ sort: "S", data: [{ id: "1", name: "深圳" }, { id: "1", name: "上海" }] },{ sort: "B", data: [{ id: "1", name: "北京" }, { id: "1", name: "保定" }]}];
const nbhdl = [{id:"001",name:"西乡街道"},{id:"002",name:"粤海大道"}]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
    area: '',
    nbhd: '',
    cityList: [],
    areaList: [],
    nbhdList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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