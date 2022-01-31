import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  return Frame().Backdrop().Parent($.root).Children([
    Frame({ prefix: 'hello' }),
    Frame({ prefix: 'hello' }),
    Frame({ prefix: 'hello' }, [
      Frame(null, [
        Frame(null, [
          Frame(),
          Frame(),
        ]),
      ]),
    ]),
  ])
})
