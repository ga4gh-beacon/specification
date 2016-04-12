"""
Utilities for scripts
"""
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import functools
import os
import shlex
import subprocess
import sys
import time

import humanize
import requests
import yaml


def log(message):
    print(message)


class Timed(object):
    """
    Decorator that times a method, reporting runtime at finish
    """
    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            self.start = time.time()
            result = func(*args, **kwargs)
            self.end = time.time()
            self._report()
            return result
        return wrapper

    def _report(self):
        delta = self.end - self.start
        timeString = humanize.time.naturaldelta(delta)
        log("Finished in {} ({} seconds)".format(timeString, delta))


class FileDownloader(object):
    """
    Provides a wget-like file download and terminal display
    """
    defaultChunkSize = 1048576  # 1MB
    defaultStream = sys.stdout

    def __init__(self, url, path, chunkSize=defaultChunkSize,
                 stream=defaultStream):
        self.url = url
        self.path = path
        self.basename = os.path.basename(url)
        self.basenameLength = len(self.basename)
        self.chunkSize = chunkSize
        self.stream = stream
        self.bytesWritten = 0
        self.displayIndex = 0
        self.displayWindowSize = 20

    def download(self):
        self.stream.write("Downloading '{}' to '{}'\n".format(
            self.url, self.path))
        response = requests.get(self.url, stream=True)
        response.raise_for_status()
        self.contentLength = int(response.headers['content-length'])
        with open(self.path, 'wb') as outputFile:
            for chunk in response.iter_content(chunk_size=self.chunkSize):
                self.bytesWritten += self.chunkSize
                self._updateDisplay()
                outputFile.write(chunk)
        self.stream.write("\n")
        self.stream.flush()

    def _getFileNameDisplayString(self):
        if self.basenameLength <= self.displayWindowSize:
            return self.basename
        else:
            return self.basename  # TODO scrolling window here

    def _updateDisplay(self):
        fileName = self._getFileNameDisplayString()

        # TODO contentLength seems to slightly under-report how many bytes
        # we have to download... hence the min functions
        percentage = min(self.bytesWritten / self.contentLength, 1)
        numerator = humanize.filesize.naturalsize(
            min(self.bytesWritten, self.contentLength))
        denominator = humanize.filesize.naturalsize(
            self.contentLength)

        displayString = "{}   {:<6.2%} ({:>9} / {:<9})\r"
        self.stream.write(displayString.format(
            fileName, percentage, numerator, denominator))
        self.stream.flush()


def runCommandSplits(splits, silent=False):
    """
    Run a shell command given the command's parsed command line
    """
    if silent:
        with open(os.devnull, 'w') as devnull:
            subprocess.check_call(splits, stdout=devnull, stderr=devnull)
    else:
        subprocess.check_call(splits)


def runCommand(command, silent=False):
    """
    Run a shell command
    """
    splits = shlex.split(command)
    runCommandSplits(splits, silent=silent)


def getAuthValues(filePath='scripts/auth.yml'):
    """
    Return the script authentication file as a dictionary
    """
    return getYamlDocument(filePath)


def getYamlDocument(filePath):
    """
    Return a yaml file's contents as a dictionary
    """
    with open(filePath) as stream:
        doc = yaml.load(stream)
        return doc
