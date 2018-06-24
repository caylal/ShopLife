import util from '../../utils/util.js';
import api from '../../api/api.js';

Page({
  data: {
    cart: [],
    allSelected: false,
    checkedGoodsCount: 0,
    checkedGoodsAmount: 0,
    pageIndex: 1,
    pageSize: 10,   
  }, 
  onLoad () {    
    wx.setNavigationBarTitle({
      title: util.pageTitle.cart
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getMyCarts();
  },
  getMyCarts(){
    let _this = this
    util.getMyCart(_this.data.pageIndex, _this.data.pageSize).then( res => {
      console.log("myCart:" + JSON.stringify(res));
      const goods = res   
      goods.map(value => {
        value.checked = false
        value.items.map(item => {
          item.url = `/pages/goods/detail/detail?url=${api.getGood}&&id=${item.goodsid}`
          item.checked = false;         
          return item
        })       
      })  
      console.log("mapCart:" + JSON.stringify(goods))
      _this.setData({
        cart: goods,
        allSelected: false,
        checkedGoodsAmount: 0
      })     
      wx.hideLoading()
    })
  },
  onShow(){
    this.onLoad()
  },
  // 选择检查
  isCheckedAll(data) {
    //判断购物车商品已全选
    return data.every(item => {
      if (item.checked) {
        return true;
      } else {
        return false;
      }
    }) 
  },
  //全选门店
  checkboxChange(e){
    const items = this.data.cart
    let name = e.currentTarget.dataset.shopname
    let index = e.currentTarget.dataset.index
    const shop = items[index]
    let selected = shop.checked
    items[index].checked = !selected 
    //门店内所有商品选中
    shop.items.map(val => val.checked = !selected)
    //计算金额
    let total = shop.items.reduce((pre,cur) => {      
      return pre + (cur.goodsretailprice * cur.quantity)
    },0) 
    this.setData({
      cart: items,
      allSelected: this.isCheckedAll(this.data.cart),
      checkedGoodsAmount: items[index].checked ? this.data.checkedGoodsAmount + total : this.data.checkedGoodsAmount - total
    })
  },
  //商品选择
  childChange(e){
    const items = this.data.cart
    let index = e.currentTarget.dataset.index
    let pindex = e.currentTarget.dataset.pindex
    const shop = items[pindex]
    let checked = shop.items[index].checked
    items[pindex].items[index].checked = !checked
    let isall = this.isCheckedAll(items[pindex].items)    
    items[pindex].checked = isall

    let total = shop.items[index].goodsretailprice * shop.items[index].quantity

    this.setData({
      cart: items,
      allSelected: this.isCheckedAll(this.data.cart),
      checkedGoodsAmount: items[pindex].items[index].checked ? this.data.checkedGoodsAmount + total : this.data.checkedGoodsAmount - total
    })
  },
  selectAll(){
    let selectAll = this.isCheckedAll(this.data.cart)
    const items = this.data.cart
    const cartList = items.map( item => {
      item.checked = !selectAll
      item.items.map( val => val.checked = !selectAll)
      return item
    })
    let total = 0
    items.forEach(item => {
      total += item.items.reduce((prev, cur) => {
        return prev + (cur.goodsretailprice * cur.quantity)
      },0)
    })
    console.log(total)
    console.log("all:" + JSON.stringify(cartList))
    this.setData({
      cart: cartList,
      allSelected: !selectAll,
      checkedGoodsAmount: this.isCheckedAll(this.data.cart) ? this.data.checkedGoodsAmount + total : this.data.checkedGoodsAmount - total
    })
  },
  // 修改数量
  editNum(e){
    let _this = this
    const cartList = _this.data.cart 
    const { btn, pindex, cindex}  = e.currentTarget.dataset
    const item = cartList[pindex].items[cindex]
    let goodsid = item.goodsid,        
        shopgoodsid = item.shopgoodsid,
        quantity = 1
    if(btn == "cut"){
      quantity = -1
    }
    let data = {}
    if(util.isEmpty(shopgoodsid)){
      data = {
        userid: "U000000000",
        goodsid: goodsid,        
        quantity: quantity
      }
    }else{
      data = {
        userid: "U000000000",       
        shopgoodsid: shopgoodsid,
        quantity: quantity
      }
    }
    util.request(api.createCart, data, "POST").then(res => {
      console.log(JSON.stringify(res.data.result))
      const result = res.data.result
      let account = _this.data.checkedGoodsAmount;
      if (result != null) {
        if(item.checked){
          if(btn == "cut"){
            account -= item.goodsretailprice
          }
          else{
            account += item.goodsretailprice
          }
        }
        if (result.quantity == 0) {
          util.request(api.deleteCart, { id: result.id },"POST").then(res => {
            if(res.data.result){
              const list = cartList[pindex].items.filter(i => {
                return i.shoppingcartid != res.data.result.id
              })
              _this.setData({
                cart: cartList,
                checkedGoodsAmount: account
              })
            }           
          })
        } else {
          item.quantity = result.quantity
          _this.setData({
            cart: cartList,
            checkedGoodsAmount: account
          })
        }
      }
    })
    
  }, 
})
