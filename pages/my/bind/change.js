
const base = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    telephone: "",
    telCode: "",
    countDown: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loading: true,
    })
  },

  setTelephone: function (e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  setCode: function (e) {
    this.setData({
      telCode: e.detail.value
    })
  },
  btnCode: function (e) {
    var that = this;
    if (that.data.telephone == "") {
      wx.showToast({
        title: "请填写新手机号",
        icon: 'none',
        duration: 1000
      });
      return false;
    }

    that.setData({
      countDown: 60
    });
    var timer = setInterval(function () {
      var time = that.data.countDown - 1;
      that.setData({
        countDown: time
      });
      if (time < 0) {
        clearInterval(timer);
      }
    }, 1000);
    that.sendSmsCode();
  },
  sendSmsCode: function () {
    var that = this;
    that.setData({
      loading: false
    })
    base.getAjax({
      url: '/api/User/SendSmsCode',
      data: { tel: that.data.telephone },
    }, function (res) {
      that.setData({
        loading: true
      })
      that.setData({
        telCode: res.code
      })
    })
  },
  btnSave: function () {
    var that = this;
    var title = "";
    if (that.telephone == "") {
      title = "请填写新手机号";
    } else if (that.data.telCode == "") {
      title = "请填写验证码";
    }
    if (title != "") {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1000
      });
      return false;
    }

    that.setData({
      loading: false
    })

    base.getAjax({
      url: '/api/User/UpdateBindingTelephone',
      data: {
        tel: that.data.telephone,
        code: that.data.telCode,
      }
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