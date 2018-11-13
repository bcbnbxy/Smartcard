const app = getApp()
const baseUrl = 'http://test.fudaojt.com:8080';
const http = ({ url = '', param = {}, ...other } = {}) => {
  wx.showLoading({
    title: '加载中...'
  });
  let timeStart = Date.now();
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      // header: {
      //   'content-type': 'application/json' // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
      // },
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
    method: 'post'
  })
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
  cmsBroadCast: '/cms/broadcast'
} 

export const cmsBroadCast = query => {
  return _get(sendApi.cmsBroadCast, query)
};