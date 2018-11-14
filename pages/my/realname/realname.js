
const base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    zcardpic: "",
    fcardpic: "",
    frontCard: "/image/sfz2@2x.png",
    behindCard: "/image/sfz1@2x.png",
    username: "",
    cardid: "",
    status: -1,
    remark: "待审核"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!base.config.hasLogin) {
      this.setData({
        loading: true,
      });
      wx.showToast({
        title: "请登陆",
        icon: 'none',
        duration: 1000
      });

      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500);
      return false;
    }
    var that = this;
    base.getAjax({
      url: '/api/User/GetUserVerifyRecord',
      data: { uid: base.config.userinfo.Id }
    }, function (obj) {
      that.setData({
        loading: true,
        // frontCard: "/images/addpic.png",
        // behindCard: "/images/addpic.png",
        frontCard: "/image/sfz2@2x.png",
        behindCard: "/image/sfz1@2x.png",
      });
      var res = obj.userInfo;
      if (res != null) {
        var sts = res.Status;
        var remark_ = that.data.remark;
        if (sts == 1) {
          remark_ = "审核通过";
        } else if (sts == 2) {
          remark_ = "审核不通过";
        }
        that.setData({
          username: res.UserName,
          cardid: res.CardId,
          status: sts,
          frontCard: base.config.baseurl + res.FrontCard,
          behindCard: base.config.baseurl + res.BehindCard,
          remark: remark_
        });
      }
    });

  },
  setUserName: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  setCardID: function (e) {
    this.setData({
      cardid: e.detail.value
    })
  },
  //身份证正面
  z_btnPhoto: function () {
    this.uploadCardPic(0);
  },
  //身份证反面
  f_btnPhoto: function () {
    this.uploadCardPic(1);
  },
  //图片拍照
  uploadCardPic: function (types) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        if (types == 0) {
          that.setData({
            zcardpic: tempFilePaths,
            frontCard: tempFilePaths,
          });
        } else {
          that.setData({
            fcardpic: tempFilePaths,
            behindCard: tempFilePaths,
          });
        }
      }
    });
  },
  //上传图片 + 提交表单
  btnSave: function (e) {
    var that = this;
    var formObj = that.data;
    var title = "";
    if (formObj.username == "") {
      title = "请填写姓名";
    } else if (formObj.cardid == "") {
      title = "请填写身份证号码";
    } else if (formObj.frontCard == "") {
      title = "请上传身份证正面图";
    } else if (formObj.behindCard == "") {
      title = "请上传身份证反面图";
    }
    if (title != "") {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1000
      });
      return;
    }
    that.setData({
      loading: false
    });
    var list = [];
    if (that.data.zcardpic != "") {
      list.push(that.data.zcardpic);
    }
    if (that.data.fcardpic != "") {
      list.push(that.data.fcardpic);
    }
    if (list.length > 0) {
      //存在图片先上传图片
      base.uploadimgToCallback({
        url: '/api/Upload/Pic',//这里是你图片上传的接口
        imgData: {
          path: "/Resource/Mini/" + base.config.openid + "/Card"
        },
        filestr: "",
        path: list//这里是选取的图片的地址数组,
      }, that.btnForm);
    } else {
      //直接提交表单
      that.btnForm(null);
    }
  },
  //提交表单
  btnForm: function (fileModel) {
    var that = this;
    var frontCard = that.data.frontCard.replace(base.config.baseurl, '');
    var behindCard = that.data.behindCard.replace(base.config.baseurl, '');
    if (fileModel != null) {
      frontCard = fileModel.filestr.split(',')[0];
      behindCard = fileModel.filestr.split(',')[1];
    }

    var info = {
      UserId: base.config.userinfo.Id,
      UserName: that.data.username,
      FrontCard: frontCard,
      BehindCard: behindCard,
      CardId: that.data.cardid,
      CreateUserName: base.config.userinfo.NickName
    };

    base.postAjaxEntity({
      url: '/api/User/AddUserVerifyRecord',
      data: info
    }, function (res) {
      wx.showLoading({
        title: '成功,2秒后跳转',
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500);
    });
  },
  // //上传图片方法
  // uploadimg: function (type_, file_) {
  //   //存在图片先上传图片
  //   base.uploadimgToCallback({
  //     url: '/api/Upload/Pic',
  //     imgData: {
  //       path: "/upload/MiniApp/" + base.config.openid
  //     },
  //     filestr: "",
  //     path: files_//这里是选取的图片的地址数组,
  //   }, function (fileModel) {
  //     if (type_ == "front") {
  //       that.setData({
  //         frontCard: fileModel.filesstr,
  //       })
  //     } else if (type_ == "behind") {
  //       that.setData({
  //         behindCard: fileModel.filesstr,
  //       })
  //     }
  //   });
  // },
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