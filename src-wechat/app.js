App({
  globalData: {
    userInfo: null,
    hasLogin: false
  },
  onLaunch() {
    wx.showShareMenu({
      withShareTicket: true
    });
  }
});
