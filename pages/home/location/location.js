import util from '../../../utils/util.js'
import api from '../../../api/api.js'

const cityAreaNbhd = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
    area: '',
    nbhd: '',
    showCity: true,
    showArea: false,
    showNbhd: false,   
    cityList: [],
    areaList: [],
    nbhdList: [],   
    showCity: true,
    showArea: false,
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
        city: areaNbhd.city.name,
        area: areaNbhd.area.name,
        nbhd: areaNbhd.nbhd.name
      })
    }
    this.getAllCity()
  },
  getAllCity(){
    let _this = this
    util.request(api.getAllCity).then(res => {
      const data = res.data.result
      console.log("city:" + JSON.stringify(data))
      _this.setData({
        cityList: data
      })
      const cites =[]
      data.forEach(item => {
        item.cities.forEach(val => cites.push(val)) 
      })
      console.log("cities:" + JSON.stringify(cites))
      wx.setStorage({
        key: 'allCitys',
        data: cites,
      })

     
    })
  }, 
  chooseCity(e){
    let cityId = e.currentTarget.dataset.cityid
    const cities = wx.getStorageSync('allCitys')
    const areas = cities.filter(item => { return item.id == cityId})
    console.log("areas:" + JSON.stringify(areas))
    const children = areas[0].children
    cityAreaNbhd["city"] = {cid:cityId,name:areas[0].namecn}
    this.setData({
      city: areas[0].namecn,
      areaList: children || [],
      showCity: children.length <= 0 ? true : false,
      showArea: children.length >= 0 ? true : false,      
    }) 
     
  },
  chooseArea(e){
    let areaId = e.currentTarget.dataset.areaid
    let areaName = e.currentTarget.dataset.areaname    
    let _this = this
    cityAreaNbhd["area"] = { aid: areaId, name: areaName}   
    util.request(api.getAreaNeighbor,{
        pageIndex:_this.data.pageIndex, 
        pageSize: _this.data.pageSize,
        id: areaId
      }).then(res => {
        const data = res.data.result
        console.log("nbhd:" + JSON.stringify(data))
        _this.setData({
          nbhdList: data || [],
          showArea: false,
          area: areaName         
        })
    })
  },
  chooseNbhd(e){
    let nbhdId = e.currentTarget.dataset.nbhdid
    let nbhdName = e.currentTarget.dataset.nbhdname
    cityAreaNbhd["nbhd"] = {nid:nbhdId, name:nbhdName}
    wx.setStorage({
      key: 'areaNbhd',
      data: cityAreaNbhd,
    })
    this.setData({
      nbhd: nbhdName
    })
    wx.switchTab({
      url: '../index/index',
    })
  },
  choosed(){
    wx.switchTab({
      url: '../index/index',
    })
  }
})