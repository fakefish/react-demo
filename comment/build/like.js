var LikeButton = React.createClass({displayName: "LikeButton",
	getInitialState: function() {
		return {
			like : false
		};
	},
	render: function() {
		var text = this.state.like ? 'like' : 'haven\'t liked';
		return (
			React.createElement("a", {onClick: this.handleClick}, 
			  "Your ", text, " this."
			)
		);
	},
	handleClick: function(e) {
		// this.state.like = !this.state.like;
		this.setState({
			like: !this.state.like
		});
		e.preventDefault();
	}

});

var LikeButtons = React.createClass({displayName: "LikeButtons",

	render: function() {
		return (
			React.createElement(LikeButton, null)
		);
	}

});



React.render(
	React.createElement(LikeButtons, null),
	document.getElementById('likeButton')

);