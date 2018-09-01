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
    isFresh: false
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
    Promise.all([
      this.getIndexBanner(),
      this.getRecommend(),
      this.getHot()
    ]).then(res => {    
        wx.hideLoading()
    })    
   
  },
  onShow(){
    const areaNbhd = wx.getStorageSync('areaNbhd')
    if (areaNbhd.length > 0) {
      this.setData({
        locationName: areaNbhd[3].name
      })
    } 
  },
  getIndexBanner(){
    let _this = this
    const banner_list = wx.getStorageSync('IndexBanner')
    return new Promise((resolve, rejecet) => {
      if(!_this.data.isFresh && banner_list.length > 0){
        _this.setData({
          imagesUrl: banner_list
        })  
        resolve(true)
      }else{
        util.request(api.getBannerOfnbhd,{
          pi: _this.data.pageIndex,
          ps: _this.data.pageSize, 
          nbhd: "N000"
        }).then(res => {
          if(!util.isEmpty(res)){
            console.log("result:" + JSON.stringify(res))      
            _this.setData({
              imagesUrl: res
            })  
            wx.setStorage({
              key: 'IndexBanner',
              data: res,
            })
          }else{
            console.log("banner无数据")
          }
          resolve(true)
        }).catch(err => rejecet(err))
      }
    })
  },  
  getRecommend(){
    let _this = this
    const rec_list = wx.getStorageSync('IndexRecommend')
    return new Promise((resolve, rejecet) => {
      if(!_this.data.isFresh && rec_list.length > 0){
        _this.setData({
          recGoods: rec_list
        })  
        resolve(true)
      }else{
        util.request(api.getRecommendGoodOfMy, { 
          pi: _this.data.pageIndex, 
          ps: _this.data.pageSize, 
          uid: "U000000000", 
          nid: "N000" 
        }).then(res => {
          console.log("recomment:" + JSON.stringify(res));
          if(!util.isEmpty(res)){
            res.map(item => {         
              item.cate = "rec"  
              item.url = `/pages/goods/detail/detail?url=${api.getRecommendGood}&&id=${item.id }`
              let num = parseFloat(item.retailprice);
              num = num.toFixed(2);
              item.retailprice = num         
            })       
            _this.setData({
              recGoods: res
            })
            wx.setStorage({
              key: 'IndexRecommend',
              data: res,
            })          
          } else{
            console.log("Recommend无数据")
          } 
          resolve(true)
        }).catch(err => rejecet(err))
      }      
    })     
  },
  getHot(){
    let _this = this
    const hot_list = wx.getStorageSync('IndexHot')
    return new Promise((resolve,reject) => {
      if(!_this.data.isFresh && hot_list.length > 0){
        _this.setData({
          hotGoods: hot_list
        })  
        resolve(true)
      }else{
        util.request(api.getHotGoodsOfNbhd, {
          pi: _this.data.pageIndex, 
          ps: _this.data.pageSize, 
          nbhd: "N000"
        }).then(res => {
          console.log("hot:" + JSON.stringify(res));
          if(!util.isEmpty(res)){
            res.map(item => { 
              item.cate = "hot"  
              item.url = `/pages/goods/detail/detail?url=${api.getHotGood}&&id=${item.id}`          
            })
            console.log("resultmap:" + JSON.stringify(res))
            _this.setData({
              hotGoods: res
            })
            wx.setStorage({
              key: 'IndexHot',
              data: res,
            })    
          }else{
            console.log("Hot无数据")
          }       
          resolve(true)
        }).catch(err => reject(err))   
      }      
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
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.setData({
    //   pageIndex: 1,
    //   isFresh: true
    // })
    // this.onLoad()
  },
  
})
