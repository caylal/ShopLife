import util from '../../../utils/util.js';
import api from '../../../api/api.js';
Page({  
  data: {
    shopDetailList: []
  },  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.orderM.shopdetail
    });
    this.getShopDetail(options.item)
  },
  getShopDetail(item){
    console.log("shopDetail:" + item);
    const list = JSON.parse(item)
    list.map(res => { 
      res.url = `/pages/goods/detail/detail?url=${api.getShopGood}&&id=${res.shopgoodsid}`
    })
    this.setData({
      shopDetailList: list
    })
  }
})