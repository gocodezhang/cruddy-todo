const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId(function(err, filename) {
    // console.log('path:', `${exports.dataDir}/${filename}.txt`);
    fs.writeFile(`${exports.dataDir}/${filename}.txt`, text, function () {
      // console.log('id:', id);
      // console.log({ id: filename, text: text });
      callback(null, { id: filename, text: text });
    });
  });
  items[id] = text;

  // console.log('cread id:', id);
  // console.log('creat id:', text);
  // console.log('filepath:', `${exports.dataDir}/${id}.txt`);
  // setTimeout(function() {
  //   fs.writeFileSync(`${exports.dataDir}/${id}.txt`, text);
  // }, 10);

  // setTimeout(function() {
  //   callback(null, { id, text });
  // }, 11);
  // counter.getNextUniqueId(function(err, filename) {
  //   fs.writeFileSync(`${exports.dataDir}/${filename}.txt`, text);
  //   callback(null, {filename, text });
  // });
};

exports.readAll = (callback) => {
  // Read files from dataDir (fs.readdir)
  fs.readdir(exports.dataDir, function(err, files) {
    // Iterate on files to construct an array containing objects of each file (id, text)
    var data = _.map(files, (filename) => {
      var number = filename.slice(0, 5); // get the index from 0 to 4
      return { id: number, text: number };
    });
    callback(null, data);
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
