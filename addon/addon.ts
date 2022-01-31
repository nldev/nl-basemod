import { init, Get } from './basemod/app'
import { Frame } from './basemod/component'

init($ => {
  const frame = new Frame({ name: 'helloworld' })

  console.log(frame.ref.GetName())
})

