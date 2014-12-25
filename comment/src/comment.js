// var converter = new Showdown.converter();

var CommentBox = React.createClass({
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
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }

});

var Comment = React.createClass({
  render: function() {
    var comment = this.props.content;
    var editBtn,deleteBtn;

    if(comment.access.canEdit) {
      editBtn = function() {
        return (
          <a href="">编辑</a>
        )
      }
    }
    if(comment.access.canDelete) {
      deleteBtn = function() {
        return (
          <a href="">删除</a>
        )
      }
    }
    return (
      <div className="comment">
        <div dangerouslySetInnerHTML={{__html:comment.parsedText}} />
        <a href={comment.user.url} >{comment.user.name}</a>
        {comment.createdDate}
        <a href="">回复</a>
        {editBtn}
        {deleteBtn}
      </div>
    );
  }
})

var CommentList = React.createClass({
  render: function() {
    // console.log(this.props.data)
    var commentNodes = function(){
      return (
        <Comment />
      );
    };
    if(this.props.data.data) {
      // console.log(this.props.data.data)
      commentNodes = this.props.data.data.comment.map(function(comment) {
        return (
          <Comment content={comment} />
        );
      });
    }
    
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
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
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="your name" ref="author"/>
        <textarea placeholder="type something..." ref="text"/>
        <input type="submit" value="Post"/>
      </form>
    );
  }
});



React.render(
  <CommentBox url="comments.json" pollInterval={2000}/>,
  document.getElementById('content')
)