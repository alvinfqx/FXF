var room_ = ['两房一厅', '一房一厅'], money_ = ['3000内', '3000-4000', '4000-5000'];

var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room_list: [],
    room_id: 0,
    room_name: '',
    money_list: [],
    money_id: 0,
    money_name: '',
    hasLocation: false,
    position: {}
  },

  //选择户型
  roomChange: function (e) {
    this.setData({
      room_id: e.detail.value,
      room_name: room_[e.detail.value]
    })
  },

  //选择租金
  moneyChange: function (e) {
    this.setData({
      money_id: e.detail.value,
      money_name: money_[e.detail.value]
    })
  },

  //选择房源位置
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          position: res,
          locationAddress: res.address
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRoom();
    this.initMoney();

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

  },

  //初始化户型
  initRoom: function () {
    var that = this;
    // 获取房屋配置信息接口
    wx.request({
      url: base.config.baseurl + '/api/MiniAppV1/GetMultipleDataItemJson',
      data: { EnCodes: "'fxf_HouseType'" },
      dataType: 'json',
      success: function (res) {
        var list = res.data[0];
        room_ = list.KeyList;
        that.setData({
          room_list: room_,
          room_name: room_[0],
          room_id: 0,
        });
      }
    });

  },

  initMoney: function () {
    var that = this;
    that.setData({
      money_list: ['3000内', '3000-4000', '4000-5000'],
      money_name: money_[0],
      money_id: 0,
    });
  }




})