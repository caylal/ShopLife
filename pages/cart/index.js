import util from '../../utils/util.js';
import api from '../../api/api.js';

Page({
  data: {
    cart: [],
    allSelected: false,
    checkedGoodsCount: 0,
    checkedGoodsAmount: 0,
    showDelete: false,
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
    util.request(api.getCartOfMy,{
      pi: _this.data.pageIndex,
      ps: _this.data.pageSize,
      uid: "U000000000"
    }).then( res => {
      if(!util.isEmpty(res)){
        console.log("myCart:" + JSON.stringify(res));
        const goods = res
        goods.map(value => {
          value.checked = false
          value.items.map(item => {
            if (item.hasOwnProperty('shopid')) {
              item.url = `/pages/goods/detail/detail?url=${api.getShopGood}&&id=${item.shopgoodsid}`
            } else {
              item.url = `/pages/goods/detail/detail?url=${api.getGood}&&id=${item.goodsid}`
            }
            item.checked = false;
            return item
          })
        })       
        console.log("mapCart:" + JSON.stringify(goods))
        _this.setData({
          cart: _this.data.pageIndex != 1 ? _this.data.cart.concat(goods) : goods,
          allSelected: false,
          checkedGoodsAmount: 0
        })    
      }
      else{
        console.log("没有购物车信息")
        _this.setData({         
          cart: [],
          allSelected: false,
          checkedGoodsAmount: 0            
        })
      }       
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
    if(item.quantity === 1 && btn == "cut"){
      wx.showToast({
        title: '商品不能在减少了哦',
        icon: 'none',
      })
      return false;
    }
    let goodsid = item.goodsid,        
        shopgoodsid = item.shopgoodsid      
    
    util.editCart({ goodsid: goodsid, shopgoodsid: shopgoodsid, btn: btn }).then(res => {
      if (res != null) {
        console.log("添加或减少：" + JSON.stringify(res))
        let account = _this.data.checkedGoodsAmount;
        if (res != null) {
          if (item.checked) {
            if (btn == "cut") {
              account -= item.goodsretailprice
            }
            else {
              account += item.goodsretailprice
            }
          }
          item.quantity = res.quantity
          _this.setData({
            cart: cartList,
            checkedGoodsAmount: account
          })

        }
      }
    })  
    
  },
  // 显示删除操作 
  showDel(){
    let show = this.data.showDelete
    this.setData({
      showDelete: !show
    })
  },
  // 删除购物车
  deleteCart(){
    let _this = this
    const list = this.getCheckedList()
    const allCart = wx.getStorageSync('myCart')
    if (list.length == 0) {
      wx.showModal({
        title: '购物车',
        content: '请选择需要删除的商品',
      })
    } else {
      list.forEach( res => {
        util.delOrPutRequest(api.createOrdeleteCart, res.shoppingcartid).then(result => {
          console.log(result)
          if(result){
            const cart = allCart.filter(item => {
              return item.shoppingcartid != res.shoppingcartid
            })
            wx.setStorage({
              key: 'myCart',
              data: cart,
            })
            wx.showToast({
              title: '删除成功！',
              icon: 'none'
            })
          }
          _this.getMyCarts();         
        })
      })
    }
  },
  // 获取选中商品
  getCheckedList(){
    const cartList = this.data.cart
    console.log("所有cartlist：" + JSON.stringify(cartList))
    let list = []
    if (this.data.allSelected) {
      cartList.forEach(res => {
        list.push.apply(list, res.items)
      })
    } else {
      cartList.forEach(res => {
        if (res.checked) {
          list.push.apply(list, res.items)
        } else {
          const checkedList = res.items.filter(item => { return item.checked === true })
          list.push.apply(list, checkedList)
        }
      })
    }
    return  list
  },  
  checkoutOrder(){
    const list = this.getCheckedList()
    if(list.length == 0){
      wx.showModal({
        title: '购物车',
        content: '请选择需要下单的商品',
      })
    }else{
      console.log("已选择: " + JSON.stringify(list))
      wx.setStorage({
        key: 'checkOrder',
        data: list,
      })

      wx.navigateTo({
        url: 'confirmOrder/index',
      })
    }
   
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.onLoad()
  },
  onReachBottom: function () {
    // this.setData({
    //   pageIndex: this.data.pageIndex + 1
    // })
    // this.getMyCarts()
  }
})
