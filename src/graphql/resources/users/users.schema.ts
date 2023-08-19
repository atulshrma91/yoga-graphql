import { DateTimeTypeDefinition } from 'graphql-scalars';

const userTypes = `
  ${DateTimeTypeDefinition}
  type User{
    userId: String!
    email: String!
    userName: String
    firstName: String
    lastName: String
    isEmailVerified: Boolean
    referenceCode: String
    mobileNumber: String
    phoneNumber: String
    isWhitelistEnabled: Boolean
    is2faEnabled: Boolean
    dob: String
    gender: String
    receiveNewsletter: Boolean
    image: String
    google2faSecret: String
    loginHistories: [LoginHistory]
    userAddress: [UserAddress]
    userRole: [UserRole]
  }

  type UserRole {
    userRoleTypeId: Int,
    userId: String!
  }

  type LoginHistory {
    ipAddress: String,
    accessDevice: String,
    accessLocation: String,
    browser: String,
    createdAt: DateTime
  }

  type UserAddress {
    addressLine1: String,
    addressLine2: String,
    City: String,
    State: String,
    Zipcode: String,
  }

  type UserMembership {
    membershipProgramId: String!,
    userId: String!,
    membershipStartDate: DateTime!,
    isCurrent: Boolean!,
    membershipEndedDate: DateTime,
    membershipPrograms: MembershipProgram!
  }

  type MembershipProgram {
    programName: String!
    products: product
  }

  type MailSentOutput {
    mail: String!
  }

  type VerifyEmailOutput{
    verified: Boolean!
    message: String!
  }

  type GoogleRegisterOutput {
    success: Boolean!
    message: String!
  }

`;

const userQueries = `
  user: User!
  getUserMemberships: [UserMembership]
`;

const userMutations = `
  authorizeUser: User!
  getUserMembership: UserMembership!
  sendResetPasswordEmail(email: String!): MailSentOutput
  sendVerificationEmailNewUser(email: String!, referralCode: String): MailSentOutput
  resendVerificationEmail: MailSentOutput
  verifyEmail(oobCode: String!): VerifyEmailOutput
  sendUserGoogleRegister(userName: String!, referralCode: String): GoogleRegisterOutput
`;

export { userTypes, userQueries, userMutations };
