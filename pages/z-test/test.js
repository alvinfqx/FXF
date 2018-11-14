// pages/z-test/test.js
var base = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resJson: "显示JSON",
    uid: "",
    neighborId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  UserPay: function () {
    var that = this;
    wx.request({
      url: base.config.baseurl + '/api/WeixinPay/SubmintPayOrder',
      data: {
        openid: base.config.userinfo.WxOpenId,
        money: 0.01
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var payargs = res.data;
        if (payargs != undefined) {
          var pay = payargs.Values;
          //调用支付
          wx.requestPayment({
            timeStamp: pay.timeStamp,
            nonceStr: pay.nonceStr,
            package: pay.package,
            signType: pay.signType,
            paySign: pay.paySign,
            success: function (res) {
              // wx.redirectTo({
              //   // url: 'success'
              //   url: '../../service/success?orderId=' + orderId
              // })
              console.log(res);
            },
            fail: function (error) {
              // wx.navigateTo({
              //   url: '../../service/fail?orderId=' + orderId
              // })

              console.log(error);

            }
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //邻居圈动态
  GetNeighborListJson: function () {
    var that = this;

    var pagination = {
      rows: 20,
      page: 1,
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "uid": base.config.userinfo.Id, "city": "东莞市"
      })
    };

    wx.request({
      url: base.config.baseurl + "/api/MiniAppV1/GetNeighborListJson",
      data: pagination,
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data);
        var nid = "";
        if (data.rows.length > 0) {
          //测试情况下取第一个
          nid = data.rows[0].Id;
        }
        that.setData({
          resJson: JSON.stringify(data),
          neighborId: nid,
          uid: base.config.userinfo.Id
        });
      },
    })

  },
  //动态实体No1
  GetNeighborEntityJson: function () {
    var that = this;

    wx.request({
      url: base.config.baseurl + "/api/MiniAppV1/GetNeighborEntityJson?token=" + base.config.token,
      data: { neighborId: that.data.neighborId },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data);
        that.setData({
          resJson: JSON.stringify(data)
        });
      },
    })

  },
  //动态详情No1
  GetNeighborAllJson: function () {
    var that = this;

    wx.request({
      url: base.config.baseurl + "/api/MiniAppV1/GetNeighborAllJson?token=" + base.config.token,
      data: { neighborId: that.data.neighborId },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data);
        that.setData({
          resJson: JSON.stringify(data)
        });
      },
    })

  },
  //邻居圈评论列表
  GetReplyNeighborListJson: function () {
    var that = this;

    var pagination = {
      page: 1,
      rows: 20,
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "NeighborId": that.data.neighborId
      })
    };

    wx.request({
      url: base.config.baseurl + "/api/MiniAppV1/GetReplyNeighborListJson?token=" + base.config.token,
      data: pagination,
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data);
        that.setData({
          resJson: JSON.stringify(data),
        });
      },
    })

  },
  //邻居圈点赞列表
  GetIsYesNeighborListJson: function () {
    var that = this;

    var pagination = {
      page: 1,
      rows: 20,
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "NeighborId": that.data.neighborId
      })
    };

    wx.request({
      url: base.config.baseurl + "/api/MiniAppV1/GetIsYesNeighborListJson?token=" + base.config.token,
      data: pagination,
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data);
        that.setData({
          resJson: JSON.stringify(data),
        });
      },
    })

  },
  //发布动态
  SaveNeighbor: function () {
    var that = this;

    // 实例化API核心类 头部引用jssdk
    var qqmapsdk = new QQMapWX({
      key: base.config.qqMapKey
    });
    wx.getLocation({
      type: 'wgs84',
      async: true,
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // 调用接口 通过经纬度定位当前位置
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            var address_component = res.result.address_component;
            var info = {
              Content: "你好" + formatTime(new Date),
              Country: base.config.userinfo.Country,
              Province: address_component.province,
              City: address_component.city,
              District: address_component.street,
              FullAddress: res.result.address,
              Longitude: longitude,
              Latitude: latitude,
              Satus: 0,
            }

            wx.request({
              url: base.config.baseurl + "/api/MiniAppV1/SaveNeighbor?token=" + base.config.token,
              data: info,
              method: 'POST',
              dataType: 'json',
              success: function (res) {
                var data = res.data;
                console.log(data);
                that.setData({
                  resJson: JSON.stringify(data),
                  uid: base.config.userinfo.Id
                });
              },
            })



          },
          fail: function (res) {
            console.log(res);
          }
        });
      }
    })

  },
  //评论动态
  SaveReplyNeighbor_0: function () {
    var that = this;

    var info = {
      NeighborId: that.data.neighborId,
      Reply: "我很好-" + base.formatTime(new Date),
      ReplyUserId: base.config.userinfo.Id,
      ReplyDate: base.formatTime(new Date),
      Satus: 0,
    }

    wx.request({
      url: base.config.baseurl + "/api/MiniAppV1/SaveNeighbor?token=" + base.config.token,
      data: info,
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data);
        that.setData({
          resJson: JSON.stringify(data),
          uid: base.config.userinfo.Id
        });
      },
    })

  },
  //回复评论
  SaveReplyNeighbor_1: function () {
    var that = this;

    var info = {
      NeighborId: that.data.neighborId,
      Reply: "回复我很好-" + base.formatTime(new Date),
      ReplyUserId: base.config.userinfo.Id,
      ReplyDate: base.formatTime(new Date),
      ReplyId: "", //评论ID 测试为空,实际为当前评论得ID
      Status: 0,
    }

    wx.request({
      url: base.config.baseurl + "/api/MiniAppV1/SaveReplyNeighbor?token=" + base.config.token,
      data: info,
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        console.log(data);
        that.setData({
          resJson: JSON.stringify(data),
          uid: base.config.userinfo.Id
        });
      },
    })

  },
  //赞-踩
  ZanOrCaiNeighbor: function () {

  },

  getComment: function () {
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