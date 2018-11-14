// pages/home/home_order/home_order.js
const base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    context: "立即订房页面",
    houseId: "", //房源ID

    imgArray: [],
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    imgIndex: 1,
    title: "",

    houseType: "", //户型
    houseRent: 0, //	租金
    depositMethod: "", //押金方式
    houseArea: "0m²", //	面积
    fullAddress: "", //房屋地址
    checkInData: "", //入住时间
    limitValue: 6,
    checkInLimit: "", //	入住期限
    setPrice: "", //	预定价格
    isSave: true
  },

  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      imgIndex: e.detail.current + 1
    })
  },

  //入住时间
  bindCheckChange: function (e) {
    this.setData({
      checkInData: e.detail.value
    })
  },

  //入住期限
  limitBind: function(e) { 
    var that = this;
    this.setData({
      limitValue: e.detail.value,
      checkInLimit: that.getTimeMonth(e.detail.value), //	入住期限(月)
      setPrice: that.data.houseRent * e.detail.value, //	预定价格
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      houseId: options.hid,
    });
    that.getHouesDetail(options.hid);
  },
  //获取房源明细
  getHouesDetail: function(hid) {
    var that = this;
    base.getAjax({
      url: "/api/House/GetHouseDetailJson",
      data: {
        hid: hid,
        uid: base.config.userinfo.Id
      },
    }, function(obj) {
      
      // var checkInLimit_ = 6; //入住时间 以月为主,此处以6个月为例子

      var imgArray = [];
      if (obj.Photo != "" && obj.Photo != null) {
        var img_sp = obj.Photo.split(',');
        for (var i = 0; i < img_sp.length; i++) {
          imgArray.push(base.config.baseurl + img_sp[i]);
        }
      }
      that.setData({
        imgArray: imgArray,
        title: obj.Title,
        houseType: obj.HouseType, //户型
        houseRent: obj.HouseRent, //	租金
        depositMethod: obj.DepositMethod, //押金方式
        houseArea: obj.HouseArea, //	面积
        fullAddress: obj.Province + " " + obj.City + "" + obj.District + "" + obj.FullAddress, //房屋地址 省 市 区 详情
        checkInData: base.formatData(new Date()), //入住时间
        checkInLimit: that.getTimeMonth(that.data.limitValue), //	入住期限(月)
        setPrice: obj.HouseRent * that.data.limitValue, //	预定价格
        loading: true
      });
    });
  },

  getTimeMonth: function(num) {
    if(num == ""){
      return "";
    }
    if (num < 12) {
      return num + "个月";
    }
    
    var year = num / 12;
    var month = num % 12;
    return year + "年" + month + "个月";
  },

  //提交订单
  saveHouseOrder: function() {
    var that = this;
    if (!that.data.isSave) {
      return false;
    }
    that.setData({
      loading: false
    });

    var flag = that.setExFrom();
    if (!flag) {
      that.setData({
        isSave: true,
        loading: true,
      });
      return false;
    }

    var obj = that.data;
    var model = {
      HouseId: that.data.houseId, //户型
      HouseType: obj.houseType, //户型
      HouseRent: obj.houseRent, //	租金
      DepositMethod: obj.depositMethod, //押金方式
      HouseArea: obj.houseArea, //	面积
      FullAddress: obj.fullAddress, //房屋地址
      CheckInData: obj.checkInData, //入住时间
      CheckInLimit: obj.checkInLimit, //入住期限(月)
      SetPrice: obj.setPrice, //	预定价格
      CreateUserId: base.config.userinfo.Id,
      CreateUserName: base.config.userinfo.NickName,
    };
   
    base.postAjaxEntity({
      url: '/api/HousrOrder/SaveHousrOrder',
      data: model
    }, function(res) {
      that.setData({
        loading: true,
        isSave: false
      });
      that.payOrder(0.01, res.houseOrderId, res.orderNo);
    });
  },
  //支付订单
  payOrder: function(money, orderId, orderNo) {
    var that = this;
    base.getAjax({
      url: '/api/Pay/PayHouseOrder',
      data: {
        openid: base.config.userinfo.OpenId,
        money: money,
        orderId: orderId,
        orderNo: orderNo
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
            wx.showToast({
              title: '支付成功',
              duration: 1500
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1500);
          },
          fail: function(error) {
            that.setData({
              isSave: true
            });
          }
        });
      }
    })
  },

  //格式验证
  setExFrom: function () {
    var flag = true;
    var that = this;
    var info = {
      CheckInData: that.data.checkInData,
      CheckInLimit: that.data.checkInLimit,
      HouseID: that.data.houseId,

    };
    if (info.HouseID == "") {
      wx.showToast({
        title: '房源流水号为空!',
        icon: "none"
      });
      flag = false;
    } else if (info.CheckInData < base.formatData(new Date())) {
      wx.showToast({
        title: '入住时间不能小于当前时间',
        icon: "none"
      });
      flag = false;
    } else if (info.CheckInLimit == ""){
      wx.showToast({
        title: '入住期限为空!',
        icon: "none"
      });
      flag = false;
    }
    return flag;
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