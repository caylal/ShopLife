import util from '../../../utils/util.js';
import api from '../../../api/api.js';
Page({  
  data: {
    orderDetail: {}
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.orderM.detail
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getOrderDetail(options.id)
  },
  getOrderDetail(id){
    let orderlist =  wx.getStorageSync('myOrderList')
    let list = []
    if(orderlist.length > 0){
      list = orderlist.filter(item => item.id == id)
    }
    if(list.length <= 0){
      util.request(api.getOrderOfMy, {
        pi: 1,
        ps: 10,
        uid: "U000000000"
      }).then(res => {
        if(!util.isEmpty(res)){
          list = res.filter(item => item.id == id)
          list[0].shopes.map(val => {
            val.distance = util.transDistance(val.distance)           
          })
          this.setData({
            orderDetail: list[0]
          })
        }
        wx.hideLoading();
      })
    }else{
      list[0].shopes.map(item => {
        if (item.distance < 1000) {
          item.distance = item.distance.toFixed(1) + 'm'
        } else {
          item.distance = (Math.round(item.distance / 100) / 10).toFixed(1) + 'km'
        }
      })
      this.setData({
        orderDetail: list[0]
      })
      wx.hideLoading();
    }   
  
  },
  goodsDetail(e){
    let index = e.currentTarget.dataset.index
    const list = this.data.orderDetail
    const items = list.shopes[index].items
    wx.navigateTo({
      url: '../shopdetail/index?item=' + JSON.stringify(items)
    })
  },
})