import api from '../../../../api';

const apiService = {
  getTitleWordFrequency: async (limit, timeRange) => {
    const response = await api.get(`/api/newsfeed/title_word_frequency?limit=${limit}&time_range=${timeRange}`);
    return response.data;
  },
  getTopIocs: async (iocType, limit, timeRange) => {
    const response = await api.get(`/api/newsfeed/iocs/top?ioc_type=${iocType}&limit=${limit}&time_range=${timeRange}`);
    return response.data;
  },
  getTopCves: async (limit, timeRange) => {
    const response = await api.get(`/api/newsfeed/cves/top?limit=${limit}&time_range=${timeRange}`);
    return response.data;
  },
  getArticlesByIds: async (articleIds) => {
    const response = await api.post('/api/newsfeed/articles/bulk', articleIds);
    return response.data;
  },
  getIocTypeDistribution: async (timeRange) => {
    const response = await api.get(`/api/newsfeed/iocs/distribution?time_range=${timeRange}`);
    return response.data;
  },
};

export default apiService;