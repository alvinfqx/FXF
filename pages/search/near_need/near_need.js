var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    needArray: [],
  },

  //发布需求按钮
  bindNeed: function(e) {
    wx.navigateTo({
      url: '/pages/search/near_need/release_need',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //需求参数
    var pagination = {
      rows: 20,
      page: 1,
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "city": base.config.userinfo.City,
      })
    };
    //调用接口
    base.postAjaxEntity({
      url: "/api/Demand/GetDemandListJson",
      data: pagination
    }, function(obj) {
      console.log(obj);
      var list = obj.rows;
      for (var i = 0; i < list.length; i++) {
        var mo = list[i];
        if (mo.UserPic.indexOf('https:') < 0) {
          mo.UserPic = base.config.baseurl + mo.UserPic;
        }
      }

      that.setData({
        needArray: obj.rows,
        baseUrl: base.config.baseurl
      });
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})