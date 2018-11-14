var base = getApp();

var cash_ = ['押一付三', '押一付二', '押一付一'];
var room_ = ['一室一厅', '两室一厅'];
var position_ = ['东北', '西南', '东西'];
var decoration_ = ['毛坯', '精装修'];
var type_ = ['别墅', '单元房', '民宿'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    housePic: "/image/needrend.jpeg",
    houseFiles: [],
    housePicIds: "",
    title: "",
    houseRent: 0,
    attr_list: [],
    attr_listStr: "",
    cash_list: [],
    cash_id: 0,
    cash_name: '',
    isCashClass: false,

    room_list: [],
    room_id: 0,
    room_name: '',
    isRoomClass: false,

    position_list: [],
    position_id: 0,
    position_name: '',
    isPositionClass: false,

    decoration_list: [],
    decoration_id: 0,
    decoration_name: '',
    isDecorationClass: false,

    type_list: [],
    type_id: 0,
    type_name: '',
    isTypeClass: false,
    isBtn: false,
    hasLocation: false,
    position: null
  },

  //获取房源配置
  getAttr: function() {
    var that = this;
    base.getAjax({
      url: "/api/House/GetHouseConfigList",
      data: {
        configStr: ""
      }
    }, function(obj) {
      var attr_data = obj;
      var attr_arr = [];
      for (var i = 0; i < attr_data.length; i++) {
        if (attr_data[i].name == "") {
          attr_data.splice(i, 1);
        }
        attr_data[i].value = i;
      }
      console.log(attr_data);
      that.setData({
        attr_list: obj
      });

    });
  },

  //标题
  SetTitle: function(e) {
    this.setData({
      title: e.detail.value
    });
  },
  //租金
  SetHouseRent: function(e) {
    this.setData({
      houseRent: e.detail.value
    });
  },
  //选择押金方式
  cashChange: function(e) {
    this.setData({
      cash_id: e.detail.value,
      cash_name: cash_[e.detail.value],
      isCashClass: true
    })
  },

  //初始化押金方式
  initCash: function() {
    var that = this;
    that.setData({
      cash_list: cash_,
      cash_name: cash_[0],
      cash_id: 0,
    });
  },

  //选择户型
  roomChange: function(e) {
    this.setData({
      room_id: e.detail.value,
      room_name: room_[e.detail.value],
      isRoomClass: true
    })
  },

  //初始化户型
  initRoom: function() {
    var that = this;
    that.setData({
      room_list: room_,
      room_name: room_[0],
      room_id: 0,
    });
  },

  //选择朝向
  positionChange: function(e) {
    this.setData({
      position_id: e.detail.value,
      position_name: position_[e.detail.value],
      isPositionClass: true
    })
  },

  //初始化朝向
  initPosition: function() {
    var that = this;
    that.setData({
      position_list: position_,
      position_name: position_[0],
      position_id: 0,
    });
  },

  //选择装修
  decorationChange: function(e) {
    this.setData({
      decoration_id: e.detail.value,
      decoration_name: decoration_[e.detail.value],
      isDecorationClass: true
    })
  },

  //初始化装修
  initDecoration: function() {
    var that = this;
    that.setData({
      decoration_list: decoration_,
      decoration_name: decoration_[0],
      decoration_id: 0,
    });
  },

  //选择住房类型
  typeChange: function(e) {
    this.setData({
      type_id: e.detail.value,
      type_name: type_[e.detail.value],
      isTypeClass: true
    })
  },

  //初始化住房类型
  initType: function() {
    var that = this;
    that.setData({
      type_list: type_,
      type_name: type_[0],
      type_id: 0,
    });
  },

  //房屋配置多选
  checkboxChange: function(e) {
    var items = this.data.attr_list,
      values = e.detail.value,
      str = "";
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value == values[j]) {
          items[i].checked = true;
          str += ',' + items[i].name;
          break
        }
      }
    }
    this.setData({
      attr_list: items,
      attr_listStr: str.substring(1)
    })
  },

  //选择房源位置
  chooseLocation: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        if (res.address == undefined) {
          return false;
        }
        that.setData({
          hasLocation: true,
          position: res,
          locationAddress: res.address
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAttr();
    this.getHouseSetting();
  },

  getHouseSetting: function() {
    var that = this;
    // 获取房屋配置信息接口
    base.getAjax({
      url: '/api/House/GetMultipleDataItemJson',
      dataType: 'json'
    }, function(list) {
      for (var i = 0; i < list.length; i++) {
        var key = list[i].KeyName;
        if (key == "fxf_DepositMethod") {
          cash_ = list[i].KeyList;
        } else if (key == "fxf_HouseType") {
          room_ = list[i].KeyList;
        } else if (key == "fxf_Orientation") {
          position_ = list[i].KeyList;
        } else if (key == "fxf_DecorationType") {
          decoration_ = list[i].KeyList;
        } else if (key == "fxf_UseType") {
          type_ = list[i].KeyList;
        }
      }

      that.initCash();
      that.initRoom();
      that.initPosition();
      that.initDecoration();
      that.initType();


    });

  },
  //房源上传图片
  uploadPic: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        that.setData({
          housePic: tempFilePaths,
          houseFiles: that.data.houseFiles.concat(res.tempFilePaths)
        });
      }
    });
  },
  //提交表单
  formSubmit: function(e) {
    var that = this;
    that.setData({
      isBtn: true,
    });
    var fromModel = e.detail.value;
    var Province = "",
      City = "";
    var position = that.data.position;
    if (position == null) {
      wx.showToast({
        title: "请选择房屋地点",
        icon: 'none',
        duration: 1000
      });
      that.setData({
        isBtn: false,
      });
      return false;
    } else {
      var address = position.address;
      var sp_1 = address.split('省');
      var sp_2 = sp_1[1].split('市');
      Province = sp_1[0] + "省";
      City = sp_2[0] + "市";
    }
    //存储房源信息
    var model = {
      Id: "",
      Photo: "",
      Title: fromModel.title,
      HouseRent: fromModel.houseRent,
      DepositMethod: that.data.cash_name,
      HouseType: that.data.room_name,
      Orientation: that.data.position_name,
      TotalFloors: fromModel.totalFloors, //总楼层  楼层使用输入的当时,不使用下拉
      FloorNum: fromModel.floorNum, //第几层 
      HouseArea: fromModel.houseArea,
      DecorationType: that.data.decoration_name,
      UseType: that.data.type_name,
      Configuration: that.data.attr_listStr, //房屋配置
      Country: "中国",
      Province: Province,
      City: City,
      District: "",
      Street: "",
      StreetNumber: "", //门牌号码
      Town: "", //镇
      Village: "", //村
      MapPointName: position.name, //地图自动获取
      MapAddress: position.address, //地图自动获取
      Longitude: position.longitude,
      Latitude: position.latitude,
      FullAddress: fromModel.fullAddress, //详细地址（输入）
      Remark: fromModel.remark, // 详情描述 无法输入
      ReleaseDate: base.formatTime(new Date())
    };

    //  楼层使用输入的当时,不使用下拉 --  详情描述 无法输入
    if (
      model.Title == "" || model.HouseRent == "" || model.DepositMethod == "" ||
      model.HouseType == "" || model.Orientation == "" || model.TotalFloors == "" ||
      model.FloorNum == "" || model.HouseArea == "" || model.DecorationType == "" ||
      model.UseType == "" || model.Configuration == "" || model.MapAddress == ""
    ) {
      wx.showToast({
        title: "信息不完善,无法发布",
        icon: 'none',
        duration: 1000
      });
      that.setData({
        isBtn: false,
      })
      return false;
    }

    var files = that.data.houseFiles;
    if (files.length > 0) {
      //存在图片先上传图片
      base.uploadimgToCallback({
          url: '/api/UpLoad/UploadHouseFile',
          imgData: {
            path: "/upload/MiniApp/" + base.config.openid
          },
          filestr: "",
          path: files, //这里是选取的图片的地址数组
          fromModel: model
        },
        that.saveHouse
      );
    } else {
      //直接提交表单
      that.saveHouse({
        fromModel: model,
        filestr: ""
      });
    }
  },
  //发布房源
  saveHouse: function(fileData) {
    var that = this;
    var model = fileData.fromModel;
    model.Photo = fileData.filestr;
    base.postAjaxEntity({
      url: '/api/House/SaveFormHouse',
      data: model
    }, function(res) {
      wx.showToast({
        title: "发布成功",
        icon: 'none',
        duration: 1000
      });

      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 1000);
    });

    //上传失败,放开按钮
    that.setData({
      isBtn: false,
    });

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