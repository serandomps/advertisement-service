var async = require('async');
var utils = require('utils');
var serand = require('serand');
var autils = require('autos-utils');

var query = function (options) {
    if (!options) {
        return '';
    }
    var data = {
        query: {}
    };
    var name;
    var value;
    for (name in options) {
        if (!options.hasOwnProperty(name)) {
            continue;
        }
        if (name === '_') {
            continue;
        }
        value = options[name];
        data.query[name] = value instanceof Array ? {$in: value} : value;
    }
    return '?data=' + JSON.stringify(data);
};

var cdn = function (size, items) {
    if (!items) {
        return autils.cdn('images/' + size + '/');
    }
    var o = items instanceof Array ? items : [items];
    o.forEach(function (item) {
        var photos = item.photos;
        if (!photos) {
            return;
        }
        var o = [];
        photos.forEach(function (photo) {
            o.push({
                id: photo,
                url: autils.cdn('images/' + size + '/' + photo)
            });
        });
        item.photos = o;
    });
    return items;
};

var update = function (advertisements, options, done) {
    if (options.images) {
        cdn(options.images, advertisements);
    }
    done(null, advertisements);
};

exports.findOne = function (options, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('advertising:///apis/v/advertisements/' + options.id),
        dataType: 'json',
        success: function (data) {
            update(data, options, done);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

exports.find = function (options, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('advertising:///apis/v/advertisements' + query(options.query)),
        dataType: 'json',
        success: function (data) {
            update(data, options, done);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};
