
Page({
  data: {
    resultList: [], //搜索结果
    SearchVal: "", //搜索内容
    searchLogShowed: true, //显示搜索记录
    searchGoodShowed: false,
    searchLogList: [], //搜索历史记录，
    searchHotList: ['啤酒', '可乐', "零食", "牛奶", '水果', '槟榔'],
    goods: [{ title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }, { title: "Apple iPad 平板电脑9.7英寸", price: "2899" }]
  },

  // 搜索栏
  onLoad () {
    let _this = this;
    let value = wx.getStorageSync('searchLog');
    _this.setData({
      searchLogList: value || []      
    })
    console.log("history:" + _this.data.searchLogList);
    
  },
  //搜索框输入
  SearchData (e) {
    let _this = this;
    _this.setData({
      SearchVal: e.detail.value
    })
    console.log('SearchData' + _this.data.SearchVal)
  }, 
  //清空搜索框
  SearchClear (e) {
    let _this = this;
    _this.setData({
      SearchVal: ""
    })
  },
 //提交搜索
  SearchConfirm (e) {
    let key = e.target.dataset.key;
    let _this = this;
    if (key == 'back'){
      wx.switchTab({
        url: '../home/index/index',
      })
    } else {
      let searchVal = _this.data.SearchVal;
      let value = wx.getStorageSync('searchLog');
      if(value){
        if (value.indexOf(searchVal) < 0){
          value.unshift(searchVal);          
        }        
      } else {
        value = [];
        value.push(searchVal);        
      } 
      wx.setStorage({
        key: "searchLog",
        data: value,
        success: function () {
          _this.setData({
            searchLogList: value,
            searchGoodShowed: true,
            searchLogShowed: false
          })
        }
      })
      
    }
  },
  //清除搜索记录
  SearchDeleteAll () {
    let _this = this;
    wx.removeStorage({
      key: 'searchLog',
      success: function(res) {
        _this.setData({
          searchLogList: []
        })
      },
    })
  },
  //搜索历史记录
  SearchKeyTap () {   
    this.setData({      
      searchGoodShowed: true,
      searchLogShowed: false
    })
  }

})
