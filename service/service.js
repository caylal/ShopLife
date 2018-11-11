import https from '../service/https.js'
import {isEmpty} from '../utils/util.js'
import api from '../api/api.js'

/**获取用户购物车信息 */
const getMyCart = (uid, pindex = 1, psize = 10) => {
  wx.removeStorageSync('myCart')
  return new Promise((resolve, reject) => {
    https.get(api.getCartOfMy, {
      pi: pindex,
      ps: psize,
      uid: uid
    }).then(res => {
      if (!isEmpty(res)) {
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
          getMyCart(uid, pindex + 1)
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
  if (list.length > 0) {
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
  let { uid, goodsid, shopgid, shopgoodsid, btn } = data
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
        userid: uid,
        goodsid: goodsid,
        quantity: quantity
      }
    } else {
      data = {
        userid: uid,
        shopgoodsid: shopgoodsid,
        quantity: quantity
      }
    }
    https.post(api.createCart, data).then(res => {
      console.log("addorcut:===" + JSON.stringify(res))
      const listall = wx.getStorageSync('myCart')
      let list = []
      if (listall.length > 0) {
        list = listall.filter(item => {
          return item.shoppingcartid == res.id
        })
      }
      if (list.length <= 0) {
        getMyCart(uid)
      } else {
        listall.map(item => {
          if (item.shoppingcartid == res.id) {
            item.quantity = res.quantity
          }
        })
        wx.setStorage({
          key: 'myCart',
          data: listall,
        })
      }
      if (res) {
        resolve(res)
      }
    }).catch(err => reject(err))
  })

}

module.exports = {
  getMyCart,
  filterGood,
  editCart,
}