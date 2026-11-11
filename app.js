// app.js
const store = require('./utils/store.js')

App({
  globalData: {
    user: null
  },

  onLaunch() {
    // 首次启动时写入示例数据
    store.initData()
    // 恢复本地登录态
    const user = wx.getStorageSync('user')
    if (user) {
      this.globalData.user = user
    }
  }
})
