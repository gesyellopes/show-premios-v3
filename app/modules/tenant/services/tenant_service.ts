export default class TenantService {
  async list() {
    return []
  }

  async find(id: number | string) {
    return {
      id,
    }
  }

  async create(payload: Record<string, unknown>) {
    return {
      ...payload,
    }
  }

  async update(id: number | string, payload: Record<string, unknown>) {
    return {
      id,
      ...payload,
    }
  }

  async delete(id: number | string) {
    return {
      id,
      deleted: true,
    }
  }
}
