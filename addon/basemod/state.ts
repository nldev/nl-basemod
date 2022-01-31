import { App } from './app'

const state = {
  app: new App(noop, true)
}

export const State = () => state

export const init = (onInit: (app: App) => void) => {
  const state = State()

  state.app = new App(onInit)

  return state.app
}


