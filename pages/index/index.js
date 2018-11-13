//index.js
//获取应用实例
const app = getApp();
import { cmsBroadCast } from '../../utils/api.js'
Page({  
        data:{
          toggleslide:true,
          maskshow:false,
          maskitem:'',
          headimg:'',
          phonenum:'13782056503',
          peoplename:'左文伟'
        },
        onLoad:function(){                    
          wx.setNavigationBarTitle({
            title: "名片"
          });
          this.getUserInfo();
        },
    toggle(){
        this.setData({
          "toggleslide": !this.data.toggleslide
        })          
    },
    maskshow(e){//弹出遮罩层
      var that=this;
      if (e.currentTarget.dataset.item == 1){
        this.setData({
          "maskitem": e.currentTarget.dataset.item,
          "phonenum": e.currentTarget.dataset.phonenum
        })
      }else if (e.currentTarget.dataset.item==3){
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
        success:function(){
          that.setData({
            "maskshow":true
          })
        }
      })
    },
    hidemask(){//隐藏遮罩层
        this.setData({
          "maskshow":false
        });
      wx.showTabBar({});       
    },
    stopmask(){//阻止事件冒泡
      
    },
    copy(e){//复制文本
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
  callphone(){//拨打电话
    var that=this;
    wx.makePhoneCall({
      phoneNumber:that.data.phonenum  //电话号码
    })
  },
  saveaddresslist(){//存入手机通讯录
    var that=this;
    wx.addPhoneContact({
      "firstName": that.data.peoplename,
      "mobilePhoneNumber": that.data.phonenum
    })
  },
  onShareAppMessage: function () {
    return {
      title: '分享我的名片',
      path: 'pages/index/index'
    }
  },
  getUserInfo(){
    cmsBroadCast().then((res) => {
      // console.log(JSON.stringify(res));
    }) 
  }
})
