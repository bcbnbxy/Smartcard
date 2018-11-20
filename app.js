//app.js
App({
  globalData: {
    version: "1.0",
    product: "fudao-mini-program",
     userInfo: null,
     fudoUser: null,
     cardUser:null,
     tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "text": "名片",
          "iconPath": "/images/index/index.png",
          "selectedIconPath": "/images/index/indexactive.png",
          "clas": "menu-item",
          "selectedColor": "#1AAD19",
          active: true
        },
        {
          "pagePath": "/pages/mall/mallindex",
          "text": "商城",
          "iconPath": "/images/index/markt.png",
          "selectedIconPath": "/images/index/marktactive.png",
          "selectedColor": "#1AAD19",
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/pages/student/student",
          "text": "学员分享",
          "iconPath": "/images/index/student.png",
          "selectedIconPath": "/images/index/studentshare.png",
          "selectedColor": "#1AAD19",
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/pages/company/company",
          "text": "公司介绍",
          "iconPath": "/images/index/company.png",
          "selectedIconPath": "/images/index/companyactive.png",
          "selectedColor": "#1AAD19",
          "clas": "menu-item",
          active: false
        }
      ],
      "position": "bottom"
    },
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    wx.setStorageSync('logs', logs);
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log(JSON.stringify(res));
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  editTabBar: function () {
    //使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。
    var curPageArr = getCurrentPages();    //获取加载的页面
    var curPage = curPageArr[curPageArr.length - 1];    //获取当前页面的对象
    var pagePath = curPage.route;    //当前页面url
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true;    //根据页面地址设置当前页面状态    
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  }
})

