//index.js
//获取应用实例
import util from '../../../utils/util.js'
import api from '../../../api/api.js'
const rec = [{ id: "12da", goodsid: "12345", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png", url: "http://2530013758.nat123.net/api/recommendGoods/get" }, { id: "56fdf", goodsid: "fd355", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png", url: "http://2530013758.nat123.net/api/recommendGoods/get" }, { id: "78fgdh", goodsid: "g6743e", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png", url: "http://2530013758.nat123.net/api/recommendGoods/get" }]
const hot = [{ id: "12da", goodsid: "12345", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/goods.png", url: "http://2530013758.nat123.net/api/hotGoods/get" }, { id: "56fdf", goodsid: "fd355", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/goods.png", url: "http://2530013758.nat123.net/api/hotGoods/get" }, { id: "78fgdh", goodsid: "g6743e", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/goods.png", url: "http://2530013758.nat123.net/api/hotGoods/get" }]


Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    loadingHidden: false , // loading
    interval: 3000,
    duration: 1000,
    location: '',
    imagesUrl:[],
    recGoods: [],
    hotGoods:[]
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
  getIndexBanner(){
    let _this = this
    util.request(api.getBannerOfnbhd,{pageIndex: 1,pageSize: 3, id: "N000"}).then(res => {
       console.log("result:" + JSON.stringify(res.data.result))      
        _this.setData({
          imagesUrl: res.data.result
        })       
      
    })
   
  },  
  getRecommend(){
    let _this = this
    return new Promise((resolve, rejecet) => {
      util.request(api.getRecommendGoodOfMy, { pageIndex: 1, pageSize: 3, uid: "U00000000", nid: "N000" }).then(res => {
        console.log("recomment:" + JSON.stringify(res.data.result));
        const cate = res.data.result.map(item => {
          item.url = api.getRecommendGood
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
      util.request(api.getHotGoodsOfNbhd, { pageIndex: 1, pageSize: 3, neighborhood: "N000"}).then(res => {
        console.log("hot:" + JSON.stringify(res.data.result));
        const list = res.data.result.map(item => {
          item.url = api.getHotGood
          return item
        })
        console.log("resultmap:" + JSON.stringify(list))
       _this.setData({
         hotGoods: list
       })
        resolve(true)
      }).catch(err => reject(err))   
    })   
  }
  
})
