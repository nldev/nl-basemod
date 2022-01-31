import { State } from './state'
import { noop } from './utils'

interface App {
  state: State
}

const app: App = ({} as any)

export const Get = () => app.state

export const init = (onInit: ($: App) => void) => {
  app.state = new State(onInit)

  return app.state
}


