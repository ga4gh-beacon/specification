# Beacon Project Repository
GA4GH Beacon team repo


## Developer FAQ

### What are the valid responses for a beacon?

A: Yes or No

Yes means, "I have information about the queried variant" and No means, either (i) "I don't have information about the queried variant" or (ii) "I don't know if I have information about the queried variant".

The decision to support either Yes or No, and not an additional Null option, was due to complexities in distinguishing between "I don't have information about the queried variant" and "I don't know if I have information about the queried variant". For example, if a beacon is served from a VCF file that has reference alleles omitted, it is impossible to determine whether the reference allele was observed but not recorded, or not observed at all.

It was decided that an additional set of Evidence Codes could be returned if this information is available.

### Is the position in a Beacon query 0-based or 1-based?

A: 0-based

The decision to use 0-based coordinates for the position in the Beacon query was based on alignment with the core GA4GH APIs. Of course, when designing clients (e.g. websites) which query beacons, developers should use descretion about what the end-user expects. The Beacon Network, for example, takes 1-based coordinates as input and queries connected Beacons in 0-based coordinates, as appropriate.

### How are queries against complex mutations treated? 

A: For insertions and deletions exact match is required for a Yes response. More complex mutations (e.g. inversions, duplications) are not yet supported.

Queries for insertions or deletions must be sepcified using ref and alt strings of bases. For insertions and deletions exact match is required for a Yes response. More complex mutations (e.g. inversions, duplications) are not yet supported. 
