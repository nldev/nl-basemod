import { Container } from './container'

export const Get = () => _G['app'] as Container

export const render = (onInit: ($: Container) => void) => {
  const app = new Container(onInit)

  _G['app'] = app

  return app
}

