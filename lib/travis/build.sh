#!/bin/bash

set -e

grunt bower jshint build
karma start karma.conf.js --browsers SL_Firefox,SL_Chrome --single-run
