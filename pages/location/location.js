import util from '../../utils/util.js'
import { Apis } from '../../api/api.js'
import https from '../../service/https.js'
import { logFactory } from '../../utils/log/logFactory.js'
const log = logFactory.get("Location")
const app = getApp()
let cityAreaNbhd = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIndex: true,
    nearestNbhd: [],
    isShowLetter: false,
    showLetter: "",
    SearchVal: "",
    letter: [],
    winHeight: 0,
    scrollTop: 0,
    city: {},
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
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.nbhd.list
    });
    wx.showLoading({
      title: '加载中',
    })
   
    if (options && !util.isEmpty(options.index)) {
      this.setData({       
        isIndex: false
      })  
      this.getAllCity()           
      const areaNbhd = wx.getStorageSync('areaNbhd')
      if (areaNbhd.length > 0) {
        this.setData({
          city: areaNbhd[0],
          area: areaNbhd[1],
          nbhd: areaNbhd[2]
        })
      }      
    } else {
      if(app.globalData.userInfo){
        this.getLocation()
      }else{
        if(!util.isEmpty(wx.getStorageSync("userInfo"))){
          app.userInfoCallback = userInfo => {
            log.log('app.userInfo: ' , userInfo)
            if(!util.isEmpty(userInfo)){
              this.getLocation()
            } 
          }     
        } else {
          wx.navigateTo({
            url: "/pages/authorize/index"
          })
        }
       
      }
    }
  },
  onShow() {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    if (!util.isEmpty(currPage.data.back)) {
      this.onLoad();
    }
  }, 
  getLocation() {
    let _this = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.setStorage({
          key: 'location',
          data: {"lng": longitude, "lat": latitude}
        })
        app.globalData.location = { "lng": longitude,"lat": latitude }
        https.get(Apis.nbhd.queryLngLat, {
          pi: 1,
          ps: 20,
          lng: longitude,
          lat: latitude,
          dis: 20
        }).then(res => {
          if (res) {
            let data = res.map(item => {
              return {
                id: item.id,
                name: item.name,
                areaid: item.areaid,
                distance: util.transDistance(item.distance)
              } 
            })
            log.log("locamap: ", data)
            _this.setData({
              nearestNbhd: data
            })
            wx.setStorage({
              key: 'nearestNbhd',
              data: res,
            })
            wx.hideLoading()
          } else {
            log.log(util.getPageUrl() + "无数据", res)
          }
        })
      }
    })
  },
  getNbhd(e) {
    let { id,areaid, name }= e.currentTarget.dataset
    https.get(Apis.area.restful.query, { id: areaid }).then(res => {
      log.log(util.getPageUrl() + " 当前区域: ", res)
      let city = []
      let c = res[0].hierarchy.split('|')
      let n = res[0].hierarchyname.split('|')
      city.push({id: c[1], name: n[1]})
      city.push({id: c[2], name: n[2]})
      city.push({id: id, name: name})
      wx.setStorage({
        key: 'areaNbhd',
        data: city,
      })
      app.globalData.Nbhd = city       
      wx.switchTab({
        url: '/pages/index/index',
      })  
      // wx.redirectTo({
      //   url: '/pages/welcome/index',
      // })
    })
    
  },
  // 重新选择社区开始
  getAllCity(isback) {
    let sysInfo = wx.getSystemInfoSync();
    log.log(util.getPageUrl() + " 系统信息：", sysInfo)

    let winHeight = sysInfo.windowHeight;
    log.log(util.getPageUrl() + " 窗口高度：", winHeight)
      
    let _this = this
    const storeAll = wx.getStorageSync('allCityMap')    
    if (storeAll) {
      log.log(util.getPageUrl() + " allCityMap: ", storeAll)
      const letter = getLetter(storeAll)
      let itemH = (winHeight - 45) / letter.length
      console.log(itemH)
      console.time("渲染计时")
      _this.setData({
        allCitys: storeAll,
        winHeight: winHeight,
        letter: letter,
        itemH: itemH
      })
      wx.hideLoading()
      console.timeEnd("渲染计时")
    } else {
      https.get(Apis.area.queryCity).then(res => {
        if(!util.isEmpty(res)) {
          const data = res
          log.log(util.getPageUrl() + " city: ", data)
          const letter = getLetter(data)
          let itemH = (winHeight - 45) / letter.length
          wx.setStorage({
            key: 'allCitys',
            data: data,
          })
          const map_data = mapCity(data)  // 简化数据，解决渲染慢的问题
          _this.setData({
            allCitys: map_data,
            winHeight: winHeight,
            letter: letter,
            itemH: itemH
          })
          wx.hideLoading()
          wx.setStorage({
            key: 'allCityMap',
            data: map_data,
          })
        } else {
          log.log(util.getCurrentPages() + "city无数据：", res)
        }
      })
    }
    if (isback) {
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
  chooseCity(e) {
    const { index, pindex } = e.currentTarget.dataset
    const list = wx.getStorageSync('allCitys')
    let city = list[index].cities
    let choose_c = city[pindex]
    const children = choose_c.children
    const choose_city = {
      id: choose_c.id,
      name: choose_c.namecn
    }
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
  chooseArea(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    const list = this.data.city
    const choose_a = list.children[index]
    const choose_area = {
      id: choose_a.id,
      name: choose_a.namecn
    }
    cityAreaNbhd.push(choose_area)
    https.get(Apis.nbhd.queryArea, {
      pi: _this.data.pageIndex,
      ps: _this.data.pageSize,
      areaid: choose_a.id
    }).then(res => {
      const data = res
      log.log(util.getPageUrl() + " nbhd: ", data)
      _this.setData({
        nbhdList: data || [],
        showArea: false,
        showNbhd: true,
        area: choose_a,
        choose: true
      })
    })
  },
  chooseNbhd(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.nbhdList
    const choose_n = list[index]
    const choose_nbhd = {
      id: choose_n.id,
      name: choose_n.name
    }
    cityAreaNbhd.push(choose_nbhd)
    wx.setStorage({
      key: 'areaNbhd',
      data: cityAreaNbhd,
    })
    app.globalData.Nbhd = cityAreaNbhd
    this.setData({
      nbhd: choose_n
    })
    let pages = getCurrentPages() // 获取当前页面
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      load: true
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  choosed() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  backChoose(e) {
    if (this.data.choose) {
      let key = e.target.dataset.key
      let id = e.target.dataset.id
      if (key == 'backCity') {
        this.setData({
          showCity: true,
          showArea: false,
          city: {},
          area: {},
          nbhd: {},
          showNbhd: false
        })
      } else if (key == 'backArea') {
        this.setData({
          showCity: false,
          showArea: true,
          area: {},
          nbhd: {},
          showNbhd: false
        })
        if (cityAreaNbhd.length > 0) {
          cityAreaNbhd.splice(1, 1)
        }
      } else {

      }
    }
    return false

  },
  bindScroll: function (e) {
    log.log(util.getPageUrl() + " ", e.detail)
  },
  searchStart(e) {
    let item = e.currentTarget.dataset.item
    let pageY = e.touches[0].pageY
    log.log("letter: " + item + " pageY: " + pageY, [])
    this.setScrollTop(this, item)
    this.setData({
      showLetter: item,
      isShowLetter: true,
    })
  },
  searchEnd(e){
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  setScrollTop(that, item) {
    let scrollTop = 0;
    const city = that.data.allCitys
    let cityCount = 0;
    let initialCount = 0
    for (let i = 0; i < city.length; i++) {
      if (item === city[i].forShort) {
        scrollTop = initialCount * 25 + cityCount * 41;
        break;
      } else {
        initialCount++;
        cityCount += city[i].cities.length;
      }
    }
    that.setData({
      scrollTop: scrollTop
    })
  },
  // 重新选择社区结束
  //搜索框输入
  SearchData(e) {
    let _this = this;
    _this.setData({
      SearchVal: e.detail.value
    })
    log.log(util.getPageUrl() + ' SearchData: ', _this.data.SearchVal)
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
        url: '/pages/index/index',
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

const getStoreOfCity = id => {
  const data = wx.getStorageSync('allCitys')
  const cites = []
  data.forEach(item => {
    item.cities.forEach(val => cites.push(val))
  })
  log.log(util.getPageUrl() + " cities: ", cites)
  return cites.filter(item => {
    return item.id == id
  })
}

const getLetter = (data) => {
  let tempObj = []
  for (let i = 0; i < data.length; i++) {
    tempObj.push(data[i].forShort)
  }
  return tempObj
}
const mapCity = (data) => {
  for (let i = 0; i < data.length; i++) {
    data[i].cities = data[i].cities.map(item => {
      return {
        id: item.id,
        namecn: item.namecn
      }
    })
  }
  return data
}