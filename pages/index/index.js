//index.js
//获取应用实例
const app = getApp()
var urls = require('../../common/urls.js')
var util = require('../../utils/util.js')
import {
  cmsBroadCast,
  getUserMessage,
  getAccessToken,
  getWxacodeunlimit,
  getRecommentUserIdAndCardUserId,
  getCardOwnerInfo
} from '../../utils/api.js'
Page({
  data: {
    recommentUserId: "",
    cardUserId: "",
    userInfo: {},
    hasUserInfo: false,
    fudoUser: {}, //访客
    cardUser: {}, //卡片拥有人
    audio: {
      playState: false,
      src: '',
      currentTime: '00:00',
      duration: '00:00',
      title:'我的语音介绍',
      progressWidth:0
    },
    hasfudoUser: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toggleslide: true,
    maskshow: false,
    maskitem: '',
    headimg: '',
  },
  onShow: function () {
    app.editTabBar();    //显示自定义的底部导航
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "名片"
    });
    var that = this;
    var cardUserId = "";
    if (options != null && options != undefined && options.scene) {
      //小程序码方式进来
      cardUserId = options.scene;
      this.setData({
        recommentUserId: cardUserId,
        cardUserId: cardUserId,
      })
    } else if (options != null && options != undefined &&
      options.cardUserId != null && options.cardUserId > 0) {
      //分享名片页面方式进来
      cardUserId = options.cardUserId;
      this.setData({
        recommentUserId: cardUserId,
        cardUserId: cardUserId,
      })
    } else {
      //1.直接搜索小程序进来的，如果是未注册用户或已注册的没有卡片权限的普通用户，首页显示小福的名片，如果是拥有卡片权限的人直接显示其名片信息。
      //2.在获取访客信息时，如果是未注册用户，注册时推荐人为小福。recommentid = 0;
      this.setData({
        recommentUserId: "",
        cardUserId: "",
      })
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        }
      })
    }
    login(that);
  },
  toggle() {
    this.setData({
      "toggleslide": !this.data.toggleslide
    })
  },
  maskshow(e) { //弹出遮罩层
    this.setData({
        maskitem: e.currentTarget.dataset.item,
        maskshow:true
      })
  },
  hidemask() { //隐藏遮罩层
    this.setData({
      "maskshow": false
    });
    wx.showTabBar({});
  },
  stopmask() { //阻止事件冒泡

  },
  copy(e) { //复制文本
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.copytext,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  callphone(e) { //拨打电话
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenum //电话号码
    })
  },
  saveaddresslist() { //存入手机通讯录
    var that = this;
    wx.addPhoneContact({
      "firstName": that.data.cardUser.tuser.name,
      "mobilePhoneNumber": that.data.cardUser.tuser.contactMobile
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
    login(this);
  },
  onShareAppMessage: function() {
    return {
      title: '分享我的名片',
      path: 'pages/index/index?cardUserId=' + this.data.cardUserId
    }
  },
  playFun(){//播放音频
    var that=this;
    this.audioCtx.play();
    this.setData({
      ['audio.playState']: true
    });
    setTimeout(() => {
      this.audioCtx.currentTime;
      this.audioCtx.onTimeUpdate(() => {
        let duration = this.audioCtx.duration
        let currentTime = this.audioCtx.currentTime;
        let str =parseInt(currentTime); // currentTime.toFixed(0)
        let minute = parseInt(str / 60);
        let second = parseInt(str % 60);
        if (minute > 0 && minute < 60) {
          that.setData({
            ['audio.currentTime']: (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
          })
        } else {
          if (second < 10 && second > 0) {
            that.setData({
              ['audio.currentTime']: '00:' + '0' + second
            })
          } else if (second <= 0) {
            that.setData({
              ['audio.currentTime']: '00:00'
            })
          } else {
            that.setData({
              ['audio.currentTime']: '00:' + second
            })
          }
        }
        let d = 100 * currentTime / duration;
        d = d.toFixed(1) > 100 ? 100 : d.toFixed(1);
        this.setData({
          ['audio.progressWidth']: d
        });        
      })
      this.audioCtx.onEnded(() => {
        this.setData({
          ['audio.playState']: false
        });
      })
    },0)    
  },
  paushFun() {//暂停音频
    this.audioCtx.pause();
    this.setData({
      ['audio.playState']:false
    })
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
                  if (that.data.recommentUserId == "" && that.data.cardUserId == "") {
                    //直接搜索智能名片小程序进入名片的访客根据访客信息确定recommentUserId和cardUserId
                    getRecommentUserIdAndCardUserId({
                      js_code: that.code
                    }).then((res) => {
                      var unionid = res.unionid;
                      var openid = res.openid;
                      that.setData({
                        recommentUserId: res.recommentUserId,
                        cardUserId: res.cardUserId,
                      })
                      //获取cardUser和fudaoUser信息
                      getcardUserAndfudaoUserInfo(that, unionid, openid);
                    }).catch(err => console.log(err));

                  } else {
                    //从小程序码或名片方式进入的访客
                    //获取cardUser和fudaoUser信息
                    getcardUserAndfudaoUserInfo(that);
                   
                  }
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

function getcardUserAndfudaoUserInfo(that,unionid, openid) {
 
  //获取卡片拥有者信息
  getCardOwnerInfo({
    cardUserId: that.data.cardUserId
  }).then((res) => {
    that.setData({
      cardUser: res,
      ['audio.src']:res.cardUser.voice
    })
    app.globalData.cardUser = res;
    audioSettings(that);
    //注册|获取访客用户信息
    getUserMessage({
      recommendUserid: that.data.recommentUserId,
      code: that.code,
      userInfo: JSON.stringify(app.globalData.userInfo),
      unionid: unionid,
      openid: openid
    }).then((res) => {
      that.setData({
        fudoUser: res,
        hasfudoUser: true,
      })
      app.globalData.fudoUser = res;
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
}


/**
 * 生成小程序二维码
 */
function creaMiniQRCode(that, urls, scene) {
  //先获取access_token
  getAccessToken().then((res) => {
    var access_token = res;
    var url = util.splitParameter(urls.getWxacodeunlimit, "access_token", access_token);
    // 生成页面的二维码
    wx.request({
      url: url,
      data: {
        scene: that.data.cardUserId,
        page: "pages/index/index"
      },
      method: "POST",
      responseType: 'arraybuffer', //设置响应类型
      success(res) {
        //二维码链接
        var miniQRCodeSrc = wx.arrayBufferToBase64(res.data); //对数据进行转换操作
        console.log(miniQRCodeSrc);
        that.setData({
          miniQRCodeSrc: miniQRCodeSrc
        })
      },
      fail(e) {
        console.log(e)
      }
    })

  }).catch(err => console.log(err));
}


/**
 * 音频相关设置
 * 
 */
function audioSettings(that) {
 
  that.audioCtx = wx.createInnerAudioContext();
  that.audioCtx.src = that.data.audio.src;
  that.audioCtx.play();
  setTimeout(() => {
    that.audioCtx.duration;
    that.audioCtx.onTimeUpdate((res) => {
      that.audioCtx.pause();
      let duration = that.audioCtx.duration
      let str = parseInt(duration); // currentTime.toFixed(0)
      let minute = parseInt(str / 60);
      let second = parseInt(str % 60);
      if (minute > 0 && minute < 60) {
        that.setData({
          ['audio.duration']: (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
        })
      } else {
        if (second < 10 && second > 0) {
          that.setData({
            ['audio.duration']: '00:' + '0' + second
          })
        } else if (second <= 0) {
          that.setData({
            ['audio.duration']: '00:00'
          })
        } else {
          that.setData({
            ['audio.duration']: '00:' + second
          })
        }
      }
      that.audioCtx.offTimeUpdate();
    })
  }, 0)
}