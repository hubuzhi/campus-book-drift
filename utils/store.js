// utils/store.js
// 本地数据层：用 Storage 模拟数据库。
// 后续接入云开发时，只需把这里的实现换成云函数调用，页面代码不用改。

const KEY_BOOKS = 'books'
const KEY_COLLECT = 'collect'
const KEY_USER = 'user'

const SEED = [
  { id: 1, title: '深入理解计算机系统', author: 'Randal E. Bryant', category: '计算机', desc: '从程序员视角理解计算机系统，讲透数据表示、汇编、链接、虚拟内存与并发。', color: '#2d7d5a', owner: '图书馆', status: 'available', createdAt: 1700000000000 },
  { id: 2, title: 'Java 编程思想', author: 'Bruce Eckel', category: '计算机', desc: 'Java 经典入门与进阶读物，面向对象思想讲得很细。', color: '#c0392b', owner: '张同学', status: 'available', createdAt: 1700100000000 },
  { id: 3, title: '活着', author: '余华', category: '文学', desc: '讲述一个人和他命运之间的友情，平静而有力量。', color: '#8e44ad', owner: '李同学', status: 'borrowed', createdAt: 1700200000000 },
  { id: 4, title: '万历十五年', author: '黄仁宇', category: '历史', desc: '从 1587 年切入，透视明代制度的深层结构。', color: '#d68910', owner: '王同学', status: 'available', createdAt: 1700300000000 },
  { id: 5, title: '算法导论', author: 'Thomas H. Cormen', category: '计算机', desc: '算法领域的标准教材，覆盖排序、图论、动态规划等。', color: '#1f618d', owner: '图书馆', status: 'available', createdAt: 1700400000000 },
  { id: 6, title: '人类简史', author: '尤瓦尔·赫拉利', category: '历史', desc: '从认知革命讲到人工智能，重新理解人类的发展路径。', color: '#117a65', owner: '赵同学', status: 'available', createdAt: 1700500000000 }
]

/** 首次启动写入示例数据 */
function initData() {
  if (!wx.getStorageSync(KEY_BOOKS)) {
    wx.setStorageSync(KEY_BOOKS, SEED)
  }
  if (!wx.getStorageSync(KEY_COLLECT)) {
    wx.setStorageSync(KEY_COLLECT, [])
  }
}

/** 取全部图书 */
function getBooks() {
  return wx.getStorageSync(KEY_BOOKS) || []
}

/** 按 id 取一本 */
function getBook(id) {
  return getBooks().find(function (b) { return b.id === Number(id) }) || null
}

/** 新增图书（发布） */
function addBook(book) {
  const list = getBooks()
  const maxId = list.reduce(function (m, b) { return Math.max(m, b.id) }, 0)
  const item = Object.assign({
    id: maxId + 1,
    status: 'available',
    createdAt: Date.now()
  }, book)
  list.unshift(item)
  wx.setStorageSync(KEY_BOOKS, list)
  return item
}

/** 更新借阅状态 */
function setStatus(id, status) {
  const list = getBooks()
  const idx = list.findIndex(function (b) { return b.id === Number(id) })
  if (idx >= 0) {
    list[idx].status = status
    wx.setStorageSync(KEY_BOOKS, list)
  }
}

/** 收藏 / 取消收藏，返回最新状态 */
function toggleCollect(id) {
  const list = wx.getStorageSync(KEY_COLLECT) || []
  const nid = Number(id)
  const i = list.indexOf(nid)
  if (i >= 0) {
    list.splice(i, 1)
  } else {
    list.push(nid)
  }
  wx.setStorageSync(KEY_COLLECT, list)
  return i < 0
}

/** 是否已收藏 */
function isCollected(id) {
  const list = wx.getStorageSync(KEY_COLLECT) || []
  return list.indexOf(Number(id)) >= 0
}

/** 收藏夹里的书 */
function getCollectedBooks() {
  const ids = wx.getStorageSync(KEY_COLLECT) || []
  return getBooks().filter(function (b) { return ids.indexOf(b.id) >= 0 })
}

/** 我发布的书（未登录时返回空数组） */
function getMyBooks(owner) {
  if (!owner) return []
  return getBooks().filter(function (b) { return b.owner === owner })
}

/** 登录（本地模拟，仅保存昵称） */
function login(nickname) {
  const user = { nickname: nickname, loginAt: Date.now() }
  wx.setStorageSync(KEY_USER, user)
  return user
}

function logout() {
  wx.removeStorageSync(KEY_USER)
}

function getUser() {
  return wx.getStorageSync(KEY_USER) || null
}

module.exports = {
  initData: initData,
  getBooks: getBooks,
  getBook: getBook,
  addBook: addBook,
  setStatus: setStatus,
  toggleCollect: toggleCollect,
  isCollected: isCollected,
  getCollectedBooks: getCollectedBooks,
  getMyBooks: getMyBooks,
  login: login,
  logout: logout,
  getUser: getUser
}
