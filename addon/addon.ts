import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => Scroll({ name: 'bar' })
  .Backdrop()
  //.Click('LeftButton', () => console.log($.playerInfo.name))
)


