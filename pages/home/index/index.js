//index.js
//获取应用实例
import util from '../../../utils/util.js'
import api from '../../../api/api.js'
const rec = [{ id: "12da", goodsid: "12345", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }, { id: "56fdf", goodsid: "fd355", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }, { id: "78fgdh", goodsid: "g6743e", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }]
const hot = [{ id: "12da", goodsid: "12345", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/goods.png" }, { id: "56fdf", goodsid: "fd355", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/goods.png" }, { id: "78fgdh", goodsid: "g6743e", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/goods.png" }]


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
    //wx.hideLoading()
    this.getIndexBanner()
    Promise.all([
      this.getRecomment(),
      this.getHot()
    ]).then(res => {    
        wx.hideLoading()
    })
    
  },
  getIndexBanner(){
    let _this = this
    util.request(api.bannerOfnbhd,{pageIndex: 1,pageSize: 3, id: "N000"}).then(res => {
       console.log("result:" + JSON.stringify(res.data.result))
        _this.setData({
          imagesUrl: res.data.result
        })       
      
    })
   
  },  
  getRecomment(){
    let _this = this
    return new Promise((resolve, rejecet) => {
      util.request(api.recommendGoodsOfMy, { pageIndex: 1, pageSize: 3, uid: "U00000000", nid: "N000" }).then(res => {
        console.log("recomment:" + JSON.stringify(res.data.result));
        const cate = res.data.result.map(item => {
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
      util.request(api.hotGoods, { pageIndex: 1, pageSize: 3 }).then(res => {
       _this.setData({
         hotGoods: res.data.result
       })
        resolve(true)
      }).catch(err => reject(err))   
    })   
  }
  
})
