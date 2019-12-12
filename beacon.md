
# Beacon API Specification v1.1.0

Beacon is a web service for genetic data sharing. Beacon permits simple queries regarding the presence or absence of a specified variant in a given dataset. This is the key idea behind Beacon, by allowing these queries Beacon makes the data discoverable. If the user finds their variant(s) of interest, Beacon will point them to the appropriate place to gain access to the data (e.g. the European Genome-Phenome Archive, EGA).

**Authors**: _Ilkka Lappalainen, Jordi Rambla, Juha Törnroos, Kasper Keinänen, Marc Fiume, Michael Baudis, Miro Cupack, Sabela de la Torre, Saif Ur-Rehman_ 


## Design Principles
The Beacon protocol provides _query interface_ that has been designed to be:

- **Simple:** focuses on robustness and easy implementation
- **Federated:** maintained by individual organizations and assembled into a network
- **General-purpose:** used to distribute any allelic dataset
- **Aggregative:** provides a boolean answer to whether an allele was observed
- **Privacy protecting:** queries do not return information about single individuals


Due to the needs for data discoverability providing as much metadata as possible in query responses is endorsed. The Beacon is limited for human data only.


## Protocol essentials

Beacon provides REST API on top of the HTTPS protocol, as specified in RFC 7231. HTTPS (HTTP over SSL) SHOULD be used instead of regular HTTP because the communication between Beacon server and Beacon client has to be encrypted. The Beacon API has two endpoints: `/` (also known as _Info endpoint_) and `/query`. The _Info endpoint_ provides general metadata about the Beacon instance and dataset(s) included. The query interface is provided by the _Query endpoint_. 

