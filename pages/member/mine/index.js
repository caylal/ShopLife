import util from '../../../utils/util.js';
import api from '../../../api/api.js';
Page({ 
  data: {
    userInfo: {},
    addressList: []
  },
  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.member.setting
    });
    this.getAddress()
  },
  getAddress(){
    let _this = this
    let list = wx.getStorageSync('myAddress');
    if(list.length > 0){
      _this.setData({
        addressList: list
      })
    }else{
      util.request(api.getAddressOfMy, { userid:'U000000000'}).then(res => {
        res.map(item => {
          item.lng = item.lng.toFixed(2)
          item.lat = item.lat.toFixed(2)
        })
        _this.setData({
          addressList: res
        })
        wx.setStorage({
          key: 'myAddress',
          data: res,
        })
      })
    }
    
  },
  addAddress(){
    let _this = this    
    wx.navigateTo({
      url: '../../member/address/index',
    })
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

})