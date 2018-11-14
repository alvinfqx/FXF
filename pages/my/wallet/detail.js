// pages/user/wallet/detail.js
const base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    list: "",
    SumPrice: 0,
    IncomeNum: 0,
    ExpenditureNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
  },
  getList: function() {
    var pagination = {
      page: 1,
      rows: 50,
      records: 0,
      sidx: "CreateDate",
      sord: "desc",
      queryJson: JSON.stringify([{
        "groupOp": "AND",
        "rules": [{
          "field": "CreateUserId",
          "op": "=",
          "data": base.config.userinfo.Id
        }]
      }])
    };
    var that = this;
    base.postAjaxEntity({
      url: '/api/User/GetUserTradeItemList',
      data: pagination
    }, function(obj) {
      var list = obj.rows;
      if (list.length == 0) {
        return false;
      }
      var sumPrice = 0,
        incomeNum = 0,
        expenditureNum = 0;

      for (var i = 0; i < list.length; i++) {
        var model = list[i];

        if (model.Amount >= 0)
          incomeNum++;
        else
          expenditureNum++;

        sumPrice += model.Amount;
      }

      that.setData({
        loading: true,
        list: list,
        SumPrice: sumPrice,
        IncomeNum: incomeNum,
        ExpenditureNum: expenditureNum

      });
    });

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