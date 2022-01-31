import { App } from './app'

interface Global {
  app: App
}

export const state: Global = {}

export default () => state


