/**
 * Created by Administrator on 2017/6/27.
 */
var config = 'http://localhost:3000';
var apis = {
  slideimgs: config + '/slides',
  productsType: config + '/productsType',
  productsRank: config + '/productsRank',
  products: config + '/products',
  userResource: config + '/allUsers',
  checkUserResource: config + '/checkUserResource',
  mobileCodeResource: config + '/mobileCodeResource',
  encyclopedias_type: config + '/encyclopedias_type',
  encyclopedias_other: config + '/encyclopedias_other'
};
var api = {
  getSlideResource() {
    return axios.get( apis.slideimgs)
  },
  getProductsById( typeid, rankid ) {
    return axios.get( apis.allProducts, {
      params: {
        typeid: typeid,
        rankid: rankid
      }
    } )
  },

  /* 获取用户信息 */
  getUser(){
    return axios.get( null, {
      params: {

      }
    } )
  },
  /* 用户名登录 */
  accountLogin( phoneNumber, passWord ){
    return axios.post( apis.userResource, {
      phoneNumber: phoneNumber,
      passWord: passWord
    } )
  },
  /* 短信验证码登录 */
  sendLogin(mobileCode, phoneNumber, validate_token){
    return axios.post( apis.userResource, {
      mobileCode: mobileCode,
      phoneNumber: phoneNumber,
      validate_token: validate_token
    } )
  },
  /* 发送短信验证码 */
  mobileCode(phoneNumber){
    return axios.post( apis.mobileCodeResource, {
      phoneNumber: phoneNumber,
      passWord: passWord
    } )
  },
  /* 检测 */
  checkExists(phoneNumber){
    return axios.get( apis.checkUserResource, {
      phoneNumber: phoneNumber
    } )
  }
};
