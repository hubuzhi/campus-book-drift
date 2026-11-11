// components/book-card/book-card.js
// 自定义组件：接收 book 属性，点击时向父页面抛出 tap 事件
Component({
  properties: {
    book: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      // triggerEvent 把数据传给父页面，由父页面决定跳转
      this.triggerEvent('booktap', { id: this.data.book.id })
    }
  }
})
