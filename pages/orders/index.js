import util from '../../utils/util.js';
import api from '../../api/api.js';
Page({
  data: {
    tab: [{ type: 0, title: "全部" }, { type: 1, title: "待支付" }, { type: 2, title: "待发货" }, { type: 3, title: "待收货" },{ type: 4, title: "已完成" },{ type: 5, title: "已取消" }],
    orderList: [],
    currentid: 0,
    pageIndex: 1,
    pageSize: 10,
  },
  onLoad(option) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.order
    });  
    wx.showLoading({
      title: '加载中',
    })
    this.getAllOrders(option.types) 
  },
  // 分页获取订单
  getAllOrders(types = 0){
    let _this = this
    let order_list = wx.getStorageSync('myOrderList')
    if(order_list.length > 0 && _this.data.pageIndex == 1){
      if(types == 0){
        _this.setData({
          orderList: order_list,
          currentid: types
        })
      }else{
        let filter_list = order_list.filter(item => item.state.value == types)
        _this.setData({
          orderList: filter_list,
          currentid: types
        })
      }
      wx.hideLoading()
    }else{
      util.request(api.getOrderOfMy, {
        pi: _this.data.pageIndex,
        ps: _this.data.pageSize,
        uid: "U000000000"
      }).then(res => {
        if (!util.isEmpty(res)) {
          res.map(item => {
            item.state = OrderState(item.status)
            item.date = transDate(item.createdt)
          })
          console.log("所有订单信息：" + JSON.stringify(res))
          const store_order = wx.getStorageSync('myOrderList')
          wx.setStorage({
            key: 'myOrderList',
            data: _this.data.pageIndex != 1 ? store_order.concat(res) : res
          })
          if(types == 0){
            _this.setData({
              orderList: _this.data.pageIndex != 1 ? _this.data.orderList.concat(res) : res,
              currentid: types
            })
          }else{
            if(_this.data.pageIndex != 1){
              const _concatList = store_order.concat(res);
              const _filter = _concatList.filter(item => item.state.value == types)
              _this.setData({
                orderList: _this.data.pageIndex != 1 && _this.data.currentid == types ? _this.data.orderList.concat(_filter) : _filter,
                currentid: types
              })
            }
          }
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh()
        }
      })
    }
    
  },
  bindTap(e) {
    let id = e.currentTarget.dataset.type;
    let list = [];
    let order = wx.getStorageSync('myOrderList')
    if(id == '0'){
      list = order
    }else{
      list = order.filter(item => item.state.value == id)
    }   
    this.setData({
      currentid: e.currentTarget.dataset.id,
      orderList: list
    })
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    wx.removeStorageSync('myOrderList')
    this.onLoad({types:this.data.currentid})
  },
  onReachBottom() {
    const list = wx.getStorageSync('myOrderList')
    let count = list.length
    let ps = this.data.pageSize  
    let type = this.data.currentid  
    let pi    
    if(ps > count){
      pi = 2;
    }else{
      pi = Math.round(count / ps)
    }
    // this.setData({
    //   pageIndex: pi
    // })
    // this.getAllOrders(type)
  }
})

function OrderState(state){
  let status = {}
  switch(state){
    case "init": status.value = 0 ,status.desc = "初始化"
      break;
    case "waitingforpay": status.value = 1 ,status.desc = "待支付"
      break;
    case "waitingforshipping": status.value = 2 ,status.desc = "待发货"
      break;
    case "waitingforarriving": status.value = 3 ,status.desc = "待收货"
      break;
    case "completed":status.value = 4 ,status.desc = "已完成"
      break;
    case "cancel": status.value = 5 ,status.desc = "已取消"
      break;
    default: status.value = 0 ,status.desc = "初始化"
      break;
  }
  return status
}
function transDate(date){
  let tt = new Date(date);
  let days = parseInt((new Date().getTime() - tt) / 86400000);
  let today = new Date().getDate();
  let year = tt.getFullYear();
  let mouth = tt.getMonth() + 1;
  let day = tt.getDate();
  let time = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
  let min = tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
  let result, offset;
  offset = Math.abs(today - day);
  if (days < 4 && offset < 4) {
    if (offset === 0) {
      result = "今天" + time + ":" + min;
    } else if (offset === 1) {
      result = "昨天" + time + ":" + min;
    } else if (offset === 2) {
      result = "前天" + time + ":" + min;
    }
  } else {
    result = year + "-" + mouth + "-" + day + " " + time + ":" + min;
  }
  return result
}