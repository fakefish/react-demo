var CommentBox = React.createClass({displayName: "CommentBox",
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { data: {} };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    this.handleReply();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },
  handleReply: function(user) {
    console.log(user)
    this.setState({replyUser:user});
  },
  render: function() {
    var commentNodes = function() {
      return (
        React.createElement(Comment, {onReply: this.handleReply})
      );
    }

    if(this.state.data.data) {
      // console.log(this.handleReply)
      commentNodes = this.state.data.data.comment.map(function(comment,i) {
        return (
          React.createElement(Comment, {content: comment, index: i, onReply: this.handleReply})
        );
      });
    }
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement("div", {className: "commentList"}, 
          commentNodes
        ), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit, replyUser: this.state.replyUser})
      )
    );
  }

});

var Comment = React.createClass({displayName: "Comment",
  onReply: function(e) {
    
    console.log(this.props.onReply)
    if(this.props.onReply) {
      console.log(this.content.user)
      return this.props.onReply(this.content.user);
    }
    e.preventDefault();
    return;
  },
  render: function() {
    var comment = this.props.content;
    this.content = comment;
    var editBtn,deleteBtn;
    // console.log(this.props.onReply) // undefine

    if(comment.access.canEdit) {
      editBtn = function() {
        return (
          React.createElement("a", {href: ""}, "编辑")
        )
      }
    }
    if(comment.access.canDelete) {
      deleteBtn = function() {
        return (
          React.createElement("a", {href: ""}, "删除")
        )
      }
    }
    // console.log(this.onReply)

    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement(LikeBtn, null), 
        React.createElement("div", {dangerouslySetInnerHTML: {__html:comment.parsedText}}), 
        React.createElement("a", {href: ""}, this.props.index), 
        "·", 
        React.createElement("a", {href: comment.user.url}, comment.user.name), 
        "·", 
        comment.createdDate, 
        React.createElement("a", {href: "", onClick: this.onReply}, "回复"), 
        editBtn, 
        deleteBtn
      )
    );
  }
})

var CommentForm = React.createClass({displayName: "CommentForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.text.getDOMNode().value.trim();
    if(!text) {
      return;
    }
    this.props.onCommentSubmit({text: text})
    this.refs.text.getDOMNode().value = '';
    return;
  },
  render: function() {
    var replyUser;
    if(this.props.replyUser) {
      replyUser = this.props.replyUser.name
    }
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        replyUser, 
        React.createElement("textarea", {placeholder: "type something...", ref: "text"}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

var LikeBtn = React.createClass({displayName: "LikeBtn",
  getInitialState: function() {
    return {
      like: false
    };
  },
  handleLike: function(e) {
    this.setState({like:!this.state.like});
    e.preventDefault();
  },
  render: function() {
    var active = this.state.like ? 'active' : '';
    var text = this.state.like ? 'like' : 'unlike';
    return (
      React.createElement("a", {onClick: this.handleLike, href: "###", className: active}, text)
    );
  }
})


React.render(
  React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
  document.getElementById('content')
)