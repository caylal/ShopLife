//index.js
//获取应用实例
import util from '../../../utils/util.js'
import api from '../../../api/api.js'
const app = getApp()
const indexGoods = []
const goodList = { id: 1, title: "商品上门", color: "#76e3ee", goodsItem: [] }
const washList = { id: 2, title: "洗护上门", color: "#f4aaaa", goodsItem: [{ tag: "推荐洗护", icon: "tuijianshangjia", items: [{ id: "12da", goodsid: "12345", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }, { id: "56fdf", goodsid: "fd355", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }, { id: "78fgdh", goodsid: "g6743e", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }] }, { tag: "热卖洗护", icon: "rexiaochanpin", items: [{ id: "12243da", goodsid: "fdsg464", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }, { id: "hffj565", goodsid: "gh4673", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }, { id: "eryfdvs", goodsid: "jj5434", name: "Apple iPad 平板电脑9.7英寸", retailprice: "2899", img: "../../../images/orange.png" }] }] }
const imgUrl = [
  'http://img.ithome.com/newsuploadfiles/focus/81c82dc3-ce78-47bc-9860-4ab4e60e61aa.jpg',
  'http://img.ithome.com/newsuploadfiles/focus/d1695f8b-4da3-4b0f-9808-47e229bec851.jpg',
  'http://img.ithome.com/newsuploadfiles/focus/00861095-32e2-42bb-9568-12c664941bc9.jpg',
  'http://img.ithome.com/newsuploadfiles/focus/d167fd30-f5ce-44b1-ab2d-acd1a22d7ef1.jpg'
];
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
    category: [] 
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
    this.getIndexBanner()
    this.getIndexRecomment(); 
  },
  getIndexBanner(){
    let _this = this
    util.request(api.bannerOfnbhd,{pageIndex: 1,pageSize: 3, id: "N000"}).then(res => {
       console.log("result:" + JSON.stringify(res.data.result))
        _this.setData({
          imagesUrl: res.data.result
        })
       
      
    }).catch(err => console.log(err))
    wx.hideLoading()
  },
   getIndexRecomment(){
    let _this = this
    util.request(api.recommendGoodsOfMy, { pageIndex: 1, pageSize: 3, uid: "U00000000", nid: "N000"}).then(res => {
      console.log("recomment:" + JSON.stringify(res.data.result));
      const cate = { tag: "推荐商品", icon: "tuijianshangjia", items: [] }
      cate.items = res.data.result
      goodList.goodsItem.push(cate)
    }).catch(err => console.log(err))

    util.request(api.hotGoods, {pageIndex: 1, pageSize: 3}).then(res => {
      console.log("HotGoods:" + JSON.stringify(res.data.result))
      const good = {tag: "热卖商品", icon: "rexiaochanpin", items: []}
      good.items = res.data.result
      goodList.goodsItem.push(good)
     
    }).catch(err => console.log(err))
  
   indexGoods.push(goodList)
   indexGoods.push(washList)
   console.log(indexGoods);
   _this.setData({
     category: indexGoods,
    })
  },

  
})
