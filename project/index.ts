import {
  Attributes,
  button,
  center,
  Children,
  col,
  container,
  defineComponent,
  div,
  forceUpdateEofol,
  generateId,
  h1,
  h2,
  input,
  mountEofol,
  row,
} from "../src"

const getRandomStringImpl = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

const getRandomString = getRandomStringImpl(17)

const eContainer = (children?: Children) => col(children, { class: "e-container" })
const eButton = (children: Children, onclick: () => void, attributes?: Attributes) =>
  button(
    children,
    {
      onclick,
    },
    {
      class: "e-button",
      ...(attributes ?? {}),
    },
  )

const rand = defineComponent("rand", {
  state: { id: getRandomString() },
  render: (args) =>
    eContainer([
      // @ts-ignore
      center(`Render id: ${args.state.id}`),
      eButton("Refresh", () => {
        args.setState({ id: getRandomString() })
        console.log("Set state!")
      }),
      eButton("Force update", () => {
        forceUpdateEofol()
        console.log("Force update!")
      }),
    ]),
})

const counter = defineComponent("counter", {
  state: { count: 0 },
  render: (args) =>
    eContainer([
      // @ts-ignore
      center(`Clicked ${args.state.count} times`),
      eButton("Click", () => {
        // @ts-ignore
        args.setState({ count: args.state.count + 1 })
      }),
      eButton("Clear", () => {
        args.setState({ count: 0 })
      }),
    ]),
})

const propsTest = defineComponent("propsTest", {
  render: (args) => center(`${args.props.label} prop value: ${args.props.arg}`),
})

const propsTestContainer = defineComponent("propsTestContainer", {
  state: { first: 0, second: 0 },
  render: (args) =>
    eContainer([
      // @ts-ignore
      propsTest({ arg: args.state.first, label: "First" }),
      eButton("Increment first", () => {
        // @ts-ignore
        args.mergeState({ first: args.state.first + 1 })
      }),
      // @ts-ignore
      propsTest({ arg: args.state.second, label: "Second" }),
      eButton("Increment second", () => {
        // @ts-ignore
        args.mergeState({ second: args.state.second + 1 })
      }),
    ]),
})

const air = defineComponent("air", {
  state: { aqi: undefined },
  // @ts-ignore
  render: (args) => col(["Air", args.state.aqi !== undefined && div(`AQI: ${args.state.aqi}`)]),
  effect: [
    (args) => {
      console.log("EFFECT!")
      // @ts-ignore
      if (args.state.aqi === undefined) {
        args.mergeState({ aqi: "Loading" })
        const PLACEHOLDER_LAT = "50.075"
        const PLACEHOLDER_LON = "14.437"
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${PLACEHOLDER_LAT}&longitude=${PLACEHOLDER_LON}&hourly=pm10,pm2_5&current=european_aqi,us_aqi,pm10,carbon_monoxide,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia,alder_pollen,grass_pollen,birch_pollen,mugwort_pollen,ragweed_pollen,olive_pollen`,
        )
          .then((res) => res.json())
          .then((data) => {
            if (data?.current?.european_aqi) {
              args.mergeState({ aqi: data.current.european_aqi })
            }
          })
      }
      return () => {
        console.log("EFFECT CLEANUP!")
      }
    },
  ],
})

const ID_INPUT_TD_TITLE = "td-input"

const NOTIFICATION_DURATION_MS = 3000

const notify = (msg: string) => {
  const notificationRoot = document.createElement("div")
  notificationRoot.innerHTML = msg
  const nextId = `snackbar-${generateId()}`
  notificationRoot.setAttribute("id", nextId)
  notificationRoot.setAttribute("class", "snackbar show")
  document.body.appendChild(notificationRoot)
  setTimeout(() => {
    document.body.removeChild(notificationRoot)
  }, NOTIFICATION_DURATION_MS)
}

const td = defineComponent("td", {
  state: { items: [] },
  render: (args) =>
    eContainer([
      h2("To do"),
      eContainer(
        // @ts-ignore
        args.state.items.map((item) =>
          row(
            [
              div(item.title),
              eButton("X", () => {
                // @ts-ignore
                args.setState({ items: args.state.items.filter((x) => x.id !== item.id) })
              }),
            ],
            { class: "center" },
          ),
        ),
      ),
      input(
        {
          // @ts-ignore
          onkeypress: (event) => {
            if (event.key === "Enter") {
              const inputElement = document.getElementById(ID_INPUT_TD_TITLE)
              if (inputElement) {
                // @ts-ignore
                const value = inputElement.value
                if (value) {
                  // @ts-ignore
                  args.setState({ items: [...args.state.items, { id: getRandomString(), title: value }] })
                  inputElement.setAttribute("value", "")
                }
              }
            }
          },
        },
        { id: ID_INPUT_TD_TITLE, placeholder: "Title", autocomplete: "off", spellcheck: "false" },
      ),
      eButton("Add", () => {
        const inputElement = document.getElementById(ID_INPUT_TD_TITLE)
        if (inputElement) {
          // @ts-ignore
          const value = inputElement.value
          if (value) {
            // @ts-ignore
            args.setState({ items: [...args.state.items, { id: getRandomString(), title: value }] })
            inputElement.setAttribute("value", "")
          } else {
            notify("Cannot add To do item: title is empty.")
          }
        }
      }),
    ]),
})

mountEofol("root", container([h1("Eofol6"), rand(), counter(), propsTestContainer(), air(), td()]))
