// ==UserScript==
// @name                 v2ex.min - V2EX 极简风格
// @name:zh-CN           v2ex.min - V2EX 极简风格
// @namespace            https://github.com/v2hot/v2ex.min
// @homepage             https://github.com/v2hot/v2ex.min#readme
// @supportURL           https://github.com/v2hot/v2ex.min/issues
// @version              0.0.1
// @description          V2EX 极简风格，扁平化 UI，导航栏顶部固定，去除背景图片，支持黑暗模式，去除广告，去除不必要元素，支持隐藏头像。
// @description:zh-CN    V2EX 极简风格，扁平化 UI，导航栏顶部固定，去除背景图片，支持黑暗模式，去除广告，去除不必要元素，支持隐藏头像。
// @icon                 https://www.v2ex.com/favicon.ico
// @author               Pipecraft
// @license              MIT
// @run-at               document-start
// @match                https://*.v2ex.com/*
// @match                https://v2hot.pipecraft.net/*
// @grant                GM_getValue
// @grant                GM_addStyle
// ==/UserScript==
//
;(() => {
  "use strict"
  var getValue = (key) => {
    const value = GM_getValue(key)
    return value && value !== "undefined" ? JSON.parse(value) : void 0
  }
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
  var addStyle = (styleText) => GM_addStyle(styleText)
  var enhance_node_name_default =
    "/** * \u8282\u70B9\u663E\u793A\u589E\u5F3A *//* Node name */#Main .box a.node {  color: #1ba784;}/* \u8282\u70B9\uFF0C\u7528\u6237\u540D\u663E\u793A\u5728\u6807\u9898\u4E0A\u9762 */#Main td:has(.topic_info) {  display: flex;  flex-direction: column-reverse;}/* \u589E\u52A0\u4E3B\u9898\u95F4\u7684\u95F4\u8DDD */div.cell:has(.topic_info) {  border-bottom: 5px solid var(--box-border-color);}"
  var hide_profile_photo_default =
    '/* \u4E3B\u9898\u5217\u8868\u5934\u50CF */#Main td:has(a > img.avatar),#Main td:has(a > img.avatar) + td[width="10"],#Main td[width="48"],#Main td[width="48"] + td[width="10"],/* \u53F3\u4FA7\u680F */#TopicsHot td:has(a > img.avatar),#TopicsHot td:has(a > img.avatar) + td,#my-recent-topics td:has(a > img),#my-recent-topics td:has(a > img) + td,/* \u8BC4\u8BBA\u533A\u5934\u50CF */#Main > box > div.cell[id] td:has(img.avatar),#Main > box > div.cell[id] td:has(img.avatar) + td {  display: none !important;}/* user name*/td > strong > .dark {  color: #1ba784 !important;}'
  var minimalist_default =
    '* {  box-shadow: unset !important;}#Wrapper,.topic_buttons {  background: unset !important;}.box,#Main .box,#Top,#Tabs,#Wrapper,#Bottom {  background-image: unset !important;  border: none !important;}.cell,.box,.super.button,div[style*="border"] {  border: unset !important;  background-image: unset !important;}.count_livid {  padding: 0 !important;  margin-right: 0 !important;  color: #999 !important;  font-family: "Bender" !important;  background-color: unset !important;}'
  var no_ads_default =
    "/* ads */.box:has(> style),div:has(> script),div:has(> .wwads-cn),.box:has(> .sidebar_compliance),div:has(> a > #DigitalOcean) {  display: none !important;}"
  var sticky_header_default =
    '#Top {  position: fixed;  top: 0;  width: 100%;  box-sizing: border-box;}#Top .content {  max-width: unset !important;  width: 100% !important;}.site-nav .tools {  flex: unset;}.site-nav a[name="top"] {  margin-right: auto;}#Wrapper::before {  content: "";  display: block;  height: 44px;}/* v2hot */#placeholder {  height: 38px;}#Tabs {  position: fixed;  top: 1px;  padding: 9px;  border: none;}#search-container {  width: 100px;}#search-container:has(input:focus) {  width: 300px;}body:has(input:focus) #Tabs {  display: none;}/* \u5C4F\u5E55\u5BBD\u5EA6\u5C0F\u65F6\uFF0C\u9690\u85CF logo */@media only screen and (max-width: 1300px) {  .site-nav a[name="top"] {    visibility: hidden;  }}'
  async function main() {
    const hidePinnedTopics = (await getValue("hidePinnedTopics")) || false
    const hideUnwantedTabs = (await getValue("hideUnwantedTabs")) || false
    const hideNodeList = (await getValue("hideNodeList")) || true
    const hideProfilePhoto = (await getValue("hideProfilePhoto")) || false
    addStyle(no_ads_default)
    addStyle(sticky_header_default)
    addStyle(enhance_node_name_default)
    addStyle(minimalist_default)
    if (hideProfilePhoto) {
      addStyle(hide_profile_photo_default)
    }
    if (hidePinnedTopics) {
      addStyle(`/* Hide pinned topics */
    #Main > div:nth-child(2) > div[style*="corner"] {
      display: none;
    }
    `)
    }
    if (hideNodeList) {
      addStyle(`/* \u53F3\u4FA7\u680F\u4E00\u4E9B\u4E1C\u897F */
    #TopicsHot + div,
    #TopicsHot + div + div,
    #TopicsHot + div + div + div,
    #TopicsHot + div + div + div + div,
    #TopicsHot + div + div + div + div + div,
    #TopicsHot + div + div + div + div + div + div {
      display: none !important;
    }
    /* \u8282\u70B9\u5BFC\u822A */
    .box:has(a[href="/planes"]) {
      display: none;
    }
    `)
    }
    if (hideUnwantedTabs) {
      addStyle(`/* Some tabs */
    #Tabs > a:nth-child(4),
    #Tabs > a:nth-child(5),
    #Tabs > a:nth-child(6),
    #Tabs > a:nth-child(7),
    #Tabs > a:nth-child(13) {
      display: none;
    }
    #Tabs > a {
      min-width: 3.5em;
    }
    `)
    }
  }
  main()
})()
