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
    Promise.all(_.map(files, (filename) => {
      return new Promise((resolve, reject) => {
        var number = filename.slice(0, 5); // get the index from 0 to 4
        fs.readFile(`${exports.dataDir}/${filename}`, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: number, text: data.toString() });
          }
        });
      });
    })).then((data) => callback(null, data));
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  // Read file from dataDir based on id
  fs.readFile(`${exports.dataDir}/${id}.txt`, function(err, data) {
    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data.toString() });
    }
  });
  // Construct a object that has id and text
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id: id, text: data });
  // }
};

exports.update = (id, text, callback) => {
  // Read file from dataDir based on id
  fs.readFile(`${exports.dataDir}/${id}.txt`, function(err, data) {
    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      // Update the text in the file and Overwrite the file
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, function() {
        // items[id] = text;
        callback(null, { id: id, text: text });
      });
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  // Read file from dataDir based on id
  fs.readFile(`${exports.dataDir}/${id}.txt`, function(err, data) {
    if (!data) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      // Delete file from dataDir based on id
      fs.unlink(`${exports.dataDir}/${id}.txt`, function() {
        callback();
      });
    }
  });
  // Delete file from dataDir based on id
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
