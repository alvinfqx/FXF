
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    grids: [0, 1, 2, 3, 4]
  },
  
  //新增房产
  addRoomBtn:function(){
     console.log("新增房产");
  },

  //未交租住户
  noPayBtn: function(){
    wx.navigateTo({
      url: '/pages/my/my_room/nopay',
    })
  },

  //收取租金
  getMoneyBtn: function(){
    wx.navigateTo({
      url: '/pages/my/my_room/get_money',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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