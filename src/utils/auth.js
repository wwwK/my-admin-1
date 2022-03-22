import Cookies from 'js-cookie'

const TokenKey = 'vaa_admin'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getUserInfo(){
  let userInfo = Cookies.get('userInfo');
  return JSON.parse(userInfo)
}
