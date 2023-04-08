// ==UserScript==
// @name                 v2ex.min - V2EX 极简风格
// @name:zh-CN           v2ex.min - V2EX 极简风格
// @namespace            https://github.com/v2hot/v2ex.min
// @homepageURL          https://github.com/v2hot/v2ex.min#readme
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
// @grant                GM.getValue
// @grant                GM_addStyle
// ==/UserScript==
//
;(() => {
  "use strict"
  var getValue = async (key) => {
    const value = await GM.getValue(key)
    return value && value !== "undefined" ? JSON.parse(value) : void 0
  }
  var doc = document
  var createElement = (tagName, attributes) =>
    setAttributes(doc.createElement(tagName), attributes)
  var addStyle = (styleText) => {
    const element = createElement("style", { textContent: styleText })
    doc.head.append(element)
    return element
  }
  var addEventListener = (element, type, listener, options) => {
    if (!element) {
      return
    }
    if (typeof type === "object") {
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.addEventListener(type1, type[type1])
        }
      }
    } else if (typeof type === "string" && typeof listener === "function") {
      element.addEventListener(type, listener, options)
    }
  }
  var setAttribute = (element, name, value) =>
    element ? element.setAttribute(name, value) : void 0
  var setAttributes = (element, attributes) => {
    if (element && attributes) {
      for (const name in attributes) {
        if (Object.hasOwn(attributes, name)) {
          const value = attributes[name]
          if (value === void 0) {
            continue
          }
          if (/^(value|textContent|innerText|innerHTML)$/.test(name)) {
            element[name] = value
          } else if (name === "style") {
            setStyle(element, value, true)
          } else if (/on\w+/.test(name)) {
            const type = name.slice(2)
            addEventListener(element, type, value)
          } else {
            setAttribute(element, name, value)
          }
        }
      }
    }
    return element
  }
  var setStyle = (element, values, overwrite) => {
    if (!element) {
      return
    }
    const style = element.style
    if (typeof values === "string") {
      style.cssText = overwrite ? values : style.cssText + ";" + values
      return
    }
    if (overwrite) {
      style.cssText = ""
    }
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        style[key] = values[key].replace("!important", "")
      }
    }
  }
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
  var addStyle2 =
    typeof GM_addStyle === "function"
      ? (styleText) => GM_addStyle(styleText)
      : addStyle
  var enhance_node_name_default =
    "#Main .box a.node{color:#1ba784}#Main td:has(.topic_info){display:flex;flex-direction:column-reverse}div.cell:has(.topic_info){border-bottom:5px solid var(--box-border-color)}"
  var hide_profile_photo_default =
    '#Main td:has(a>img.avatar),#Main td:has(a>img.avatar)+td[width="10"],#Main td[width="48"],#Main td[width="48"]+td[width="10"],#TopicsHot td:has(a>img.avatar),#TopicsHot td:has(a>img.avatar)+td,#my-recent-topics td:has(a>img),#my-recent-topics td:has(a>img)+td,#Main>box>div.cell[id] td:has(img.avatar),#Main>box>div.cell[id] td:has(img.avatar)+td{display:none !important}td>strong>.dark{color:#1ba784 !important}'
  var minimalist_default =
    '*{box-shadow:unset !important;text-shadow:unset !important}.box,#Main .box,#Top,#Tabs,#Wrapper,#Bottom{background-image:unset !important;border:none !important}.cell,.box,.super.button,.topic_buttons,div[style*=border]{border:unset !important;background-image:unset !important}.count_livid{padding:0 !important;margin-right:0 !important;color:#999 !important;font-family:"Bender" !important;background-color:unset !important}body #Wrapper{background-color:#fff;--topic-link-color: #444444;--topic-link-hover-color: #217dfc;--primary-button-fill-color: #217dfc;--primary-button-text-color: #fff}body #Wrapper.Night{background-color:var(--box-background-color);--topic-link-color: #9caec7;--topic-link-hover-color: #a9bcd6;--primary-button-fill-color: #217dfc;--primary-button-text-color: #fff}a.topic-link:active,a.topic-link:link{color:var(--topic-link-color)}a.topic-link:hover{color:var(--topic-link-hover-color)}img{max-width:100%}body .super.button{background-color:var(--primary-button-fill-color);color:var(--primary-button-text-color);font-weight:400;border:transparent;border-radius:4px}body .super.button+.super.button{border-left:1px solid rgba(255,255,255,.2509803922) !important}body .super.button:not(.disable_now):hover,body .super.button:hover:enabled{background-color:var(--primary-button-fill-color) !important;opacity:85%;color:var(--primary-button-text-color) !important;font-weight:400;text-shadow:unset !important}'
  var no_ads_default =
    ".box:has(>style),div:has(>script),div:has(>.wwads-cn),.box:has(>.sidebar_compliance),div:has(>a>#DigitalOcean){display:none !important}"
  var sticky_header_default =
    '#Top{position:fixed;top:0;width:100%;box-sizing:border-box}#Top .content{max-width:unset !important;width:100% !important}.site-nav .tools{flex:unset}.site-nav a[name=top]{margin-right:auto}#Wrapper::before{content:"";display:block;height:44px}#placeholder{height:38px}#Tabs{position:fixed;top:1px;padding:9px;border:none}#search-container{width:100px}#search-container:has(input:focus){width:300px}body:has(input:focus) #Tabs{display:none}@media only screen and (max-width: 1300px){.site-nav a[name=top]{visibility:hidden}}body{scroll-margin-top:44px}'
  async function main() {
    const hidePinnedTopics = (await getValue("hidePinnedTopics")) || false
    const hideUnwantedTabs = (await getValue("hideUnwantedTabs")) || false
    const hideNodeList = (await getValue("hideNodeList")) || true
    const hideProfilePhoto = (await getValue("hideProfilePhoto")) || false
    addStyle2(no_ads_default)
    addStyle2(sticky_header_default)
    addStyle2(enhance_node_name_default)
    addStyle2(minimalist_default)
    if (hideProfilePhoto) {
      addStyle2(hide_profile_photo_default)
    }
    if (hidePinnedTopics) {
      addStyle2(`/* Hide pinned topics */
    #Main > div:nth-child(2) > div[style*="corner"] {
      display: none;
    }
    `)
    }
    if (hideNodeList) {
      addStyle2(`/* \u53F3\u4FA7\u680F\u4E00\u4E9B\u4E1C\u897F */
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
      addStyle2(`/* Some tabs */
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
