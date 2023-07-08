import { getSettingsValue, showSettings } from "browser-extension-settings"
import { $, addElement } from "browser-extension-utils"

export function showSideNav() {
  if (!document.body) {
    return
  }

  if (!$("#v2min_sideNav")) {
    const sideNav = addElement(document.body, "div", {
      id: "v2min_sideNav",
      style: "display: none",
    })

    addElement(sideNav, "button", {
      class: "fa fa-arrow-circle-up",
      title: "Back to the top",
      onclick() {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      },
    })
    addElement(sideNav, "button", {
      class: "fa fa-comments",
      title: "Comments",
      disabled:
        location.href.includes("/t/") && $("#Main > div:nth-child(4)")
          ? undefined
          : true,
      onclick() {
        window.scrollTo({
          top:
            $("#Main > div:nth-child(4)").offsetTop -
            (getSettingsValue("stickyHeader") ? 44 : 0),
          behavior: "smooth",
        })
      },
    })
    addElement(sideNav, "button", {
      class: "fa fa-edit",
      title: "Add comment",
      value: "AA",
      disabled:
        location.href.includes("/t/") && $("#reply_content") ? undefined : true,
      onclick() {
        $("#reply_content").focus()
      },
    })
    addElement(sideNav, "button", {
      class: "fa fa-chevron-left",
      title: "Go to previous page",
      disabled: $('*[title="上一页"]') ? undefined : true,
      onclick() {
        $('*[title="上一页"]').click()
      },
    })
    addElement(sideNav, "button", {
      class: "fa fa-chevron-right",
      title: "Go to next page",
      disabled: $('*[title="下一页"]') ? undefined : true,
      onclick() {
        $('*[title="下一页"]').click()
      },
    })
    addElement(sideNav, "button", {
      class: "fa fa-bell",
      title: "Notifications",
      onclick() {
        location.href = "https://www.v2ex.com/notifications"
      },
    })
    addElement(sideNav, "button", {
      class: "fa fa-home",
      title: "Home",
      onclick() {
        location.href = "/"
      },
    })
    addElement(sideNav, "button", {
      class: "fa fa-cog",
      title: "Settings",
      onclick() {
        setTimeout(showSettings, 1)
      },
    })
  }
}
