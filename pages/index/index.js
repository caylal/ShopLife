//index.js
import util from '../../utils/util.js'
import api from '../../api/api.js'
import https from '../../service/https.js'
import { getMyCart, editCart, getAllCity } from '../../service/service.js'
import { logFactory } from '../../utils/log/logFactory.js'

const log = logFactory.get("Home")

const app = getApp()
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    loadingHidden: false , // loading
    interval: 3000,
    duration: 1000,
    locationName: '定位中',
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
      url: '../search/search'
    })
  }, 
  onLoad() {
    wx.setNavigationBarTitle({
      title: util.pageTitle.home
    });    
    this.setData({
      locationName: app.globalData.Nbhd[2].name
    })
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
    getAllCity()
    getMyCart(app.globalData.userInfo.id).then(res => {
      log.log("首次获取购物车信息：", res)
    })
  },
  onShow(){ 
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    if(!util.isEmpty(currPage.data.load)){
      this.onLoad()
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
        https.get(api.getBannerOfnbhd,{
          pi: _this.data.pageIndex,
          ps: _this.data.pageSize, 
          nbhd: app.globalData.Nbhd[2].id
        }).then(res => {
          if(!util.isEmpty(res)){             
            log.log(util.getPageUrl() + ' banner: ', res)   
            _this.setData({
              imagesUrl: res
            })  
            wx.setStorage({
              key: 'IndexBanner',
              data: res,
            })
          }else{           
            log.log(util.getPageUrl() + ' banner无数据', res)   
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
        https.get(api.getRecommendGoodOfMy, { 
          pi: _this.data.pageIndex, 
          ps: _this.data.pageSize, 
          uid: app.globalData.userInfo.id, 
          nid: app.globalData.Nbhd[2].id
        }).then(res => {         
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
            log.log(util.getPageUrl() + ' Recommend无数据', res) 
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
        https.get(api.getHotGoodsOfNbhd, {
          pi: _this.data.pageIndex, 
          ps: _this.data.pageSize, 
          nbhd: app.globalData.Nbhd[2].id
        }).then(res => { 
          if(!util.isEmpty(res)){
            res.map(item => { 
              item.cate = "hot"  
              item.url = `/pages/goods/detail/detail?url=${api.getHotGood}&&id=${item.id}`          
            })
            log.log(util.getPageUrl() + " resultmap:", res)
            _this.setData({
              hotGoods: res
            })
            wx.setStorage({
              key: 'IndexHot',
              data: res,
            })    
          }else{           
            log.log(util.getPageUrl() + ' Hot无数据', res)
          }       
          resolve(true)
        }).catch(err => reject(err))   
      }      
    })   
  },   
  // getCart() {
  //   // 获取所有购物车信息
  //   getMyCart(app.globalData.userInfo.id).then(res => log.log(util.getPageUrl() + " 获取购物车成功：" ,res))
  // },  
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
    log.log(util.getPageUrl() + " indexList: " + item)
    let goodsid = item.goodsid,     
        shopgoodsid = item.shopgoodsid     
    editCart({ uid: app.globalData.userInfo.id, goodsid: goodsid, shopgoodsid: shopgoodsid,btn: btn}).then(res => {    
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
