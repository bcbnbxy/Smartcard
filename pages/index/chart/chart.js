// pages/index/chart/chart.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
        choosepictureshow:false,
        cardUser: {}, //卡片拥有人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cardUser: app.globalData.cardUser
    })
    wx.setNavigationBarTitle({
      title: this.data.cardUser
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  choosepicture(){
    this.setData({
      choosepictureshow: !this.data.choosepictureshow
    })
  },
  choice: function () {//选择图片
    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          textHidden: true,
          image_photo: tempFilePaths,
          photoHidden: false
        })
      }
    })
  },
  copyWechatNum(e) { //复制微信号
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: this.data.cardUser.tuser.wechatId ? this.data.cardUser.tuser.wechatId:"",
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  calling: function () { //拨打电话
    wx.makePhoneCall({
      phoneNumber: this.data.cardUser.tuser.userMobile,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }

})