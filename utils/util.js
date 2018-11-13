const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

module.exports.splitParameter=function(aUrl, key, value) {
  // return aUrl.indexOf('?') > -1 ? aUrl + '&' + key + '=' + value : aUrl + '?' + key + '=' + value;
  // url1或url2里如果有$，再根据是否有参数做处理
  if (aUrl.indexOf('$') > -1) {
    if (aUrl.indexOf('=') > -1) {
      return aUrl + '&' + key + '=' + value;
    }
    else {
      return aUrl + key + '=' + value;
    }
  }
  if (aUrl.indexOf('?') > -1) {
    return aUrl + '&' + key + '=' + value;
  }
  if (aUrl.indexOf('$') === -1 && aUrl.indexOf('?') === -1) {
    return aUrl + '?' + key + '=' + value;
  }
 }
