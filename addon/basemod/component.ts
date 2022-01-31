import { Get } from './state'
export const Frame = () => {
  const $ = Get()

  const component = CreateFrame('Frame', 'framer', $.root)

  console.log('hello from ' + component.GetName())

  return component
}
