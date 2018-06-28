import util from '../../../utils/util.js'
import api from '../../../api/api.js'

let cityAreaNbhd = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SearchVal:"",
    city:{},
    area: {},
    nbhd: {},
    showCity: true,
    showArea: false,
    showNbhd: false,
    choose: false,     
    cityList: [],
    areaList: [],
    nbhdList: [], 
    pageIndex: 1,
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.nbhd.list
    });
    const areaNbhd = wx.getStorageSync('areaNbhd')
    if(areaNbhd.length > 0){
      this.setData({
        city: areaNbhd[0],
        area: areaNbhd[1],
        nbhd: areaNbhd[2]
      })
    }
    this.getAllCity()
  },
  getAllCity(isback){
    let _this = this
    const storeAll = wx.getStorageSync('allCitys')
    if(storeAll){
      _this.setData({
        cityList: storeAll,      
      })
    }else{
      util.request(api.getAllCity).then(res => {
        const data = res
        console.log("city:" + JSON.stringify(data))
        _this.setData({
          cityList: data
        })
        wx.setStorage({
          key: 'allCitys',
          data: data,
        })
      })
    }
    if(isback){
      _this.setData({
        city: {},
        area: {},
        nbhd: {},
        showCity: true,
        showArea: false,
        showNbhd: false,
      })
    }
   
  }, 
  chooseCity(e){
    let cityId = e.currentTarget.dataset.cityid
    const areas = getStoreOfCity(cityId)
    console.log("areas:" + JSON.stringify(areas))
    const children = areas[0].children
    const choose_city = { id: cityId, name: areas[0].namecn }
    if(cityAreaNbhd.length > 0) {
      cityAreaNbhd = []
    }
    cityAreaNbhd.push(choose_city)
    this.setData({
      city: choose_city,
      area: {},
      nbhd: {},
      areaList: children || [],
      showCity: children.length <= 0 ? true : false,
      showArea: children.length >= 0 ? true : false,
      choose: true      
    }) 
     
  },
  chooseArea(e){
    let areaId = e.currentTarget.dataset.areaid
    let areaName = e.currentTarget.dataset.areaname    
    let _this = this
    const choose_area = { id: areaId, name: areaName }
    cityAreaNbhd.push(choose_area) 
    util.request(api.getAreaNeighbor,{
        pageIndex:_this.data.pageIndex, 
        pageSize: _this.data.pageSize,
        id: areaId
      }).then(res => {
        const data = res
        console.log("nbhd:" + JSON.stringify(data))
        _this.setData({
          nbhdList: data || [],
          showArea: false,
          showNbhd: true,
          area: choose_area    
        })
    })
  },
  chooseNbhd(e){
    let nbhdId = e.currentTarget.dataset.nbhdid
    let nbhdName = e.currentTarget.dataset.nbhdname
    const choose_nbhd = { id: nbhdId, name: nbhdName }
    cityAreaNbhd.push(choose_nbhd)
    wx.setStorage({
      key: 'areaNbhd',
      data: cityAreaNbhd,
    })
    this.setData({
      nbhd: choose_nbhd
    })
    wx.switchTab({
      url: '../index/index',
    })
  },
  choosed(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  backChoose(e){
    if(this.data.choose){
      let key = e.target.dataset.key
      let id = e.target.dataset.id
      if (key == 'backCity') {
        this.getAllCity(true)
      } else if (key == 'backArea') {
        const areas = getStoreOfCity(id)
        this.setData({
          areaList: areas[0].children || [],
          showCity: areas[0].children.length <= 0 ? true : false,
          showArea: areas[0].children.length >= 0 ? true : false,
          area: {},
          showNbhd: false
        })
        cityAreaNbhd.splice(1,2)
      } else {

      }
    }
    return false
   
  },
   //搜索框输入
  SearchData(e){
    let _this = this;
    _this.setData({
      SearchVal: e.detail.value
    })
    console.log('SearchData' + _this.data.SearchVal)
  },
  //清空搜索框
  SearchClear(e) {
    let _this = this;
    _this.setData({
      SearchVal: ""
    })
  },
  //提交搜索
  SearchConfirm(e) {
    let key = e.target.dataset.key;
    let _this = this;
    if (key == 'back') {
      wx.switchTab({
        url: '../index/index',
      })
    } else {     

    }
  },
  //清除搜索记录
  SearchDeleteAll() {
    
  },
  //搜索历史记录
  SearchKeyTap() {
    
  }
})

const getStoreOfCity = id =>{
  const data = wx.getStorageSync('allCitys')
  const cites = []
  data.forEach(item => {
    item.cities.forEach(val => cites.push(val))
  })
  console.log("cities:" + JSON.stringify(cites))
  return cites.filter(item => { return item.id == id })
}
