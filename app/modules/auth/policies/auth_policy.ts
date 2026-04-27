export default class AuthPolicy {
  async viewAny() {
    return true
  }

  async view() {
    return true
  }

  async create() {
    return true
  }

  async update() {
    return true
  }

  async delete() {
    return true
  }
}
