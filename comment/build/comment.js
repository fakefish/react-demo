// var converter = new Showdown.converter();

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
    return {
      data: {}
    };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement(CommentList, {data: this.state.data}), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
      )
    );
  }

});

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var comment = this.props.content;
    var editBtn,deleteBtn;

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
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("div", {dangerouslySetInnerHTML: {__html:comment.parsedText}}), 
        React.createElement("a", {href: comment.user.url}, comment.user.name), 
        comment.createdDate, 
        React.createElement("a", {href: ""}, "回复"), 
        editBtn, 
        deleteBtn
      )
    );
  }
})

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    // console.log(this.props.data)
    var commentNodes = function(){
      return (
        React.createElement(Comment, null)
      );
    };
    if(this.props.data.data) {
      // console.log(this.props.data.data)
      commentNodes = this.props.data.data.comment.map(function(comment) {
        return (
          React.createElement(Comment, {content: comment})
        );
      });
    }
    
    return (
      React.createElement("div", {className: "commentList"}, 
        commentNodes
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if(!author || !text) {
      return;
    }
    this.props.onCommentSubmit({author: author,text: text})
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "your name", ref: "author"}), 
        React.createElement("textarea", {placeholder: "type something...", ref: "text"}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});



React.render(
  React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
  document.getElementById('content')
)