import { App } from './app'
import { app } from './foo'

const b: App = app

export function hello () {
  b.act()
}
