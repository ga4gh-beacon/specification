
# Beacon API Specification v1.0.0

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

## Info endpoint

### Request 
##### - URL: `/`
##### - HTTP method: `GET`
##### - Parameters: `None`

### Response
##### Content-type:`application/json`
##### Payload: `Beacon object`  

**Beacon object**

|Properties (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|*id* *|Unique identifier of the beacon. Use reverse domain name notation.|string|org.ga4gh.beacon|
|*name* *|Human readable name of the beacon|string|EGA Beacon|
|*apiVersion* *|Version of the API provided by the beacon.|string|v1.0.0|
|*organisation* *|Organisation providing the Beacon|object|Beacon Organisation object (see below)|
|*datasets* *|Datasets served by the beacon. Any beacon should specify at least one dataset.|array|Array of Beacon Dataset objects (see below)|
|description|Description of the beacon.|string|"This sample set comprises cases of schizophrenia with additional cognitive measurements, collected in Aberdeen, Scotland."|
|version|Version of the Beacon server instance.|string|v0.1|
|welcomeUrl|URL to the welcome page for this beacon (RFC 3986 format).|string|'http://example.org/wiki/Main_Page'|
|alternativeUrl|Alternative URL to the API, e.g. a restricted version of this beacon (RFC 3986 format).|string|'http://example.org/wiki/Main_Page'|
|createDateTime|The time the beacon was created (ISO 8601 format).|string|'2012-07-19 or 2017-01-17T20:33:40Z'|
|updateDateTime|The time the beacon was updated in (ISO 8601 format).|string|'2012-07-19 or 2017-01-17T20:33:40Z'|
|sampleAlleleRequests|Examples of interesting queries, e.g. a few queries demonstrating different responses.|array|Array of BeaconAlleleRequest objects (see _Query endpoint request_)|
|info|'Additional structured metadata, key-value pairs.'|array|-|

**Beacon Organisation object** 

|Properties (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|*id**|Unique identifier of the organization.|string|-|
|*name**|Name of the organization.|string|-|
|description|Description of the organization.|string|-|
|address|Address of the organization.|string|-|
|welcomeUrl|URL of the website of the organization (RFC 3986 format).|string|-|
|contactUrl|URL with the contact for the beacon operator/maintainer, e.g. link to a contact form (RFC 3986 format) or an email (RFC 2368 format).|string|-|
|logoUrl|URL to the logo (PNG/JPG format) of the organization (RFC 3986 format).|string|-|
|info|Additional structured metadata, key-value pairs.|string|-|

**Beacon Dataset object**

|Properties (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|*id**|Unique identifier of the dataset.|string|-|
|*name**|Name of the dataset.|string|-|
|*assemblyId**|Assembly identifier|string|`'GRCh38'`|
|*createDateTime**|The time the dataset was created (ISO 8601 format).|string|`'2012-07-29 or 2017-01-17T20:33:40Z'`|
|*updateDateTime**|The time the dataset was updated in (ISO 8601 format).|string|`'2012-07-19 or 2017-01-17T20:33:40Z'`|
|description|Description of the dataset.|string|-|
|version|Version of the dataset.|string|-|
|variantCount|Total number of variants in the dataset.|integer|`230453`|
|callCount|Total number of calls in the dataset.|integer|`213454`|
|sampleCount|Total number of samples in the dataset.|integer|`13`|
|externalUrl|URL to an external system providing more dataset information (RFC 3986 format).|string|-|
|info|Additional structured metadata, key-value pairs.|array|-|
|dataUseConditions|The conditions for the use of the dataset|object|Data Use Conditions object (see below)|

**Data Use Conditions object**


|Properties (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|*consentCodeDataUse**|The consent code for the use of data.|object|See [GA4GH-CC](https://raw.githubusercontent.com/ga4gh/ga4gh-consent-policy/806ea53cffacb2055c3639f0fc9783f0dcd8cb02/consent_code.yaml#/components/schemas/ConsentCodeDataUse)|
|*adamDataUse**|The Automatable Discovery and Access Matrix (ADA-M) provides a standardized way to unambiguously represent the conditions related to data discovery and access. |object|Adam Data Use Object (see below)|

**Adam Data Use object**

|Properties (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|**header***|General description of what the data is.|object|See [ADA-M](https://raw.githubusercontent.com/ga4gh/ADA-M/b16a72f9987ae20f433e97d6a3247ecddd8dde23/adam.yaml#/components/schemas/Header)|
|**profile***|Profile of the data.|object|See [ADA-M](https://raw.githubusercontent.com/ga4gh/ADA-M/b16a72f9987ae20f433e97d6a3247ecddd8dde23/adam.yaml#/components/schemas/Profile)|
|**terms***|Terms related to the use of the data.|object|See [ADA-M](https://raw.githubusercontent.com/ga4gh/ADA-M/b16a72f9987ae20f433e97d6a3247ecddd8dde23/adam.yaml#/components/schemas/Terms)|
|**metaConditions***|Special conditions.|object|See [ADA-M](https://raw.githubusercontent.com/ga4gh/ADA-M/b16a72f9987ae20f433e97d6a3247ecddd8dde23/adam.yaml#/components/schemas/MetaConditions)|




### Examples 
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
      "alternativeUrl": "https://ega-archive.org/beacon_web/", 
      "apiVersion": "0.4", 
      "createDateTime": "2015-06-15T00:00.000Z", 
      "dataset": [
        {
          "assemblyId": "grch37", 
          "callCount": 74, 
          "description": "This sample set comprises cases of schizophrenia with additional cognitive measurements, collected in Aberdeen, Scotland.", 
          "id": "EGAD00000000028", 
          "info": {}, 
          "sampleCount": 1, 
          "variantCount": 74, 
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
        "logoUrl": "https://ega-archive.org/images/logo.png", 
        "name": "European Genome-Phenome Archive (EGA)", 
        "welcomeUrl": "https://ega-archive.org/"
      }, 
      "sampleAlleleRequests": [
        {
          "alternateBases": "A", 
          "assemblyId": "GRCh37", 
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
      "version": "v04", 
      "welcomeUrl": "https://ega-archive.org/beacon_web/"
    }
    * Closing connection 0

## Query endpoint

      
### Request
##### - URL: `/query`
##### - HTTP method: `GET`, `POST`
##### - Content-Type: `application/x-www-form-urlencoded`(POST)
##### - Parameters: `BeaconAlleleRequest`

**BeaconAlleleRequest object**

|Parameter (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|*referenceName**|Reference name (chromosome). Accepting values 1-22, X, Y so follows Ensembl chromosome naming convention.|string|`'1'`|
|*referenceBases**|Reference bases for this variant (starting from `start`). Accepted values: [ACGT]* When querying for variants without specific base alterations (e.g. imprecise structural variants with separate `variantType` as well as `startMin` & `endMin` ... parameters), the use of a single "N" value is required.<br/>See the REF field in [VCF 4.2 specification](https://samtools.github.io/hts-specs/VCFv4.2.pdf).|string|`'G'`|
|*assemblyId* *|Assembly identifier|string|`'GRCh38'`|
|start~|Precise start coordinate position, allele locus (0-based, inclusive).<p>* `start` only:<br />- for single positions, e.g. the start of a specified sequence alteration where the size is given through the specified `alternateBases`<br />- typical use are queries for SNV and small InDels<br />- the use of `start` without an `end` parameter requires the use of `referenceBases`<br />* `start` and `end`:<br /> - special use case for exactly determined structural changes |integer|`345233`|
|startMin~|Minimum start coordinate<br />* `startMin` + `startMax` + `endMin` + `endMax`:<br />- for querying imprecise positions (e.g. identifying all structural variants starting anywhere between `startMin` <-> `startMax`, and ending anywhere between `endMin` <-> `endMax`<br />- single or double sided precise matches can be achieved by setting `startMin` = `startMax` OR `endMin` = `endMax`<br/> <br/>For more information on range querys, see: [Beacon-Querys](https://github.com/ga4gh-beacon/specification/wiki/Beacon-Queries#range-queries-and-structural-variants)|integer|`23433`|
|startMax|Maximum start coordinate. See `startMin`.|integer|`23450`|
|end|Precise end coordinate (0-based, exclusive). See `start`.|integer|`455635`|
|endMin|Minimum end coordinate. See `startMin`.|integer|`23500`|
|endMax|Maximum end coordinate. See `startMin`.|integer|`23520`|
|alternateBases~|The bases that appear instead of the reference bases. Accepted values: [ACGT]* or N.<br /> <br/>Symbolic ALT alleles (DEL, INS, DUP, INV, CNV, DUP:TANDEM, DEL:ME, INS:ME) will be represented in `variantType`.<br/> <br/> See the ALT field in [VCF 4.2 specification](https://samtools.github.io/hts-specs/VCFv4.2.pdf)<br/> <br/>*Either `alternateBases` OR `variantType` is REQUIRED*|string|`'A'`, `'AGATAC'`|
|variantType~|The `variantType` is used to denote e.g. structural variants.<br/> <br/>*Either `alternateBases` OR `variantType` is REQUIRED*|string|`'INS'`, `'DUP'`, `'DEL'`, `'INV'`|
|datasetIds|Identifiers of datasets, as defined in `BeaconDataset`. In case `assemblyId` doesn't match requested dataset(s) error will be raised (`400 Bad request`). If this field is not specified, all datasets should be queried.|array|`['dataset1', 'dataset2']`|
|includeDatasetResponses|Indicator of whether responses for individual datasets (`datasetAlleleResponses`) should be included in the response (`BeaconAlleleResponse`) to this request or not. If null (not specified), the default value of NONE is assumed.<br/> <br/>Accepted values : ['ALL', 'HIT', 'MISS', 'NONE']|string|`'ALL'`|


### Response
##### Content-type:`application/json`
##### Payload: `Beacon Allele Response object`  

**Beacon Allele Response object**

|Properties (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|*beaconId**|Identifier of the beacon, as defined in `Beacon`.|string|-|
|apiVersion|Version of the API. If specified, the value must match `apiVersion` in Beacon|string|-|
|exists|Indicator of whether the given allele was observed in any of the datasets queried. This should be non-null, unless there was an error, in which case `error` has to be non-null.|boolean|`TRUE`|
|alleleRequest|The request that is sent to the Beacon.|object|BeaconAlleleRequest Object (see above _Query endpoint request_)|
|datasetAlleleResponses|The response that the user receives from the Beacon|object|BeaconDatasetAlleleResponse Object (see below)|
|error|The error message and the appropriate HTTP status code|object|See section _Errors_ |

**Beacon Dataset Allele Response object**

|Properties (* mandatory, ~ one of these is mandatory)|Description|Type|Example|
|---|---|:---:|---|
|**datasetId***|Unique identifier of the dataset.|string|-|
|exists|Indicator of whether the given allele was observed in the dataset. This should be non-null, unless there was an error, in which case `error` has to be non-null.|boolean|`TRUE`|
|error|The error message and the appropriate HTTP status code|object|See section _Errors_|
|frequency|Frequency of this allele in the dataset. Between 0 and 1, inclusive.|float|`0.07`|
|variantCount|Number of variants matching the allele request in the dataset.|integer|`2`|
|callCount|Number of calls matching the allele request in the dataset.|integer|`3`|
|sampleCount|Number of samples matching the allele request in the dataset|integer|`1`|
|note|Additional note or description of the response.|string|-|
|externalUrl|URL to an external system, such as a secured beacon or a system providing more information about a given allele (RFC 3986 format).|string|-|
|info|Additional structured metadata, key-value pairs.|array|-|


#### Examples

Example of how to use the GET method in the `/query` endpoint:

    curl -v 'https://localhost:5000/query?referenceName=1&start=0&end=0&startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL'
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
        "alleleRequest": {
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
                "error": null
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
                "info": {},
                "error": null
            }
        ]
    }
    * Closing connection 0

`curl -v 'https://localhost:5000/query?&start=0&end=0&startMin=28000000&startMax=29000000&endMin=28000000&endMax=29000000&referenceBases=A&alternateBases=T&assemblyId=GRCh37&datasetIds=EGAD00000000028&includeDatasetResponses=ALL'`


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
    "message": {
        "beaconId": "ega-beacon",
        "apiVersion": "0.4",
        "exists": null,
        "error": {
            "errorCode": 400,
            "errorMessage": "Missing mandatory parameter referenceName"
        },
        "allelRequest": {
            "referenceName": "0",
            "start": 0,
            "startMin": 28000000,
            "startMax": 29000000,
            "end": 0,
            "endMin": 28000000,
            "endMax": 29000000,
            "referenceBases": "A",
            "alternateBases": "T",
            "variantType": "0",
            "assemblyId": "GRCh37",
            "datasetIds": [
                "EGAD00000000028"
            ],
            "includeDatasetResponses": "ALL"
        },
        "datasetAlleleResponses": []
    }
}
* Closing connection 0

```
