
var reason_ = ['离职', '离开城市', '换房'];
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check_data:'',
    reason_list: [],
    reason_id: 0,
    reason_name: ''
  },
 

  //选择租金
  reasonChange: function (e) {
    this.setData({
      reason_id: e.detail.value,
      reason_name: reason_[e.detail.value]
    })
  },


  initReason: function () {
    var that = this;
    that.setData({
      reason_list: ['离职', '离开城市', '换房'],
      reason_name: reason_[0],
      reason_id: 0,
    });
  },

  //选择退房时间
  setCheckData: function (e) {
    this.setData({
      check_data: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({   
      check_data: app.formatTime(new Date()).split(' ')[0],
      loading: true,
    });
   
    this.initReason();
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