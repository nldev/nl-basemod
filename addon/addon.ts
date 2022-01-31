import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  console.log($.playerInfo.name)

  return Scroll({ name: 'scrollable' }, [
    Frame({ name: 'hello', isPrefix: true }),
    Frame({ name: 'hello', isPrefix: true }),
    Frame({ name: 'hello', isPrefix: true }, [
      Frame(null, [
        Frame(null, [
          Frame(),
          Frame(),
          Frame(),
        ]),
      ]),
    ]),
  ])
})