The full complement of Beacon API endpoints, requests and responses is published in [OpenAPI format](https://github.com/ga4gh-beacon/specification/blob/master/beacon.yaml). 

### Security
Beacon endorses GA4GH's 3-tier access to data:

- **Open:** No authentication (verification of identity) or authorization (verification of access rights).

- **Registered:** Authentication of the user is performed. For example it is required that the user is `bona-fide researcher`.

- **Controlled:** Both authentication and authorization checks are performed to ensure that the user has been granted to access the data they are querying.

Registered and controlled access requires authentication of the user. The Beacon API supports authenticated queries using OAuth2 Bearer tokens in HTTP Authorisation header as specified in [RFC 6750](https://tools.ietf.org/html/rfc6750): 

     GET /query HTTP/1.1
     Host: beacon.com
     Authorization: Bearer doPk34akbm9bsw5nknklex

Both granting access to the data and identifying `bona-fide researchers` **is not** Beacon's responsibility. 

 ### Errors

The server MUST respond with the appropriate HTTP status code when an error condition is detected. In the case of transient 
server errors, (e.g., 500 and other 5xx status codes), the client SHOULD implement appropriate retry logic.

For errors that are specific to the Beacon API, the response will be one of the HTTP status codes represented in the table below. 
The response body SHOULD be a JSON object (`Content-Type: application/json`) providing machine-readable information 
about the nature of the error, along with a human-readable description. 


The following error types are defined: 

| Error type | HTTP status code | Description |
|---|:---:|---|
|Bad request|400|Mandatory parameters are missing or they are invalid|
|Unauthorized|401|An unauthenticated user is trying to access a protected resource|
|Forbidden|403|The resource is protected for all users, or the user is authenticated but they are not granted access for this resource|

The error type SHOULD be chosen from this table and be accompanied by the specified HTTP status code. 
An example of a valid JSON error response is:

```json
"error": {
            "errorCode": 400,
            "errorMessage": "Missing mandatory parameter referenceName"
        }
```    

### CORS 
Beacon API SHOULD support cross-origin resource sharing (CORS) and follow [GA4GH CORS recommendations](https://docs.google.com/document/d/1Ifiik9afTO-CEpWGKEZ5TlixQ6tiKcvug4XLd9GNcqo/edit).


### External Standards referenced in the API
- The Automatable Discovery and Access Matrix ([ADAM](https://github.com/ga4gh/ADA-M)) 
- GA4GH Consent Codes ([GA4GH-CC](https://github.com/ga4gh/ga4gh-consent-policy))


### Example Requests and Responses 
An example `GET` request and response to the info endpoint:    
    
    > GET / HTTP/1.1
    > Host: localhost:5000
    > User-Agent: curl/7.54.0
    > Accept: */*
    > 
    * HTTP 1.0, assume close after body
    < HTTP/1.0 200 OK
    < Content-Type: application/json
    < Content-Length: 2391
    < Server: Werkzeug/0.14.1 Python/3.6.5
    < Date: Fri, 08 Jun 2018 12:07:36 GMT
    < 
    {
      "id": "ega-beacon", 
      "name": "EGA Beacon", 
      "apiVersion": "1.1.0", 
      "organization": {
        "id": "EGA", 
        "name": "European Genome-Phenome Archive (EGA)", 
        "description": "The European Genome-phenome Archive (EGA) is a service for permanent archiving and sharing of all types of personally identifiable genetic and phenotypic data resulting from biomedical research projects.", 
        "address": "", 
        "welcomeUrl": "https://ega-archive.org/",
        "contactUrl": "mailto:beacon.ega@crg.eu", 
        "logoUrl": "https://ega-archive.org/images/logo.png" 
      }, 
      "description": "This <a href=\"http://ga4gh.org/#/beacon\">Beacon</a> is based on the GA4GH Beacon <a href=\"https://github.com/ga4gh/beacon-team/blob/develop/src/main/resources/avro/beacon.avdl\">API 0.4</a>", 
      "version": "v1.0.0", 
      "welcomeUrl": "https://ega-archive.org/beacon_web/",
      "alternativeUrl": "https://ega-archive.org/beacon_web/", 
      "createDateTime": "2015-06-15T00:00.000Z", 
      "datasets": [
        {
          "id": "EGAD00000000028", 
          "name": "Sample Dataset",
          "description": "This sample set comprises cases of schizophrenia with additional cognitive measurements, collected in Aberdeen, Scotland.", 
          "assemblyId": "GRCh37", 
          "createDateTime": "2017-01-17T20:33:40Z", 
          "updateDateTime": "2017-01-17T20:33:40Z", 
          "variantCount": 74, 
          "callCount": 74, 
          "sampleCount": 1, 
          "info": {} 
        }
      ], 
      "sampleAlleleRequests": [
        {
          "referenceName": "17", 
          "start": 6689, 
          "referenceBases": "C", 
          "alternateBases": "A", 
          "assemblyId": "GRCh37", 
          "includeDatasetResponses": "NONE"
        }, 
        {
          "referenceName": "1", 
          "start": 14929, 
          "referenceBases": "A", 
          "alternateBases": "G", 
          "assemblyId": "GRCh37", 
          "datasetIds": [
            "EGAD00000000028"
          ], 
          "includeDatasetResponses": "ALL" 
        }, 
        {
          "referenceName": "1", 
          "start": 866510, 
          "referenceBases": "C", 
          "alternateBases": "CCCCT", 
          "assemblyId": "GRCh37", 
          "datasetIds": [
            "EGAD00001000740", 
            "EGAD00001000741"
          ], 
          "includeDatasetResponses": "HIT" 
        }
      ], 
      "info": {
        "size": "60270153"
      } 
    }
    * Closing connection 0


Example of how to use the GET method in the `/query` endpoint:

    curl -v 'https://localhost:5000/query?referenceName=1&startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL'
######
    
    > GET /query?referenceName=1&startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL HTTP/1.1
    > Host: localhost:5000
    > User-Agent: curl/7.54.0
    > Accept: */*
    > 
    * HTTP 1.0, assume close after body
    < HTTP/1.0 200 OK
    < Content-Type: application/json
    < Content-Length: 1078
    < Server: Werkzeug/0.14.1 Python/3.6.5
    < Date: Mon, 11 Jun 2018 07:29:26 GMT
    < 
    {
      "id": "ega-beacon", 
      "name": "EGA Beacon", 
      "apiVersion": "1.1.0", 
      "organization": {
        "id": "EGA", 
        "name": "European Genome-Phenome Archive (EGA)", 
        "description": "The European Genome-phenome Archive (EGA) is a service for permanent archiving and sharing of all types of personally identifiable genetic and phenotypic data resulting from biomedical research projects.", 
        "address": "", 
        "welcomeUrl": "https://ega-archive.org/",
        "contactUrl": "mailto:beacon.ega@crg.eu", 
        "logoUrl": "https://ega-archive.org/images/logo.png" 
      }, 
      "description": "This <a href=\"http://ga4gh.org/#/beacon\">Beacon</a> is based on the GA4GH Beacon <a href=\"https://github.com/ga4gh/beacon-team/blob/develop/src/main/resources/avro/beacon.avdl\">API 0.4</a>", 
      "version": "v1.0.0", 
      "welcomeUrl": "https://ega-archive.org/beacon_web/",
      "alternativeUrl": "https://ega-archive.org/beacon_web/", 
      "createDateTime": "2015-06-15T00:00.000Z", 
      "alleleRequest": {
          "referenceName": "1",
          "startMin": 28000000,
          "startMax": 29000000,
          "endMin": 28000000,
          "endMax": 29000000,
          "referenceBases": "A",
          "alternateBases": "T",
          "assemblyId": "GRCh37",
          "datasetIds": [
              "EGAD00000000028"
          ],
          "includeDatasetResponses": "ALL"
        },
        "datasetAlleleResponses": [
            {
                "datasetId": "EGAD00000000028",
                "exists": true,
                "frequency": 0.5,
                "variantCount": 1,
                "callCount": 1,
                "sampleCount": 1,
                "note": "This sample set comprises cases of schizophrenia with additional cognitive measurements, collected in Aberdeen, Scotland.",
                "externalUrl": null,
                "info": {},
                "datasetHandover": [
                  {
                    "handoverType": {
                      "id": "EFO:0004157",
                      "label": "BAM format"
                    },
                    "note": "This handover link provides access to a summarized VCF. To access the VCF containing the details for each sample filling an application is required. See Beacon contact information details.",
                    "url": "https://api.mygenomeservice.org/handover/9dcc48d7-fc88-11e8-9110-b0c592dbf8c0/"
                  }
                ]
            }
        ],
        "beaconHandover": [
          {
            "handoverType": {
              "id": "EFO:0004157",
              "label": "BAM format"
            },
            "note": "This handover link provides access to a summarized VCF. To access the VCF containing the details for each sample filling an application is required. See Beacon contact information details.",
            "url": "https://api.mygenomeservice.org/handover/9dcc48d7-fc88-11e8-9110-b0c592dbf8c0/"
          }
        ]
    }
    * Closing connection 0    
    
######
Example of how to use the POST method in the "/query" path:
   
    curl -v -d "referenceName=1&start=14929&referenceBases=A&alternateBases=G&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatsetResponses=ALL" https://localhost:5000/query
######

    > POST /query HTTP/1.1
    > Host: localhost:5000
    > User-Agent: curl/7.54.0
    > Accept: */*
    > Content-Length: 133
    > Content-Type: application/x-www-form-urlencoded
    > 
    * upload completely sent off: 133 out of 133 bytes
    * HTTP 1.0, assume close after body
    < HTTP/1.0 200 OK
    < Content-Type: application/json
    < Content-Length: 1056
    < Server: Werkzeug/0.14.1 Python/3.6.5
    < Date: Mon, 11 Jun 2018 07:15:48 GMT
    < 
    {
      "id": "ega-beacon", 
      "name": "EGA Beacon", 
      "apiVersion": "1.1.0", 
      "organization": {
        "id": "EGA", 
        "name": "European Genome-Phenome Archive (EGA)", 
        "description": "The European Genome-phenome Archive (EGA) is a service for permanent archiving and sharing of all types of personally identifiable genetic and phenotypic data resulting from biomedical research projects.", 
        "address": "", 
        "welcomeUrl": "https://ega-archive.org/",
        "contactUrl": "mailto:beacon.ega@crg.eu", 
        "logoUrl": "https://ega-archive.org/images/logo.png" 
      }, 
      "description": "This <a href=\"http://ga4gh.org/#/beacon\">Beacon</a> is based on the GA4GH Beacon <a href=\"https://github.com/ga4gh/beacon-team/blob/develop/src/main/resources/avro/beacon.avdl\">API 0.4</a>", 
      "version": "v1.0.0", 
      "welcomeUrl": "https://ega-archive.org/beacon_web/",
      "alternativeUrl": "https://ega-archive.org/beacon_web/", 
      "createDateTime": "2015-06-15T00:00.000Z", 
        "alleleRequest": {
            "referenceName": "1",
            "start": 14929,
            "referenceBases": "A",
            "alternateBases": "G",
            "assemblyId": "GRCh37",
            "datasetIds": [
                "EGAD00000000028"
            ],
            "includeDatasetResponses": "ALL"
        },
        "datasetAlleleResponses": [
            {
                "datasetId": "EGAD00000000028",
                "exists": true,
                "frequency": 0.5,
                "variantCount": 1,
                "callCount": 1,
                "sampleCount": 1,
                "note": "This sample set comprises cases of schizophrenia with additional cognitive measurements, collected in Aberdeen, Scotland.",
                "externalUrl": null,
                "info": {},
                "datasetHandover": [
                  {
                    "handoverType": {
                      "id": "EFO:0004157",
                      "label": "BAM format"
                    },
                    "note": "This handover link provides access to a summarized VCF. To access the VCF containing the details for each sample filling an application is required. See Beacon contact information details.",
                    "url": "https://api.mygenomeservice.org/handover/9dcc48d7-fc88-11e8-9110-b0c592dbf8c0/"
                  }
                ]
            }
        ],
        "beaconHandover": [
          {
            "handoverType": {
              "id": "EFO:0004157",
              "label": "BAM format"
            },
            "note": "This handover link provides access to a summarized VCF. To access the VCF containing the details for each sample filling an application is required. See Beacon contact information details.",
            "url": "https://api.mygenomeservice.org/handover/9dcc48d7-fc88-11e8-9110-b0c592dbf8c0/"
          }
        ]
    }
    * Closing connection 0

`curl -v 'https://localhost:5000/query?startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL'`


```
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 5000 (#0)
> GET /query?&start=0&end=0&startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL HTTP/1.1
> Host: localhost:5000
> User-Agent: curl/7.54.0
> Accept: */*
> 
* HTTP 1.0, assume close after body
< HTTP/1.0 400 BAD REQUEST
< Content-Type: application/json
< Content-Length: 791
< Server: Werkzeug/0.14.1 Python/3.6.5
< Date: Fri, 06 Jul 2018 09:15:39 GMT
< 
{
  "id": "ega-beacon", 
  "name": "EGA Beacon", 
  "apiVersion": "1.1.0", 
  "organization": {
    "id": "EGA", 
    "name": "European Genome-Phenome Archive (EGA)", 
    "description": "The European Genome-phenome Archive (EGA) is a service for permanent archiving and sharing of all types of personally identifiable genetic and phenotypic data resulting from biomedical research projects.", 
    "address": "", 
    "welcomeUrl": "https://ega-archive.org/",
    "contactUrl": "mailto:beacon.ega@crg.eu", 
    "logoUrl": "https://ega-archive.org/images/logo.png" 
  }, 
  "description": "This <a href=\"http://ga4gh.org/#/beacon\">Beacon</a> is based on the GA4GH Beacon <a href=\"https://github.com/ga4gh/beacon-team/blob/develop/src/main/resources/avro/beacon.avdl\">API 0.4</a>", 
  "version": "v1.0.0", 
  "welcomeUrl": "https://ega-archive.org/beacon_web/",
  "alternativeUrl": "https://ega-archive.org/beacon_web/", 
  "createDateTime": "2015-06-15T00:00.000Z", 
    "error": {
        "errorCode": 400,
        "errorMessage": "Missing mandatory parameter referenceName"
    },
    "allelRequest": {
        "startMin": 28000000,
        "startMax": 29000000,
        "endMin": 28000000,
        "endMax": 29000000,
        "referenceBases": "A",
        "alternateBases": "T",
        "assemblyId": "GRCh37",
        "datasetIds": [
            "EGAD00000000028"
        ],
        "includeDatasetResponses": "ALL"
    },
    "datasetAlleleResponses": [],
    "beaconHandover": [
      {
        "handoverType": {
          "id": "EFO:0004157",
          "label": "BAM format"
        },
        "note": "This handover link provides access to a summarized VCF. To access the VCF containing the details for each sample filling an application is required. See Beacon contact information details.",
        "url": "https://api.mygenomeservice.org/handover/9dcc48d7-fc88-11e8-9110-b0c592dbf8c0/"
      }
    ]
}
* Closing connection 0

```
