var dateTimePicker = require('../../../utils/dateTimePicker.js');
var base = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dateTimeStarArray: null,
    dateTimeStar: null,
    dateTimeStarStr: "",
    dateTimeEndArray: null,
    dateTimeEnd: null,
    dateTimeEndStr: "",
    files: [],
    title: "",
    position: "",
    money: 0,
    content: "",
    isSave: true,
    damanID: "",
    startYear: 1978,
    endYear: 2100,
    baseUrl: base.config.baseurl,
    httpImg: '',
    /*原来的图片*/
  },

  initData: function(did) {
    var that = this;
    //调用接口
    base.getAjax({
      url: "/api/Demand/GetDemandDetail",
      data: {
        id: did
      },
    }, function(obj) {
      var photoArr = [];
      if (obj.Photo) {
        var imgList = obj.Photo.split(',');
        for (var i = 0; i < imgList.length; i++) {
          var photourl = that.data.baseUrl + imgList[i];
          photoArr.push(photourl);
        }
      }
      var objEditStar = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, obj.BeginDate);
      var objEditEnd = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, obj.EndDate);

      that.setData({
        title: obj.Title,
        position: obj.Position,
        money: obj.Money.toFixed(2),
        content: obj.Content,
        dateTimeStarStr: obj.BeginDate,
        dateTimeStar: objEditStar.dateTime,
        dateTimeEndStr: obj.EndDate,
        dateTimeEnd: objEditEnd.dateTime,
        files: photoArr,
        httpImg: obj.Photo
      });
    })
  },

  changeDateTimeStar(e) {
    this.setData({
      dateTimeStar: e.detail.value
    });
  },

  changeDateTimeColumnStar(e) {
    var arr = this.data.dateTimeStar,
      dateArr = this.data.dateTimeStarArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    var timesStar = dateArr[0][arr[0]] +
      '-' + dateArr[1][arr[1]] +
      '-' + dateArr[2][arr[2]] +
      ' ' + dateArr[3][arr[3]] +
      ':' + dateArr[4][arr[4]];
    this.setData({
      dateTimeStarArray: dateArr,
      dateTimeStar: arr,
      dateTimeStarStr: timesStar,
    });
  },

  changeDateTimeEnd(e) {
    this.setData({
      dateTimeEnd: e.detail.value
    });
  },

  changeDateTimeColumnEnd(e) {
    var arrEnd = this.data.dateTimeEnd,
      dateEndArr = this.data.dateTimeEndArray;

    arrEnd[e.detail.column] = e.detail.value;
    dateEndArr[2] = dateTimePicker.getMonthDay(dateEndArr[0][arrEnd[0]], dateEndArr[1][arrEnd[1]]);

    var timessEnd = dateEndArr[0][arrEnd[0]] +
      '-' + dateEndArr[1][arrEnd[1]] +
      '-' + dateEndArr[2][arrEnd[2]] +
      ' ' + dateEndArr[3][arrEnd[3]] +
      ':' + dateEndArr[4][arrEnd[4]];
    this.setData({
      dateTimeEndArray: dateEndArr,
      dateTimeEnd: arrEnd,
      dateTimeEndStr: timessEnd,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var objStar = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var objEnd = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = objStar.dateTimeArray.pop();
    var lastTime = objStar.dateTime.pop();

    var lastEndArray = objEnd.dateTimeArray.pop();
    var lastEndTime = objEnd.dateTime.pop();

    this.setData({
      dateTimeStarArray: objStar.dateTimeArray,
      dateTimeStar: objStar.dateTime,
      dateTimeStarStr: base.formatTime(new Date()),
      dateTimeEndArray: objEnd.dateTimeArray,
      dateTimeEnd: objEnd.dateTime,
      dateTimeEndStr: base.formatTime(new Date()),
    });
    //需求ID 

    if (options.did && options.did.length > 0) {
      this.setData({
        damanID: options.did
      })
      this.initData(this.data.damanID);
    }

  },

  getTitle: function(e) {
    this.setData({
      title: e.detail.value
    });
  },
  getPosition: function(e) {
    this.setData({
      position: e.detail.value
    });
  },
  getMoney: function(e) {
    this.setData({
      money: e.detail.value
    });
  },
  getContent: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  chooseImage: function(e) {
    var that = this;
    var num = 9;
    if (that.data.files.length > 0) {
      num = num - that.data.files.length;
    }
    if (num == 0) {
      wx.showToast({
        title: '最多上传9张图',
        icon: "none",
        duration: 1500
      });
      return false;
    }
    wx.chooseImage({
      count: num,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        //判断图片是否超出,超出则删除后面的图片
        var list = [];
        if (res.tempFilePaths.length > num) {
          for (var z = 0; z < num; z++) {
            list.push(res.tempFilePaths[z]);
          }
        } else {
          list = res.tempFilePaths;
        }
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(list)
        });
      }
    })
  },
  //发布需求
  SaveDemand: function() {
    var that = this;
    if (!that.data.isSave) {
      return false;
    }
    var flag = that.setExFrom();
    if (!flag) {
      that.setData({
        isSave: true,

      });
      return false;
    }
    var files = that.data.files;
    if (files.length > 0) {
      for (var z = 0; z < files.length; z++) {
        if (files[z].indexOf("https") != -1) {
          files.splice(z, 1);
          z--;
        }
      }

      //存在图片先上传图片
      base.uploadimgToCallback({
        url: '/api/Upload/Pic',
        imgData: {
          path: "/upload/MiniApp/" + base.config.openid + '/Demand'
        },
        filestr: "",
        path: files //这里是选取的图片的地址数组,
      }, this.SaveForm);
    } else {
      this.SaveForm({
        filestr: ""
      });
    }

  },
  //提交表单
  SaveForm: function(fileData) {
    var that = this;
    var newsPhoto = fileData.filestr;

    if (newsPhoto == '' && that.data.httpImg != '') {
      newsPhoto = that.data.httpImg;
    } else if (newsPhoto != '' && that.data.httpImg != '') {
      newsPhoto += "," + that.data.httpImg;
    }
    if (newsPhoto.charAt(0) == ',') {
      newsPhoto = newsPhoto.substr(1);
    }
    var info = {
      Id: that.data.damanID,
      Title: that.data.title,
      Position: that.data.position,
      BeginDate: that.data.dateTimeStarStr + ':00',
      EndDate: that.data.dateTimeEndStr + ':00',
      Money: that.data.money,
      Content: that.data.content,

      Country: base.config.userinfo.Country,
      Province: base.config.userinfo.Province,
      City: base.config.userinfo.City,
      District: base.config.userinfo.Area,
      FullAddress: base.config.userinfo.AddressDetail,
      Longitude: base.config.userinfo.Longitude,
      Latitude: base.config.userinfo.Latitude,
      Photo: newsPhoto,
      Status: 0,
      DeleteMark: 0,
      UserId: base.config.userinfo.Id,
      CreateUserId: base.config.userinfo.Id,
      CreateUserName: base.config.userinfo.NickName
    }


    if (that.data.damanID && that.data.damanID.length > 0) {

      base.postAjaxEntity({
        url: "/api/Demand/UpdateDemand",
        data: info
      }, function(obj) {
        that.setData({
          loading: true,
          isSave: true
        });
        wx.showToast({
          title: "修改成功",
          icon: 'none',
          duration: 1000
        });

        setTimeout(function() {
          wx.navigateBack({

          })
        }, 500);
      });
    } else {
      base.postAjaxEntity({
        url: "/api/Demand/SaveDemand",
        data: info
      }, function(obj) {
        that.setData({
          loading: true,
          isSave: true
        });
        wx.showToast({
          title: "发布成功",
          icon: 'none',
          duration: 1000
        });

        setTimeout(function() {
          wx.navigateBack({

          })
        }, 500);
      });
    }
  },
  setExFrom: function() {
    var flag = true;
    var that = this;
    var info = {
      Title: that.data.title,
      Position: that.data.position,
      BeginDate: that.data.dateTimeStarStr,
      EndDate: that.data.dateTimeEndStr,
      Money: that.data.money,
      Content: that.data.content
    };
    if (info.Title == "") {
      wx.showToast({
        title: '请填写需求描述',
        icon: "none"
      });
      flag = false;
    } else if (info.Position == "") {
      wx.showToast({
        title: '请填写详细地址',
        icon: "none"
      });
      flag = false;
    } else if (info.Money == "") {
      wx.showToast({
        title: '请填写计划花费',
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