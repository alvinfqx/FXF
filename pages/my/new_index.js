var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    hasUserInfo: false,
    userinfo: null,
    photo: "",
    age: 24,
    nickName: "用户001",
    remark: "",
    recordNum: 0,
    neighborNum: 0,
    demanNum: 0,
    grids: [],
    isUserAut: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var menuUser = base.config.appMenu.Index3;
    var menuList = [];
    for (var i = 0; i < menuUser.length; i++) {
      var mo = menuUser[i];
      menuList.push({
        width: "50rpx",
        height: '51rpx',
        url: mo.Url,
        image: mo.PicUrl,
        label: mo.MenuName
      });
    }
    this.setData({
      grids: menuList
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
    var that = this;

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权,进行登陆');
          wx.login({
            success: res => {
              var that = this;
              that.getUserIndex();
            }
          });
        } else {
          console.log('未授权');
          that.setData({
            loading: true
          })
        }
      }
    })

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

  },

  //退出按钮事件
  exitbtn() {
    wx.reLaunch({
      url: '',
    })
  },

  //编辑个人资料
  editPersonal: function() {
    wx.navigateTo({
      url: '/pages/my/personal/personal',
    })
  },
  btnDongTai: function() {
    if (!base.config.hasLogin) {
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.navigateTo({
      url: "/pages/my/my_active/my_active?uid=" + base.config.userinfo.Id,
    })
  },
  onGotUserInfo: function(e) {
    var that = this;
    if (!base.config.hasLogin) {
      that.setData({
        loading: false,
        isUserAut: true,
      })
      that.userLogin(e.detail.userInfo);
    }
  },

  // 登录
  userLogin: function(sqUser) {
    wx.login({
      success: res => {
        var that = this;
        base.getAjax({
          url: "/api/OpenId/Get",
          data: {
            authorizeCode: "fxf",
            userCode: res.code,
          },
        }, function(obj) {
          var model = obj.userInfo;
          if (model == null) {
            console.log("登陆失败")
            that.setData({
              loading: true,
              
            })
            return false;
          }
          var imgPhoto = "";
          if (model.Avatar != null || model.Avatar != "") {
            imgPhoto = sqUser.avatarUrl;
            model.Avatar = sqUser.avatarUrl;
            model.NickName = sqUser.nickName;
          }
          base.config.token = obj.token;
          base.config.openid = obj.openId;
          base.config.hasLogin = true;
          base.config.userinfo = model;
          base.UpdateAddress();

          setTimeout(function() {
            that.getUserIndex();
          }, 2000);

        })

      }
    })
  },
  getUserIndex: function() {
    var that = this;
    base.getAjax({
      url: "/api/user/GetUserInfo",
      data: {
        userId: base.config.userinfo.Id,
      },
    }, function(res) {
      var pic = res.userinfo.Avatar;
      if (pic != null && pic.indexOf('https') < 0) {
        pic = base.config.baseurl + res.userinfo.Avatar;
      }

      that.setData({
        photo: pic,
        nickName: res.userinfo.NickName,
        remark: res.userinfo.Remark == null ? "" : res.userinfo.Remark,
        age: res.userinfo.Age,
        recordNum: res.recordNum,
        neighborNum: res.neighborNum,
        demanNum: res.demanNum,
        hasUserInfo: true,
        userinfo: res.userinfo,
        loading: true,
        isUserAut: true
      });
      //base.UpdateAddress();
    })

  },

})