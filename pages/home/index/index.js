//index.js
import util from '../../../utils/util.js'
import api from '../../../api/api.js'
import https from '../../../service/https.js'
import { getMyCart, editCart } from '../../../service/service.js'

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
    if (app.globalData.userInfo){
      wx.showLoading({
        title: '加载中...'
      });
      this.setLocation().then(res => {
        Promise.all([
          this.getIndexBanner(),
          this.getRecommend(),
          this.getHot(),
          this.getCart()
        ]).then(res => {
          wx.hideLoading()
        })    
      })     
    }else{
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }    
   
  },
  onShow(){    
    this.onLoad()
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
        https.get(api.getRecommendGoodOfMy, { 
          pi: _this.data.pageIndex, 
          ps: _this.data.pageSize, 
          uid: app.globalData.userInfo.id, 
          nid: app.globalData.Nbhd[2].id
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
        https.get(api.getHotGoodsOfNbhd, {
          pi: _this.data.pageIndex, 
          ps: _this.data.pageSize, 
          nbhd: app.globalData.Nbhd[2].id
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
  getLocation() {    
    let _this = this
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          wx.setStorage({
            key: 'location',
            data: { "lng": longitude, "lat": latitude },
          })
          app.globalData.location = { "lng": longitude, "lat": latitude }
          https.get(api.getLngLat, {
            pi: 1,
            ps: 20,
            lng: longitude,
            lat: latitude,
            dis: 20
          }).then(res => {
            if (res) {
              wx.setStorage({
                key: 'nearestNbhd',
                data: res,
              })
              resolve(true)
            } else {
              reject(false)
            }

          })
        }
      })
    })
  },
  setLocation() {
    const areaNbhd = wx.getStorageSync('areaNbhd')
    return new Promise((resolve, reject) => {
      if (!app.globalData.Nbhd) {
        this.getLocation().then(res => {
          const nearestNbhd = wx.getStorageSync('nearestNbhd')
          https.get(api.getArea, { id: nearestNbhd[0].areaid }).then(res => {
            console.log("当前区域:" + JSON.stringify(res))
            let city = []
            let c = res[0].hierarchy.split('|')
            let n = res[0].hierarchyname.split('|')
            city.push({ id: c[1], name: n[1] })
            city.push({ id: c[2], name: n[2] })
            city.push({ id: nearestNbhd[0].id, name: nearestNbhd[0].name })
            wx.setStorage({
              key: 'areaNbhd',
              data: city,
            })
            app.globalData.Nbhd = city
            this.setData({
              locationName: city[2].name
            })
            resolve(true)
          })
        })
      } else {
        app.globalData.Nbhd = areaNbhd
        this.setData({
          locationName: areaNbhd[2].name
        })
        resolve(true)
      }
    })
  },
  getCart() {
    // 获取所有购物车信息
    getMyCart(app.globalData.userInfo.id).then(res => console.log("获取购物车成功：" + JSON.stringify(res)))
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
