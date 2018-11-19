import https from '../service/https.js'
import {isEmpty} from '../utils/util.js'
import { Apis } from '../api/api.js'
import { logFactory } from '../utils/log/logFactory.js'

const log = logFactory.get("Service")

/**获取用户购物车信息 */
const getMyCart = (uid) => {
  wx.removeStorageSync('myCart')
  const id = uid
  function getCart(pindex = 1, psize = 10){
    return new Promise((resolve, reject) => {
      https.get(Apis.cart.queryOfMy, {
        pi: pindex,
        ps: psize,
        uid: id
      }).then(res => {
        if (!isEmpty(res)) {
          const list = []
          res.forEach(item => {
            item.items.forEach(val => {
              list.push(val)
            })
          })
          log.log("myCartList: ", list)
          const storeCart = wx.getStorageSync('myCart') || []
          const lalist = storeCart.concat(list)
          wx.setStorage({
            key: 'myCart',
            data: lalist,
          })
          log.log("购物车：", lalist)
          log.log("购物车数量：", list.length)
          if (list.length == psize) {
            getCart(pindex + 1)
          } else {
            resolve(lalist)
          }
        } else {
          resolve(res)
          log.log("购物车无数据：", res)
        }
      }).catch(err => reject(err))
    })
  }

  return getCart()
}
const filterGood = (good) => {
  const list = wx.getStorageSync('myCart')
  log.log("filterMyCart: " , list)
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
    https.post(Apis.cart.restful.post, data).then(res => {
      log.log("addorcut:" , res)
      const listall = wx.getStorageSync('myCart')
      if (btn == "cut"){
        let filter_list = listall.filter(val => val.shoppingcartid !== res.id);
        listall.forEach(item => {
          if(item.shoppingcartid === res.id) {
            if(item.quantity > 1) {
              item.quantity = item.quantity - 1
              filter_list.push(item)
            } 
          }
        })
        log.log("剩余购物车商品：", filter_list)
        wx.setStorage({
          key: 'myCart',
          data: filter_list,
        })
        resolve(res)
      }else{
        let list = []
        if (listall.length > 0) {
          list = listall.filter(item => {
            return item.shoppingcartid == res.id
          })
          log.log("购物车是否有此商品：" + res.id, listall)
        }
        if (list.length <= 0) {
          getMyCart(uid).then(ress => {
            resolve(res)
          })
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
          resolve(res)
        }      
      }      
      
    }).catch(err => reject(err))
  })

}

const getAllCity = () => {
  const allCityMap = wx.getStorageSync('allCityMap');
  if(isEmpty(allCityMap)){
    https.get(Apis.area.queryCity).then(res => {
      if (!isEmpty(res)) {
        wx.setStorage({
          key: 'allCitys',
          data: res,
        })
        const map_data = mapCity(res)  // 简化数据，解决渲染慢的问题     
        wx.setStorage({
          key: 'allCityMap',
          data: map_data,
        })
        log.log("allCtiy: ", res)
      } else {
        log.log("city无数据：", res)
      }
    })
  }else{
    log.log("已缓存allCtiy: " , allCityMap)
  }  
}
const mapCity = (data) => {
  for (let i = 0; i < data.length; i++) {
    data[i].cities = data[i].cities.map(item => {
      return {
        id: item.id,
        namecn: item.namecn
      }
    })
  }
  return data
}

module.exports = {
  getMyCart,
  filterGood,
  editCart,
  getAllCity
}