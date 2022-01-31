import { init } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

init($ => {
  const scroll = Scroll(
    { name: 'scrollable' },
    [
      Frame({ name: 'hello', isPrefix: true }),
      Frame({ name: 'hello', isPrefix: true }),
      Frame({ name: 'hello', isPrefix: true }, [
        Frame(),
      ]),
    ],
  )

  console.log(scroll.ref.GetName())
})

