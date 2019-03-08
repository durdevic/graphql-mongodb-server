import User from "../../../server/models/User";
import Post from "../../../server/models/Post";
import Comment from "../../../server/models/Comment";

import {transformComment} from "../merge";

export default {
  Query: {
    comment: async (parent, { _id }, context, info) => {
      return await Comment.find({ _id });
    },
    comments: async (parent, args, context, info) => {
      const res = await Comment.find({})
        .populate()
        .exec();

      return res.map(u => ({
        _id: u._id.toString(),
        text: u.text,
        author: u.author,
        post: u.post
      }));
    }
  },
  Mutation: {
    createComment: async (parent, { comment }, context, info) => {
      const newComment = await new Comment({
        text: comment.text,
        author: comment.author,
        post: comment.post
      });

      let createdComment;
      try {
        console.log(comment);
        const result = await newComment.save();
        console.log(result)
        createdComment = transformComment(result);
        console.log('did you even go ')
        const post = await Post.findById(comment.post);
        const author = await User.findById(comment.author);

        if (!post) {
          throw new Error("Post not found.");
        } else if (!author) {
          throw new Error("Author does not exist");
        }
        // pushing to Post and Author comments array
        post.comments.push(newComment);
        author.comments.push(newComment);
        await post.save();
        await author.save();
        return createdComment;

      } catch (error) {
        console.log(error);
        throw error;
      }

      // return new Promise((resolve, reject) => {
      //   newComment.save((err, res) => {
      //     err ? reject(err) : resolve(res);
      //   });
      // });
    },
    updateComment: async (parent, { _id, comment }, context, info) => {
      return new Promise((resolve, reject) => {
        Comment.findByIdAndUpdate(
          _id,
          { $set: { ...comment } },
          { new: true }
        ).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    deleteComment: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        Comment.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  },
  Subscription: {
    comment: {
      subscribe: (parent, args, { pubsub }) => {
        //return pubsub.asyncIterator(channel)
      }
    }
  },
  Comment: {
    author: async ({ author }, args, context, info) => {
      return await User.findById({ _id: author });
    },
    post: async ({ _id }, args, context, info) => {
      return await Post.findById(_id);
    }
  }
};
