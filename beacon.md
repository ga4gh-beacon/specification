# Beacon API Specification v1.0.0

#### Name: Beacon API
#### Description: A Beacon is a web service for genetic data sharing that can be queried for information about specific alleles.

#### Authors:
- Dylan Spalding
- Gary Saunders
- Ilkka Lappalainen
- Jordi Rambla
- Juha Törnroos
- Kasper Keinänen
- Marc Fiume
- Michael Baudis
- Miro Cupack
- Sabela de la Torre
- Saif Ur-Rehman 
- Serena Scollen


#### Publication Date: xx.06.2018
#### Version: 1.0.0

## Executive Summary
The main purpose of Beacon is to make genetic data discoverable without a need to apply access to datasets beforehand. With Beacon it is possible to make simple queries to the datasets and discover interesting datasets. If interesting dataset is found Beacon will point to appropriate place to apply dataset permissions (e.g. to EGA).    

## Document Scope 
This document explains what are the design principles in Beacon API, how protocol works, what methods are offered by the API and shows API works in practise by providing examples. This document does not editorialise how Beacon API should be implemented. However there are implementations of this API, such as [ELIXIR Beacon reference implementation](https://github.com/ga4gh-beacon/beacon-elixir).  

### Referenced External Standards
- [ADA-M](https://github.com/ga4gh/ADA-M) 
- [GA4GH Consent Codes](https://github.com/ga4gh/ga4gh-consent-policy)

## Design Principles
Beacon provides REST API on top of HTTP protocol.



## API Protocol
The Beacon API has two endpoints:

#### - `/`
The `/` endpoint has only one method, the `get()` method.
about the API.

#### - `/query`
The `/query` endpoint has two methods, the `get()` and the `post()`.

### Security
Three level access tiers: Open, Registered and Controlled.

Open: no authorization (verification of access rights) or authentication (verification of identity) is performed.

Registered: authentication  of the user is performed (in the case of ELIXIR verification of 'bona-fide' researcher status is performed)

Controlled: both authentication and authorization checks are performed.

 

## Beacon API Methods

#### Beacon `/` endpoint:
##### - METHOD: `GET`
The `get()` method uses the HTTP protocol 'GET' to returns a Json object of all the necessary info on the beacon and the Api. It
uses the `/` path and only serves an information giver. The parameters that the method returns and their descriptions
can be found under the title: [Beacon]()

        
#### Beacon `/query` endpoint:
##### - METHOD: `GET`
The `get()` method uses the HTTP
protocol 'GET' to return a Json object. The object contains the `alleleRequest` that was submitted, the `datasetAlleleResponse`
that was received, some general info on the api and the parameter `exists`. The `exists` parameter is the answer from the
query that tells the user if the allele was found or not.


##### - METHOD: `POST`
The `post()` method runs the same code as the `get()` method but uses the HTTP protocol `POST` instead. The main difference
between the methods is that the parameters are not sent in the URL. This is more secure because the `GET` requests URLs get
logged and then if you use the `POST` instead, you dont reveal the parameters that you query with.


                

    

## Beacon API Objects
### 1. Beacon
#### Required parameters:
- id
- name
- apiVersion
- organization
- datasets
#### Properties:
**id:** Unique identifier of the beacon. Use reverse domain name notation.

*example: org.ga4gh.beacon*     
          
**name:** Name of the beacon.
          
**apiVersion:** Version of the API provided by the beacon.

*example: v0.3*
        
**organization:** [Organization](#4.-beaconorganization)
        
**description:** Description of the beacon.
        
**version:** Version of the beacon.

*example: v0.1*
        
**welcomeUrl:** URL to the welcome page for this beacon (RFC 3986 format).

*example: 'http://example.org/wiki/Main_Page'*
       
**alternativeUrl:** Alternative URL to the API, e.g. a restricted version of this beacon(RFC 3986 format).

*example: 'http://example.org/wiki/Main_Page'*
          
**createDateTime:** The time the beacon was created (ISO 8601 format).

*example: '2012-07-19 or 2017-01-17T20:33:40Z'*
       
**updateDateTime:** The time the beacon was created (ISO 8601 format).

*example: '2012-07-19 or 2017-01-17T20:33:40Z'*
        
**datasets:** Datasets served by the beacon. Any beacon should specify at least one dataset. ([BeaconDataset](#5.-beacondataset))
        
**sampleAlleleRequests:** Examples of interesting queries, e.g. a few queries demonstrating different esponses. ([BeaconAlleleRequest](#2.-beaconallelerequest))
          
**info:** Additional structured metadata, key-value pairs. ([KeyValuePair](#8.-keyvaluepair))
          
### 2. BeaconAlleleRequest
Allele request as interpreted by the beacon.

#### Required parameters:
- referenceName
- referenceBases
- assemblyId
#### Properties:
**referenceName:** `string`

Reference name (chromosome). Accepting values 1-22, X, Y.

**start:** `integer`

Precise start coordinate position, allele locus (0-based).
* **start** only:
  - for single positions, e.g. the start of a specified sequence alteration where the size is given through the specified alternateBases
  - typical use are queries for SNV and small InDels
  - the use of "start" without an "end" parameter requires the use of "referenceBases"
* **start** and **end**:
  - special use case for exactly determined structural changes

**end:** `integer`

Precise end coordinate. See start.

**startMin:** `integer`

Minimum start coordinate
* startMin + startMax + endMin + endMax
  - for querying imprecise positions (e.g. identifying all structural variants starting anywhere between startMin <-> startMax, and ending anywhere between endMin <-> endMax
  - single or douple sided precise matches can be achieved by setting startMin = startMax XOR endMin = endMax

**startMax:** `integer`

Maximum start coordinate. See startMin.

**endMin:** `integer`

Minimum end coordinate. See startMin.

**endMAx:** `integer`

Maximum end coordinate. See startMin.

**referenceBases:** `string`

Reference bases for this variant (starting from `start`).

Accepted values: [ACGT]*

When querying for variants without specific base alterations (e.g. imprecise structural variants with separate variant_type as well as start_min & end_min ... parameters), the use of a single "N" value is required.

**alternateBases:** `string`

The bases that appear instead of the reference bases. Accepted
values: [ACGT]* or N.
Symbolic ALT alleles (DEL, INS, DUP, INV, CNV, DUP:TANDEM, DEL:ME,
INS:ME) will be represented in `variantType`.

Optional: either `alternateBases` or `variantType` is required.

**variantType:** `string`

The `variantType` is used to denote e.g. structural variants.

Examples:
* DUP: duplication of sequence following `start`; not necessarily in
situ
* DEL: deletion of sequence following `start`

Optional: either `alternateBases` or `variantType` is required.

**assemblyId:** `string`

Assembly identifier (GRC notation, e.g. `GRCh37`).

**datasetIds:** `array`

Identifiers of datasets, as defined in `BeaconDataset`. If this field is null/not specified, all datasets should be queried.

**includeDatasetResponses:** `string`

Indicator of whether responses for individual datasets
(datasetAlleleResponses) should be included in the response
(BeaconAlleleResponse) to this request or not. If null (not
specified), the default value of NONE is assumed.

Values: [ALL, HIT, MISS, NONE]


### 3. BeaconAlleleResponse
The response to the given query.

#### Required parameters:
- beaconId
#### Properties:
**beaconId:** `string`

Identifier of the beacon, as defined in `Beacon`.

**apiVersion:** `string`

Version of the API. If specified, the value must match `apiVersion` in Beacon

**exists: `boolean`** 

Indicator of whether the given allele was observed in any of the
datasets queried. This should be non-null, unless there was an
error, in which case `error` has to be non-null.

**alleleRequest:** `object`

[BeaconAlleleRequest](#2.-beaconallelerequest)

**datasetAlleleResponses:** `array`

Indicator of whether the given allele was  observed in individual
datasets. This should be non-null if `includeDatasetResponses` in
the corresponding `BeaconAlleleRequest` is true, and null otherwise.

Array items: [BeaconDatasetAlleleResponse](#6.-beacondatasetalleleresponse)

**error:** [BeaconError](#7.--beaconerror)

### 4. BeaconOrganization
The organization owning the beacon.

#### Required parameters:
- id
- name
#### Properties:

**id:** `string`

Unique identifier of the organization

**name:** `string`

Name of the organization.

**description:** `string`

Description of the organization.

**address:** `string`

Address of the organization.

**welcomeUrl:** `string`

URL of the website of the organization (RFC 3986 format).

**contactUrl:** `string`

URL with the contact for the beacon operator/maintainer, e.g. link
to a contact form (RFC 3986 format) or an email (RFC 2368 format).

**logoUrl:** `string`

URL to the logo (PNG/JPG format) of the organization (RFC 3986
format).

**info:** `array`

Additional structured metadata, key-value pairs.

Array items: [KeyValuePair](#8.-keyvaluepair)

### 5. BeaconDataset

#### Required parameters:
- id
- name
- assemblyId
- createDateTime
- updateDateTime

#### Properties:

**id:** `string`

Unique identifier of the dataset.

**name:** `string`

Name of the dataset.

**assemblyId:** `string`

Assembly identifier (GRC notation, e.g. `GRCh37`).

**createDateTime:** `string`

The time the dataset was created (ISO 8601 format).

*example: '2012-07-19 or 2017-01-17T20:33:40Z'*

**version:** `string`

Version of the dataset.

**variantCount:** `integer`

Total number of variants in the dataset.

*minimum: 0*

**callCount:** `integer`

Total number of calls in the dataset.

*minimum: 0*

**sampleCount:** `integer`

Total number of samples in the dataset.

*minimum: 0*

**externalUrl:** `string`

URL to an external system providing more dataset information (RFC 3986 format).

*example: 'http://example.org/wiki/Main_Page'*

**info:** `array`

Additional structured metadata, key-value pairs.

Array items: [KeyValuePair](#8.-keyvaluepair)

### 6. BeaconDatasetAlleleResponse
The individual responces from the different datasets. 
#### Required parameters:
- datasetId

#### Properties:

**datasetId:** `string

The unique Id for the dataset.

**exists:** `boolean`

Indicator of whether the given allele was observed in the dataset.
This should be non-null, unless there was an error, in which case
`error` has to be non-null.

**error:** [BeaconError](#7.--beaconerror)

**frequency:** `integer`

Frequency of this allele in the dataset. Between 0 and 1, inclusive.

*minimum: 0*

*maximum: 1*

**variantCount:** `integer`

Number of variants matching the allele request in the dataset.

*minimum: 0*

**callCount:** `integer`

Number of calls matching the allele request in the dataset.

*minimum: 0*

**sampleCount:** `integer`

Number of samples matching the allele request in the dataset

*minimum: 0*

**note:** `string`

Additional note or description of the response.

**externalUrl:** `string`

URL to an external system, such as a secured beacon or a system
providing more information about a given allele (RFC 3986 format).

**info:**: `array`

Additional structured metadata, key-value pairs.

Array items: [KeyValuePair](#8.-keyvaluepair)


### 7.  BeaconError
Beacon-specific error. This should be non-null in exceptional situations only, in which case `exists` has to be null.
#### Required parameters:
- errorCode
#### Properties:

**errorCode:** `integer`

**errorMessage:** `string`

### 8. KeyValuePair
#### Required parameters:
- key
- value
#### Properties:
**key:** `string`

**value:** `string`

### 9. DataUseConditions
#### Required parameters:
- consentCodeDataUse
- adamDataUse
#### Properties:
**consentCodeDataUse:** 
https://raw.githubusercontent.com/sdelatorrep/ga4gh-consent-policy/openapi_v2.0/consent_code.yaml#/definitions/ConsentCodeDataUse

**adamDataUse:** [AdamDataUse](#10.-adamdatause)

### 10. AdamDataUse
#### Required parameters:
- header
- profile
- terms
- metaConditions
#### Properties:
**header:** 
https://raw.githubusercontent.com/sdelatorrep/ADA-M/openapi_v2.0/adam.yaml#/definitions/AdamHeader

**profile:** 
https://raw.githubusercontent.com/sdelatorrep/ADA-M/openapi_v2.0/adam.yaml#/definitions/AdamProfile

**terms:**
https://raw.githubusercontent.com/sdelatorrep/ADA-M/openapi_v2.0/adam.yaml#/definitions/AdamTerms

**metaConditions:**
https://raw.githubusercontent.com/sdelatorrep/ADA-M/openapi_v2.0/adam.yaml#/definitions/AdamMetaConditions

## Beacon API Example
#### - /
Example of how to use the GET method in the "/" path:    
`curl -v http://localhost:5000/` 
    
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
      "alternativeUrl": "https://ega-archive.org/beacon_web/", 
      "apiVersion": "0.4", 
      "createDateTime": "2015-06-15T00:00.000Z", 
      "dataset": [
        {
          "assemblyId": "grch37", 
          "callCount": 74, 
          "createDateTime": null, 
          "description": "This sample set comprises cases of schizophrenia with additional cognitive measurements, collected in Aberdeen, Scotland.", 
          "externalUrl": null, 
          "id": "EGAD00000000028", 
          "info": {
            "accessType": "PUBLIC", 
            "authorized": "false"
          }, 
          "name": null, 
          "sampleCount": 1, 
          "updateDateTime": null, 
          "variantCount": 74, 
          "version": null
        }
      ], 
      "description": "This <a href=\"http://ga4gh.org/#/beacon\">Beacon</a> is based on the GA4GH Beacon <a href=\"https://github.com/ga4gh/beacon-team/blob/develop/src/main/resources/avro/beacon.avdl\">API 0.4</a>", 
      "id": "ega-beacon", 
      "info": {
        "size": "60270153"
      }, 
      "name": "EGA Beacon", 
      "organization": {
        "address": "", 
        "contactUrl": "mailto:beacon.ega@crg.eu", 
        "description": "The European Genome-phenome Archive (EGA) is a service for permanent archiving and sharing of all types of personally identifiable genetic and phenotypic data resulting from biomedical research projects.", 
        "id": "EGA", 
        "info": null, 
        "logoUrl": "https://ega-archive.org/images/logo.png", 
        "name": "European Genome-Phenome Archive (EGA)", 
        "welcomeUrl": "https://ega-archive.org/"
      }, 
      "sampleAlleleRequests": [
        {
          "alternateBases": "A", 
          "assemblyId": "GRCh37", 
          "datasetIds": null, 
          "includeDatasetResponses": false, 
          "referenceBases": "C", 
          "referenceName": "17", 
          "start": 6689
        }, 
        {
          "alternateBases": "G", 
          "assemblyId": "GRCh37", 
          "datasetIds": [
            "EGAD00000000028"
          ], 
          "includeDatasetResponses": "ALL", 
          "referenceBases": "A", 
          "referenceName": "1", 
          "start": 14929
        }, 
        {
          "alternateBases": "CCCCT", 
          "assemblyId": "GRCh37", 
          "datasetIds": [
            "EGAD00001000740", 
            "EGAD00001000741"
          ], 
          "includeDatasetResponses": "HIT", 
          "referenceBases": "C", 
          "referenceName": "1", 
          "start": 866510
        }
      ], 
      "updateDateTime": null, 
      "version": "v04", 
      "welcomeUrl": "https://ega-archive.org/beacon_web/"
    }
    * Closing connection 0
#### - /query
Example of how to use the GET method in the "/query" path:

    curl -v 'http://localhost:5000/query?referenceName=1&start=0&end=0&startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL'
######
    
    > GET /query?referenceName=1&start=0&end=0&startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL HTTP/1.1
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
        "beaconId": "ega-beacon",
        "apiVersion": "0.4",
        "exists": true,
        "error": null,
        "allelRequest": {
            "referenceName": "1",
            "start": 0,
            "startMin": 28000000,
            "startMax": 29000000,
            "end": 0,
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
        "datasetAllelResponses": [
            {
                "datasetId": "EGAD00000000028",
                "exists": true,
                "frequency": 0.5,
                "variantCount": 1,
                "callCount": 1,
                "sampleCount": 1,
                "note": "This sample set comprises cases of schizophrenia with additional cognitive measurements, collected in Aberdeen, Scotland.",
                "externalUrl": null,
                "info": {
                    "accessType": "PUBLIC",
                    "authorized": "false"
                },
                "error": null
            }
        ]
    }
    * Closing connection 0
    
    
######
Example of how to use the POST method in the "/query" path:
   
    curl -v -d "referenceName=1&start=14929&referenceBases=A&alternateBases=G&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatsetResponses=ALL" http://localhost:5000/query
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
        "beaconId": "ega-beacon",
        "apiVersion": "0.4",
        "exists": true,
        "error": null,
        "alleleRequest": {
            "referenceName": "1",
            "start": 14929,
            "startMin": 0,
            "startMax": 0,
            "end": 0,
            "endMin": 0,
            "endMax": 0,
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
                "info": {
                    "accessType": "PUBLIC",
                    "authorized": "false"
                },
                "error": null
            }
        ]
    }
    * Closing connection 0
    
    

