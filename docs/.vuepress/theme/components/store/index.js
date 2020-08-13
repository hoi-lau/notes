class EventBus {
  constructor() {
    this.eventInstances = []
    this.sub = {}
  }
  create(str) {
    if (this.contains(str)) return false
    this.eventInstances.push(str)
    this.sub[str] = []
    return true
  }
  contains(str) {
    return this.eventInstances.includes(str)
  }
  destroy(str) {
    const index = this.eventInstances.indexOf(str)
    if (index === -1) return false
    this.eventInstances.splice(index, 1)
    delete this.sub[str]
  }
  publish(str) {
    if (this.sub[str]) this.sub[str].forEach(item => item())
  }
  subscribe(str, cb) {
    this.create(str)
    this.sub[str].push(cb)
  }
}

const GlobalBus = new EventBus()

export default GlobalBus