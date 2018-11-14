//index.js
const base = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    haslogin_: false,
    nowAmount: 0,
    sumIncome: 0,
    sumExpenditure: 0,
  },
  //获取
  getUserAmount: function() {
    var that = this;
    base.getAjax({
      url: '/api/User/GetUserWallet',
      data: {
        uid: base.config.userinfo.Id
      }
    }, function(obj) {
      var amount = base.config.userinfo.Amount == null ? 0 : base.config.userinfo.Amount;
      that.setData({
        loading: true,
        haslogin_: true,
        nowAmount: amount,
        sumIncome: obj.sumIncome,
        sumExpenditure: obj.sumExpenditure
      })
    });
  },
  setMoney: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  btnPay: function() {

    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/my/wallet/recharge',
    });
  },
  //提现
  btnMinus: function() {
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }

    wx.navigateTo({
      url: '/pages/my/wallet/getcash',
    });
    return false;

    var that = this;
    var totalfee = parseFloat(that.data.money);
    var nowAmount = parseFloat(that.data.nowAmount) - totalfee;
    var sumExpenditure = parseFloat(that.data.sumExpenditure) + totalfee;
    base.getAjax({
      url: '/api/User/MinusWallet',
      data: {
        totalfee: totalfee
      }
    }, function(res) {
      base.config.userinfo.Amount = nowAmount;
      that.setData({
        money: 0,
        nowAmount: nowAmount,
        sumExpenditure: sumExpenditure
      });
      wx.navigateTo({
        url: '/pages/my/wallet/getcash',
      });
    });

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
    if (base.config.hasLogin) {
      this.getUserAmount();
    } else {
      this.setData({
        loading: true,
      });
    }
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