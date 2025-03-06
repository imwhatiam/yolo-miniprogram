import { API } from '../../config';
Page({
  data: {
    id: 1,
    title: '',
    items: [],
    isAllExpanded: false
  },

  onShareTimeline: function () {
    return {
      title: this.data.title,
      query: 'itemID=${this.data.id}',
    };
  },

  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: `/pages/index/index?itemID=${this.data.id}`
    };
  },

  onLoad(options) {
    wx.showLoading({ title: '加载中...' });
    if (options.itemID !== undefined) {
      this.fetchData(parseInt(options.itemID));
    } else {
      this.fetchData(1);
    }
  },

  fetchData(itemID) {
    wx.request({
      url: API.checkList(itemID),
      success: res => {
        const data = res.data
        data.items.forEach(item => item.isExpanded = false)
        this.setData({ id: data.id })
        this.setData({ title: data.title })
        this.setData({ items: data.items })
        wx.hideLoading();
      }
    })
  },

  navigateToIndexPage(e) {
    const itemID = e.currentTarget.dataset.itemid;
    if (itemID === 45) {
      wx.navigateTo({
        url: `/pages/activity_list/activity_list`
      })
    } else {
      wx.navigateTo({
        url: `/pages/index/index?itemID=${itemID}`
      })
    }
  },

  toggleExpand(e) {
    const index = e.currentTarget.dataset.index
    const key = `items[${index}].isExpanded`
    this.setData({
      [key]: !this.data.items[index].isExpanded
    })
  },

  toggleAll() {
    const { items, isAllExpanded } = this.data
    items.forEach(item => item.isExpanded = !isAllExpanded)
    this.setData({
      items: items,
      isAllExpanded: !isAllExpanded
    })
  }
})