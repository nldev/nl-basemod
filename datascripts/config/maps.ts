import { Task, Templates } from '../basemod'
import { MapOptions } from '../basemod/maps'

export const MAPS: Templates<MapOptions> = {
  taskId: 'create-map',
  list: [
    {
      id: 'dev',
      data: {
        name: 'World',
        timeOfDay: 0,
        isModify: false,
      }
    }
  ],
}

