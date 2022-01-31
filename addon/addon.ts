import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const f = Frame().Backdrop().Parent($.root)

  return Scroll({ name: 'scrollable' }, [
    Frame({ prefix: 'hello' }),
    Frame({ prefix: 'hello' }),
    Frame({ prefix: 'hello' }, [
      Frame(null, [
        Frame(null, [
          f,
          Frame(),
          Frame(),
        ]),
      ]),
    ]),
  ])
})
