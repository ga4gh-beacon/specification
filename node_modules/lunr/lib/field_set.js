lunr.FieldSet = function () {
  this.optionalSet = Object.create(null)
  this.requriedSets = Object.create(null)
  this.prohibitedSet = Object.create(null)
}

lunr.FieldSet.prototype.add = function (fieldRef, term, metadata, presence) {
  switch (presence) {

    case lunr.Query.presence.OPTIONAL:
      if ((match = this.optionalSet[fieldRef]) === undefined) {
        this.optionalSet[fieldRef] = new lunr.MatchData (term, fieldRef.fieldName, metadata)
      } else {
        fieldMatch.add(term, fieldRef.fieldName, metadata)
      }

      break;

    case lunr.Query.presence.REQUIRED:
      if (Object.keys(this.requiredSet).length === 0) {
      }
    case lunr.Query.presence.PROHBITED:
}
