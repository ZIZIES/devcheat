import { lang, section, card } from '../helpers';

export default lang({
  id: "graphql", name: "GraphQL", ext: ".graphql", year: 2015, common: false,
  sections: [
    section("basics", "basics", [
      card("queries", {
        beginner: {
          explanation: "GraphQL is a query language for APIs — instead of hitting different endpoints (GET /users, GET /users/1/posts), you send one request describing exactly what data you want. The server returns exactly that, nothing more. Made by Facebook in 2015, used by GitHub, Shopify, Twitter.",
          code: `# a query — ask for specific data
query {
  user(id: "1") {
    name
    email
    posts {
      title
      createdAt
    }
  }
}

# response matches the shape of the query exactly
# {
#   "data": {
#     "user": {
#       "name": "Alice",
#       "email": "alice@example.com",
#       "posts": [
#         { "title": "Hello World", "createdAt": "2024-01-15" }
#       ]
#     }
#   }
# }

# with variables (don't hardcode values in queries)
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
  }
}
# variables: { "id": "1" }`,
          examples: [
            { input: `# REST: 3 requests\nGET /users/1\nGET /users/1/posts\nGET /users/1/followers`, output: `3 round trips, over-fetches data` },
            { input: `# GraphQL: 1 request\nquery { user(id:"1") { name posts { title } followers { name } } }`, output: `1 round trip, exactly the data you asked for` },
          ],
          note: "the biggest GraphQL win: you ask for exactly the fields you need. REST endpoints return fixed shapes — you might get 50 fields when you only need 3. GraphQL eliminates both over-fetching (too much data) and under-fetching (too many requests)",
        },
        intermediate: {
          explanation: "Mutations change data (like POST/PUT/DELETE in REST). Fragments let you reuse field selections. The schema defines all possible types and operations — it's like a contract between client and server.",
          code: `# mutation — change data
mutation CreatePost($title: String!, $content: String!) {
  createPost(input: { title: $title, content: $content }) {
    id
    title
    createdAt
    author {
      name
    }
  }
}

# fragment — reusable field selection
fragment UserFields on User {
  id
  name
  email
  avatarUrl
}

query {
  me { ...UserFields }
  user(id: "2") { ...UserFields }
}

# schema definition (server-side)
type User {
  id:       ID!
  name:     String!
  email:    String!
  posts:    [Post!]!
  followers: [User!]!
}

type Post {
  id:        ID!
  title:     String!
  content:   String!
  author:    User!
  createdAt: String!
}

type Query {
  user(id: ID!): User
  posts: [Post!]!
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}`,
          examples: [
            { input: `# ! means non-nullable\nname: String   # can be null\nname: String!  # guaranteed non-null`, output: `null safety in the schema` },
          ],
          note: "! means non-nullable in GraphQL schema. String! = never null. [Post!]! = a list (never null) of Posts (each never null). forgetting ! where it should be causes null handling bugs on the client",
        },
        advanced: {
          explanation: "Subscriptions stream real-time data over WebSockets. DataLoader solves the N+1 query problem — where fetching a list of 100 users then their posts naively causes 101 database queries.",
          code: `# subscription — real-time data via WebSocket
subscription OnNewMessage($chatId: ID!) {
  messageCreated(chatId: $chatId) {
    id
    content
    sender { name }
    createdAt
  }
}

# N+1 problem — fetching users then their posts
# NAIVE: causes 1 + N queries (1 for users, 1 per user for posts)
query {
  users {          # query 1: SELECT * FROM users
    name
    posts {        # query 2,3,4...N: SELECT * FROM posts WHERE user_id = ?
      title
    }
  }
}

# DataLoader fixes this by batching:
# instead of N separate queries, it batches all post IDs
# and does ONE query: SELECT * FROM posts WHERE user_id IN (1,2,3...)

# directives — conditionally include fields
query GetUser($withPosts: Boolean!) {
  user(id: "1") {
    name
    posts @include(if: $withPosts) {  # only fetch if true
      title
    }
    email @skip(if: $isPrivate)       # skip if true
  }
}`,
          examples: [
            { input: `# 100 users, each with posts\n# naive: 101 queries\n# with DataLoader: 2 queries`, output: `DataLoader batches N queries into 1` },
          ],
          note: "the N+1 problem is the most common GraphQL performance issue. if you expose a GraphQL API without DataLoader (or similar batching), fetching a list of items with nested relations will hammer your database",
        },
      }),
    ]),
  ],
});
