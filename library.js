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

		var data ={};

		async.series([
			function(next) {
				ssq.info(server.host, server.port, function(err, info) {
					data.info = info;
					next();
				});
			},

			function(next) {
				if (data.info.numplayers < 1) return next();

				ssq.players(server.host, server.port, function(err, players) {
					players = players.map(function(player) {
						if (!player.name) {
							// If no name is defined, it's a ghost session, so we ignore it
							data.info.numplayers--;
							return null;
						}
						player.duration = (new Date(player.duration * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
						return player;
					});

					data.players = players;
					next();
				});
			}
		], function(err) {
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
