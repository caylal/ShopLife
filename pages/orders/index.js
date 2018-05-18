//index.js
//获取应用实例
const app = getApp()
let goods = [{ type: "商品订单", status: "未发货", no: "15486126489615265", time: "5-17 18:01" }]
let wash = [{type: "洗护订单", status: "未发货", no: "15486126489615265", time: "5-17 18:01" }]
let all = goods.concat(wash)
Page({
  data: {
    tab: [{ type: "all", title: "全部" }, { type: "goods", title: "商品订单" },{ type: "wash", title: "洗护订单" }],
    orderList: [],
    currentid: 0,
  },
  onLoad() {
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
