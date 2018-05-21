const BASE_URL = "http://2530013758.nat123.net/api/";

module.exports = {
  city: BASE_URL + 'area/query/city', //城市信息
  neighborArea: BASE_URL + 'neighbor/query/area', // 社区列表
  neighborAll: BASE_URL + 'shop/query/nbhd',//社区门店列表

  recommendGoodsOfMy: BASE_URL + 'recommendGoods/query/my', //我的推荐商品
  bannerOfnbhd: BASE_URL + 'banner/query/nbhd', // 首页banner
  hotGoods: BASE_URL + 'hotGoods/query', //热卖商品
  categoryAll: BASE_URL + 'category/All', //所有商品分类
  goodsByCate: BASE_URL + 'goods/query/cate', //根据类别查询商品

}
