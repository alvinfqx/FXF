var bank_ = ['中国银行', '建设银行', '东莞银行'];
const base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [{
        value: 'WX',
        name: '微信',
        icon: '../../../image/wechat@2x.png',
        checked: 'true'
      },
      {
        value: 'CARD',
        name: '银行卡',
        icon: '../../../image/bank@2x.png'
      },
    ],
    isCard: false,
    bank_list: [],
    bank_id: 0,
    bank_name: '',
    isBankClass: false,
    money: "", //需要提现金额
    nowAmount: 0, //用户余额
  },

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var isCard = this.data.isCard;
    var items = this.data.types;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
      if (e.detail.value == 'CARD') {
        isCard = true;
      } else {
        isCard = false;
      }
    }

    this.setData({
      types: items,
      isCard: isCard
    });
  },

  //选择银行
  bankChange: function(e) {
    this.setData({
      bank_id: e.detail.value,
      bank_name: bank_[e.detail.value],
      isBankClass: true
    })
  },
  setTixian: function(e) {
    this.setData({
      tiXian: e.detail.value
    })
  },
  //获取
  getUserAmount: function() {
    var that = this;
    that.setData({
      loading: false,
    })
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
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.initBank();
    this.getUserAmount();
  },

  //初始化银行
  initBank: function() {
    var that = this;
    that.setData({
      bank_list: ['中国银行', '建设银行', '东莞银行'],
      bank_name: bank_[0],
      bank_id: 0,
    });
  },
  btnAdd: function() {
    wx.showToast({
      title: '暂时无法提现',
      icon:"none"
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