import util from '../../utils/util.js';
let goods = [{ type: "商品订单", status: "未发货", no: "15486126489615265", time: "5-17 18:01" }]
let wash = [{type: "洗护订单", status: "未发货", no: "15486126489615265", time: "5-17 18:01" }]
let all = goods.concat(wash)
Page({
  data: {
    tab: [{ type: 1, title: "全部" }, { type: 2, title: "待支付" }, { type: 3, title: "待发货" }, { type: 4, title: "待收货" },{ type: 5, title: "已完成" },{ type: 6, title: "已取消" }],
    orderList: [],
    currentid: 0,
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: util.pageTitle.order
    });

    this.setData({
      orderList: all
    })
  },
  bindTap(e) {
    let id = e.currentTarget.dataset.type;
    let list = [];
    if( id == 'goods') {
      list = goods;
    } else if( id == 'wash'){
      list = wash;
    }else{
      list = all;
    }
    this.setData({
      currentid: e.currentTarget.dataset.id,
      orderList: list
    })
  }
})
