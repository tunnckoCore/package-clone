/**
 * npm-clone <https://github.com/tunnckoCore/npm-clone>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var fs = require('fs');
var got = require('got');
var tar = require('tar-fs');
var path = require('path');
var zlib = require('zlib');
var format = require('util').format;
var JSONStream = require('JSONStream');
var parseSemver = require('parse-semver');
var registryUrl = require('registry-url');

module.exports = function npmClone(name) {
  var parts = name.split('/');
  var url = false;

  if (parts.length > 1) {
    name = parts[parts.length - 1];
    url = registryUrl(parts[0]);
  }

  url = url || registryUrl();
  parts = parseSemver(name);
  var _name = parts.name;
  var basename = format('%s-%s', _name, parts.version);
  url = format('%s%s', url, _name);

  if (parts.range !== '*') {

    // TODO: should this be moved to `parse-semver`?
    parts.version = parts.range.replace(/^[^0-9]+/, '').replace(/\s+.*$/, '');

    basename = format('%s-%s', _name, parts.version);
    url = format('%s%s/-/%s.tgz', url, _name, basename);

    var basename_tgz = path.join(__dirname, basename + '.tgz');
    var basename_tar = path.join(__dirname, basename + '.tar');

    got(url)
    .pipe(zlib.createGunzip())
    .pipe(tar.extract('./my-tagdfgdfgrball'));
    return;
  }

  // clone latest version
  // got(url + '/latest')

};
