import { App } from './app'

interface Global {
  app: App
}

const $: Global = {
  app: new App(true)
}

export default () => $


