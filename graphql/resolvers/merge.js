import User from "./User";
import Post from "./Post";
import Comment from "./Comment";

const user = async userId => {
  try {
    const user = await User.findById(userId);
    console.log('this is user')
    console.log(user)
    return {
      ...user._doc,
      _id: user.id,
      posts: posts.bind(this, user._doc.posts),
      comments: comments.bind(this, user._doc.comments)
    };
  } catch (error) {
    throw error;
  }
};

const post = async postId => {
  try {
    const post = await Post.findById(postId);
    return {
      ...post._doc,
      _id: post.id,
      comments: comments.bind(this, post._doc.comments)
    };
  } catch (error) {
    throw error;
  }
};

const comments = async commentIds => {
  try {
    const comments = await Comment.find({ _id: { $in: commentIds } });
    return comments.map(comment => {
      return transformComment(comment);
    });
  } catch (error) {
    throw error;
  }
};

const posts = async postIds => {
  try {
    const posts = await Post.find({ _id: { $in: postIds } });
    return posts.map(post => {
      return transformPost(post);
    });
  } catch (error) {
    throw error;
  }
};

const transformComment = comment => {
  return {
    ...comment._doc,
    _id: comment.id,
    author: user.bind(this, comment._doc.author),
    post: post.bind(this, comment._doc.post)
  };
};

const transformPost = post => {
  console.log('transforming postj')
  console.log(post)
  return {
    ...post._doc,
    _id: post.id,
    author: user.bind(this, post._doc.author),
    comments: comments.bind(this, post._doc.comments)
  };
};

exports.transformPost = transformPost;
exports.transformComment = transformComment;
