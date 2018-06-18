import util from '../../utils/util.js';
import api from '../../api/api.js';

Page({
  data: {
    cart: [],
    pageIndex: 1,
    pageSize: 10,   
  }, 
  onLoad () {    
    wx.setNavigationBarTitle({
      title: util.pageTitle.cart
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getMyCart();
  },
  getMyCart(){
    let _this = this
    util.request(api.getCartOfMy,{
      pageIndex: _this.data.pageIndex,
      pageSize: _this.data.pageSize,
      userid:"U000000000"
    }).then( res => {
      console.log("myCart:" + JSON.stringify(res.data.result));
      _this.setData({
        cart: res.data.result
      })
      wx.hideLoading()
    })
  }
 
})
