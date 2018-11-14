const base = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    photo: "",
    files: [],
    nickname: "",
    signature: "",
    birthday: "",
    loading: false,
    sexArr: ['男', '女'],
    sex: "",
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var user = base.config.userinfo;
    var pic = user.Avatar;
    if (pic != null && pic.indexOf('https') < 0) {
      pic = base.config.baseurl + user.Avatar;
    }
    this.setData({
      userinfo: user,
      photo: pic,
      nickname: user.NickName,
      sex: user.Gender,
      birthday: user.Birthday.split(' ')[0],
      signature: user.Remark,
      loading: true,
    });

  },
  btnPhoto: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        that.setData({
          photo: tempFilePaths[0],
          files: tempFilePaths
        });

      }
    });
  },
  //昵称
  setNickName: function(e) {
    this.data.userinfo.NickName = e.detail.value;
    this.setData({
      nickname: e.detail.value
    });
  },
  //签名
  signature: function(e) {
    this.data.userinfo.Signature = e.detail.value;
    this.setData({
      signature: e.detail.value
    });
  },
  //性别
  setSex: function(e) {
    this.data.userinfo.Sex = e.detail.value;
    this.setData({
      sex: this.data.sexArr[e.detail.value]
    });

  },
  //选择生日
  setBirthday: function(e) {
    this.data.userinfo.Birthday = e.detail.value;
    this.setData({
      birthday: e.detail.value
    });
  },
  btnSave: function() {
    var that = this;
    //启动上传等待中...  
    wx.showLoading({
      title: '正在保存...',
      icon: 'loading',
      mask: true
    });
    var files_ = that.data.files;
    if (files_.length > 0) {

      //存在图片先上传图片
      base.uploadimgToCallback({
        url: '/api/Upload/Pic',
        imgData: {
          path: "/upload/MiniApp/" + base.config.openid
        },
        filestr: "",
        path: files_ //这里是选取的图片的地址数组,
      }, this.saveFrom);
    } else {
      that.saveFrom({
        filestr: null
      });
    }

  },
  saveFrom: function(fileData) {
    var that = this;
    var model = base.config.userinfo;
    model.Id = that.data.userinfo.Id;
    if (fileData.filestr != null) {
      model.Avatar = fileData.filestr;
    }
    model.NickName = that.data.nickname;
    model.Birthday = that.data.birthday + " 00:00:00";
    model.Remark = that.data.signature;
    model.Gender = that.data.sex;
    base.postAjaxEntity({
      url: "/api/User/UpdateUserInfo",
      data: model,
    }, function(obj) {
      base.config.userinfo = obj.userInfo;
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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