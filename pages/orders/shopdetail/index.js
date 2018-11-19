import util from '../../../utils/util.js';
import { Apis } from '../../../api/api.js';
import { logFactory } from '../../../utils/log/logFactory.js'

const log = logFactory.get("Orders")

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
    log.log(util.getPageUrl() + " shopDetail: " ,item);
    const list = JSON.parse(item)
    list.map(res => { 
      res.url = `/pages/goods/detail/detail?url=${Apis.shop.goods}&&id=${res.shopgoodsid}`
    })
    this.setData({
      shopDetailList: list
    })
  }
})