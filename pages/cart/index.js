import util from '../../utils/util.js';
import api from '../../api/api.js';

Page({
  data: {
    cart: [],
    allSelected: false,
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
    console.log(JSON.stringify(shop))
    this.setData({
      cart: items,
      allSelected: this.isCheckedAll(this.data.cart)
    })
  },
  childChange(e){
    const items = this.data.cart
    let index = e.currentTarget.dataset.index
    let pindex = e.currentTarget.dataset.pindex
    const shop = items[pindex]
    let checked = shop.items[index].checked
    items[pindex].items[index].checked = !checked
    let isall = this.isCheckedAll(items[pindex].items)    
    items[pindex].checked = isall
   
    this.setData({
      cart: items,
      allSelected: this.isCheckedAll(this.data.cart)
    })
  },
  selectAll(){
    let selectAll = this.isCheckedAll()
    const items = this.data.cart
    const cartList = items.map( item => {
      item.checked = !selectAll
      item.items.map( val => val.checked = !selectAll)
      return item
    })
    console.log("all:" + JSON.stringify(cartList))
    this.setData({
      cart: cartList,
      allSelected: !selectAll
    })

  }
 
})
