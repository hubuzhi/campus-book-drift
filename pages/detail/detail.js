// pages/detail/detail.js
const store = require('../../utils/store.js')

Page({
  data: {
    book: null,
    collected: false,
    related: []
  },

  onLoad(options) {
    const book = store.getBook(options.id)
    if (!book) {
      wx.showToast({ title: '图书不存在', icon: 'none' })
      return
    }
    // 同分类的其它书，最多 3 本
    const related = store.getBooks()
      .filter(function (b) { return b.category === book.category && b.id !== book.id })
      .slice(0, 3)

    this.setData({
      book: book,
      collected: store.isCollected(book.id),
      related: related
    })
    wx.setNavigationBarTitle({ title: book.title })
  },

  onCollect() {
    const res = store.toggleCollect(this.data.book.id)
    this.setData({ collected: res })
    wx.showToast({ title: res ? '已加入书架' : '已移出书架', icon: 'none' })
  },

  onToggleStatus() {
    const b = this.data.book
    const next = b.status === 'available' ? 'borrowed' : 'available'
    store.setStatus(b.id, next)
    this.setData({ 'book.status': next })
    wx.showToast({
      title: next === 'borrowed' ? '借阅成功' : '已归还',
      icon: 'none'
    })
  },

  onRelatedTap(e) {
    const id = e.currentTarget.dataset.id
    // 用 redirectTo 避免详情页无限堆栈
    wx.redirectTo({ url: '/pages/detail/detail?id=' + id })
  },

  onBack() {
    wx.navigateBack()
  }
})
