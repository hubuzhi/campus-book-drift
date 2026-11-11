// pages/detail/detail.js
const store = require('../../utils/store.js')

Page({
  data: {
    book: null,
    collected: false
  },

  onLoad(options) {
    const book = store.getBook(options.id)
    if (!book) {
      wx.showToast({ title: '图书不存在', icon: 'none' })
      return
    }
    this.setData({
      book: book,
      collected: store.isCollected(book.id)
    })
    wx.setNavigationBarTitle({ title: book.title })
  },

  // 收藏 / 取消收藏
  onCollect() {
    const res = store.toggleCollect(this.data.book.id)
    this.setData({ collected: res })
    wx.showToast({ title: res ? '已加入书架' : '已移出书架', icon: 'none' })
  },

  // 借阅 / 归还
  onToggleStatus() {
    const b = this.data.book
    const next = b.status === 'available' ? 'borrowed' : 'available'
    store.setStatus(b.id, next)
    this.setData({ 'book.status': next })
    wx.showToast({ title: next === 'borrowed' ? '借阅成功' : '已归还', icon: 'none' })
  }
})
