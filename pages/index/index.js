//index.js
//获取应用实例
const app = getApp()
var urls = require('../../common/urls.js')
var util = require('../../utils/util.js')
import { cmsBroadCast } from '../../utils/api.js'
Page({
  data: {
    recommentUserId: "",
    userInfo: {},
    hasUserInfo: false,
    fudoUser: {},
    hasfudoUser: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toggleslide:true,
    maskshow:false,
    maskitem:'',
    headimg:'',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "名片"
    });
   

    var recommentUserId = decodeURIComponent(options.scene)
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        recommentUserId: recommentUserId,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          recommentUserId: recommentUserId,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            recommentUserId: recommentUserId,
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        }
      })
    }
    wx.setNavigationBarTitle({
      title: "名片"
    });
    creaMiniQRCode(this,urls,recommentUserId);
    login(that);
  },
  toggle() {
    this.setData({
      "toggleslide": !this.data.toggleslide
    })
  },
  maskshow(e) {//弹出遮罩层
    var that = this;
    if (e.currentTarget.dataset.item == 1) {
      this.setData({
        "maskitem": e.currentTarget.dataset.item,
        "phonenum": e.currentTarget.dataset.phonenum
      })
    } else if (e.currentTarget.dataset.item == 3) {
      this.setData({
        "maskitem": e.currentTarget.dataset.item,
        "headimg": e.currentTarget.dataset.headimg
      })
    } else if (e.currentTarget.dataset.item == 2) {
      this.setData({
        "maskitem": e.currentTarget.dataset.item,
      })
    }
    wx.hideTabBar({//隐藏底部导航栏
      success: function () {
        that.setData({
          "maskshow": true
        })
      }
    })
  },
  hidemask() {//隐藏遮罩层
    this.setData({
      "maskshow": false
    });
    wx.showTabBar({});
  },
  stopmask() {//阻止事件冒泡

  },
  copy(e) {//复制文本
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.copytext,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  callphone() {//拨打电话
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phonenum  //电话号码
    })
  },
  saveaddresslist() {//存入手机通讯录
    var that = this;
    wx.addPhoneContact({
      "firstName": that.data.peoplename,
      "mobilePhoneNumber": that.data.phonenum
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
    login(this);
  },
  onShareAppMessage: function () {
    return {
      title: '分享我的名片',
      path: '/index/index'
    }
  },



})


/**
 * 登录
 */
function login(that) {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        that.code = res.code;
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  app.globalData.userInfo = res.userInfo
                  if (app.userInfoReadyCallback) {
                    app.userInfoReadyCallback(res)
                  }
                  //根据unionid查找登录用户信息
                  wx.request({
                    url: urls.getUserbyUnionid,
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      'code': that.code,
                      'idrecommendUserid': that.recommentUserId,
                      'userInfo': JSON.stringify(res.userInfo)
                    },
                    method: 'POST',
                    success: function (res) {
                      that.setData({
                        fudoUser: res.data.data,
                        hasfudoUser: true,
                      })
                    },
                    fail: function () {
                    },
                  })

                }
              })
            }
          }
        })


      } else {
        console.log('登录失败！' + res.errMsg)
      }



    }
  })
}

/**
 * 生成小程序二维码
 */
function creaMiniQRCode(that, urls,scene) {
  wx.request({
    url: urls.getAccessToken,
    data: {},
    method: "POST",
    success(res) {
      debugger;
      var access_token = res.data.data;
      debugger
      console.log(access_token)
      var url = util.splitParameter(urls.getWxacodeunlimit, "access_token", access_token);
      // 生成页面的二维码
      wx.request({
        url: url,
        data: {
          scene: scene,
          page: "pages/index/index"
        },
        method: "POST",
        responseType: 'arraybuffer',  //设置响应类型
        success(res) {
          console.log(res) 
          //二维码链接
          var miniQRCodeSrc = wx.arrayBufferToBase64(res.data);  //对数据进行转换操作
          that.setData({
            miniQRCodeSrc: miniQRCodeSrc
          })
        },
        fail(e) {
          console.log(e)
        }
      })


    },
    fail(e) {
      console.log(e)
    }
  })
}
