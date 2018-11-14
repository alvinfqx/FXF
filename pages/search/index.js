// pages/search/index.js
var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      menuList: base.config.appMenu.Index2
    });
  },

  btnUrl_1: function() {
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.navigateTo({
      url: "/pages/search/circle_friends/circle_friends",
    })
  },
  btnUrl_2: function() {
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.navigateTo({
      url: "/pages/search/near_need/near_need",
    })
  },
  btnUrl_3: function() {
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.navigateTo({
      url: "/pages/search/help_search/help_search",
    })
  },
  btnUrl_4: function() {
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.navigateTo({
      url: "/pages/search/need_rent/need_rent",
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