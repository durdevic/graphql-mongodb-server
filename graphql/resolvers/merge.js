import User from "./User";

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            // createdPosts: postMessage.bind(this, user._doc.createdPosts)
        };
    } catch (error) {
        throw error;
    }
}

const transformPost = post => {
    return {
        ...post._doc,
        _id: post.id,
        creator: user.bind(this, post._doc.author)
    }
}

// const user = async userId => {
// try {
//   const user = await User.findById(userId);
//   return {
//     ...user._doc,
//     _id: user.id,
//     // posts: posts.bind(this, user._doc.posts),
//     // comments: comments.bind(this, user._doc.comments)
//   };
// } catch (error) {
//   throw error;
// }
// };

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

// const transformPost = event => {
// return {
//   ...event._doc,
//   _id: event.id,
//   author: user.bind(this, event._doc.creat)
// };
// };

exports.transformPost = transformPost;
