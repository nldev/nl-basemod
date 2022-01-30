import '../global'

export type Color = [number, number, number, number]

export interface Mapping<T = any> {
  [key: string]: T
}

