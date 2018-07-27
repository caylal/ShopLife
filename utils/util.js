import api from '../api/api.js'

const formatTime = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const numDate = (start, end) =>{
  let start_date = new Date(start)
  let end_date = new Date(end)
  let days = end_date.getTime() - start_date.getTime();
  let day = parseInt(days / (1000 * 60 * 60 * 24))
  return day
}

const isEmpty = n => {
  if(n != "" && n != null && n != undefined){
    return false;
  }
  return true;
}

//换算距离低于1000返回米，否则返回千米
const transDistance = len => {
  if(!len || Math.abs(len) <= 0.000001){
    return "0m"
  }
  if (len < 1000) {
    return len.toFixed(2) + 'm'
  } 
  else {
    return (Math.round(len/ 100) / 10).toFixed(1) + 'km'
  } 
}
// 时间转换
const transDate = date => {
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
/**封装微信的request */
const request = (url,data={},method = "Get") => {
  return new Promise((resolve,reject) =>{
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
      success: res =>{
        console.log("success");
        if (res.statusCode == 200 && res.data._wrapperCode == 200){         
          resolve(res.data.result)
        } else if (res.statusCode == 200 && res.data.result == null){
          resolve(res.data.result)
        }
        else{
          reject(res.data.error)
        }
      },
      fail: res => {
        console.log("failed");
        reject(res.errMsg);
      }
    })
  })
}
const delOrPutRequest = (url, id, data = {}, method = "DELETE") => { 
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/' + id,
      method: method,
      data: data,
      success: res => {
        if(res.statusCode == 200 && res.data._wrapperCode == 200){
          resolve(res.data.result)
        }else{
          reject(res.data.error)
        }
      },
      fail: res => {
        reject(res.errMsg)
      }
    })
  })
}


/**获取用户购物车信息 */
const getMyCart = (pindex = 1, psize = 10) =>{ 
  wx.removeStorageSync('myCart')  
  return new Promise((resolve, reject) => {    
    request(api.getCartOfMy, {
      pi: pindex,
      ps: psize,
      uid: "U000000000"
    }).then(res => {
      if(!isEmpty(res)){        
        const list = []
        res.forEach(item => {
          item.items.forEach(val => {
            list.push(val)
          })
        })
        console.log("myCartList===:" + JSON.stringify(list))
        const storeCart = wx.getStorageSync('myCart') || []
        const lalist = storeCart.concat(list)
        wx.setStorage({
          key: 'myCart',
          data: lalist,
        })
        console.log("购物车数量：" + list.length)
        if (list.length == 10) {
          getMyCart(pindex + 1)
        } else {
          resolve(lalist)
        }
      }
     
    }).catch(err => reject(err)) 
  }) 
 
}
const filterGood = (good) => {
  const list = wx.getStorageSync('myCart')
  console.log("myCart:" + JSON.stringify(list))
  let data;
  if(list.length > 0){
    list.forEach(val => {
      if (!val.hasOwnProperty("shopid") && !good.hasOwnProperty("shopid")) {
        if (val.goodsid === good.goodsid) {
          data = val
          return
        }
      } else {
        if (val.shopid === good.shopid && val.shopgoodsid === good.shopgoodsid) {
          data = val
          return
        }
      }
    })
  }  
  if (!isEmpty(data)) {
    return data.quantity
  }
  else {
    return false
  }
}
const editCart = (data) => {
  let { goodsid, shopgid, shopgoodsid, btn } = data
  return new Promise((resolve, reject) => {    
    let quantity = 1
    if (!isEmpty(shopgid) && isEmpty(shopgoodsid)) {
      shopgoodsid = shopgid
    }
    if (btn == "cut") {
      quantity = -1
    }
    let data = {}
    if (isEmpty(shopgoodsid)) {
      data = {
        userid: "U000000000",
        goodsid: goodsid,
        quantity: quantity
      }
    } else {
      data = {
        userid: "U000000000",
        shopgoodsid: shopgoodsid,
        quantity: quantity
      }
    }
    request(api.createOrdeleteCart, data, "POST").then(res => {
      console.log("addorcut:===" + JSON.stringify(res))
      const listall = wx.getStorageSync('myCart')
      let list = []
      if(listall.length > 0){
        list = listall.filter(item => {
          return item.shoppingcartid == res.id
        })
      }      
      if (list.length <= 0){
        getMyCart()
      }else{
        listall.map(item => {
          if (item.shoppingcartid == res.id){
            item.quantity = res.quantity
          }
        })
        wx.setStorage({
          key: 'myCart',
          data: listall,
        })
      }
      if (res){
        resolve(res)
      }
    }).catch(err => reject(err))
  })
  
}
const pageTitle = {
  home: "近邻生活",
  nbhd: {
    index: "近邻",
    list: "社区列表"
  },
  cart: "购物车",
  goods: {
    list: '商品列表',
    detail: '商品详情',
    catalog: '商品分类'
  },
  member: {
    index: "个人中心",
    setting: "设置",
    address: "地址信息"
  },
  search: "搜索",
  order: "我的订单",
  orderM: {
    detail: '订单详情',
    shopdetail: '门店商品清单',
    payment: '订单付款',
    s1: '待付款',
    s2: '待发货',
    s3: '待收货',
    s4: '待评价'
  },  
 
  address: "我的地址",
  addressM: {
    add: '添加地址',
    edit: '更新地址'
  },
  userinfo: "用户信息",
  wechatLogin: "微信登录",
  wechatPay: "微信支付",
};
module.exports = {
  formatTime: formatTime,
  pageTitle: pageTitle,
  request,
  delOrPutRequest, 
  getMyCart, 
  filterGood,
  editCart,
  isEmpty,
  numDate,
  transDistance,
  transDate
}
