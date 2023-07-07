import {
  addValueChangeListener,
  getValue,
  setValue,
} from "browser-extension-storage"
import {
  $,
  $$,
  addElement,
  addEventListener,
  addStyle,
  createElement,
  registerMenuCommand,
  removeEventListener,
} from "browser-extension-utils"
import styleText from "data-text:./content.scss"
import enhanceNodeName from "data-text:./custom-styles/enhance-node-name.scss"
import hideLastReplier from "data-text:./custom-styles/hide-last-replier.scss"
import hideProfilePhotoStyle from "data-text:./custom-styles/hide-profile-photo.scss"
import minimalist from "data-text:./custom-styles/minimalist.scss"
import noAds from "data-text:./custom-styles/no-ads.scss"
import sideNavStyle from "data-text:./custom-styles/side-nav.scss"
import stickyHeader from "data-text:./custom-styles/sticky-header.scss"
import type { PlasmoCSConfig } from "plasmo"

import { showSideNav } from "./components/side-nav"
import { createSwitchOption } from "./components/switch"

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
}
let settings = {}
export function getSettingsValue(key: string): boolean | undefined {
  return Object.hasOwn(settings, key)
    ? settings[key]
    : settingsTable[key]?.defaultValue
}

function registerMenuCommands() {
  registerMenuCommand("⚙️ 设置", showSettings, "o")
}

const modalHandler = (event) => {
  let target = event.target as HTMLElement
  const settingsLayer = $("#v2min_settings")
  if (settingsLayer) {
    while (target !== settingsLayer && target) {
      target = target.parentNode as HTMLElement
    }

    if (target === settingsLayer) {
      return
    }

    settingsLayer.style.display = "none"
    removeEventListener(document, "click", modalHandler)
  }
}

async function updateOptions() {
  if (!$("#v2min_settings")) {
    return
  }

  for (const key in settingsTable) {
    if (Object.hasOwn(settingsTable, key)) {
      const checkbox = $(
        `#v2min_settings .option_groups .switch_option[data-key=${key}] input`
      )
      if (checkbox) {
        checkbox.checked = getSettingsValue(key)
      }
    }
  }

  $(`#v2min_settings .option_groups:nth-of-type(2)`).style.display =
    getSettingsValue("customStyle") ? "block" : "none"

  const customStyleValue = $(`#v2min_settings .option_groups textarea`)
  customStyleValue.value = settings.customStyleValue || ""
}

export async function showSettings() {
  let settingsLayer = $("#v2min_settings")
  if (!settingsLayer) {
    addStyle(styleText)
    settingsLayer = addElement(document.body, "div", {
      id: "v2min_settings",
    })

    addElement(settingsLayer, "h2", { textContent: "v2ex.min" })

    const options = addElement(settingsLayer, "div", { class: "option_groups" })
    for (const key in settingsTable) {
      if (Object.hasOwn(settingsTable, key)) {
        const item = settingsTable[key]
        const switchOption = createSwitchOption(item.title, {
          async onchange(event) {
            const settings = await getSettings()
            settings[key] = event.target.checked
            await setValue("settings", settings)
          },
        })

        switchOption.dataset.key = key

        addElement(options, switchOption)
      }
    }

    const options2 = addElement(settingsLayer, "div", {
      class: "option_groups",
    })
    let timeoutId
    addElement(options2, "textarea", {
      class: "custom_style",
      placeholder: `/* 自定义样式 */
body #Wrapper {
  background-color: #f0f0f0;
}
body #Wrapper.Night {
  background-color: #22303f;
}`,
      onkeyup(event) {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        timeoutId = setTimeout(async () => {
          const settings = await getSettings()
          settings.customStyleValue = event.target.value
          await setValue("settings", settings)
        }, 1000)
      },
    })

    const options3 = addElement(settingsLayer, "div", {
      class: "option_groups",
    })
    addElement(options3, "a", {
      class: "action",
      textContent: "重置所有设置",
      async onclick() {
        await setValue("settings", {})
      },
    })
    addElement(options3, "a", {
      class: "action",
      textContent: "恢复 V2EX 默认样式",
      async onclick() {
        await setValue("settings", {
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
    })

    const footer = addElement(settingsLayer, "footer")
    footer.innerHTML = `Made with ❤️ by
    <a href="https://www.pipecraft.net/" target="_blank">
      Pipecraft
    </a>`
  }

  await updateOptions()
  settingsLayer.style.display = "block"

  addEventListener(document, "click", modalHandler)
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

  const customStyleValue = settings.customStyleValue || ""
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

async function getSettings() {
  return (
    ((await getValue("settings")) as Record<string, unknown> | undefined) ?? {}
  )
}

async function main() {
  if (document["v2ex.min"]) {
    return
  }

  document["v2ex.min"] = true
  registerMenuCommands()

  addValueChangeListener("settings", async () => {
    settings = await getSettings()
    await addStyles()
    await updateOptions()
  })

  settings = await getSettings()
  await addStyles()
  addEventListener(document, "DOMContentLoaded", addStyles)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
main()
