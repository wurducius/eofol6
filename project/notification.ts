import { cx, generateId } from "../src"

const NOTIFICATION_DURATION_MS = 3000

const NOTIFICATION_CONTAINER_ID = "snackbar-container"

const notificationContainer = document.getElementById(NOTIFICATION_CONTAINER_ID)

const notify = (level: string | undefined, msg: string) => {
  if (notificationContainer) {
    const notificationRoot = document.createElement("div")
    notificationRoot.innerHTML = msg
    const nextId = `snackbar-${generateId()}`
    notificationRoot.setAttribute("id", nextId)
    notificationRoot.setAttribute("class", cx("snackbar", level && `snackbar-${level}`))
    notificationContainer.appendChild(notificationRoot)
    setTimeout(() => {
      notificationContainer.removeChild(notificationRoot)
    }, NOTIFICATION_DURATION_MS)
  }
}

export const notifySuccess = (msg: string) => notify("success", msg)
export const notifyWarn = (msg: string) => notify("warning", msg)
export const notifyInfo = (msg: string) => notify("info", msg)
export const notifyError = (msg: string) => notify("danger", msg)
