import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => Frame({ name: 'bar' })
  .Point('CENTER')
  .Size(500, 500)
  .Backdrop()
  .Z(5)
  .Click('LeftButtonDown', () => console.log('hello'))
)


