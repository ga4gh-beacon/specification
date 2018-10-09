# Beacon API specification [![](https://travis-ci.org/ga4gh-beacon/specification.svg?branch=develop)](https://travis-ci.org/ga4gh-beacon/specification) [![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/ga4gh-beacon/specification/develop/LICENSE) [![](https://beacon-team-slackin.herokuapp.com/badge.svg)](https://beacon-team-slackin.herokuapp.com/)

## What is a Beacon?

The _Beacon_ project was launched in 2014 to show the willingness of researchers to enable the secure sharing of genomic data from participants of genomic studies. _Beacons_ are web-servers that answer questions such as _Does your dataset include a genome that has a specific nucleotide (e.g. G) at a specific genomic coordinate (e.g. Chr.1 position 111,111)?_ to which the _Beacon_ must respond with _yes_ or _no_, without referring to a specific individual.

## Specification

The specification is done in [OpenAPI format](beacon.yaml) and it is online in [Swagger Hub](https://app.swaggerhub.com/apis/ELIXIR-Finland/ga-4_gh_beacon_api_specification/1.0.0-rc1). The overall design is explained in 
[beacon.md](beacon.md) document.


## License

This project is licensed under the terms of the [Apache2.0 license](LICENSE).

## How to contribute

Guidelines for contributing to this repository are listed in the [CONTRIBUTING.md](CONTRIBUTING.md) document. To introduce new development ideas or enhancements please use [this wiki-page](https://github.com/ga4gh-beacon/specification/wiki/Future-enhancements-and-development-ideas).

## How to test

Use [Swagger Validator Badge](https://github.com/swagger-api/validator-badge) to validate the YAML file.

## Communications
- [Slack Channel](https://beacon-team-slackin.herokuapp.com/)
- [Bi-weekly Technical Call](https://docs.google.com/document/d/13c5-c2WsQTRysl0QQEMmap__0jh3OstuM8YwzE-3AlQ/edit#)

## GitHub projects page

All members of the [ga4gh-beacon GitHub organisation](https://github.com/ga4gh-beacon) have access to the [projects page](https://github.com/orgs/ga4gh-beacon/projects/1).

This page is used to plan and manage the work across the ga4gh-beacon repositories, allowing everyone to see what’s already in motion and to work together without duplicating effort.

## More information

More information for developers is available on [our wiki](https://github.com/ga4gh-beacon/specification/wiki). A list of related tools and projects developed by the community is maintained on the [Resources](https://github.com/ga4gh-beacon/specification/wiki/Resources) page.  

## Notify GA4GH of potential security flaw in specification

To enable a long-term contact for potential security flaws an email address of security-notification@ga4gh.org has been set up. This email will be monitored by the GA4GH secretariat and GA4GH security members to allow for an incoming response to be directed to appropriate parties.
