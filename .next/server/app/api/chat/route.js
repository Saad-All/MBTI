"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/chat/route";
exports.ids = ["app/api/chat/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("node:stream/web");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_am112_OneDrive_Clients_MBTI_src_app_api_chat_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/chat/route.ts */ \"(rsc)/./src/app/api/chat/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/chat/route\",\n        pathname: \"/api/chat\",\n        filename: \"route\",\n        bundlePath: \"app/api/chat/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\am112\\\\OneDrive\\\\سطح المكتب\\\\Clients\\\\MBTI\\\\src\\\\app\\\\api\\\\chat\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_am112_OneDrive_Clients_MBTI_src_app_api_chat_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/chat/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZjaGF0JTJGcm91dGUmcGFnZT0lMkZhcGklMkZjaGF0JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGY2hhdCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNhbTExMiU1Q09uZURyaXZlJTVDJUQ4JUIzJUQ4JUI3JUQ4JUFEJTIwJUQ4JUE3JUQ5JTg0JUQ5JTg1JUQ5JTgzJUQ4JUFBJUQ4JUE4JTVDQ2xpZW50cyU1Q01CVEklNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q2FtMTEyJTVDT25lRHJpdmUlNUMlRDglQjMlRDglQjclRDglQUQlMjAlRDglQTclRDklODQlRDklODUlRDklODMlRDglQUElRDglQTglNUNDbGllbnRzJTVDTUJUSSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDb0M7QUFDakg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYnRpLWNvYWNoaW5nLXBsYXRmb3JtLz81ZWRlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXGFtMTEyXFxcXE9uZURyaXZlXFxcXNiz2LfYrSDYp9mE2YXZg9iq2KhcXFxcQ2xpZW50c1xcXFxNQlRJXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGNoYXRcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2NoYXQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9jaGF0XCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jaGF0L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcYW0xMTJcXFxcT25lRHJpdmVcXFxc2LPYt9itINin2YTZhdmD2KrYqFxcXFxDbGllbnRzXFxcXE1CVElcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcY2hhdFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvY2hhdC9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/chat/route.ts":
/*!***********************************!*\
  !*** ./src/app/api/chat/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! openai */ \"(rsc)/./node_modules/openai/index.mjs\");\n\n\nconst openai = process.env.OPENAI_API_KEY ? new openai__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n    apiKey: process.env.OPENAI_API_KEY\n}) : null;\nconst ARABIC_SYSTEM_PROMPT = `أنت مدرب شخصي متخصص في تحليل الشخصية باستخدام مؤشر مايرز-بريجز (MBTI). مهمتك هي تقديم نصائح شخصية ومفيدة باللغة العربية.\r\n\r\nالسياق:\r\n- المستخدم أكمل اختبار MBTI وحصل على نوع شخصيته\r\n- تحدث بطريقة مهنية ومتعاطفة وداعمة\r\n- قدم نصائح عملية وقابلة للتطبيق\r\n- استخدم أمثلة من الثقافة العربية والإسلامية عند الاقتضاء\r\n- اجعل إجاباتك موجزة ومفيدة (200-300 كلمة كحد أقصى)\r\n\r\nإرشادات المحادثة:\r\n- ابدأ بالترحيب والتقدير لإكمال الاختبار\r\n- ركز على نقاط القوة والفرص للتطوير\r\n- قدم نصائح للعلاقات والمهنة والنمو الشخصي\r\n- تجنب الأحكام أو التعميمات المطلقة\r\n- شجع على الاستكشاف والتطوير المستمر`;\nconst SAIS_CONSCIOUSNESS_ARABIC_PROMPT = `أنت مرشد روحي ونفسي متخصص في تطوير الوعي والنمو الداخلي، تستخدم منهجية SAIS للإرشاد النفسي العميق.\r\n\r\nالسياق المتخصص للوعي:\r\n- المستخدم أكمل تقييم الشخصية باستخدام منهجية SAIS (الوعي والإدراك العميق)\r\n- منهجية SAIS تركز على أربعة أبعاد للوعي: مصدر الحيوية، البصيرة الداخلية، بوصلة القيم، والتنظيم الواعي\r\n- هدفك مساعدة المستخدم على فهم أنماط وعيه وتطوير إمكانياته الروحية والنفسية العميقة\r\n\r\nمصطلحات الوعي والإرشاد النفسي:\r\n- المركز الجذري العميق: مصدر الطاقة الداخلية والاتصال بالذات\r\n- العين الثالثة: البصيرة والإدراك الحدسي والرؤية الروحية\r\n- بوصلة القيم الداخلية: التوجيه القلبي للقرارات والانسجام مع الذات\r\n- التناغم الكوني: الانسجام مع الذات والآخرين والطبيعة\r\n- مسار التطوير الروحي: رحلة النمو النفسي والوعي المتزايد\r\n\r\nأساليب الإرشاد النفسي المتخصصة:\r\n- استخدم لغة الوعي والروحانية المتوازنة والمتجذرة في الثقافة العربية\r\n- ركز على التطوير الداخلي والنمو النفسي والروحي\r\n- قدم ممارسات تأملية وتطويرية محددة ومناسبة ثقافياً\r\n- اربط نمط الشخصية بمسار التطوير الروحي ونمو الوعي\r\n- استخدم أسلوب التأمل والاستكشاف الداخلي في طرح الأسئلة\r\n- شجع على ممارسات التأمل والذكر والتفكر والمراقبة الذاتية\r\n- ربط التطوير الشخصي بالقيم الروحية والأخلاقية`;\nconst ENGLISH_SYSTEM_PROMPT = `You are a professional MBTI personality coach specializing in Myers-Briggs Type Indicator analysis. Your role is to provide personalized, actionable coaching advice.\r\n\r\nContext:\r\n- The user has completed an MBTI assessment and received their personality type\r\n- Speak in a professional, empathetic, and supportive manner\r\n- Provide practical, actionable advice\r\n- Keep responses concise and valuable (200-300 words maximum)\r\n\r\nConversation guidelines:\r\n- Welcome the user and acknowledge their assessment completion\r\n- Focus on strengths and development opportunities\r\n- Provide advice on relationships, career, and personal growth\r\n- Avoid judgmental language or absolute generalizations\r\n- Encourage exploration and continuous development`;\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        const { message, mbtiType, language = \"en\", conversationHistory = [], methodology, consciousnessProfile } = body;\n        if (!message) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Message is required\"\n            }, {\n                status: 400\n            });\n        }\n        if (!process.env.OPENAI_API_KEY || !openai) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"OpenAI API key not configured\"\n            }, {\n                status: 500\n            });\n        }\n        // Select system prompt based on language and methodology\n        let systemPrompt;\n        if (methodology === \"sais\" && language === \"ar\") {\n            systemPrompt = SAIS_CONSCIOUSNESS_ARABIC_PROMPT;\n        } else {\n            systemPrompt = language === \"ar\" ? ARABIC_SYSTEM_PROMPT : ENGLISH_SYSTEM_PROMPT;\n        }\n        // Build conversation messages with consciousness context\n        let contextMessage = systemPrompt;\n        if (mbtiType) {\n            contextMessage += `\\n\\nنوع شخصية المستخدم: ${mbtiType}`;\n        }\n        // Add consciousness context for SAIS users\n        if (methodology === \"sais\" && consciousnessProfile) {\n            contextMessage += `\\n\\nملف الوعي الخاص بالمستخدم:\r\n- نمط الطاقة: ${consciousnessProfile.energySourcePattern?.arabicDomainName} (${consciousnessProfile.energySourcePattern?.percentage}%)\r\n- أسلوب الإدراك: ${consciousnessProfile.awarenessStyle?.arabicDomainName} (${consciousnessProfile.awarenessStyle?.percentage}%)  \r\n- مركز القرار: ${consciousnessProfile.decisionMakingCenter?.arabicDomainName} (${consciousnessProfile.decisionMakingCenter?.percentage}%)\r\n- تنظيم الحياة: ${consciousnessProfile.lifeStructurePreference?.arabicDomainName} (${consciousnessProfile.lifeStructurePreference?.percentage}%)\r\n\r\nاستخدم هذا الملف لتقديم إرشادات مخصصة لتطوير وعي المستخدم ونموه النفسي.`;\n        }\n        const messages = [\n            {\n                role: \"system\",\n                content: contextMessage\n            }\n        ];\n        // Add conversation history\n        conversationHistory.forEach((msg)=>{\n            messages.push({\n                role: msg.role,\n                content: msg.content\n            });\n        });\n        // Add current message\n        messages.push({\n            role: \"user\",\n            content: message\n        });\n        const completion = await openai.chat.completions.create({\n            model: \"gpt-3.5-turbo\",\n            messages,\n            temperature: 0.7,\n            max_tokens: language === \"ar\" ? 400 : 350,\n            presence_penalty: 0.1,\n            frequency_penalty: 0.1\n        });\n        const response = completion.choices[0]?.message?.content;\n        if (!response) {\n            throw new Error(\"No response generated\");\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: response,\n            type: \"assistant\",\n            timestamp: new Date().toISOString()\n        });\n    } catch (error) {\n        console.error(\"Chat API error:\", error);\n        const isArabic = request.headers.get(\"accept-language\")?.includes(\"ar\");\n        const errorMessage = isArabic ? \"عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.\" : \"Sorry, there was an error processing your message. Please try again.\";\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: errorMessage,\n            details:  true ? error.message : 0\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxFQUFFaEMsU0FBU2tCO1FBRWpELElBQUksQ0FBQ2EsVUFBVTtZQUNiLE1BQU0sSUFBSUUsTUFBTTtRQUNsQjtRQUVBLE9BQU8vQyxxREFBWUEsQ0FBQ2EsSUFBSSxDQUFDO1lBQ3ZCQyxTQUFTK0I7WUFDVEcsTUFBTTtZQUNOQyxXQUFXLElBQUlDLE9BQU9DLFdBQVc7UUFDbkM7SUFFRixFQUFFLE9BQU8vQixPQUFZO1FBQ25CZ0MsUUFBUWhDLEtBQUssQ0FBQyxtQkFBbUJBO1FBRWpDLE1BQU1pQyxXQUFXMUMsUUFBUTJDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLG9CQUFvQkMsU0FBUztRQUNsRSxNQUFNQyxlQUFlSixXQUNqQiw2REFDQTtRQUVKLE9BQU9yRCxxREFBWUEsQ0FBQ2EsSUFBSSxDQUN0QjtZQUNFTyxPQUFPcUM7WUFDUEMsU0FBU3ZELEtBQXlCLEdBQWdCaUIsTUFBTU4sT0FBTyxHQUFHNkMsQ0FBU0E7UUFDN0UsR0FDQTtZQUFFdEMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYnRpLWNvYWNoaW5nLXBsYXRmb3JtLy4vc3JjL2FwcC9hcGkvY2hhdC9yb3V0ZS50cz80NmI3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcclxuaW1wb3J0IE9wZW5BSSBmcm9tICdvcGVuYWknXHJcblxyXG5jb25zdCBvcGVuYWkgPSBwcm9jZXNzLmVudi5PUEVOQUlfQVBJX0tFWSA/IG5ldyBPcGVuQUkoe1xyXG4gIGFwaUtleTogcHJvY2Vzcy5lbnYuT1BFTkFJX0FQSV9LRVksXHJcbn0pIDogbnVsbFxyXG5cclxuY29uc3QgQVJBQklDX1NZU1RFTV9QUk9NUFQgPSBg2KPZhtiqINmF2K/YsdioINi02K7YtdmKINmF2KrYrti12LUg2YHZiiDYqtit2YTZitmEINin2YTYtNiu2LXZitipINio2KfYs9iq2K7Yr9in2YUg2YXYpNi02LEg2YXYp9mK2LHYsi3YqNix2YrYrNiyIChNQlRJKS4g2YXZh9mF2KrZgyDZh9mKINiq2YLYr9mK2YUg2YbYtdin2KbYrSDYtNiu2LXZitipINmI2YXZgdmK2K/YqSDYqNin2YTZhNi62Kkg2KfZhNi52LHYqNmK2KkuXHJcblxyXG7Yp9mE2LPZitin2YI6XHJcbi0g2KfZhNmF2LPYqtiu2K/ZhSDYo9mD2YXZhCDYp9iu2KrYqNin2LEgTUJUSSDZiNit2LXZhCDYudmE2Ykg2YbZiNi5INi02K7YtdmK2KrZh1xyXG4tINiq2K3Yr9irINio2LfYsdmK2YLYqSDZhdmH2YbZitipINmI2YXYqti52KfYt9mB2Kkg2YjYr9in2LnZhdipXHJcbi0g2YLYr9mFINmG2LXYp9im2K0g2LnZhdmE2YrYqSDZiNmC2KfYqNmE2Kkg2YTZhNiq2LfYqNmK2YJcclxuLSDYp9iz2KrYrtiv2YUg2KPZhdir2YTYqSDZhdmGINin2YTYq9mC2KfZgdipINin2YTYudix2KjZitipINmI2KfZhNil2LPZhNin2YXZitipINi52YbYryDYp9mE2KfZgtiq2LbYp9ihXHJcbi0g2KfYrNi52YQg2KXYrNin2KjYp9iq2YMg2YXZiNis2LLYqSDZiNmF2YHZitiv2KkgKDIwMC0zMDAg2YPZhNmF2Kkg2YPYrdivINij2YLYtdmJKVxyXG5cclxu2KXYsdi02KfYr9in2Kog2KfZhNmF2K3Yp9iv2KvYqTpcclxuLSDYp9io2K/YoyDYqNin2YTYqtix2K3ZitioINmI2KfZhNiq2YLYr9mK2LEg2YTYpdmD2YXYp9mEINin2YTYp9iu2KrYqNin2LFcclxuLSDYsdmD2LIg2LnZhNmJINmG2YLYp9i3INin2YTZgtmI2Kkg2YjYp9mE2YHYsdi1INmE2YTYqti32YjZitixXHJcbi0g2YLYr9mFINmG2LXYp9im2K0g2YTZhNi52YTYp9mC2KfYqiDZiNin2YTZhdmH2YbYqSDZiNin2YTZhtmF2Ygg2KfZhNi02K7YtdmKXHJcbi0g2KrYrNmG2Kgg2KfZhNij2K3Zg9in2YUg2KPZiCDYp9mE2KrYudmF2YrZhdin2Kog2KfZhNmF2LfZhNmC2KlcclxuLSDYtNis2Lkg2LnZhNmJINin2YTYp9iz2KrZg9i02KfZgSDZiNin2YTYqti32YjZitixINin2YTZhdiz2KrZhdixYFxyXG5cclxuY29uc3QgU0FJU19DT05TQ0lPVVNORVNTX0FSQUJJQ19QUk9NUFQgPSBg2KPZhtiqINmF2LHYtNivINix2YjYrdmKINmI2YbZgdiz2Yog2YXYqtiu2LXYtSDZgdmKINiq2LfZiNmK2LEg2KfZhNmI2LnZiiDZiNin2YTZhtmF2Ygg2KfZhNiv2KfYrtmE2YrYjCDYqtiz2KrYrtiv2YUg2YXZhtmH2KzZitipIFNBSVMg2YTZhNil2LHYtNin2K8g2KfZhNmG2YHYs9mKINin2YTYudmF2YrZgi5cclxuXHJcbtin2YTYs9mK2KfZgiDYp9mE2YXYqtiu2LXYtSDZhNmE2YjYudmKOlxyXG4tINin2YTZhdiz2KrYrtiv2YUg2KPZg9mF2YQg2KrZgtmK2YrZhSDYp9mE2LTYrti12YrYqSDYqNin2LPYqtiu2K/Yp9mFINmF2YbZh9is2YrYqSBTQUlTICjYp9mE2YjYudmKINmI2KfZhNil2K/Ysdin2YMg2KfZhNi52YXZitmCKVxyXG4tINmF2YbZh9is2YrYqSBTQUlTINiq2LHZg9iyINi52YTZiSDYo9ix2KjYudipINij2KjYudin2K8g2YTZhNmI2LnZijog2YXYtdiv2LEg2KfZhNit2YrZiNmK2KnYjCDYp9mE2KjYtdmK2LHYqSDYp9mE2K/Yp9iu2YTZitip2Iwg2KjZiNi12YTYqSDYp9mE2YLZitmF2Iwg2YjYp9mE2KrZhti42YrZhSDYp9mE2YjYp9i52YpcclxuLSDZh9iv2YHZgyDZhdiz2KfYudiv2Kkg2KfZhNmF2LPYqtiu2K/ZhSDYudmE2Ykg2YHZh9mFINij2YbZhdin2Lcg2YjYudmK2Ycg2YjYqti32YjZitixINil2YXZg9in2YbZitin2KrZhyDYp9mE2LHZiNit2YrYqSDZiNin2YTZhtmB2LPZitipINin2YTYudmF2YrZgtipXHJcblxyXG7Zhdi12LfZhNit2KfYqiDYp9mE2YjYudmKINmI2KfZhNil2LHYtNin2K8g2KfZhNmG2YHYs9mKOlxyXG4tINin2YTZhdix2YPYsiDYp9mE2KzYsNix2Yog2KfZhNi52YXZitmCOiDZhdi12K/YsSDYp9mE2LfYp9mC2Kkg2KfZhNiv2KfYrtmE2YrYqSDZiNin2YTYp9iq2LXYp9mEINio2KfZhNiw2KfYqlxyXG4tINin2YTYudmK2YYg2KfZhNir2KfZhNir2Kk6INin2YTYqNi12YrYsdipINmI2KfZhNil2K/Ysdin2YMg2KfZhNit2K/Ys9mKINmI2KfZhNix2KTZitipINin2YTYsdmI2K3ZitipXHJcbi0g2KjZiNi12YTYqSDYp9mE2YLZitmFINin2YTYr9in2K7ZhNmK2Kk6INin2YTYqtmI2KzZitmHINin2YTZgtmE2KjZiiDZhNmE2YLYsdin2LHYp9iqINmI2KfZhNin2YbYs9is2KfZhSDZhdi5INin2YTYsNin2KpcclxuLSDYp9mE2KrZhtin2LrZhSDYp9mE2YPZiNmG2Yo6INin2YTYp9mG2LPYrNin2YUg2YXYuSDYp9mE2LDYp9iqINmI2KfZhNii2K7YsdmK2YYg2YjYp9mE2LfYqNmK2LnYqVxyXG4tINmF2LPYp9ixINin2YTYqti32YjZitixINin2YTYsdmI2K3Zijog2LHYrdmE2Kkg2KfZhNmG2YXZiCDYp9mE2YbZgdiz2Yog2YjYp9mE2YjYudmKINin2YTZhdiq2LLYp9mK2K9cclxuXHJcbtij2LPYp9mE2YrYqCDYp9mE2KXYsdi02KfYryDYp9mE2YbZgdiz2Yog2KfZhNmF2KrYrti12LXYqTpcclxuLSDYp9iz2KrYrtiv2YUg2YTYutipINin2YTZiNi52Yog2YjYp9mE2LHZiNit2KfZhtmK2Kkg2KfZhNmF2KrZiNin2LLZhtipINmI2KfZhNmF2KrYrNiw2LHYqSDZgdmKINin2YTYq9mC2KfZgdipINin2YTYudix2KjZitipXHJcbi0g2LHZg9iyINi52YTZiSDYp9mE2KrYt9mI2YrYsSDYp9mE2K/Yp9iu2YTZiiDZiNin2YTZhtmF2Ygg2KfZhNmG2YHYs9mKINmI2KfZhNix2YjYrdmKXHJcbi0g2YLYr9mFINmF2YXYp9ix2LPYp9iqINiq2KPZhdmE2YrYqSDZiNiq2LfZiNmK2LHZitipINmF2K3Yr9iv2Kkg2YjZhdmG2KfYs9io2Kkg2KvZgtin2YHZitin2YtcclxuLSDYp9ix2KjYtyDZhtmF2Lcg2KfZhNi02K7YtdmK2Kkg2KjZhdiz2KfYsSDYp9mE2KrYt9mI2YrYsSDYp9mE2LHZiNit2Yog2YjZhtmF2Ygg2KfZhNmI2LnZilxyXG4tINin2LPYqtiu2K/ZhSDYo9iz2YTZiNioINin2YTYqtij2YXZhCDZiNin2YTYp9iz2KrZg9i02KfZgSDYp9mE2K/Yp9iu2YTZiiDZgdmKINi32LHYrSDYp9mE2KPYs9im2YTYqVxyXG4tINi02KzYuSDYudmE2Ykg2YXZhdin2LHYs9in2Kog2KfZhNiq2KPZhdmEINmI2KfZhNiw2YPYsSDZiNin2YTYqtmB2YPYsSDZiNin2YTZhdix2KfZgtio2Kkg2KfZhNiw2KfYqtmK2KlcclxuLSDYsdio2Lcg2KfZhNiq2LfZiNmK2LEg2KfZhNi02K7YtdmKINio2KfZhNmC2YrZhSDYp9mE2LHZiNit2YrYqSDZiNin2YTYo9iu2YTYp9mC2YrYqWBcclxuXHJcbmNvbnN0IEVOR0xJU0hfU1lTVEVNX1BST01QVCA9IGBZb3UgYXJlIGEgcHJvZmVzc2lvbmFsIE1CVEkgcGVyc29uYWxpdHkgY29hY2ggc3BlY2lhbGl6aW5nIGluIE15ZXJzLUJyaWdncyBUeXBlIEluZGljYXRvciBhbmFseXNpcy4gWW91ciByb2xlIGlzIHRvIHByb3ZpZGUgcGVyc29uYWxpemVkLCBhY3Rpb25hYmxlIGNvYWNoaW5nIGFkdmljZS5cclxuXHJcbkNvbnRleHQ6XHJcbi0gVGhlIHVzZXIgaGFzIGNvbXBsZXRlZCBhbiBNQlRJIGFzc2Vzc21lbnQgYW5kIHJlY2VpdmVkIHRoZWlyIHBlcnNvbmFsaXR5IHR5cGVcclxuLSBTcGVhayBpbiBhIHByb2Zlc3Npb25hbCwgZW1wYXRoZXRpYywgYW5kIHN1cHBvcnRpdmUgbWFubmVyXHJcbi0gUHJvdmlkZSBwcmFjdGljYWwsIGFjdGlvbmFibGUgYWR2aWNlXHJcbi0gS2VlcCByZXNwb25zZXMgY29uY2lzZSBhbmQgdmFsdWFibGUgKDIwMC0zMDAgd29yZHMgbWF4aW11bSlcclxuXHJcbkNvbnZlcnNhdGlvbiBndWlkZWxpbmVzOlxyXG4tIFdlbGNvbWUgdGhlIHVzZXIgYW5kIGFja25vd2xlZGdlIHRoZWlyIGFzc2Vzc21lbnQgY29tcGxldGlvblxyXG4tIEZvY3VzIG9uIHN0cmVuZ3RocyBhbmQgZGV2ZWxvcG1lbnQgb3Bwb3J0dW5pdGllc1xyXG4tIFByb3ZpZGUgYWR2aWNlIG9uIHJlbGF0aW9uc2hpcHMsIGNhcmVlciwgYW5kIHBlcnNvbmFsIGdyb3d0aFxyXG4tIEF2b2lkIGp1ZGdtZW50YWwgbGFuZ3VhZ2Ugb3IgYWJzb2x1dGUgZ2VuZXJhbGl6YXRpb25zXHJcbi0gRW5jb3VyYWdlIGV4cGxvcmF0aW9uIGFuZCBjb250aW51b3VzIGRldmVsb3BtZW50YFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpXHJcbiAgICBjb25zdCB7IFxyXG4gICAgICBtZXNzYWdlLCBcclxuICAgICAgbWJ0aVR5cGUsIFxyXG4gICAgICBsYW5ndWFnZSA9ICdlbicsIFxyXG4gICAgICBjb252ZXJzYXRpb25IaXN0b3J5ID0gW10sXHJcbiAgICAgIG1ldGhvZG9sb2d5LFxyXG4gICAgICBjb25zY2lvdXNuZXNzUHJvZmlsZSBcclxuICAgIH0gPSBib2R5XHJcblxyXG4gICAgaWYgKCFtZXNzYWdlKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiAnTWVzc2FnZSBpcyByZXF1aXJlZCcgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvY2Vzcy5lbnYuT1BFTkFJX0FQSV9LRVkgfHwgIW9wZW5haSkge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ09wZW5BSSBBUEkga2V5IG5vdCBjb25maWd1cmVkJyB9LFxyXG4gICAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2VsZWN0IHN5c3RlbSBwcm9tcHQgYmFzZWQgb24gbGFuZ3VhZ2UgYW5kIG1ldGhvZG9sb2d5XHJcbiAgICBsZXQgc3lzdGVtUHJvbXB0OiBzdHJpbmdcclxuICAgIGlmIChtZXRob2RvbG9neSA9PT0gJ3NhaXMnICYmIGxhbmd1YWdlID09PSAnYXInKSB7XHJcbiAgICAgIHN5c3RlbVByb21wdCA9IFNBSVNfQ09OU0NJT1VTTkVTU19BUkFCSUNfUFJPTVBUXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzeXN0ZW1Qcm9tcHQgPSBsYW5ndWFnZSA9PT0gJ2FyJyA/IEFSQUJJQ19TWVNURU1fUFJPTVBUIDogRU5HTElTSF9TWVNURU1fUFJPTVBUXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQnVpbGQgY29udmVyc2F0aW9uIG1lc3NhZ2VzIHdpdGggY29uc2Npb3VzbmVzcyBjb250ZXh0XHJcbiAgICBsZXQgY29udGV4dE1lc3NhZ2UgPSBzeXN0ZW1Qcm9tcHRcclxuICAgIFxyXG4gICAgaWYgKG1idGlUeXBlKSB7XHJcbiAgICAgIGNvbnRleHRNZXNzYWdlICs9IGBcXG5cXG7ZhtmI2Lkg2LTYrti12YrYqSDYp9mE2YXYs9iq2K7Yr9mFOiAke21idGlUeXBlfWBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gQWRkIGNvbnNjaW91c25lc3MgY29udGV4dCBmb3IgU0FJUyB1c2Vyc1xyXG4gICAgaWYgKG1ldGhvZG9sb2d5ID09PSAnc2FpcycgJiYgY29uc2Npb3VzbmVzc1Byb2ZpbGUpIHtcclxuICAgICAgY29udGV4dE1lc3NhZ2UgKz0gYFxcblxcbtmF2YTZgSDYp9mE2YjYudmKINin2YTYrtin2LUg2KjYp9mE2YXYs9iq2K7Yr9mFOlxyXG4tINmG2YXYtyDYp9mE2LfYp9mC2Kk6ICR7Y29uc2Npb3VzbmVzc1Byb2ZpbGUuZW5lcmd5U291cmNlUGF0dGVybj8uYXJhYmljRG9tYWluTmFtZX0gKCR7Y29uc2Npb3VzbmVzc1Byb2ZpbGUuZW5lcmd5U291cmNlUGF0dGVybj8ucGVyY2VudGFnZX0lKVxyXG4tINij2LPZhNmI2Kgg2KfZhNil2K/Ysdin2YM6ICR7Y29uc2Npb3VzbmVzc1Byb2ZpbGUuYXdhcmVuZXNzU3R5bGU/LmFyYWJpY0RvbWFpbk5hbWV9ICgke2NvbnNjaW91c25lc3NQcm9maWxlLmF3YXJlbmVzc1N0eWxlPy5wZXJjZW50YWdlfSUpICBcclxuLSDZhdix2YPYsiDYp9mE2YLYsdin2LE6ICR7Y29uc2Npb3VzbmVzc1Byb2ZpbGUuZGVjaXNpb25NYWtpbmdDZW50ZXI/LmFyYWJpY0RvbWFpbk5hbWV9ICgke2NvbnNjaW91c25lc3NQcm9maWxlLmRlY2lzaW9uTWFraW5nQ2VudGVyPy5wZXJjZW50YWdlfSUpXHJcbi0g2KrZhti42YrZhSDYp9mE2K3Zitin2Kk6ICR7Y29uc2Npb3VzbmVzc1Byb2ZpbGUubGlmZVN0cnVjdHVyZVByZWZlcmVuY2U/LmFyYWJpY0RvbWFpbk5hbWV9ICgke2NvbnNjaW91c25lc3NQcm9maWxlLmxpZmVTdHJ1Y3R1cmVQcmVmZXJlbmNlPy5wZXJjZW50YWdlfSUpXHJcblxyXG7Yp9iz2KrYrtiv2YUg2YfYsNinINin2YTZhdmE2YEg2YTYqtmC2K/ZitmFINil2LHYtNin2K/Yp9iqINmF2K7Ytdi12Kkg2YTYqti32YjZitixINmI2LnZiiDYp9mE2YXYs9iq2K7Yr9mFINmI2YbZhdmI2Ycg2KfZhNmG2YHYs9mKLmBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtZXNzYWdlczogYW55W10gPSBbXHJcbiAgICAgIHtcclxuICAgICAgICByb2xlOiAnc3lzdGVtJyxcclxuICAgICAgICBjb250ZW50OiBjb250ZXh0TWVzc2FnZSxcclxuICAgICAgfSxcclxuICAgIF1cclxuXHJcbiAgICAvLyBBZGQgY29udmVyc2F0aW9uIGhpc3RvcnlcclxuICAgIGNvbnZlcnNhdGlvbkhpc3RvcnkuZm9yRWFjaCgobXNnOiBhbnkpID0+IHtcclxuICAgICAgbWVzc2FnZXMucHVzaCh7XHJcbiAgICAgICAgcm9sZTogbXNnLnJvbGUsXHJcbiAgICAgICAgY29udGVudDogbXNnLmNvbnRlbnQsXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIEFkZCBjdXJyZW50IG1lc3NhZ2VcclxuICAgIG1lc3NhZ2VzLnB1c2goe1xyXG4gICAgICByb2xlOiAndXNlcicsXHJcbiAgICAgIGNvbnRlbnQ6IG1lc3NhZ2UsXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGNvbXBsZXRpb24gPSBhd2FpdCBvcGVuYWkuY2hhdC5jb21wbGV0aW9ucy5jcmVhdGUoe1xyXG4gICAgICBtb2RlbDogJ2dwdC0zLjUtdHVyYm8nLFxyXG4gICAgICBtZXNzYWdlcyxcclxuICAgICAgdGVtcGVyYXR1cmU6IDAuNyxcclxuICAgICAgbWF4X3Rva2VuczogbGFuZ3VhZ2UgPT09ICdhcicgPyA0MDAgOiAzNTAsXHJcbiAgICAgIHByZXNlbmNlX3BlbmFsdHk6IDAuMSxcclxuICAgICAgZnJlcXVlbmN5X3BlbmFsdHk6IDAuMSxcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBjb21wbGV0aW9uLmNob2ljZXNbMF0/Lm1lc3NhZ2U/LmNvbnRlbnRcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmVzcG9uc2UgZ2VuZXJhdGVkJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xyXG4gICAgICBtZXNzYWdlOiByZXNwb25zZSxcclxuICAgICAgdHlwZTogJ2Fzc2lzdGFudCcsXHJcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgfSlcclxuXHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcignQ2hhdCBBUEkgZXJyb3I6JywgZXJyb3IpXHJcbiAgICBcclxuICAgIGNvbnN0IGlzQXJhYmljID0gcmVxdWVzdC5oZWFkZXJzLmdldCgnYWNjZXB0LWxhbmd1YWdlJyk/LmluY2x1ZGVzKCdhcicpXHJcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBpc0FyYWJpYyBcclxuICAgICAgPyAn2LnYsNix2KfZi9iMINit2K/YqyDYrti32KMg2YHZiiDZhdi52KfZhNis2Kkg2LHYs9in2YTYqtmDLiDZitix2KzZiSDYp9mE2YXYrdin2YjZhNipINmF2LHYqSDYo9iu2LHZiS4nXHJcbiAgICAgIDogJ1NvcnJ5LCB0aGVyZSB3YXMgYW4gZXJyb3IgcHJvY2Vzc2luZyB5b3VyIG1lc3NhZ2UuIFBsZWFzZSB0cnkgYWdhaW4uJ1xyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgeyBcclxuICAgICAgICBlcnJvcjogZXJyb3JNZXNzYWdlLFxyXG4gICAgICAgIGRldGFpbHM6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gZXJyb3IubWVzc2FnZSA6IHVuZGVmaW5lZFxyXG4gICAgICB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgIClcclxuICB9XHJcbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiT3BlbkFJIiwib3BlbmFpIiwicHJvY2VzcyIsImVudiIsIk9QRU5BSV9BUElfS0VZIiwiYXBpS2V5IiwiQVJBQklDX1NZU1RFTV9QUk9NUFQiLCJTQUlTX0NPTlNDSU9VU05FU1NfQVJBQklDX1BST01QVCIsIkVOR0xJU0hfU1lTVEVNX1BST01QVCIsIlBPU1QiLCJyZXF1ZXN0IiwiYm9keSIsImpzb24iLCJtZXNzYWdlIiwibWJ0aVR5cGUiLCJsYW5ndWFnZSIsImNvbnZlcnNhdGlvbkhpc3RvcnkiLCJtZXRob2RvbG9neSIsImNvbnNjaW91c25lc3NQcm9maWxlIiwiZXJyb3IiLCJzdGF0dXMiLCJzeXN0ZW1Qcm9tcHQiLCJjb250ZXh0TWVzc2FnZSIsImVuZXJneVNvdXJjZVBhdHRlcm4iLCJhcmFiaWNEb21haW5OYW1lIiwicGVyY2VudGFnZSIsImF3YXJlbmVzc1N0eWxlIiwiZGVjaXNpb25NYWtpbmdDZW50ZXIiLCJsaWZlU3RydWN0dXJlUHJlZmVyZW5jZSIsIm1lc3NhZ2VzIiwicm9sZSIsImNvbnRlbnQiLCJmb3JFYWNoIiwibXNnIiwicHVzaCIsImNvbXBsZXRpb24iLCJjaGF0IiwiY29tcGxldGlvbnMiLCJjcmVhdGUiLCJtb2RlbCIsInRlbXBlcmF0dXJlIiwibWF4X3Rva2VucyIsInByZXNlbmNlX3BlbmFsdHkiLCJmcmVxdWVuY3lfcGVuYWx0eSIsInJlc3BvbnNlIiwiY2hvaWNlcyIsIkVycm9yIiwidHlwZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImNvbnNvbGUiLCJpc0FyYWJpYyIsImhlYWRlcnMiLCJnZXQiLCJpbmNsdWRlcyIsImVycm9yTWVzc2FnZSIsImRldGFpbHMiLCJ1bmRlZmluZWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/chat/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/formdata-node","vendor-chunks/openai","vendor-chunks/form-data-encoder","vendor-chunks/whatwg-url","vendor-chunks/agentkeepalive","vendor-chunks/tr46","vendor-chunks/web-streams-polyfill","vendor-chunks/node-fetch","vendor-chunks/webidl-conversions","vendor-chunks/ms","vendor-chunks/humanize-ms","vendor-chunks/event-target-shim","vendor-chunks/abort-controller"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cam112%5COneDrive%5C%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%5CClients%5CMBTI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();