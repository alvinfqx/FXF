const base = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    num: 0,
    releaseList: [],
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      loading: true,
      userId: base.config.userinfo.Id
    });
    this.getUserDemand();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  getUserDemand: function () {
    var that = this;
    //需求参数
    var pagination = {
      rows: 20,//条数
      page: 1,//页码
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "uid": that.data.userId,
      })
    };
    //调用接口
    base.postAjaxEntity({
      url: "/api/Demand/GetDemandListJson",
      data: pagination
    }, function (obj) {    
      that.setData({
        releaseList: obj.rows,
        num: obj.rows.length,
        baseUrl: base.config.baseurl
      });

    });
  },

  pictureBtn:function(e){
      wx.navigateTo({
        url: '/pages/search/his_home/need_detail?did=' + e.target.dataset.param ,
      });
  },

  eidtBtn: function(e){
    wx.navigateTo({
      url: '/pages/search/near_need/release_need?did=' + e.target.dataset.id,
    });
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})