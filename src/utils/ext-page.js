import {corsHttp} from '../utils/http.js';

var loadFun = function (options, pagination) {
  if (options.reload) {
    pagination = { currentPageNo: 0, items: [] };
  }
  var httpOption = options.httpOptions || {};
  httpOption.params = httpOption.params || {};
  httpOption.params['pageNum'] = pagination.currentPageNo + 1;
  return corsHttp.request(options.url, httpOption).then((_pagination) => {
    pagination.currentPageNo = _pagination.currentPageNo;
    pagination.pageCount = _pagination.pageCount;
    pagination.pageSize = _pagination.pageSize;
    pagination.totalCount = _pagination.totalCount;
    pagination.hasNextPage = _pagination.hasNextPage;
    pagination.items = pagination.items.concat(_pagination.items);
    return _pagination;
  }).catch((e) => {
    return Promise.reject(e);
  });
};

export { loadFun };
