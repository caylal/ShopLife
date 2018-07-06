//index.js
import util from '../../../utils/util.js'
import api from '../../../api/api.js'
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    loadingHidden: false , // loading
    interval: 3000,
    duration: 1000,
    locationName: '',
    imagesUrl:[],
    recGoods: [],
    hotGoods:[],
    cartGoods: [],
    pageIndex: 1,
    pageSize: 10,
  },
  // 搜索入口  
  Search () {
    wx.redirectTo({
      url: '../../search/search'
    })
  },
  getLocation(){
    wx.redirectTo({
      url: '../location/location',
    })
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: util.pageTitle.home
    });

    wx.showLoading({
      title: '加载中...'
    });
    const areaNbhd = wx.getStorageSync('areaNbhd')
    if (areaNbhd.length > 0){
      this.setData({
        locationName: areaNbhd[2].name
      })
    }
    //测试数据  
    // this.setData({
    //   recGoods: rec,
    //   hotGoods: hot
    // })
    // wx.hideLoading()
   
    this.getIndexBanner()
    Promise.all([
      this.getRecommend(),
      this.getHot()
    ]).then(res => {    
        wx.hideLoading()
    })    
   
  },
  onShow(){   
    this.onLoad()    
  },
  getIndexBanner(){
    let _this = this
    util.request(api.getBannerOfnbhd,{
      pi: _this.data.pageIndex,
      ps: _this.data.pageSize, 
      nbhd: "N000"
    }).then(res => {
       console.log("result:" + JSON.stringify(res))      
        _this.setData({
          imagesUrl: res
        })       
      
    })
   
  },  
  getRecommend(){
    let _this = this
    return new Promise((resolve, rejecet) => {
      util.request(api.getRecommendGoodOfMy, { 
        pi: _this.data.pageIndex, 
        ps: _this.data.pageSize, 
        uid: "U00000000", 
        nid: "N000" 
      }).then(res => {
        console.log("recomment:" + JSON.stringify(res));
        const cate = res.map(item => {         
          item.cate = "rec"  
          item.url = `/pages/goods/detail/detail?url=${api.getRecommendGood}&&id=${item.id }`
          let num = parseFloat(item.retailprice);
          num = num.toFixed(2);
          item.retailprice = num
          return item
        })       
        _this.setData({
          recGoods: cate
        })
        resolve(true)
      }).catch(err => rejecet(err))
    })     
  },
  getHot(){
    let _this = this
    return new Promise((resolve,reject) => {
      util.request(api.getHotGoodsOfNbhd, {
        pi: _this.data.pageIndex, 
        ps: _this.data.pageSize, 
        nbhd: "N000"
      }).then(res => {
        console.log("hot:" + JSON.stringify(res));
        const list = res.map(item => { 
          item.cate = "hot"  
          item.url = `/pages/goods/detail/detail?url=${api.getHotGood}&&id=${item.id}`
          return item
        })
        console.log("resultmap:" + JSON.stringify(list))
       _this.setData({
         hotGoods: list
       })
        resolve(true)
      }).catch(err => reject(err))   
    })   
  },  
  changeCart(e){
    let _this = this
    const { cate, index, btn} = e.currentTarget.dataset
    let list = []    
    if(cate == "rec"){
      list = _this.data.recGoods     
    }else{
      list = _this.data.hotGoods      
    }
    let item = list[index]
    console.log("indexList====" + JSON.stringify(item))
    let goodsid = item.goodsid,     
        shopgoodsid = item.shopgoodsid     
    util.editCart({ goodsid: goodsid, shopgoodsid: shopgoodsid,btn: btn}).then(res => {    
      if (res != null) {
        wx.showToast({
          title: '添加成功！',
          icon: 'none'
        })
      }
    })    
   
  }, 
  
})
