import {
  getSettingsValue,
  initSettings,
  resetSattingsValues,
  saveSattingsValues,
  showSettings,
} from "browser-extension-settings"
import {
  $,
  $$,
  addElement,
  addEventListener,
  createElement,
  registerMenuCommand,
} from "browser-extension-utils"
import enhanceNodeName from "data-text:./custom-styles/enhance-node-name.scss"
import hideLastReplier from "data-text:./custom-styles/hide-last-replier.scss"
import hideProfilePhotoStyle from "data-text:./custom-styles/hide-profile-photo.scss"
import minimalist from "data-text:./custom-styles/minimalist.scss"
import noAds from "data-text:./custom-styles/no-ads.scss"
import sideNavStyle from "data-text:./custom-styles/side-nav.scss"
import stickyHeader from "data-text:./custom-styles/sticky-header.scss"
import type { PlasmoCSConfig } from "plasmo"

import { showSideNav } from "./components/side-nav"

export const config: PlasmoCSConfig = {
  matches: ["https://*.v2ex.com/*", "https://v2hot.pipecraft.net/*"],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  run_at: "document_start",
}

const settingsTable = {
  minimalist: {
    title: "极简风格",
    defaultValue: true,
  },
  stickyHeader: {
    title: "导航栏顶部固定",
    defaultValue: true,
  },
  hideNodeList: {
    title: "隐藏节点列表",
    defaultValue: true,
  },
  enhanceNodeName: {
    title: "增强显示节点名",
    defaultValue: true,
  },
  showSideNav: {
    title: "显示快捷按钮",
    defaultValue: true,
  },
  bodyBackgroundColor: {
    title: "去除页面背景色",
    defaultValue: false,
  },
  hidePinnedTopics: {
    title: "隐藏置顶帖子",
    defaultValue: false,
  },
  hideProfilePhoto: {
    title: "隐藏用户头像",
    defaultValue: false,
  },
  hideLastReplier: {
    title: "隐藏最后回复者",
    defaultValue: false,
  },
  customStyle: {
    title: "自定义样式",
    defaultValue: false,
  },
  customStyleValue: {
    title: "Enable custom rules for the current site",
    defaultValue: "",
    placeholder: `/* 自定义样式 */
body #Wrapper {
  background-color: #f0f0f0;
}
body #Wrapper.Night {
  background-color: #22303f;
}`,
    type: "textarea",
    group: 2,
  },
  customStyleTip: {
    title: "Examples",
    type: "tip",
    tipContent: `<p>自定义样式示例</p>
<p>
<pre>
body #Wrapper {
  background-color: #f0f0f0;
}
/* 黑暗模式 */
body #Wrapper.Night {
  background-color: #22303f;
}</pre>
</p>`,
    group: 2,
  },
  resetAll: {
    title: "重置所有设置",
    type: "action",
    async onclick() {
      await resetSattingsValues()
    },
    group: 3,
  },
  resetToV2ex: {
    title: "恢复 V2EX 默认样式",
    type: "action",
    async onclick() {
      await saveSattingsValues({
        enhanceNodeName: false,
        hideNodeList: false,
        stickyHeader: false,
        bodyBackgroundColor: false,
        minimalist: false,
        hidePinnedTopics: false,
        hideProfilePhoto: false,
        customStyle: false,
        showSideNav: false,
      })
    },
    group: 3,
  },
}

function registerMenuCommands() {
  registerMenuCommand("⚙️ 设置", showSettings, "o")
}

