const base = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    hasData: true,
    imageArr: [],
    screenWidth: 0,
    screenHeight: 0,
    needDetail: [],
    baseUrl: '',
    reply:'',
    demandId:'',
    userId:'',
    isSave: true
  },

  replayContent: function (e) {
    this.setData({
      reply: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    
    this.setData({
      loading: true,
      demandId: options.did
    });

    wx.getSystemInfo({
      success: function (res) {

        _this.setData({
          screenHeight: res.windowHeight / 2.5,
          screenWidth: res.windowWidth,
        });
      }
    });

    var that = this;
    //需求参数
    var pagination = {
      rows: 20,
      page: 1,
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "DemandId": options.did,
      })
    };
    //调用接口
    base.postAjaxEntity({
      url: "/api/Demand/GetDemandListJson",
      data: pagination
    }, function (res) {
      var data = res.rows[0];
      
      var imageArr = [];
      if (data != null && data != undefined && data.Photo != null) {
        imageArr = data.Photo.split(',');
      }
      that.setData({
        needDetail: data,
        baseUrl: base.config.baseurl,
        imageArr: imageArr,
        userId: data.UserId
      });
    });
  },

  helpBtn: function () {
    var that = this;
    if (!that.data.isSave) {
      return false;
    }
    var flag = that.setExFrom();
    if (!flag) {
      that.setData({
        isSave: true
      });
      return false;
    }
    this.SaveForm();

  },

  setExFrom: function () {
    var flag = true;
    var that = this;
    var info = {
      Reply: that.data.reply,
      UserId: that.data.userId
    };
    if (info.Reply == "") {
      wx.showToast({
        title: '请描述可以帮助Ta的情况',
        icon: "none"
      });
      flag = false;
    } else if (info.UserId == base.config.userinfo.Id){
      wx.showToast({
        title: '自己不能帮助自己',
        icon: "none"
      });
      flag = false;
    }
    return flag;
  },


  //提交表单
  SaveForm: function () {
    var that = this;

    var info = {      
      DemandId: that.data.demandId,
      Reply: that.data.reply,
      UserId: that.data.userId,
     
      Country: base.config.userinfo.Country,
      Province: base.config.userinfo.Province,
      City: base.config.userinfo.City,
      District: base.config.userinfo.Area,
      FullAddress: base.config.userinfo.AddressDetail,
      Longitude: base.config.userinfo.Longitude,
      Latitude: base.config.userinfo.Latitude,
      Status: 0,
      DeleteMark: 0,
      // UserId: base.config.userinfo.Id,
      CreateUserId: base.config.userinfo.Id,
      CreateUserName: base.config.userinfo.NickName
    }

    base.postAjaxEntity({
      url: "/api/Demand/SaveReplyDemand",
      data: info
    }, function (obj) {
      that.setData({
        loading: true,
        isSave: true
      });
      wx.showToast({
        title: "发布成功",
        icon: 'none',
        duration: 1000
      });

      setTimeout(function () {
        wx.navigateBack({
          
        })
      }, 500);
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