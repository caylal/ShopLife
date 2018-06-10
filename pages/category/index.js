import util from '../../utils/util.js';
import api from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{ id: "1", name: "热销榜" }, { id: "2", name: "休闲零食" }, { id: "3", name: "饮料酒水" }, { id: "4", name: "生活用品" },{ id: "15", name: "粮油调品" }],
    curId: 1,
    shop: {},
    showNbhd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.goods.list
    });
    // if(JSON.stringify(options) != '{}'){
    //   const obj = { name: "彩虹便利店(中央原著店)", state: 1, time: "07:00 -- 02:00",addr:"深圳市龙华区人民路39号", tel: "0755-123456"}
    //   this.setData({
    //     nbhd: obj,
    //     showNbhd:true
    //   })
    // }
    if (!util.isEmpty(options.itemId)){
      this.showShopInfo(options.itemId)
    }else{
      this.getNavList()
    }
   
  },
  switchRightTab(e){
    let id = e.target.dataset.id;
    this.setData({
      curId: id
    })
  },
  getNavList(){
    let _this = this
    return new Promise((resolve,reject) => {
      util.request(api.getAllCategory).then(res =>{
        console.log("category:" + JSON.stringify(res.data.result))
      })
    })
  },
  showShopInfo(id){
    let _this = this
    const shop = wx.getStorageSync('shopList')
    const item = shop.filter(item => { return item.id === id })
    console.log("item:" + JSON.stringify(item))       
    _this.setData({
      shop: item[0],
      showNbhd:true
    })
    console.log("shop: " + JSON.stringify(this.data.shop))
    util.request(api.getShopGoodCate,{id:id}).then(res => {
      console.log("shopCategory: " + JSON.stringify(res.data.result))
    })
  }  
  
})