// pages/index/index.js
const store = require('../../utils/store.js')

const PAGE_SIZE = 6

Page({
  data: {
    keyword: '',
    category: '全部',
    categories: ['全部', '计算机', '文学', '历史', '其他'],
    allBooks: [],
    list: [],
    page: 1,
    hasMore: false,
    loading: false
  },

  onShow() {
    this.refresh()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refresh()
    wx.stopPullDownRefresh()
  },

  // 触底加载下一页
  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return
    this.loadMore()
  },

  refresh() {
    const all = store.getBooks()
    this.setData({ allBooks: all, page: 1 }, () => {
      this.applyFilter()
    })
  },

  applyFilter() {
    const kw = this.data.keyword.trim()
    const cat = this.data.category
    let filtered = this.data.allBooks

    if (cat !== '全部') {
      filtered = filtered.filter(function (b) { return b.category === cat })
    }
    if (kw) {
      filtered = filtered.filter(function (b) {
        return (b.title + b.author).indexOf(kw) >= 0
      })
    }

    const page = this.data.page
    const slice = filtered.slice(0, page * PAGE_SIZE)
    this.setData({
      list: slice,
      hasMore: slice.length < filtered.length
    })
  },

  loadMore() {
    this.setData({ loading: true, page: this.data.page + 1 }, () => {
      this.applyFilter()
      this.setData({ loading: false })
    })
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value, page: 1 }, () => this.applyFilter())
  },

  onCategory(e) {
    this.setData({ category: e.currentTarget.dataset.cat, page: 1 }, () => this.applyFilter())
  },

  // 自定义组件抛出的点击事件
  onBookTap(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.detail.id })
  }
})
