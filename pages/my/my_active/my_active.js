var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var base = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    tabs: ['我的动态', '我的位置'],
    friends_list: [],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    baseUrl: '',

    btn_index: -1,
    btn_yes_index: -1,
    comment_list: [],
    yes_list: [],

    // 地图STAR
    lsUserImg: [],
    latitude: 0,
    longitude: 0,
    markers: [],
    covers: [],
    // 地图END
    page: 1,
    //每页条数
    rows: 20,
    uid: '',
    newsRows: 0
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
    // var uid = options.uid;
    that.setData({
      uid: options.uid
    });
    // 设置tabl的宽度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          loading: true,
          // sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderLeft: 0,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.GetNeighborList();
  },

  GetNeighborList: function() {
    var that = this;
    //动态参数
    var pagination = {
      rows: 20,
      page: 1,
      sidx: 'CreateDate',
      sord: 'desc',
      queryJson: JSON.stringify({
        "city": base.config.userinfo.City,
        "uid": that.data.uid, // 我的动态或者别人的动态 加上用户ID
      })
    };
    //调用接口
    base.postAjaxEntity({
      url: "/api/Neighbor/GetNeighborListJson",
      data: pagination
    }, function(obj) {
      console.log(obj);
      that.setData({
        newsRows: obj.rows.length
      })

      var data = obj;
      for (var index in data.rows) {
        var mo = data.rows[index].Neighbor;
        if (mo.Photo != null) {
          PhotoList = mo.Photo.split(',');
        } else {
          mo.PhotoList = [];
        }
        if (mo.UserPhoto != null && mo.UserPhoto.indexOf('https:') < 0) {
          mo.UserPhoto = base.config.baseurl + mo.UserPhoto;
        }
      }

      that.setData({
        friends_list: data.rows,
        baseUrl: base.config.baseurl,
        loading: true
      });
    });
  },

  commentNumClick: function(e) {
    // if (this.data.btn_index != e.currentTarget.dataset.index) {
    //   this.setData({
    //     btn_index: e.currentTarget.dataset.index,
    //     btn_yes_index: -1
    //   })
    // }
    // else {
    //   this.setData({
    //     btn_index: -1,
    //     btn_yes_index: -1
    //   })
    // }

    console.log("评论点击");
  },


  yesNumClick: function(e) {
    if (this.data.btn_yes_index != e.currentTarget.dataset.index) {
      this.setData({
        btn_yes_index: e.currentTarget.dataset.index,
        btn_index: -1
      })
    } else {
      this.setData({
        btn_yes_index: -1,
        btn_index: -1
      })
    }
    var that = this;
    var index = e.currentTarget.dataset.index;
    var record = that.data.friends_list[index];

    //调用接口
    base.getAjax({
      url: "/api/Neighbor/ZanOrCaiNeighbor",
      data: {
        neighborId: record.Neighbor.Id,
        userId: base.config.userinfo.Id,
        status: 1,
      }
    }, function(obj) {
      var data = obj;
      wx: wx.redirectTo({
        url: 'my_active?uid=' + base.config.userinfo.Id,
      })
    });
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var longitude = base.config.userinfo.Longitude,
      latitude = base.config.userinfo.Latitude;
    this.setData({
      latitude: latitude,
      longitude: longitude,
    });
    this.getUserPosition(longitude, latitude);
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
    console.log("监听用户下拉动作");
    this.setData({
      page: 1,
      loading: false,
    });
    this.GetNeighborList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("监听用户上拉动作");
    var newsRows = this.data.newsRows;
    if (newsRows < this.data.rows) {
      return false;
    }
    var page = this.data.page;
    this.setData({
      page: page + 1,
      loading: false,
    });
    this.GetNeighborList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
      async: true,
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
        // 调用接口 通过经纬度定位当前位置
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            var address_component = res.result.address_component;
            base.config.city = address_component.city;
            that.getHouseList();
          },
          fail: function(res) {
            console.log(res);
          }
        });
      }
    })
  },
  //获取周边的邻居
  getUserPosition: function(longitude, latitude) {
    var that = this;
    base.getAjax({
      url: "/api/Neighbor/GetNeighborPosition",
      data: {
        token: base.config.token,
        longitude: longitude,
        latitude: latitude,
        scope: 10
      }
    }, function(obj) {
      var list = obj;
      var imglist = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].Avatar == null && list[i].Avatar.indexOf('https:') < 0) {
          list[i].Avatar = base.config.baseurl + list[i].Avatar;
        }
        imglist.push(list[i].Avatar);
      }
      that.getLSImg(0, imglist, list.length, list);
    });
  },
  //获取临时图片
  getLSImg: function(rows, imglist, sum, mapList) {
    var that = this;
    wx.downloadFile({
      url: imglist[rows],
      success: function(res) {
        var list = that.data.lsUserImg;
        var img = "";
        if (res.statusCode === 200) {
          var imgNewList = res.tempFilePath.replace("http:/", '').replace("https:/", '');
          list.push(imgNewList);

        } else {
          list.push("");
        }
        that.setData({
          lsUserImg: list
        });
        rows++;
        if (rows < sum) {
          that.getLSImg(rows, imglist, sum, mapList);
        } else {

          that.setMap(mapList, that.data.lsUserImg);
        }
      },
      error: function(data) {

      }
    })
  },
  setMap: function(mapList, imgList) {
    var that = this;
    var userName = base.config.userinfo.NickName;
    var markers = [],
      covers = [];
    for (var i = 0; i < mapList.length; i++) {
      var mo = mapList[i];
      var img = imgList[i];
      if (userName == mo.NickName) {
        console.log(userName);
        markers.push({
          id: mo.Id,
          latitude: mo.Latitude,
          longitude: mo.Longitude,
          name: "当前位置",
          iconPath: img,
          width: 45,
          height: 45,
          anchor: {
            x: .5,
            y: .5
          }
        });
      }
    }
    that.setData({
      markers: markers
    })
    that.mapCtx = wx.createMapContext('map')
  }




})