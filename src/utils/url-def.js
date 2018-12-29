import {baseUrl} from './common-def.js';
// var mcpUrl = baseUrl + '/mcp';
var proxyBase = baseUrl + '/proxy';
var yyhBase = baseUrl + '/ydqc';

export var urls = {
  proxy_identify: proxyBase + '/miniprogram/authentication/identify.json',
  proxy_register: proxyBase + '/miniprogram/authentication/register.json',
  yyh_mineral_price_enterprise_sale_manual_list: yyhBase + '/mineral/price/enterprise-sale/manual/list.json',
  yyh_mineral_price_enterprise_sale_manual_find_one: yyhBase + '/api/mineral/price/enterprise-sale/manual/find-one.json',
  yyh_mineral_price_enterprise_sale_manual_save: yyhBase + '/api/mineral/price/enterprise-sale/manual/save.json',
  yyh_mineral_price_enterprise_sale_manual_detail_delete: yyhBase + '/api/mineral/price/enterprise-sale/manual/detail/delete.json',
  yyh_mineral_base_enterprise_list: yyhBase + '/api/mineral/base/enterprise/list.json',
  yyh_mineral_base_enterprise_spec_query_all: yyhBase + '/api/mineral/base/enterprise/spec/query-all.json'

};
