import { gql } from 'apollo-server'

const customCategoryTypes = gql`
  scalar Date
  enum ErrorTypes {
    duplicate
    failure
    invalid
    notFound
    unauthorized
  }

  type Errors {
    type: ErrorTypes
    message: String
  }

  type RecipeCategory {
    _id: ID!
    label: String
    createdAt: Date
    updatedAt: Date
  }
  union RecipeCategoryItem = RecipeCategory | Errors

  type RecipeCategories {
    RecipeCategories: [RecipeCategory]
  }
  union RecipeCategoryItems = RecipeCategories | Errors

  type BulkRecipeCategories {
    all: [RecipeCategory]
    failed: [String]
    succeeded: [String]
  }
  union BulkRecipeCategoryItems = BulkRecipeCategories | Errors

  type Query {
    getAllCustomCategories: RecipeCategoryItems
    getCustomCategoryById(userId: ID!, id: ID!): RecipeCategoryItem
    getCustomCategoryByLabel(userId: ID!, label: String!): RecipeCategoryItem

    getAllUserCategories(userId: ID!): UsersCategoriesItems
  }

  type Mutation {
    createCustomCategory(userId: ID!, label: String!): RecipeCategoryItems
    addBulkCustomCategories(
      userId: ID!
      labels: [String!]!
    ): BulkRecipeCategoryItems
    editCustomCategoryById(
      userId: ID!
      id: String!
      newLabel: String!
    ): RecipeCategoryItems
    deleteCustomCategoryById(userId: ID!, id: String!): RecipeCategoryItems
    deleteCustomCategoryByLabel(
      userId: ID!
      label: String!
    ): RecipeCategoryItems
    deleteBulkCustomCategoriesById(
      userId: ID!
      ids: [String!]!
    ): BulkRecipeCategoryItems
    deleteBulkCustomCategoriesByLabel(
      userId: ID!
      labels: [String!]!
    ): BulkRecipeCategoryItems
  }
`

export default customCategoryTypes
