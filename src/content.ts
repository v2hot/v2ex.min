import {
  addValueChangeListener,
  getValue,
  setValue,
} from "browser-extension-storage"
import { addStyle } from "browser-extension-utils"
import enhanceNodeName from "data-text:../v2ex-custom-style/enhance-node-name.css"
import hideProfilePhotoStyle from "data-text:../v2ex-custom-style/hide-profile-photo.css"
import minimalist from "data-text:../v2ex-custom-style/minimalist.css"
import noAds from "data-text:../v2ex-custom-style/no-ads.css"
import stickyHeader from "data-text:../v2ex-custom-style/sticky-header.css"

async function main() {
  const hidePinnedTopics =
    ((await getValue("hidePinnedTopics")) as boolean) || false
  const hideUnwantedTabs =
    ((await getValue("hideUnwantedTabs")) as boolean) || false
  const hideNodeList = ((await getValue("hideNodeList")) as boolean) || true
  const hideProfilePhoto =
    ((await getValue("hideProfilePhoto")) as boolean) || false

  addStyle(noAds)
  addStyle(stickyHeader)
  addStyle(enhanceNodeName)
  addStyle(minimalist)
  if (hideProfilePhoto) {
    addStyle(hideProfilePhotoStyle)
  }

  if (hidePinnedTopics) {
    addStyle(`/* Hide pinned topics */
    #Main > div:nth-child(2) > div[style*="corner"] {
      display: none;
    }
    `)
  }

  if (hideNodeList) {
    addStyle(`/* 右侧栏一些东西 */
    #TopicsHot + div,
    #TopicsHot + div + div,
    #TopicsHot + div + div + div,
    #TopicsHot + div + div + div + div,
    #TopicsHot + div + div + div + div + div,
    #TopicsHot + div + div + div + div + div + div {
      display: none !important;
    }

    /* 节点导航 */
    .box:has(a[href="/planes"]) {
      display: none;
    }
    `)
  }

  // TODO: 允许指定隐藏哪些标签
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
main()
