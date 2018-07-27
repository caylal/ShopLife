import util from '../../../utils/util.js';
import api from '../../../api/api.js';
Page({ 
  data: {
    userInfo: {},
    addressList: [],
    isFresh: false
  },
  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.member.setting
    });
    this.getAddress()
  },
  onShow(){
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    if(util.isEmpty(currPage.data.isFresh) && currPage.data.isFresh){
      this.setData({
        isFresh: currPage.data.isFresh
      })  
      this.onLoad()         
    }       
  },
  getAddress(){
    let _this = this
    let list = wx.getStorageSync('myAddress');
    if(list.length > 0 && !_this.data.isFresh){
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
  editAddress(e){
    const addRList = this.data.addressList
    let index = e.currentTarget.dataset.index
    let this_addr = addRList[index]
    const addr_str = JSON.stringify(this_addr)
    wx.navigateTo({
      url: '../../member/address/index?address='+ addr_str,
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