# Beacon Schemas

## What is a Beacon?

A _Beacon_ is a web-accessible service that can be queried for information about a specific allele. A user of a Beacon can pose queries of the form _Have you observed this nucleotide (e.g. C) at this genomic location (e.g. position 32,936,732 on chromosome 13)?_ to which the Beacon must respond with either _yes_ or _no_.

## Beacon Project

The Beacon project is a project to test the willingness of international sites to share genetic data in the simplest of all technical contexts. For more information, visit [GA4GH Data Working Group](http://ga4gh.org/#/beacon).

## Tools

A list of related tools and projects developed by the community is maintained on the [Resources](https://github.com/ga4gh/beacon-team/wiki/Resources) wiki page.

## How to contribute

Guidelines for contributing to this repository are listed in the [CONTRIBUTING.md](CONTRIBUTING.md) document.

## How to build

Prerequisites: Maven 3+, Java 1.6+.

To generate Java code, run `mvn package` and check the output in the `target` directory. 

## How to test

Prerequisites: Python 2.7 (incl. pip).

Install dependencies with `pip install -r requirements.txt`. To run the test suite, use `nosetests -v tests`. To check the test code style violations, run `flake8 tests`.

## License

See the [LICENSE](LICENSE) file.

## More information

More information for developers is available on [our wiki](https://github.com/ga4gh/beacon-team/wiki).
