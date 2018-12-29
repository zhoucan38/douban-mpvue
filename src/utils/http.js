import {CorsHttpProvider, HttpProvider} from './ext-http.js';
import {app, baseUrl} from './common-def.js';

export var corsHttp = new CorsHttpProvider(new HttpProvider(), baseUrl + '/mcp/login.json', baseUrl + '/mcp/login.json', app.id);
