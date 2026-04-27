export const META_ENTITIES = {
  user: {
    table: 'user_meta',
    foreignKey: 'user_id',
  },
  person: {
    table: 'person_meta',
    foreignKey: 'person_id',
  },
} as const

export type MetaEntity = keyof typeof META_ENTITIES