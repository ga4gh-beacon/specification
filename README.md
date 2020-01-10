# Beacon API specification [![](https://travis-ci.org/ga4gh-beacon/specification.svg?branch=develop)](https://travis-ci.org/ga4gh-beacon/specification) [![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/ga4gh-beacon/specification/develop/LICENSE)

## What is a Beacon?

The Beacon protocol defines an open standard for genomics data discovery, developed by members of the Global Alliance for Genomics & Health. It provides a framework for public web services responding to queries against genomic data collections, for instance from population based or disease specific genome repositories.

The Beacon protocol has been designed to be:

* Simple: focus on robustness and easy implementation
* Federated: maintained by individual organizations and assembled into a network
* General-purpose: used to report on any variant collection
* Aggregative: provide a boolean (or quantitative) answer about the observation of a variant
* Privacy protecting: queries do not return information about single individuals

The main places to find information about the Beracon project are:

* Beacon project [website](https://beacon-project.io)
* short documentation about the specification [in this repository](./beacon.md)
* [wiki](https://github.com/ga4gh-beacon/specification/wiki) (outdated)


## Specification

The specification is done in [OpenAPI format](beacon.yaml) and it is online in [Swagger Hub](https://app.swaggerhub.com/apis/ELIXIR-Finland/ga-4_gh_beacon_api_specification/1.0.0-rc1). The overall design is explained in the [beacon.md](beacon.md) document.

## License

This project is licensed under the terms of the [Apache2.0 license](LICENSE).

## How to contribute

Guidelines for contributing to this repository are listed in the [CONTRIBUTING.md](CONTRIBUTING.md) document. To introduce new development ideas or enhancements please use [this wiki-page](https://github.com/ga4gh-beacon/specification/wiki/Future-enhancements-and-development-ideas).

## How to test

Use [Swagger Validator Badge](https://github.com/swagger-api/validator-badge) to validate the YAML file.

## Communications
- [Slack Channel](https://beacon-team-slackin.herokuapp.com/)

## GitHub projects page

All members of the [ga4gh-beacon GitHub organisation](https://github.com/ga4gh-beacon) have access to the [projects page](https://github.com/orgs/ga4gh-beacon/projects/1).

This page is used to plan and manage the work across the ga4gh-beacon repositories, allowing everyone to see what’s already in motion and to work together without duplicating effort.

## Notify GA4GH of potential security flaw in specification

To enable a long-term contact for potential security flaws an email address of security-notification@ga4gh.org has been set up. This email will be monitored by the GA4GH secretariat and GA4GH security members to allow for an incoming response to be directed to appropriate parties.
