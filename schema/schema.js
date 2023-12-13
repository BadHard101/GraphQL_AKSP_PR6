const graphql = require('graphql');
const _ = require("lodash");
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = graphql;

const books = [
    { id: '1', title: 'The Hunger Games', genre: 'Dystopian', author: 'Suzanne Collins' },
    { id: '2', title: 'The Chronicles of Narnia', genre: 'Fantasy', author: 'C.S. Lewis' },
    { id: '3', title: 'Gone with the Wind', genre: 'Historical Fiction', author: 'Margaret Mitchell' },
    { id: '4', title: 'The Alchemist', genre: 'Fantasy', author: 'Paulo Coelho' },
    { id: '5', title: 'Brave New World', genre: 'Dystopian', author: 'Aldous Huxley' },
    { id: '6', title: 'The Book Thief', genre: 'Historical Fiction', author: 'Markus Zusak' }
];


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        info: {
            type: GraphQLString,
            resolve(parent, args) {
                return "Сервер запущен"
            }
        },
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(books, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        }
    }
});

const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        add_book: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                author: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                if (_.find(books, {id : args.id})) {
                    return null;
                }
                const len = books.push(args);
                return books[len - 1];
            }
        },
        delete_book: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let index = -1;
                for (let i = 0; i < books.length; i++) {
                    if (books[i].id == args.id) {
                        index = i;
                        break;
                    }
                }
                if (index < 0) return null;
                return books.splice(index, 1)[0];
            }
        }, 
        update_bookd: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                author: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                if (_.find(books, {id : args.id})) {
                    _.find(books, {id : args.id}).title = args.title;
                    _.find(books, {id : args.id}).author = args.author;
                    _.find(books, {id : args.id}).genre = args.genre;

                    return _.find(books, {id : args.id});
                }
                
                return null;
            }
        }
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});