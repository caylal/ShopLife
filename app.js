//app.js
import util from 'utils/util.js'
import user from 'service/user.js'

App({
  onLaunch: function () { 

    // 登录
    user.checkLogin().then(res => {
      console.log('app login')
      this.globalData.userInfo = wx.getStorageSync('userInfo');  
      if(this.userInfoCallback){
        this.userInfoCallback(wx.getStorageSync('userInfo'))
      }       
    }).catch(() => {
      // wx.navigateTo({
      //   url: "/pages/authorize/index"
      // })          
    });  
      
  },
  globalData: {
    userInfo: null,
    Nbhd: null,
    location:null,    
    token: null ,
    wx: null
  }
})