const { ApolloServer } = require("apollo-server");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFloat
} = require("graphql");
const lib = require("./lib/data");

/**
 * Graphql de primitive (string, int, float, boolean...) olmayan obje
 * tipleri GraphQLObjectType ile olusturulur
 */
const UserType = new GraphQLObjectType({
  //tipin adi
  name: "User",
  //tip icinde bulunan fieldlar
  fields: {
    //field lar dogrudan primitive tip olabilirler
    //oyle oldugunda bu objenin resolverindan gelen deger ustunden
    //dogrudan alir
    Username: { type: GraphQLString },
    Password: { type: GraphQLString },
    //relationlar veya computed degerler gibi obje ustunde dogrudan bulunmayanlar
    //icin resolver eklenebilir
    RandomField: {
      type: GraphQLFloat,
      resolve: async (root, args, context, info) => {
        return Math.random();
      }
    }
  }
});

//burda ana graphql semamizi tanimliyoruz
const Schema = new GraphQLSchema({
  //burda bu semada kullanilan tum tiplerin array olarak verilmesi gerkiyor
  types: [UserType],
  //burdaki query de normal bir objedir aslinda, top level bir obje gibi
  //query ler clientin yada server in konfigurasyonlarina bagli olarak
  //cache yapilabilirler, bu sebeple islem yapan seyler yerine veri return
  //eden fonksiyonlar tercih edilir
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      User: {
        type: UserType,
        description: "Get A User",
        args: {
          Username: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (root, args, context, info) => {
          return await lib.read("Users", args.Username);
        }
      },
      Users: {
        type: new GraphQLList(UserType),
        description: "Get All Users",
        resolve: async (root, args, context, info) => {
          return await lib.findAll("Users");
        }
      }
    }
  }),
  //burada mutation adi altinda islem yapan resolverlari yazabiliriz
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      CreateUser: {
        type: UserType,
        description: "Create A User",
        args: {
          Username: { type: new GraphQLNonNull(GraphQLString) },
          Password: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (root, args, context, info) => {
          if (!context.isAdmin) throw "Not Admin";
          await lib.create("Users", args.Username, {
            Username: args.Username,
            Password: args.Password
          });
          const User = await lib.read("Users", args.Username);
          return User;
        }
      }
    }
  })
});

const server = new ApolloServer({
  playground: true,
  cors: {
    credentials: "include",
    origin: true
  },
  //burasi her request ile herhangi bir resolver olusmadan once calisir,
  //return ettigi deger resolverlar icinde context e verilir
  context: async ({ req, res }) => {
    let isAdmin = false;
    if (req.headers.admin) {
      isAdmin = true;
    }
    return { isAdmin };
  },
  schema: Schema
});
server.listen(3001);
