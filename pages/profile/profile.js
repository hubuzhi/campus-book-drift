// pages/profile/profile.js
const store = require('../../utils/store.js')

Page({
  data: {
    user: null,
    stats: { total: 0, collected: 0, mine: 0 }
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const user = store.getUser()
    const books = store.getBooks()
    this.setData({
      user: user,
      stats: {
        total: books.length,
        collected: store.getCollectedBooks().length,
        mine: user ? store.getMyBooks(user.nickname).length : 0
      }
    })
  },

  onLogin() {
    const that = this
    wx.showModal({
      title: '登录',
      editable: true,
      placeholderText: '输入昵称（模拟微信授权）',
      success(res) {
        if (res.confirm && res.content && res.content.trim()) {
          const user = store.login(res.content.trim())
          getApp().globalData.user = user
          that.refresh()
          wx.showToast({ title: '登录成功', icon: 'success' })
        }
      }
    })
  },

  onLogout() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          store.logout()
          getApp().globalData.user = null
          that.refresh()
        }
      }
    })
  }
})
