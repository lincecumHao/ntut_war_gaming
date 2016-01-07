var React = require('react');
var request = require('request');

var Job = require('./Job.jsx');

var Jobs = React.createClass({

	getInitialState: function() {
		return {jobs:[]};
	},

	componentDidMount: function() {
		request('http://localhost:3000/api/jobs/', function(error, response, body){
        	var result = JSON.parse(body);
        	if(this.isMounted()){
        		this.setState(result.data);
        	}
		}).bind(this);
	},	

	render: function() {
		return (
			<div className="list-group">
				{this.state.data.map(function(job){
					return(
						<Job
							company={job.company}
                            position={job.position}
                            local={job.local}
                            lookingFor={job.lookingFor}
                            postedDate={job.postedDate}
                            description={job.description}
                            category={job.category}
                        />
					)
				})}
			</div>
		);
	}

});

module.exports = Jobs;	