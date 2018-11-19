const app = getApp()
const baseUrl = 'http://192.168.0.181:8088';
const http = ({ url = '', param = {}, ...other } = {}) => {
  wx.showLoading({
    title: '加载中...'
  });
  let timeStart = Date.now();
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      ...other,
      complete: (res) => {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url;
  }
  return url
}
// get方法
const _get = (url, param = {}) => {
  return http({
    url,
    param             
  }).then(res => res.data)
    .catch(err => console.log(err))
}

const _post = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post',
    header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
      },
  }).then(res => res.data)
    .catch(err => console.log(err))
}

const _put = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}

const _delete = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}
const sendApi={
  cmsBroadCast: '/cms/broadcast',
  getUserMessage: '/passport/wxuser/login/cardminiprogram', //注册|获取访客用户信息
  getAccessToken: '/wechatCardmini/getAccessToken', //获取智能名片小程序AccessToken
  getRecommentUserIdAndCardUserId: '/passport/wxuser/getRecommentUserIdAndCardUserId', //直接搜索智能名片小程序进入名片的用户根据用户信息确定recommentUserId和cardUserId
  getCardOwnerInfo: '/passport/wxuser/getCardOwnerInfo', //智能名片小程序获得卡片拥有者信息
} 
export const getUserMessage = query => {
  return _post(sendApi.getUserMessage, query)
};
export const getAccessToken = query => {
  return _post(sendApi.getAccessToken, query)
};

export const cmsBroadCast = query => {
  return _get(sendApi.cmsBroadCast, query)
};

export const getRecommentUserIdAndCardUserId = query => {
  return _post(sendApi.getRecommentUserIdAndCardUserId, query)
};

export const getCardOwnerInfo = query => {
  return _post(sendApi.getCardOwnerInfo, query)
};