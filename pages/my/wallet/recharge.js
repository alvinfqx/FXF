var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [{
        value: 'WX',
        name: '微信',
        checked: 'true',
        icon: '../../../image/wechat@2x.png'
      },
      // { value: 'CHN', name: '银行卡', icon: '../../../image/bank@2x.png'},
      // { value: 'CHASH', name: '现金', icon: '../../../img/my/u4529.png' },
      // { value: 'Aplay', name: '支付宝', icon: '../../../img/my/u4534.png'},

    ],
    money: 0.01,
    nowAmount: 0.00
  },

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    var items = this.data.types;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }

    this.setData({
      types: items
    });
  },
  btnMoney: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  UserPay: function() {
    var that = this;
    base.getAjax({
      url: '/api/Pay/WeiXinOrder',
      data: {
        openid: base.config.userinfo.OpenId,
        money: that.data.money
      }
    }, function(payargs) {
      if (payargs != undefined) {
        var pay = payargs.Values;
        //调用支付
        wx.requestPayment({
          timeStamp: pay.timeStamp,
          nonceStr: pay.nonceStr,
          package: pay.package,
          signType: pay.signType,
          paySign: pay.paySign,
          success: function(res) {
            that.btnAdd();
          },
          fail: function(error) {
            console.log(error);
          }
        });
      }
    })
  },

  //充值
  btnAdd: function() {
    var that = this;
    that.setData({
      loading: false,
    });
    var totalfee = parseFloat(that.data.money);
    var nowAmount = parseFloat(that.data.nowAmount) + totalfee;
    var sumIncome = parseFloat(that.data.sumIncome) + totalfee;
    base.getAjax({
      url: '/api/User/AddWallet',
      data: {
        uid: base.config.userinfo.Id,
        totalfee: totalfee
      }
    }, function(res) {
      base.config.userinfo.Amount = nowAmount;
      that.setData({
        loading: true,
        money: totalfee,
        nowAmount: nowAmount,
      });
      wx.navigateBack({
        delta: 1
      })
    });

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
        nowAmount: amount,
      })
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
    this.getUserAmount();
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