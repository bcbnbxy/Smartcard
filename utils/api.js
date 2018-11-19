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
  getUserbyUnionid: '/passport/wxuser/login/cardminiprogram', //根据unionid根据用户信息
  getAccessToken: '/wechatCardmini/getAccessToken', //获取智能名片小程序AccessToken
} 
export const getUserbyUnionid = query => {
  return _post(sendApi.getUserbyUnionid, query)
};
export const getAccessToken = query => {
  return _post(sendApi.getAccessToken, query)
};


export const cmsBroadCast = query => {
  return _get(sendApi.cmsBroadCast, query)
};