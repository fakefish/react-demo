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
        <Comment onReply={this.handleReply}/>
      );
    }

    if(this.state.data.data) {
      // console.log(this.handleReply)
      commentNodes = this.state.data.data.comment.map(function(comment,i) {
        return (
          <Comment content={comment} index={i} onReply={this.handleReply}/>
        );
      });
    }
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <div className="commentList">
          {commentNodes}
        </div>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} replyUser={this.state.replyUser}/>
      </div>
    );
  }

});

var Comment = React.createClass({
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
    // console.log(this.onReply)

    return (
      <div className="comment">
        <LikeBtn />
        <div dangerouslySetInnerHTML={{__html:comment.parsedText}} />
        <a href="">{this.props.index}</a>
        &middot;
        <a href={comment.user.url} >{comment.user.name}</a>
        &middot;
        {comment.createdDate}
        <a href="" onClick={this.onReply}>回复</a>
        {editBtn}
        {deleteBtn}
      </div>
    );
  }
})

var CommentForm = React.createClass({
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
      <form className="commentForm" onSubmit={this.handleSubmit}>
        {replyUser}
        <textarea placeholder="type something..." ref="text"/>
        <input type="submit" value="Post"/>
      </form>
    );
  }
});

var LikeBtn = React.createClass({
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
      <a onClick={this.handleLike} href="###" className={active}>{text}</a>
    );
  }
})


React.render(
  <CommentBox url="comments.json" pollInterval={2000}/>,
  document.getElementById('content')
)