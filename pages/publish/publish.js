// pages/publish/publish.js
const store = require('../../utils/store.js')

const COLORS = ['#2d7d5a', '#c0392b', '#8e44ad', '#d68910', '#1f618d', '#117a65']

Page({
  data: {
    title: '',
    author: '',
    category: '计算机',
    categories: ['计算机', '文学', '历史', '其他'],
    desc: '',
    color: COLORS[0],
    colors: COLORS
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    const obj = {}
    obj[field] = e.detail.value
    this.setData(obj)
  },

  onPickCategory(e) {
    this.setData({ category: e.currentTarget.dataset.cat })
  },

  onPickColor(e) {
    this.setData({ color: e.currentTarget.dataset.color })
  },

  onSubmit() {
    const d = this.data
    if (!d.title.trim()) {
      wx.showToast({ title: '请填写书名', icon: 'none' })
      return
    }
    if (!d.author.trim()) {
      wx.showToast({ title: '请填写作者', icon: 'none' })
      return
    }

    const user = store.getUser()
    if (!user) {
      wx.showModal({
        title: '还没登录',
        content: '发布前请先到「我的」页面登录',
        showCancel: false
      })
      return
    }

    store.addBook({
      title: d.title.trim(),
      author: d.author.trim(),
      category: d.category,
      desc: d.desc.trim() || '暂无简介',
      color: d.color,
      owner: user.nickname
    })

    wx.showToast({ title: '发布成功', icon: 'success' })
    this.setData({ title: '', author: '', desc: '' })
    setTimeout(function () {
      wx.switchTab({ url: '/pages/index/index' })
    }, 800)
  }
})
