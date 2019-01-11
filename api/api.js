const BASE_URL = "https://www.lifenearby.cn:8081/api/";


class Restful {
  constructor(url){
    this.post = BASE_URL + url
    this.delete = BASE_URL + url + '/{id}'
    this.put = BASE_URL + url
    this.get = BASE_URL + url + '/{id}'
    this.query = BASE_URL + url
  }
}


export const Apis = {
  area: { 
    restful: new Restful('area'),  // 获取区域信息
    queryCity: BASE_URL + 'area/city'  // 获取所有城市信息  
   },           
  nbhd: { 
    restful: new Restful('neighbor'),
    queryArea: BASE_URL + 'neighbor/area',   // 获取所在区域的社区列表 参数{pi:1, ps:20,areaid:"A0016"}
    queryLngLat: BASE_URL + 'neighbor/lnglat' // 查询经纬度附近的社区列表
  },
  shop: { 
    queryNbhd: BASE_URL + 'shop/byNbhd',         // 获取所在社区的门店 参数{pageIndex:1, pageSize:10,id:"N000",lng:"22.6348928889",  lat:"114.0321329018"}社区id，经纬度
    goods: new Restful('shop/goods'),        // 获取该门店单个商品信息 参数 {id: "SG0000"} 门店商品id
    queryCate: BASE_URL + 'shop/goods/cate/byShop',   // 获取该门店的商品所有类别 参数 {shop: "S0000"} 门店id
    queryGoodsByCate: BASE_URL + 'shop/goods/byShopAndCate',  // 获取门店该类别的商品 参数{pi:1, ps:10,shop:"S0000",cate:"C0001"}门店id，类别id
    queryGoodsByAddress: BASE_URL + 'shop/byAddressWithGoods',
  },
  cate: {
    queryCate: BASE_URL + 'category/tree',   // 获取所有商品类别
  },
  banner: {
    queryBanner: BASE_URL + 'banner/byNbhd',  // 获取所在社区首页banner 参数{pageIndex: 1,pageSize: 3, id: "N000"} 社区id
  },
  rec: {
    restful: new Restful('recommendGoods'),
    queryOfMy: BASE_URL + 'recommendGoods/my',            // 我的推荐商品 参数{pageIndex: 1, pageSize: 3, uid: "U00000000", nid: "N000"} 用户id，社区id
  },
  hot: {
    restful: new Restful('hotGoods'),
    queryOfNbhd: BASE_URL + 'hotGoods/byNbhd',                // 社区内热卖商品 参数{pi: 1,ps: 3, nbhd: "N000"} 社区id
  },
  cart: {
    restful: new Restful('shoppingcart'),
    queryOfMy: BASE_URL + 'shoppingcart/my',      // 获取我的购物车 参数{pageIndex: 1, pageSize: 3, uid: "U00000000"} 用户id
  },
  goods: {
    restful: new Restful('goods'),
    queryByCate: BASE_URL + 'goods/byCate',                   // 根据类别获取商品信息 参数{pageIndex: 1, pageSize: 20, cate:"C0025"}
  },
  order: {
    restful: new Restful('order'),
    queryOfMy: BASE_URL + 'order/my',                       // 获取我的订单信息参数{pi: 1, ps: 20,uid:} 
  },
  addr: {
    restful: new Restful('address'),
    queryOfMy: BASE_URL + 'address/my',                   // 获取地址信息 参数 {userid: 'U000000001'}  
  },
  auth: {
    login: BASE_URL + 'auth/login/wx',                      // 登录      
    refresh: BASE_URL + 'auth/refresh'
  },
  user: {
    restful: new Restful('user')
  }
}
