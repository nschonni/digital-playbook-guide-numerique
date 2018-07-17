#!/usr/bin/env node

'use strict';

var markdownLinkCheck = require('markdown-link-check');
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var chalk = require("chalk");

var files = glob.sync("**/*.md", { ignore: ["node_modules/**/*.md", "**/digital-playbook.md", "**/guide-numerique.md"] })

var config = JSON.parse(fs.readFileSync(".markdown-link-check.json"));

files.forEach(function (file) {
  var markdown = fs.readFileSync(file).toString();
  let opts = Object.assign({}, config);
  opts.baseUrl = 'file://' + path.dirname(path.resolve(file));

  markdownLinkCheck(markdown, opts, function (err, results) {
    if (err) {
      console.error('Error', err);
      return;
    }

    console.log(chalk.green("Reading: " + file));

    results.forEach(function (result) {
      if (result.status === "dead") {
        process.exitCode = 1
        console.log(chalk.red("Dead: " + result.link));
      } else if (result.status == "error") {
        process.exitCode = 1
        console.log(chalk.red("Link Error: " + result.link));
      }
    });
  });
});
