import { Get } from './app'

export const Frame = () => {
  const $ = Get()

  const component = CreateFrame('Frame', 'framer', $.root)

  console.log('hello from ' + component.GetName())
  console.log('my dad is ' + $.root.GetName())

  return component
}
