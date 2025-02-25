Page({
  data: {
    date: '',
    industries: [],
  },

  onLoad() {
    this.fetchData();
  },

  fetchData() {
    const self = this;
    wx.showLoading({ title: '加载中...' }); // 新增 loading
    wx.request({
      url: 'https://www.lian-yolo.com/stock/api/big-rise-volume/?last_x_days=2',
      success(res) {
        wx.hideLoading(); // 隐藏 loading 
        if (res.statusCode === 200) {
          const data = res.data.data || res.data;
          const dates = Object.keys(data);
          if (dates.length === 0) return;

          const targetDate = dates[0];
          const industryData = data[targetDate];

          // 处理行业数据
          const industries = Object.entries(industryData)
            .map(([name, stocks]) => ({ name, count: stocks.length }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          self.setData({
            date: targetDate,
            industries,
          });
        } else {
          wx.hideLoading(); // 隐藏 loading
          const errMsg = res.data.error || '加载数据失败';
          wx.showToast({
            title: errMsg,
            icon: 'none'
          });
        }
      },
      fail() {
        wx.hideLoading(); // 隐藏 loading
      }
    });
  },

  handleIndustryTap(e) {
    const industry = e.currentTarget.dataset.industry;
    wx.navigateTo({
      url: `/pages/industry/industry?industry=${encodeURIComponent(industry)}`
    });
  },
});
