lunr.DocumentMatches = function () {
  this.store = Object.create(null)
  this.length = 0
}

lunr.DocumentMatches.prototype.fieldRefs = function () {
  var refs = Object.keys(this.store),
      fieldRefs = []

  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i]
    var fields = Object.keys(ref)

    for (var j = 0; j < fields.length; j++) {
      fieldRefs.push(new lunr.FieldRef (ref, fields[j]))
    }
  }

  return fieldRefs
}

lunr.DocumentMatches.prototype.intersect = function (refs, field) {
  if (this.length === 0) {
    return this.union(field, refs)
  }

  var intersectedStore = Object.create(null)

  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i]
    if (this.store[ref]) {
      intersectedStore = this.store[ref]
      intersectedStore[ref][field] = true
    }
  }

  this.store = intersectedStore
  this.length = Object.keys(this.store)
}

lunr.DocumentMatches.prototype.union = function (refs, field) {
  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i]
    this.store[ref] = Object.create(null)
    this.store[ref][field] = true
  }

  this.length = Object.keys(this.store)
}

lunr.DocumentMatches.prototype.remove = function (refs, field) {
  if (this.length === 0) {
    return
  }

  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i]

    if (this.store[ref]) {
      delete this.store[ref][field]
    }

    if (Object.keys(this.store[ref]).length === 0) {
      delete this.store[ref]
    }
  }

  this.length = Object.keys(this.store)
}
