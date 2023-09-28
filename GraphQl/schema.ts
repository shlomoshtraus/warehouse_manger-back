import {
    buildSchema,
    GraphQLSchema
} from "graphql";
import {
    bestSellingProducts,
    getAllProducts, searchForProducts,
    worstSellingProducts,
    productStatus
} from "./productsQuery";
import {
    deleteAnProduct,
    changePropertiesOfProduct, addAnProduct, makeASell
} from "./productsMutation";
import {changeRole, login, register, requestPasswordLink, resetUserPassword} from "./usersMutation";


export const schema: GraphQLSchema = buildSchema(`
    type Product{
        id: Int
        name: String
        quantity: Int
        imgSrc: String
        numberOfSales: Int
    }type User{
        id: Int
        username: String
        password: String
        role: String
    }
    type Availability{
        name:String
        status: String
        message:String
    }
    type Query {
        searchForProducts(name: String!):[Product]
        productStatus(name: String):Availability
        getAllProducts: [Product]
        worstSellingProducts(limit: Int): [Product]
        bestSellingProducts(limit: Int): [Product]
    }
    type Mutation {
        makeASell(nameOfProduct: String!, numberOfItemsSold: Int!): Product
        addAnProduct(name: String!,quantity: Int!,imgSrc:String!): Product
        deleteAnProduct(name: String!): Product
        changePropertiesOfProduct(previousName: String!,name: String,imgSrc: String,quantity: Int,numberOfSales:Int):Product
        login(email: String!,password:String!):String
        register(username: String!,email:String!,password:String!):String
        changeRole(email: String!,reqRole:String!):User
        requestPasswordLink(email:String!):String
        resetUserPassword(userId:String!, password:String!):String
    }
`);

export const root = {
    searchForProducts,
    productStatus,
    getAllProducts,
    bestSellingProducts,
    worstSellingProducts,
    addAnProduct,
    makeASell,
    deleteAnProduct,
    changePropertiesOfProduct,
    login,
    register,
    changeRole,
    requestPasswordLink,
    resetUserPassword
}
