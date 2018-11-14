const base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    isSave: true,
    date: '',
    time: '',
    houseId: '',
    remark: '',
    
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  getContent: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loading: true,
      date: base.formatData(new Date()),
      time: base.formatMinute(new Date()),
      houseId: options.hid,
      
    })
  },

  //提交预约按钮
  reserveBtn: function(){
    var that = this;
    if (!that.data.isSave) {
      return false;
    }
    var flag = that.setExFrom();
    if (!flag) {
      that.setData({
        isSave: true,
      });
      return false;
    }
    that.saveData();
  },

  //格式验证
  setExFrom: function () {
    var flag = true;
    var that = this;
    var info = {
      Date: that.data.date,
      Time: that.data.time,
      HouseID: that.data.houseId,
      DateStr: that.data.date + ' ' + that.data.time
    };
    if (info.HouseID == "") {
      wx.showToast({
        title: '房源流水号为空!',
        icon: "none"
      });
      flag = false;
    } else if (info.DateStr < base.formatTime(new Date())) {
      wx.showToast({
        title: '预约时间不能小于当前时间',
        icon: "none"
      });
      flag = false;
    } 
    return flag;
  },

  //提交预约
  saveData: function () {
    var that = this;
    var info = {
      HouseId: that.data.houseId,
      LookDate: that.data.date,
      LookTime: that.data.time,
      Remark: that.data.remark,
      CreateUserId: base.config.userinfo.Id,
      CreateUserName: base.config.userinfo.NickName
    };
    base.postAjaxEntity({
      url: "/api/HousrAppointment/SaveHousrAppointment",
      data: info
    }, function (obj) {
      that.setData({
        loading: true,
        isSave: true
      });
      wx.showToast({
        title: "预约提交成功",
        icon: 'none',
        duration: 1000
      });

      setTimeout(function () {
        wx.navigateBack({

        })
      }, 1000);
    });
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