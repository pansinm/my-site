const moment = require('moment');

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MdxBlogPost: {
      date: {
        resolve(source, args, context, info) {
          return moment(source.date).format('YYYY/MM/DD');
        },
      },
    },
  }
  createResolvers(resolvers)
}
