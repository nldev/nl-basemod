import { Container } from './container'

interface App {
  container: Container
}

const app: App = ({} as any)

export const Get = () => app.container

export const render = (onInit: ($: Container) => void) => {
  app.container = new Container(onInit)

  return app.container
}


