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
    name: String!
    occupancy: Int!
    shower: Boolean!
    food: Boolean!
    address: String!
    description: String!
    pictureUrl: String
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

  type VoidResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Request {
    shelter: Shelter!
    guest: Guest!
    accepted: Boolean!
    rooms: Int!
    viewed: Boolean!
  }

  type Query {
    allShelters: [Shelter!]!
    guestList: [Request!]!
    justAccepted: [Shelter!]
  }

  type Mutation {
    createShelter(name: String!, address: String!, description: String!, occupancy: Int!, shower: Boolean!, food: Boolean!): VoidResponse!
    createDonor(name: String!, email: String!, password: String!): DonorResponse!
    createGuest(name: String!, phoneNumber: String!): GuestResponse!
    createShelterRequest(shelterId: Int!, rooms: Int!): VoidResponse!
    decideOnGuest(guestId: Int!, shelterId: Int!, accepted: Boolean!): VoidResponse!
  }

  type Subscription {
    occupancyChange: Shelter
    accepted: Shelter
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
