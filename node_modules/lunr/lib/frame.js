lunr.Frame = function (cursor, accumulator, state) {
  this.cursor = cursor
  this.accumulator = accumulator
  this.state = state
}

lunr.Frame.prototype.release = function () {
  lunr.Frame.pool.push(this)
}

lunr.Frame.pool = []

lunr.Frame.borrow = function () {
  return this.pool.pop() || new lunr.Frame
}
