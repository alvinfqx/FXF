// pages/home/index.js
var base = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    loadings: 0,
    inputShowed: false,
    inputVal: "",
    location: '',
    //每页条数
    rows: 10,
    //页码
    page: 1,
    //最新条数,为0时,不进行加载
    newsRows: 0,
    // 排序
    sortList: [{
      sort: "正序",
      image: "",
    }, {
      sort: "倒序",
      image: "",
    }],
    //租金
    rentList: [{
      name: "不限",
      image: "",
    }, {
      name: "0-1000",
      image: "",
    }, {
      name: "1000-3000",
      image: "",
    }, {
      name: "3000-5000",
      image: "",
    }, {
      name: "5000-",
      image: "",
    }],
    //户型
    roomList: [{
      name: "一室一厅",
      image: "",
    }, {
      name: "两室一厅",
      image: "",
    }],
    //方式
    wayList: [{
      name: "押一付三",
      image: "",
    }, {
      name: "押一付一",
      image: "",
    }, {
      name: "押二付一",
      image: "",
    }],
    mask1Hidden: true,
    maskRentHidden: true,
    maskRentCheck: "",
    maskRoomHidden: true,
    maskRoomCheck: "",
    maskWayHidden: true,
    maskWayCheck: "",
    rentSelected: "租金",
    roomTypeSelected: "户型",
    sortSelected: "排序",
    waySelected: "方式",

    room_list: []
  },


  // 搜索栏
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    this.getHouseList()
  },
  inputSearch: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.getHouseList()
  },

  /*
  筛选栏
  */

  mask1Cancel: function() {
    this.setData({
      mask1Hidden: true,
      maskRentHidden: true,
      maskRoomHidden: true,
      maskWayHidden: true
    })
  },
  //租金
  onRender: function() {
    this.setData({
      maskRentHidden: false
    })
  },
  //选择租金查询
  rentSelected: function(e) {
    var index_ = e.currentTarget.dataset.index;
    var str = this.data.rentList[index_].name;
    this.setData({
      rentSelected: str,
      maskRentCheck: str,
      maskRentHidden: false,
      room_list: [],
    });
    this.getHouseList()

  },
  //户型
  onRoom: function() {
    this.setData({
      maskRoomHidden: false
    });
  },
  //选择户型查询
  roomTypeSelected: function(e) {
    var index_ = e.currentTarget.dataset.index;
    var str = this.data.roomList[index_].name;
    this.setData({
      roomTypeSelected: str,
      maskRoomCheck: str,
      maskRoomHidden: false,
      room_list: [],
    });
    this.getHouseList();
  },
  //排序
  onOverallTag: function() {
    this.setData({
      mask1Hidden: false
    })
  },
  //方式
  onWay: function() {
    this.setData({
      maskWayHidden: false
    })
  },
  //选择方式查询
  waySelected: function(e) {
    var index_ = e.currentTarget.dataset.index;
    var str = this.data.wayList[index_].name;
    this.setData({
      waySelected: str,
      maskWayCheck: str,
      maskWayHidden: false,
      room_list: [],
    });
    this.getHouseList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHouseSetting();
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

    if (!base.config.newsLoad) {
      return false;
    }
    var that = this;
    that.setData({
      loading: false
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          if (base.config.city != "") {
            that.getHouseList();
          } else {
            that.getAddress();
          }
        } else {
          that.getHouseList();
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    base.config.newsLoad = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  PullDownRefresh: function() {
    this.setData({
      page: 1,
      room_list: [],
      loading: false,
    });
    this.getHouseList();
  },

  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  ReachBottom: function() {
    var newsRows = this.data.newsRows;
    if (newsRows < this.data.rows) {
      return false;
    }
    var page = this.data.page;
    this.setData({
      page: page + 1,
      loading: false,
    });
    this.getHouseList();
  },

  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  locationBtn: function() {
    if (base.config.city == "") {
      this.setData({
        loading: false
      })
      this.getAddress();
    } else {
      wx.navigateTo({
        url: '/pages/location/location',
      });
    }

  },
  getHouseSetting: function() {
    var that = this;
    // 获取房屋配置信息接口
    base.getAjax({
      url: "/api/House/GetMultipleDataItemJson",
    }, function(obj) {
      var list = obj;
      for (var i = 0; i < list.length; i++) {
        var key = list[i].KeyName;

        if (key == "fxf_DepositMethod") {
          that.setData({
            wayList: that.getNewsList(list[i].KeyList)
          });
        } else if (key == "fxf_HouseType") {
          that.setData({
            roomList: that.getNewsList(list[i].KeyList)
          })
        } else if (key == "fxf_RentalMethod") {
          that.setData({
            sortList: that.getNewsList(list[i].KeyList)
          });
        }
      }
    });
  },
  getNewsList: function(list) {
    var newsList = [{
      name: "不限",
      images: ""
    }];
    for (var i = 0; i < list.length; i++) {
      var model = {
        name: list[i],
        images: ""
      }
      newsList.push(model);
    }
    return newsList;
  },
  getHouseList: function() {
    var that = this;
    var rules = [];

    //城市定位
    if (base.config.city != "") {
      that.setData({
        location: base.config.city
      })
      rules.push({
        "field": "City",
        "op": "=",
        "data": base.config.city
      });
    }
    //搜索框条件
    if (that.data.inputVal != "") {
      var rs = {
        "field": "Title",
        "op": "like",
        "data": that.data.inputVal
      }
      rules.push(rs);
    }
    //租金条件
    if (that.data.maskRentCheck != "" && that.data.maskRentCheck != "不限") {
      var sp_ = that.data.maskRentCheck.split('-');
      var star = sp_[0];
      var rs = {
        "field": "HouseRent",
        "op": ">=",
        "data": star
      }
      rules.push(rs);
      var ent = sp_[1];
      if (ent != "") {
        var rs = {
          "field": "HouseRent",
          "op": "<",
          "data": ent
        }
        rules.push(rs);
      }
    }
    //户型条件
    if (that.data.maskRoomCheck != "" && that.data.maskRoomCheck != "不限") {
      var rs = {
        "field": "HouseType",
        "op": "like",
        "data": that.data.maskRoomCheck
      }
      rules.push(rs);
    }

    //方式 押一付一
    if (that.data.maskWayCheck != "" && that.data.maskWayCheck != "不限") {
      var rs = {
        "field": "DepositMethod",
        "op": "=",
        "data": that.data.maskWayCheck
      }
      rules.push(rs);
    }

    var pagination = {
      rows: that.data.rows,
      page: that.data.page,
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify([{
        "groupOp": "AND",
        "rules": rules
      }])
    };

    base.postAjaxEntity({
      url: "/api/House/GetHouseListJson",
      data: pagination
    }, function(obj) {
      that.setData({
        loading: true,
        newsRows: obj.length
      })
      that.setData({
        room_list: [],
      })
      if (obj.length == 0) {
        return false;
      }
      var list = that.data.room_list;
      for (var i = 0; i < obj.length; i++) {
        var objs = obj[i];
        var img_list = [];
        for (var img = 0; img < objs.Photo.length; img++) {
          img_list.push(base.config.baseurl + objs.Photo[img]);
        }

        var msg = {
          id: objs.Id,
          content: objs.Title,
          image: img_list,
          position: objs.City,
          time: objs.CreateDate,
          type: [objs.HouseType, objs.HouseArea + 'mm', objs.DepositMethod],
          price: '¥' + objs.HouseRent + '/月'
        };
        list.push(msg);
      }

      that.setData({
        room_list: list,
        loading: true,
      })
    })
  },

  //获取当前位置
  getAddress: function() {
    var that = this;

    // 实例化API核心类 头部引用jssdk
    var qqmapsdk = new QQMapWX({
      key: base.config.qqMapKey
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // 调用接口 通过经纬度定位当前位置
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            that.setData({
              room_list: []
            })
            var address_component = res.result.address_component;
            base.config.city = address_component.city;
            that.getHouseList();
          },
          fail: function(res) {
            wx.showToast({
              title: "错误 : " + JSON.stringify(res),
              icon: 'none',
              duration: 2000
            });
          }
        });
      },
      // fail: function() {
      //   wx.openSetting({
      //     success: (res) => {
      //       if (res.authSetting['scope.userLocation']) {
      //         that.setData({
      //           loading: false
      //         });
      //         setTimeout(function() {
      //           that.getAddress();
      //         }, 1000);
      //       }
      //     }
      //   })
      // }
    })
  },
})