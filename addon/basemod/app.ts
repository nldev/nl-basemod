import { Container } from './container'

export const Get = () => _G['container'] as Container

export const render = (onInit: ($: Container) => void) => {
  _G['app'].container = new Container(onInit)

  return _G['app'].container
}

