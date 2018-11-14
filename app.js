//app.js

var QQMapWX = require('/utils/qqmap-wx-jssdk.js');

App({
  config: {
    useMsg: null,
    userinfo: null,
    // 开发版
    // baseurl: 'http://fxf.yaomy.net/',
    // 测试版
    // baseurl: 'https://www.yaomy.net/fxf',
    //正式版
    baseurl: 'https://www.520ddx.com',
    token: '',
    app_id: '', //输入小程序app_id  
    app_secret: '', //输入小程序app_secret  
    code: '',
    openid: '',
    hasLogin: false, //是否授权登陆了
    menuId: '', //wx
    refreshFlag: false, //界面刷新
    qqMapKey: "WT3BZ-RLUW6-EX6SS-MUQ6K-EQ6XV-EHFIJ", //腾讯地图key
    city: '',
    newsLoad: true,
    appMenu: [],
  },

  onLaunch: function() {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权,进行登陆');
          that.userLogin();
        }
      }
    });

    that.getAjax({
      url: "/api/Menu/List",
      data: "",
    }, function(obj) {
      that.config.appMenu = obj;

    });
  },

  // 登录
  userLogin: function() {
    var that = this;
    wx.login({
      success: res => {
        that.getAjax({
          url: "/api/openid/get",
          data: {
            authorizeCode: 'FXF',
            userCode: res.code,
          },
        }, function(obj) {
          if (obj.token == "") {
            console.log("登陆失败");
            return false;
          }
          that.config.hasLogin = true;
          that.config.userinfo = obj.userInfo;
          that.config.token = obj.token;
          that.config.openid = obj.openId;
          that.UpdateAddress();
        })
      }
    })
  },
  //修改用户当前位置
  UpdateAddress: function() {
    var that = this;
    // 实例化API核心类 头部引用jssdk
    var qqmapsdk = new QQMapWX({
      key: that.config.qqMapKey
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // 调用接口 通过经纬度定位当前位置
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {

            var address_component = res.result.address_component;
            var userInfo = that.config.userinfo;
            userInfo.Province = address_component.province;
            userInfo.City = address_component.city;
            userInfo.Area = address_component.street;
            userInfo.Address = res.result.address;
            userInfo.Longitude = longitude;
            userInfo.Latitude = latitude;
            that.config.city = address_component.city;
            that.postAjaxEntity({
              url: "/api/user/UpdateUserInfo",
              data: userInfo,
            }, function(obj) {

              if (obj.token == "") {
                console.log("请求失败");
                return false;
              }
              var user = obj.userInfo;
              if (user.Birthday != null) {
                user.Birthday = user.Birthday;
              }
              that.config.userinfo = user;
            })
          },
          fail: function(res) {
            console.log(res);
          }
        });
      }
    })
  },

  // 时间戳 转为 年月日 时分秒
  formatTime: function(date) {
    var timestamp = Date.parse(date);
    timestamp = timestamp / 1000;

    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();

    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    //时
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();

    //分
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    //秒
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  },

  formatMinute: function (date) {
    var timestamp = Date.parse(date);
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //时
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return  h + ":" + m;
  },

  formatData: function (date) {
    var timestamp = Date.parse(date);
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y + "-" + M + "-" + D;
  },

  //可跨页面回调上传图片
  uploadimgToCallback: function(data, callback) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0, //上传失败的个数
      imgData = data.imgData //这里是上传图片时一起上传的数据
    ;
    wx.uploadFile({
      url: that.config.baseurl + data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      header: {
        'Authorization': that.config.token,
        'content-type': 'application/json',
      },
      formData: data.imgData,
      success: (res) => {
        var objres = JSON.parse(res.data);
        if (objres.type == 1) {
          success++; //图片上传成功，图片上传成功的变量+1
        }
        if (data.filestr == "")
          data.filestr = objres.resultdata[0];
        else
          data.filestr = data.filestr + "," + objres.resultdata[0];
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {
          //当图片传完时，停止调用          
          console.log('成功：' + success + " 失败：" + fail);
          //调用提交方法
          if (success == data.path.length) {
            console.log("调用回调");
            callback(data);
          }
        } else {
          //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          data.imgData = imgData; //这里是上传图片时一起上传的数据
          that.uploadimgToCallback(data, callback);
        }
      }
    });
  },

  //封装的get请求
  getAjax: function(e, callback) {
    var that = this;
    wx.request({
      url: that.config.baseurl + e.url,
      method: 'get',
      header: {
        'Authorization': that.config.token,
        'content-type': 'application/json',
      },
      data: e.data,
      success: function(res) {
        var info = res.data;
        var resule = res.data.resultdata;
        //错误信息 , 不执行回调
        if (info.type != 1) {
          wx.showToast({
            title: info.message,
            icon: 'none',
            duration: 1000
          })
          return false;
        }

        callback(resule);
      },
      error: function(e) {
        console.log(e);
      }
    })
  },
  //post请求 后台 dynamic 接收参数
  postAjaxEntity: function(e, callback) {
    var that = this;
    wx.request({
      url: that.config.baseurl + e.url,
      method: 'post',
      header: {
        'Authorization': that.config.token,
        'content-type': 'application/json',
      },
      data: e.data,
      success: function(res) {
        var info = res.data;
        var resule = res.data.resultdata;
        //错误信息 , 不执行回调
        if (info.type != 1) {
          wx.showToast({
            title: info.message,
            duration: 2000
          })
          return false;
        }
        callback(resule);
      },
      error: function(e) {
        console.log(e);
      }
    })
  },
  //post请求 后台 dynamic 接收参数
  postAjaxDynamic: function(e, callback) {
    var that = this;
    wx.request({
      url: that.config.baseurl + e.url,
      method: 'post',
      header: {
        'Authorization': that.config.token,
        'content-type': 'application/json',
      },
      data: JSON.stringify(e.data),
      success: function(res) {
        var info = res.data;
        var resule = res.data.resultdata;
        //错误信息 , 不执行回调
        if (info.type != 1) {
          wx.showToast({
            title: info.message,
            duration: 2000
          })
          return false;
        }
        callback(resule);
      },
      error: function(e) {
        console.log(e);
      }
    })
  },
})