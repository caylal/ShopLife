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
    this.getMyCart();
  },
  getMyCart(){
    let _this = this
    util.request(api.getCartOfMy,{
      pageIndex: _this.data.pageIndex,
      pageSize: _this.data.pageSize,
      userid:"U000000000"
    }).then( res => {
      console.log("myCart:" + JSON.stringify(res.data.result));
      const goods = res.data.result
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
        cart: goods
      })
      wx.setStorage({
        key: 'myCart',
        data: goods,
      })
      wx.hideLoading()
    })
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
    const cartList = this.data.cart 
    let btn = e.currentTarget.dataset.btn
    let pindex = e.currentTarget.dataset.pindex,
        index = e.currentTarget.dataset.cindex  
    const item = cartList[pindex].items[index]
    let goodsid = item.goodsid,
        shopid = item.shopid,
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
    this.addOrupdateCart(data)
    
  },

  addOrupdateCart(data){
    let _this = this
    util.request(api.createCart,data,"POST").then(res => {
      console.log(JSON.stringify(res.data.result))
      if(res.data.result != null){
        _this.getMyCart()
      }
    })
  }
 
})
