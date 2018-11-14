var base = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    houseId: "",
    imgArray: [],
    HouseRent: 4000,
    Title: "",
    DepositMethod: "",
    DayStr: "",
    HouseType: "",
    HouseArea: "",
    FloorNum: 10,
    TotalFloors: 30,
    DecorationType: "",
    Orientation: "",
    UseType: "",
    attr_list: [],
    Community: "",
    FullAddress: "",
    Remark: "",
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    imgIndex: 1,
    newAttr: []
  },

  onSlideChangeEnd: function(e) {
    var that = this;
    that.setData({
      imgIndex: e.detail.current + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      houseId: options.id
    })
    this.getAttr();
    this.getHouesDetail(options.id);
  },

  getHouesDetail: function(hid) {
    var that = this;
    var uid = '';
    if (base.config.userinfo != null) {
      uid = base.config.userinfo.Id;
    }
    base.getAjax({
      url: "/api/House/GetHouseDetailJson",
      data: {
        hid: hid,
        uid: uid
      },
    }, function(obj) {
      var model = obj;

      var imgArray = [];
      if (model.Photo != "" && model.Photo != null) {
        var img_sp = model.Photo.split(',');
        for (var i = 0; i < img_sp.length; i++) {
          imgArray.push(base.config.baseurl + img_sp[i]);
        }
      }

      var pz_nei = [];
      if (model.Configuration != "" && model.Configuration != null) {
        var pz_sp = model.Configuration.split(',');

        for (var i = 0; i < pz_sp.length; i++) {
          var attr_json = that.getHoustAttrSet(pz_sp[i]);
          pz_nei.push(attr_json);
        }
      }
      var attrList = [];
      if (pz_nei && pz_nei.length > 0) {
        var a_len = pz_nei.length;
        for (var i = 0; i < a_len; i += 4) {
          attrList.push(pz_nei.slice(i, i + 4));
        }
      }

      var day = "当天";
      var sdate = model.CreateDate;
      if (model.ModifyDate != null) {
        sdate = model.ModifyDate;
      }
      var edate = base.formatTime(new Date());
      var dayNum = that.num_data(sdate, edate);
      if (dayNum != 0)
        day = dayNum + "天前";

      that.setData({
        imgArray: imgArray,
        Title: model.Title,
        HouseRent: model.HouseRent,
        DepositMethod: model.DepositMethod,
        DayStr: day,
        HouseType: model.HouseType,
        HouseArea: model.HouseArea + "m²",
        FloorNum: model.FloorNum ? model.FloorNum : "",
        TotalFloors: model.TotalFloors,
        DecorationType: model.DecorationType ? model.DecorationType : "",
        Orientation: model.Orientation,
        UseType: model.UseType,
        attr_list: attrList,
        Community: model.Community,
        FullAddress: model.FullAddress ? model.FullAddress : "",
        Remark: model.Remark,
        loading: true
      })

    });
  },
  num_data: function(startDate, endDate) {
    var start_date = new Date(startDate);
    var end_date = new Date(endDate);
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    if (day > 0) {
      return day;
    } else {
      return 0;
    }
  },

  getAttr: function() {
    var that = this;
    base.getAjax({
      url: "/api/House/GetHouseConfigList",
      data: {
        configStr: ""
      }
    }, function(obj) {
      that.setData({
        newAttr: obj
      })
    });
  },

  getHoustAttrSet: function(name) {
    var that = this;
    var list = that.data.newAttr;
    var model = null;
    for (var i = 0; i < list.length; i++) {
      if (name == list[i].name) {
        model = list[i];
        break;
      }
    }

    return model;
  },

  //  预约
  reservationBtn: function(){
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请先登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    var that = this;
    wx.navigateTo({
      url: "/pages/home/home_detail/reserve?hid=" + that.data.houseId,
    })
  },


  /**立即订房 */
  bookBtn: function() {
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请先登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    var that = this;
    wx.navigateTo({
      url: "/pages/home/home_order/home_order?hid=" + that.data.houseId,
    })
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