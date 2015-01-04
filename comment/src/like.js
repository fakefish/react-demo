var LikeButton = React.createClass({
	getInitialState: function() {
		return {
			like : false
		};
	},
	render: function() {
		var text = this.state.like ? 'like' : 'haven\'t liked';
		return (
			<a onClick={this.handleClick}>
			  Your {text} this.
			</a>
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

var LikeButtons = React.createClass({

	render: function() {
		return (
			<LikeButton></LikeButton>
		);
	}

});



React.render(
	<LikeButtons/>,
	document.getElementById('likeButton')

);