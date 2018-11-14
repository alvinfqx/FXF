// pages/user/detail/binding.js
const base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    telephone: "",
    hasBind: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      loading: true
    });

    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (base.config.userinfo.Mobile != null) {
      this.setData({
        hasBind: true,
        telephone: base.config.userinfo.Mobile
      })
    }

  },
  setTelephone: function (e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  //更改绑定
  btnChange: function () {
    wx.navigateTo({
      url: '/pages/my/bind/change',
    });
  },
  btnComfire: function () {

    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }

    var that = this;
    that.setData({
      loading: false
    });

    base.getAjax({
      url: '/api/User/BindingTelephone',
      data: { tel: that.data.telephone },
    }, function (res) {
      that.setData({
        loading: true
      })
      base.config.userinfo.Mobile = that.data.telephone;
      wx.reLaunch({
        url: '/pages/my/new_index'
      });
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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