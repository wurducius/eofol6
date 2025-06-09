import {
  center,
  col,
  container,
  defineComponent,
  div,
  forceUpdateEofol,
  h1,
  h2,
  input,
  mountEofol,
  p,
  row,
} from "../src"
import { getRandomString } from "./util"
import { eButton, eContainer } from "./e-ui"
import { notifyError } from "./notification"
import { sx } from "eofol-sx"

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
            notifyError("Cannot add To do item: title is empty.")
          }
        }
      }),
    ]),
})

const childrenTestSecond = defineComponent("childrenTestSecond", {
  render: (args) => div(`Value = ${args.props.value}`),
})
const childrenTestFirst = defineComponent("childrenTestFirst", {
  render: (args) => div(childrenTestSecond({ value: args.props.value })),
})
const childrenTestRoot = defineComponent("childrenTestRoot", {
  state: { value: 0 },
  render: (args) =>
    div([
      // @ts-ignore
      childrenTestFirst({ value: args.state.value }),
      eButton("+", () => {
        // @ts-ignore
        args.setState({ value: args.state.value + 1 })
      }),
    ]),
})

mountEofol(
  "root",
  container([
    h1("Eofol6"),
    rand(),
    counter(),
    propsTestContainer(),
    air(),
    td(),
    p("Sx test", { class: sx({ color: "cyan" }) }),
    childrenTestRoot(),
  ]),
)
