(function(module) {
	"use strict";

	var async = require('async'),
		fs = require('fs'),
		path = require('path'),
		ssq = require('ssq'),
		templates = module.parent.require('templates.js'),
		app;


	var Widget = {
		templates: {}
	};

	Widget.init = function(params, callback) {
		app = params.app;

		var templatesToLoad = [
			'widget.tpl',
			'status.tpl'
		];

		function loadTemplate(template, next) {
			fs.readFile(path.resolve(__dirname, './public/templates/' + template), function (err, data) {
				if (err) {
					console.log(err.message);
					return next(err);
				}
				Widget.templates[template] = data.toString();
				next(null);
			});
		}

		async.each(templatesToLoad, loadTemplate);

		callback();
	};

	Widget.renderStatusWidget = function(widget, callback) {

		var html = Widget.templates['status.tpl'];

		var serverIpPort = widget.data.server;
		var server = {
			host: serverIpPort.split(':')[0],
			port: serverIpPort.split(':')[1]
		};

		ssq.info(server.host, server.port, function(err, data) {
			if (err) {
				console.log('Got error: ', err);
				return callback(err);
			}

			html = templates.parse(html, data);

			callback(null, html);

		});
	};

	Widget.defineWidget = function(widgets, callback) {
		widgets.push({
			widget: "steamserverinfo",
			name: "Steam Server Info",
			description: "Shows the informations of a server which supports Steam API.",
			content: fs.readFileSync(path.resolve(__dirname, './public/templates/widget.tpl')),
		});

		callback(null, widgets);
	};


	module.exports = Widget;
}(module));
