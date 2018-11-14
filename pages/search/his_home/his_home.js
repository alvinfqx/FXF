// pages/search/index.js
var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    tabs: ['位置', '动态', '需求'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    user: null,
    // 地图STAR
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: '地图',
      iconPath: '/img/friends/u1441.png'
    }],
    // 地图END

    //动态
    contentArr: [],
    //需求
    needArray: [],
  },



  //tab点击
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      userId: options.uid,
      latitude: base.config.userinfo.Latitude,
      longitude: base.config.userinfo.Longitude,
      markers: [{
        id: 1,
        latitude: base.config.userinfo.Latitude,
        longitude: base.config.userinfo.Longitude,
        name: '地图',
        iconPath: '/img/friends/u1441.png'
      }]
    });

    //地图
    this.mapCtx = wx.createMapContext('map')
    this.getUserInfo(); //个人信息
    this.getUserNeighbor(); //个人动态
    this.getUserDemand(); //个人需求
    // 设置tabl的宽度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          // sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderLeft: 0,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  getUserInfo: function() {
    var that = this;
    base.getAjax({
      url: '/api/User/GetUserInfo',
      data: {
        userId: that.data.userId,
      }
    }, function(res) {
      var model = res.userinfo;
      if (model.Avatar.indexOf('upload') > -1) {
        model.Avatar = base.config.baseurl + model.Avatar;
      }
      that.setData({
        user: res.userinfo
      });

    });
  },
  getUserNeighbor: function() {
    var that = this;
    //动态参数
    var pagination = {
      rows: 30, //条数
      page: 1, //页码
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "uid": that.data.userId,
      })
    };
    //调用接口
    base.postAjaxEntity({
      url: "/api/Neighbor/GetNeighborListJson",
      data: pagination
    }, function(res) {
      //分页自己实现
      var data = res.rows;
      if (res.rows == 0)
        return false;

      var list = [];
      var imgList = [];
      for (var i = 0; i < data.length; i++) {
        var model = data[i].Neighbor;
        var imgUrls = model.Photo;
        if (imgUrls != null && imgUrls != "") {
          imgList = [];
          var sp_ = imgUrls.split(',');
          for (var j = 0; j < sp_.length; j++) {
            imgList.push(base.config.baseurl + sp_[j]);
          }
        }
        list.push({
          time: model.DiffTime,
          content: model.Content,
          imgArr: imgList
        });
      }
      that.setData({
        contentArr: list
      });

    });
  },
  getUserDemand: function() {
    var that = this;
    //需求参数
    var pagination = {
      rows: 30, //条数
      page: 1, //页码
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "uid": that.data.userId,
      })
    };

    //
    //调用接口
    base.postAjaxEntity({
      url: "/api/Demand/GetDemandListJson",
      data: pagination
    }, function(res) {
      that.setData({
        needArray: res.rows
      });

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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