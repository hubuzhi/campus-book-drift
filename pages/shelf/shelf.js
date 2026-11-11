// pages/shelf/shelf.js
const store = require('../../utils/store.js')

Page({
  data: {
    tab: 'collect',
    collected: [],
    mine: []
  },

  onShow() {
    const user = store.getUser()
    this.setData({
      collected: store.getCollectedBooks(),
      mine: store.getMyBooks(user ? user.nickname : '')
    })
  },

  switchTab(e) {
    this.setData({ tab: e.currentTarget.dataset.tab })
  },

  onBookTap(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id })
  }
})
