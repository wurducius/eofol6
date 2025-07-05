import {
  center,
  col,
  container,
  createProjection,
  createStore,
  define,
  div,
  forceUpdateEofol,
  h1,
  h2,
  input,
  mergeStore,
  mountEofol,
  resetStore,
  row,
  selector,
  setStore,
} from "../src"
import { getRandomString } from "./util"
import { eButton, eContainer } from "./e-ui"
import { notifyError } from "./notification"
import { sx } from "eofol-sx"
import { j } from "../src/core/pragma"

const React = { createElement: j }

define("rand", {
  render: () =>
    eContainer([
      <h2>Render test</h2>,
      center(`Render id: ${getRandomString()}`),
      eButton("Force update", () => {
        forceUpdateEofol()
        console.log("Force update!")
      }),
    ]),
})

define("counter", {
  state: { count: 0 },
  render: (args) =>
    eContainer([
      <h2>State test</h2>,
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

define("propsTest", {
  render: (args) => center(`${args.props.label} prop value: ${args.props.arg}`),
})

define("propsTestContainer", {
  state: { first: 0, second: 0 },
  render: (args) =>
    eContainer([
      <h2>Props test</h2>,
      // @ts-ignore
      <propsTest arg={args.state.first} label={"First"} />,
      eButton("Increment first", () => {
        // @ts-ignore
        args.mergeState({ first: args.state.first + 1 })
      }),
      // @ts-ignore
      <propsTest arg={args.state.second} label={"Second"} />,
      eButton("Increment second", () => {
        // @ts-ignore
        args.mergeState({ second: args.state.second + 1 })
      }),
    ]),
})

define("air", {
  state: { aqi: undefined },
  render: (args) =>
    // @ts-ignore
    col([<h2>Effect test: Air</h2>, args.state.aqi !== undefined && <div>{`AQI: ${args.state.aqi}`}</div>]),
  effect: [
    (args) => {
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
      return () => {}
    },
  ],
})

const ID_INPUT_TD_TITLE = "td-input"

define("td", {
  state: { items: [] },
  render: (args) =>
    eContainer([
      <h2>To do</h2>,
      div(
        // @ts-ignore
        args.state.items.map((item) =>
          row(
            [
              div(item.title, { class: "mr-2" }),
              eButton("X", () => {
                // @ts-ignore
                args.setState({ items: args.state.items.filter((x) => x.id !== item.id) })
              }),
            ],
            { class: "justify-space-between center" },
          ),
        ),
        { class: "col td-container" },
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

define("sxTest", {
  render: () => eContainer([<h2>Dependency test</h2>, div("Cyan", { class: sx({ color: "cyan" }) })]),
})

define("childrenTestSecond", {
  render: (args) => <div>{`Value = ${args.props.value}`}</div>,
})
define("childrenTestFirst", {
  render: (args) => (
    <div>
      <childrenTestSecond value={args.props.value} />
    </div>
  ),
})

define("childrenTestRoot", {
  state: { value: 0 },
  render: (args) =>
    eContainer([
      <h2>Children of children test</h2>,
      // @ts-ignore
      <childrenTestFirst value={args.state.value} />,
      eButton("+", () => {
        // @ts-ignore
        args.setState({ value: args.state.value + 1 })
      }),
    ]),
})

const STORE_FIRST = "store1"
const STORE_SECOND = "store2"

createStore(STORE_FIRST, { value: 42 })

createProjection(STORE_FIRST, STORE_SECOND, (state: { value: number }) => ({ derived: state.value * 2 }))

define("storeTest", {
  subscribe: STORE_FIRST,
  render: () => {
    // @ts-ignore
    const value = selector(STORE_FIRST)?.value
    // @ts-ignore
    const derived = selector(STORE_SECOND)?.derived
    return eContainer([
      <h2>Store test</h2>,
      div(`Store value = ${value}`),
      eButton("Increment store", () => {
        mergeStore(STORE_FIRST, { value: value + 1 })
      }),
      eButton("Increment derived", () => {
        setStore(STORE_SECOND, { derived: derived + 1 })
      }),
      eButton("Reset store", () => {
        resetStore(STORE_FIRST)
      }),
    ])
  },
})

define("projectionTest", {
  subscribe: [STORE_SECOND],
  render: () => {
    // @ts-ignore
    const derived = selector(STORE_SECOND)?.derived
    return eContainer([<h2>Projection test</h2>, <div>{`Projection value = ${derived}`}</div>])
  },
})

define("childrenPropTest", {
  render: (args) => {
    return eContainer(args.children)
  },
})

mountEofol(
  "root",
  container([
    <h1>Eofol6</h1>,
    <rand />,
    <counter />,
    <propsTestContainer />,
    <air />,
    <td />,
    <sxTest />,
    <childrenTestRoot />,
    <storeTest />,
    <projectionTest />,
    <childrenPropTest>
      <div>Child passed as prop</div>
    </childrenPropTest>,
  ]),
)
