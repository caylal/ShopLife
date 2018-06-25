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

/**封装微信的request */
const request = (url,data={},method = "Get") => {
  console.log(method)
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
        if (res.statusCode == 200){         
          resolve(res)
        }
        else{
          reject(res.errMsg)
        }
      },
      fail: res => {
        console.log("failed");
        reject(res);
      }
    })
  })
}

/**检查微信会话是否过期 */
const checkSession = () => {
  return new Promise((resolve,reject) => {
    wx.checkSession({
      success:() => {
        resolve(true);
      },
      fail: () => {
        reject(false);
      }
    })
  })
}

/**调用微信登录 */
const login = () => {
  return Promise((resolve, reject) => {
    wx.login({
      success: res =>{
        if(res.code){
          console.log(res);
          resolve(res);
        }
        else{
          reject(res);
        }
      },
      fail: err => {
        reject(err);
       }
    })
  })
}

/**获取用户信息 */
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        resolve(res);
       },
       fail: err =>{
         reject(err);
       }
    })
  })
}
/**获取用户购物车信息 */
const getMyCart = (pindex = 1, psize = 10) =>{ 
  return new Promise((resolve, reject) => {
    request(api.getCartOfMy, {
      pageIndex: pindex,
      pageSize: psize,
      userid: "U000000000"
    }).then(res => {
      const result = res.data.result
      const list = []
      result.forEach(item => {
        item.items.forEach(val => {
          list.push(val)
        })
      })
      console.log("myCartList===:" + JSON.stringify(list))
      wx.setStorage({
        key: 'myCart',
        data: list,
      })
      resolve(result)
    }).catch(err => reject(err))
  })   
}
const filterGood = (good) => {
  const list = wx.getStorageSync('myCart')
  let data;
  list.forEach(val => {
    if (!val.hasOwnProperty("shopid") && !good.hasOwnProperty("shopid")) {
      if (val.goodsid === good.goodsid){
        data = val
        return
      }
    } else {
      if (val.shopid === good.shopid && val.shopgoodsid === good.shopgoodsid ){
        data = val
        return
      }      
    }
  })
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
    request(api.createCart, data, "POST").then(res => {
      console.log("addorcut:===" + JSON.stringify(res.data.result))
      if (res.data.result){
        resolve(res.data.result)
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
    setting: "设置"
  },
  search: "搜索",
  order: "我的订单",
  orderM: {
    detail: '订单详情',
    checkout: '检查订单',
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
  checkSession,
  login,
  getUserInfo,
  getMyCart,
  filterGood,
  editCart,
  isEmpty,
  numDate
}
