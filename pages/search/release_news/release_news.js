var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    content: "",
    Loading: false,
    filestr: ""
  },

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  bindTextAreaBlur: function(e) {
    this.setData({
      content: e.detail.value
    })

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

  },
  formSubmit: function(e) {
    var that = this;

    var files = that.data.files;
    if (that.data.content == "" || files.length == 0) {
      wx.showToast({
        icon: "none",
        title: '请说点什么...',
        duration: 700
      })
      return;
    }

    if (files.length > 0) {
      //存在图片先上传图片
      base.uploadimgToCallback({
        url: '/api/Upload/Pic',
        imgData: {
          path: "/Resource/Mini/" + base.config.openid + "/Neighbor"
        },
        filestr: "",
        path: files //这里是选取的图片的地址数组,
      }, that.SaveForm);
    } else {
      that.SaveForm({
        filestr: ""
      });
    }

  },

  //提交表单
  SaveForm: function(data) {
    var that = this;
    var info = {
      Content: that.data.content,
      Country: base.config.userinfo.Country,
      Province: base.config.userinfo.Province,
      City: base.config.userinfo.City,
      District: base.config.userinfo.Area,
      FullAddress: base.config.userinfo.AddressDetail,
      Longitude: base.config.userinfo.Longitude,
      Latitude: base.config.userinfo.Latitude,
      Status: 0,
      Photo: data.filestr,
      Hits: 0,
      IsYes: 0,
      IsNo: 0,
      Comment: 0,
      IsTop: 0,
      IsHot: 0,
      DeleteMark: 0,
      CreateUserId: base.config.userinfo.Id,
      CreateUserName: base.config.userinfo.NickName
    }

    base.postAjaxEntity({
      url: "/api/Neighbor/SaveNeighbor",
      data: info
    }, function(res) {
      wx.showToast({
        icon: "none",
        title: '发布成功',
        duration: 700
      })
      setTimeout(function() {
        wx.redirectTo({
          url: '../circle_friends/circle_friends'
        })
      }, 1000)
    })
  },

})