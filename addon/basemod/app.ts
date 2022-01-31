import { Container } from './container'
import { noop } from './utils'

interface App {
  state: Container
}

const app: App = ({} as any)

export const Get = () => app.state

export const init = (onInit: ($: Container) => void) => {
  app.state = new Container(onInit)

  return app.state
}


