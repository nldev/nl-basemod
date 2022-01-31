import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame()
    .Size(500, 500)
    .Backdrop()
    .Point('CENTER')
    .Padding(50)
    .Execute(() => console.log('ran'))

  // Scroll({ name: 'bar' })
  //   .Backdrop()
  //   .Click('LeftButton', () => console.log($.playerInfo.name))
})


