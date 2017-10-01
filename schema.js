export default `

  type Guest {
    id: Int!
    name: String!
    phoneNumber: String!
  }

  type Donor {
    id: Int!
    name: String!
    email: String!
  }

  type Shelter {
    id: Int!
    occupancy: Int!
    shower: Boolean!
    food: Boolean!
    address: String!
    description: String!
    pictureUrl: String!
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
  }

  type Error {
    path: String!
    message: String!
  }

  type ShelterResponse {
    ok: Boolean!
    errors: [Error!]
    shelter: Shelter
  }

  type DonorResponse {
    ok: Boolean!
    errors: [Error!]
    donor: Donor
  }

  type GuestResponse {
    ok: Boolean!
    errors: [Error!]
    guest: Guest
  }

  type Query {
    allShelters: [Shelter!]!
  }

  type Mutation {
    createShelter: ShelterResponse!
    createDonor(name: String!, email: String!, password: String!): DonorResponse!
    createGuest(name: String!, phoneNumber: String!): GuestResponse!
  }

  type Subscription {
    occupancyChange: Shelter
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
