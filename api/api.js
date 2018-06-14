const BASE_URL = "http://www.lifenearby.cn:8081/api/";

module.exports = {
  getAllCity: BASE_URL + 'area/query/city',                        // 获取所有城市信息
  getAllArea: BASE_URL + 'area/all',                               // 获取所有区域 

  getAllNeighbor: BASE_URL + 'neighbor/all',                       // 获取所有社区列表
  getNeighborQuery: BASE_URL + 'neighbor/query',                   // 分页获取社区列表  参数{pageIndex, pageSize}
  getAreaNeighbor: BASE_URL + 'neighbor/query/area',               // 获取所在区域的社区列表 参数{pageIndex:1, pageSize:20,id:"A0016"}

  getAllShop: BASE_URL + 'shop/all',                               // 获取所有门店
  getShopQuery: BASE_URL + 'shop/query',                           // 分页获取门店 参数{pageIndex:1, pageSize:20}
  getAreaShop: BASE_URL + 'shop/query/area',                       // 获取所在区域的门店 参数{pageIndex:1, pageSize:20,id:"A0016"} 区域id
  getNeighborShop: BASE_URL + 'shop/query/nbhd',                   // 获取所在社区的门店 参数{pageIndex:1, pageSize:10,id:"N000",lng:"22.6348928889", lat:"114.0321329018"}社区id，经纬度
  getAllShopGoods: BASE_URL + 'shop/goods/all',                    // 获取该门店所有商品信息
  getShopGood: BASE_URL + 'shop/goods/get',                        // 获取该门店单个商品信息 参数 {id: "SG0000"} 门店商品id
  getShopGoodAll: BASE_URL + 'shop/goods/cate/all',                // 获取该门店的商品所有类别 参数 {id: "S0000"} 门店id
  getShopGoodsByCate: BASE_URL + 'shop/goods/query/cate',           // 获取门店该类别的商品 参数{pageIndex:1, pageSize:10,shopid:"S0000",cateid:"C0001"}门店id，类别id
  
  getAllCategory: BASE_URL + 'category/All',                       // 获取所有商品类别

  getAllBanner: BASE_URL + 'banner/all',                           // 获取所有banner
  getBannerQuery: BASE_URL + 'banner/query',                       // 分页获取banner 参数{pageIndex,pageSize}
  getBannerOfnbhd: BASE_URL + 'banner/query/nbhd',                 // 获取所在社区首页banner 参数{pageIndex: 1,pageSize: 3, id: "N000"} 社区id

  getRecommendGoodOfMy: BASE_URL + 'recommendGoods/query/my',      // 我的推荐商品 参数{pageIndex: 1, pageSize: 3, uid: "U00000000", nid: "N000"} 用户id，社区id
  getRecommendGood: BASE_URL + 'recommendGoods/get',               // 获取单个推荐商品信息，参数 {id:"RG2018052800003"}
  getAllRecommendGoods: BASE_URL + '/recommendGoods/all',          // 获取所有推荐商品信息
  getRecommenGoodQuery: BASE_URL + 'recommendGoods/query',         // 分页获取推荐商品 参数{pageIndex,pageSize}
 
  getHotGoodsOfNbhd: BASE_URL + 'hotGoods/query/nbhd',             // 社区内热卖商品 参数{pageIndex: 1,pageSize: 3, neighborhood: "N000"} 社区id
  getHotGoodQuery: BASE_URL + 'hotGoods/query',                    // 分页获取热卖商品 参数 { pageIndex: 1, pageSize: 3 }
  getAllHotGoods: BASE_URL + 'hotGoods/all',                       // 获取所有热卖商品信息
  getHotGood: BASE_URL + 'hotGoods/get',                           // 获取单个热卖商品信息，参数 {id: "HG2018052800000"}

  getAllCart: BASE_URL + 'shoppingcart/all',                       // 获取所有购物车
  getCartQuery: BASE_URL + 'shoppingcart/query',                   // 分页获取购物车 参数{pageIndex,pageSize}
  getCartOfMy: BASE_URL + 'shoppingcart/query/my',                 // 获取我的购物车 参数{pageIndex: 1, pageSize: 3, uid: "U00000000"} 用户id

  getAllGoods: BASE_URL + 'goods/all',                             // 获取所有商品列表
  getGood: BASE_URL + 'goods/get',                                 // 获取单个商品信息 参数{id:"G0000"}
  getGoodQuery: BASE_URL + 'goods/query',                          // 分页获取商品 参数{pageIndex: 1, pageSize: 3 }
  getGoodsByCate: BASE_URL + 'goods/query/cate',                   // 根据类别获取商品信息 参数{pageIndex: 1, pageSize: 20, id:"C0025"}

  getOrderOfMy: BASE_URL + 'order/query/my',                       // 获取我的订单信息参数{pageIndex: 1, pageSize: 20,userid:}                            
}
