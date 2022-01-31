import { App } from './app'
import { noop } from './utils'

interface State {
  app: App
}

const state: any = {}

export const Get = () => (state as State).app

export const init = (onInit: ($: App) => void) => {
  state.app = new App(onInit)

  return state.app
}


