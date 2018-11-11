import util from '../../../utils/util.js'
import api from '../../../api/api.js'
import https from '../../../service/https.js'
let cityAreaNbhd = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SearchVal:"",  
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], 
    cityListId: '',
    city:{},
    area: {},
    nbhd: {},    
    showCity: true,
    showArea: false,
    showNbhd: false,
    choose: false, 
    allCitys: [], 
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
    wx.showLoading({
      title: '加载中',
    })
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
        allCitys: storeAll,      
      })
      wx.hideLoading()
    }else{
      https.get(api.getAllCity).then(res => {
        const data = res
        console.log("city:" + JSON.stringify(data))
        _this.setData({
          allCitys: data
        })
        wx.hideLoading()
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
  // chooseProvince(e){
  //   const {index, pindex} = e.currentTarget.dataset
  //   const list = this.data.allCitys
  //   let prov = list[index].cities
  //   let choose_p = prov[pindex]
  //   const children = choose_p.children
  //   const choose_province = {id:choose_p.id, name: choose_p.namecn}
  //   if(cityAreaNbhd.length > 0) {
  //     cityAreaNbhd = []
  //   }
  //   cityAreaNbhd.push(choose_province)
  //   this.setData({
  //     province: choose_p,
  //     city: {},
  //     area: {},
  //     nbhd: {},
  //     cityList: children || [],
  //     showProvince: children.length <= 0 ? true : false,    
  //     showCity: children.length >= 0 ? true : false,     
  //     choose: true   
  //   })
    
  // }, 
  chooseCity(e){
    const { index, pindex } = e.currentTarget.dataset
    const list = this.data.allCitys
    let city = list[index].cities
    let choose_c = city[pindex]
    const children = choose_c.children
    const choose_city = { id: choose_c.id, name: choose_c.namecn}
    if (cityAreaNbhd.length > 0) {
      cityAreaNbhd = []
    }
    cityAreaNbhd.push(choose_city)
    
    this.setData({
      city: choose_c,
      area: {},
      nbhd: {},
      areaList: children || [],
      showCity: children.length <= 0 ? true : false,
      showArea: children.length >= 0 ? true : false,
      choose: true      
    }) 
     
  },
  chooseArea(e){
    let _this = this
    let index = e.currentTarget.dataset.index
    const list = this.data.city
    const choose_a = list.children[index]  
    const choose_area = { id: choose_a.id, name: choose_a.namecn }
    cityAreaNbhd.push(choose_area) 
    https.get(api.getAreaNeighbor,{
        pi:_this.data.pageIndex, 
        ps: _this.data.pageSize,
        areaid: choose_a.id
      }).then(res => {
        const data = res
        console.log("nbhd:" + JSON.stringify(data))
        _this.setData({
          nbhdList: data || [],
          showArea: false,
          showNbhd: true,
          area: choose_a,
          choose: true      
        })
    })
  },
  chooseNbhd(e){
    let index = e.currentTarget.dataset.index
    let list = this.data.nbhdList
    const choose_n = list[index]
    const choose_nbhd = { id: choose_n.id, name: choose_n.name }
    cityAreaNbhd.push(choose_nbhd) 
    wx.setStorage({
      key: 'areaNbhd',
      data: cityAreaNbhd,
    })
    this.setData({
      nbhd: choose_n
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
        this.setData({
          showCity: true,
          showArea: false,
          city:{},
          area: {},
          nbhd: {},
          showNbhd: false
        })      
      }
      else if (key == 'backArea') {        
        this.setData({          
          showCity:  false,
          showArea:  true ,
          area: {},
          nbhd: {},          
          showNbhd: false
        })
        if(cityAreaNbhd.length > 0){
          cityAreaNbhd.splice(1, 1)
        }
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
