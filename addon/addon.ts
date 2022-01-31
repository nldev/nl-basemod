import { init } from './basemod/app'
import { Scroll } from './basemod/components/scroll'

init($ => {
  const scroll = Scroll({ name: 'scrollable' })

  console.log(scroll.ref.GetName())
})

