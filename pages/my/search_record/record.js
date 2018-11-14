// pages/search/index.js
var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    lognum: 0,
    inputVal: "",
    location: "",
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
      rent: "500-1000",
      image: "",
    }, {
      rent: "1000-2000",
      image: "",
    }, {
      rent: "2000-3000",
      image: "",
    }],
    //户型
    roomList: [{
      room: "一室一厅",
      image: "",
    }, {
      room: "两室一厅",
      image: "",
    }, {
      room: "两室两厅",
      image: "",
    }, {
      room: "三室一厅",
      image: "",
    }],
    //方式
    wayList: [{
      way: "押一付三",
      image: "",
    }, {
      way: "押一付一",
      image: "",
    }, {
      way: "押二付一",
      image: "",
    }],
    mask1Hidden: true,
    maskRentHidden: true,
    maskRoomHidden: true,
    maskWayHidden: true,
    rentSelected: "租金",
    roomTypeSelected: "户型",
    sortSelected: "排序",
    waySelected: "方式",

    room_list: [
      //   {
      //   id: "",
      //   content: '带车位房,香蜜三窗,业主诚心出租，有意联系...',
      //   image: [],
      //   position: '东莞',
      //   time: '2018-04-08',
      //   type: '一室一厅 60平方米 押一付一',
      //   price: '¥3000/月'
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (base.config.hasLogin) {
      this.getRecordList();
    }
  },
  getRecordList: function () {
    var that = this;

    //动态参数
    var pagination = {
      rows: 20,
      page: 1,
      sidx: 'ViewDate',
      sord: 'desc',
      queryJson: JSON.stringify(
        [{
          "groupOp": "AND", "rules": [
            { "field": "UserId", "op": "=", "data": base.config.userinfo.Id }
          ]
        }]
      )
    };
    base.postAjaxEntity({
      url: '/api/House/GetRecordJson',
      data: pagination
    }, function (res) {
      var list = [];
      for (var i = 0; i < res.length; i++) {
        var obj = res[i];
        var img_list = [];
        if (obj.Photo != "") {
          var polist = obj.Photo.split(',');
          for (var img = 0; img < polist.length; img++) {
            img_list.push(base.config.baseurl + polist[img]);
          }
        }
        var msg = {
          id: obj.Id,
          content: obj.Title,
          image: img_list,
          position: obj.City,
          time: obj.CreateDate,
          type: [obj.HouseType, obj.HouseArea + 'mm', obj.DepositMethod],
          price: '¥' + obj.HouseRent + '/月'
        }
        list.push(msg);
      }
      that.setData({
        lognum: list.length,
        room_list: list
      })
    })
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