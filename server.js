#!/usr/bin/env node

/**
 * ============================================================================
 * @fileOverview Server to deliver MD format training using live reload
 * 
 * Scan the given subdirectories to determine the available presentations
 * ============================================================================
 **/
var connect     = require('connect');
var serveStatic = require('serve-static');
var path        = require('path');
var livereload  = require('livereload');

const fs = require('fs');

const scalaDir   = path.join(__dirname, 'scala');
const scalaDirs  = [path.join(scalaDir, 'scala_01'), path.join(scalaDir, 'scala_02'),  path.join(scalaDir, 'launchpad')]
const hpiDir   = path.join(__dirname, 'hpi2017');
const hpiDirs   = [hpiDir, path.join(hpiDir, 'marmolata_01')];
const introToFPDir = path.join(__dirname, 'cp-cf-dev-fp');
const businessProcessDir = path.join(__dirname, 'business_processes');

// folders to scan for .md files
const folders = [__dirname, introToFPDir, businessProcessDir].concat(scalaDirs).concat(hpiDirs);

var server = connect();

console.log('Current directory: ' + __dirname);

folders.forEach(folder => server.use(serveStatic(folder)));

server.listen(8181);

console.log('\nAlso serving live reload\n');

var lrserver = livereload.createServer({"exts": ["md", "html", "css", "js", "png", "gif", "jpg", "svg"]});
lrserver.watch(folders);

console.log("\nAvailable presentations:\n");

folders.forEach(folder => {
  fs.readdir(folder, (err, files) =>
    files.filter(file => file.endsWith('.md')).forEach(file =>
      console.log('http://localhost:8181/index.html?md=' + file.substring(0, file.length - 3))
    )
  );
});