async function addStyles() {
  const styles: string[] = []
  styles.push(noAds)

  if (getSettingsValue("stickyHeader")) {
    styles.push(stickyHeader)
  }

  if (getSettingsValue("minimalist")) {
    styles.push(minimalist)
  }

  if (!getSettingsValue("bodyBackgroundColor")) {
    styles.push(`
    body #Wrapper {
      background-color: #f0f0f0;
    }
    body #Wrapper.Night {
      background-color: #22303f;
    }
    `)
  }

  if (getSettingsValue("enhanceNodeName")) {
    styles.push(enhanceNodeName)
  }

  if (getSettingsValue("hideProfilePhoto")) {
    styles.push(hideProfilePhotoStyle)
  }

  if (getSettingsValue("hideLastReplier")) {
    for (const element of $$("#Main .topic_info strong:nth-of-type(2)")) {
      if (element.previousSibling.nodeName === "SPAN") continue
      const span = createElement("span", { class: "last_replier_text" })
      span.append(element.previousSibling)
      element.before(span)
    }

    styles.push(hideLastReplier)
  }

  if (getSettingsValue("showSideNav")) {
    styles.push(sideNavStyle)
    showSideNav()
  }

  if (getSettingsValue("hidePinnedTopics")) {
    styles.push(`/* Hide pinned topics */
    #Main > div:nth-child(2) > div[style*="corner"] {
      display: none;
    }
    `)
  }

  if (getSettingsValue("hideNodeList")) {
    styles.push(`/* 右侧栏一些东西 */
    #TopicsHot + div,
    #TopicsHot + div + div,
    #TopicsHot + div + div + div,
    #TopicsHot + div + div + div + div,
    #TopicsHot + div + div + div + div + div,
    #TopicsHot + div + div + div + div + div + div {
      display: none !important;
    }

    /* 我收藏的节点 */
    .box:has(#nodes-sidebar),
    .box:has(#nodes-sidebar) + .sep20 {
      display: none;
    }

    /* 节点导航 */
    .box:has(a[href="/planes"]) {
      display: none;
    }
    `)
  }

  // TODO: 允许指定隐藏哪些标签
  if (getSettingsValue("hideUnwantedTabs")) {
    styles.push(`/* Some tabs */
    #Tabs > a:nth-child(4),
    #Tabs > a:nth-child(5),
    #Tabs > a:nth-child(6),
    #Tabs > a:nth-child(7),
    #Tabs > a:nth-child(13) {
      display: none;
    }

    #Tabs > a {
      min-width: 3.5em;
      text-align: center;
    }
    `)
  }

  if ($("#v2min_style")) {
    $("#v2min_style").textContent = styles.join("\n")
  } else {
    addElement("style", {
      id: "v2min_style",
      textContent: styles.join("\n"),
    })
  }

  const customStyleValue = getSettingsValue("customStyleValue") || ""
  if (getSettingsValue("customStyle") && customStyleValue) {
    if ($("#v2min_custom_style")) {
      $("#v2min_custom_style").textContent = customStyleValue
    } else {
      addElement("style", {
        id: "v2min_custom_style",
        textContent: customStyleValue,
      })
    }
  } else if ($("#v2min_custom_style")) {
    $("#v2min_custom_style").remove()
  }

  // 强制渲染页面。否则上端固定的标签栏显示有问题
  if ($("#Tabs")) $("#Tabs").style.display = "block"
}

async function main() {
  if (document["v2ex.min"]) {
    return
  }

  document["v2ex.min"] = true

  await initSettings({
    id: "v2ex.min",
    title: "v2ex.min - V2EX Minimalist (极简风格)",
    footer: `
    <p>
    <a href="https://github.com/v2hot/v2ex.min/issues" target="_blank">
    Report and Issue...
    </a></p>
    <p>Made with ❤️ by
    <a href="https://www.pipecraft.net/" target="_blank">
      Pipecraft
    </a></p>`,
    settingsTable,
    async onValueChange() {
      await addStyles()
    },
    onViewUpdate(settingsMainView) {
      const group2 = $(`.option_groups:nth-of-type(2)`, settingsMainView)
      if (group2) {
        group2.style.display = getSettingsValue(`customStyle`)
          ? "block"
          : "none"
      }
    },
  })

  registerMenuCommands()

  await addStyles()
  addEventListener(document, "DOMContentLoaded", addStyles)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
main()
