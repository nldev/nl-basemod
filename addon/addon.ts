import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => Scroll({ name: 'bar' })
  .Point('CENTER')
  .Size(800, 800)
  .Backdrop()
  //.Click('LeftButton', () => console.log($.playerInfo.name))
)


