import {
  Attributes,
  button,
  Children,
  container,
  cx,
  defineComponent,
  div,
  forceUpdateEofol,
  h1,
  mountEofol,
} from "../src"

const getRandomStringImpl = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

const getRandomString = getRandomStringImpl(17)

const col = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("col center", attributes?.class) })
// eslint-disable-next-line no-unused-vars
const row = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("row", attributes?.class) })
const center = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("center", attributes?.class) })

const eContainer = (children?: Children) => col(children, { class: "e-container" })
const eButton = (children: Children, onclick: () => void) =>
  button(
    children,
    {
      onclick,
    },
    {
      class: "e-button",
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

mountEofol("root", container([h1("Eofol6"), rand(), counter(), propsTestContainer(), air()]))
