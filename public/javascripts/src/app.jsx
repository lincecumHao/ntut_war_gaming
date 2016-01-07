var $ = require('jquery');
var bootstrap = require('bootstrap');
var React = require('react');
var ReactDOM = require('react-dom');
var Job = require('./Jobs.jsx');


ReactDOM.render(
	<Job />,
	document.getElementById('job-post')
	);