import { render } from './basemod/app'
import { Scroll } from './basemod/components/scroll'
import { Frame } from './basemod/component'

render($ => {
  Scroll()
})
  // .Backdrop()
  // .Parent($.root)
  // .Children([
  //   Frame({ prefix: 'hello' }),
  //   Frame({ prefix: 'hello' }),
  //   Frame({ prefix: 'hello' }, [
  //     Frame(null, [
  //       Frame(null, [
  //         Frame(),
  //         Frame(),
  //       ]),
  //     ]),
  //   ]),
  // ])
