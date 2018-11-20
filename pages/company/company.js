// pages/company/company.js
var urls = require('../../common/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().editTabBar();
    const recorderManager = wx.getRecorderManager()
    const innerAudioContext = wx.createInnerAudioContext()

  },
  //开始录音的时候
  start: function() {

    var recorderManager = wx.getRecorderManager()
    var innerAudioContext = wx.createInnerAudioContext()
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //播放声音
  // play: function () {
  //   var recorderManager = wx.getRecorderManager()
  //   var innerAudioContext = wx.createInnerAudioContext()
  //   innerAudioContext.autoplay = true
  //   innerAudioContext.src = this.tempFilePath,
  //     innerAudioContext.onPlay(() => {
  //       console.log('开始播放')
  //     })
  //   innerAudioContext.onError((res) => {
  //     console.log(res.errMsg)
  //     console.log(res.errCode)
  //   })
  // },
  //停止录音
  stop: function() {

    var recorderManager = wx.getRecorderManager()
    var innerAudioContext = wx.createInnerAudioContext()
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      var s = this;
      debugger
      console.log('停止录音', res.tempFilePath)
      setTimeout(function() {
        debugger
        var urls = "http://localhost:8088/file/upload";

        console.log(s.tempFilePath);

        wx.uploadFile({

          url: urls,

          filePath: s.tempFilePath,

          name: 'file',

          header: {

            'content-type': 'multipart/form-data'

          },

          success: function(res) {
            debugger
            var str = res.data;

            var data = JSON.parse(str);

            if (data.states == 1) {

              var cEditData = s.data.editData;

              cEditData.recodeIdentity = data.identitys;

              s.setData({
                editData: cEditData
              });

            } else {

              wx.showModal({

                title: '提示',

                content: data.message,

                showCancel: false,

                success: function(res) {



                }

              });

            }

            wx.hideToast();

          },

          fail: function(res) {

            console.log(res);

            wx.showModal({

              title: '提示',

              content: "网络请求失败，请确保网络是否正常",

              showCancel: false,

              success: function(res) {



              }

            });

            wx.hideToast();

          }

        });

      }, 1000)

    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // startRecode: function() {
  //   var s = this;
  //   debugger
  //   const recorderManager = wx.getRecorderManager()
  //   const options = {
  //         duration: 10000,
  //         sampleRate: 44100,
  //         numberOfChannels: 1,
  //         encodeBitRate: 192000,
  //         format: 'aac',
  //         frameSize: 50
  //       }

  //   recorderManager.start(options)

  //   console.log("start");

  //   wx.startRecord({

  //     success: function(res) {

  //       console.log(res);

  //       var tempFilePath = res.tempFilePath;

  //       s.setData({
  //         recodePath: tempFilePath,
  //         isRecode: true
  //       });

  //     },

  //     fail: function(res) {

  //       console.log("fail");

  //       console.log(res);

  //       //录音失败

  //     }

  //   });

  // },

  // endRecode: function() { //结束录音 

  //   debugger

  //   var s = this;

  //   console.log("end");

  //   wx.stopRecord();

  //   s.setData({
  //     isRecode: false
  //   });





  //   wx.showToast();

  //   setTimeout(function() {
  //     debugger
  //     var urls = "http://localhost:8088/file/upload";

  //     console.log(s.data.recodePath);

  //     wx.uploadFile({

  //       url: urls,

  //       filePath: s.data.recodePath,

  //       name: 'file',

  //       header: {

  //         'content-type': 'multipart/form-data'

  //       },

  //       success: function(res) {
  //         debugger
  //         var str = res.data;

  //         var data = JSON.parse(str);

  //         if (data.states == 1) {

  //           var cEditData = s.data.editData;

  //           cEditData.recodeIdentity = data.identitys;

  //           s.setData({
  //             editData: cEditData
  //           });

  //         } else {

  //           wx.showModal({

  //             title: '提示',

  //             content: data.message,

  //             showCancel: false,

  //             success: function(res) {



  //             }

  //           });

  //         }

  //         wx.hideToast();

  //       },

  //       fail: function(res) {

  //         console.log(res);

  //         wx.showModal({

  //           title: '提示',

  //           content: "网络请求失败，请确保网络是否正常",

  //           showCancel: false,

  //           success: function(res) {



  //           }

  //         });

  //         wx.hideToast();

  //       }

  //     });

  //   }, 1000)



  // }

})