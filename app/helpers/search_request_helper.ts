import type { Request } from '@adonisjs/core/http'

export type WhereOperator =
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'like'
  | 'in'
  | 'not in'
  | 'is'
  | 'is not'

export type WhereClause = {
  column: string
  operator?: WhereOperator
  value: any
  boolean?: 'and' | 'or'
}

export type OrderByClause = {
  column: string
  direction?: 'asc' | 'desc'
}

export type MetaWhereClause = {
  key: string
  value: any
  operator?: '=' | '!=' | 'like' | 'in' | 'not in'
  boolean?: 'and' | 'or'
}

export type ParsedSearchRequest = {
  page: number
  limit: number
  select?: string[]
  include: string[]
  where: WhereClause[]
  orderBy: OrderByClause[]
  metaWhere: MetaWhereClause[]
}

export default class SearchRequestHelper {
  static fromRequest(request: Request): ParsedSearchRequest {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))

    const select = request.input('select')
      ? String(request.input('select'))
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined

    const include = request.input('include')
      ? String(request.input('include'))
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : []

    const orderBy = request.input('orderBy')
      ? String(request.input('orderBy'))
          .split(',')
          .map((item) => {
            const [column, direction] = item.split(':')

            return {
              column: column.trim(),
              direction: (direction?.trim()?.toLowerCase() as 'asc' | 'desc') || 'asc',
            }
          })
          .filter((item) => item.column)
      : []

    const where = request.input('filters')
      ? String(request.input('filters'))
          .split(',')
          .map((item) => {
            const [column, operator, value, boolean] = item.split(':')

            return {
              column: column.trim(),
              operator: (operator?.trim() as WhereOperator) || '=',
              value: this.parseValue(value),
              boolean: (boolean?.trim() as 'and' | 'or') || 'and',
            }
          })
          .filter((item) => item.column)
      : []

    const metaWhere = request.input('metaFilters')
      ? String(request.input('metaFilters'))
          .split(',')
          .map((item) => {
            const [key, operator, value, boolean] = item.split(':')

            return {
              key: key.trim(),
              operator: (operator?.trim() as MetaWhereClause['operator']) || '=',
              value: this.parseValue(value),
              boolean: (boolean?.trim() as 'and' | 'or') || 'and',
            }
          })
          .filter((item) => item.key)
      : []

    return {
      page,
      limit,
      select,
      include,
      where,
      orderBy,
      metaWhere,
    }
  }

  private static parseValue(
    value: unknown
  ): string | number | boolean | null | Array<string | number | boolean | null> {
    if (value === 'null') return null
    if (value === 'true') return true
    if (value === 'false') return false

    if (typeof value === 'string' && value.includes('|')) {
      return value.split('|').map((item) => this.parseValue(item)) as Array<
        string | number | boolean | null
      >
    }

    if (typeof value === 'string' && value !== '' && !Number.isNaN(Number(value))) {
      return Number(value)
    }

    return String(value ?? '')
  }
}