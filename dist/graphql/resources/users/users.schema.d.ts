declare const userTypes: string;
declare const userQueries = "\n  user: User!\n  getUserMemberships: [UserMembership]\n";
declare const userMutations = "\n  authorizeUser: User!\n  getUserMembership: UserMembership!\n  sendResetPasswordEmail(email: String!): MailSentOutput\n  sendVerificationEmailNewUser(email: String!, referralCode: String): MailSentOutput\n  resendVerificationEmail: MailSentOutput\n  verifyEmail(oobCode: String!): VerifyEmailOutput\n  sendUserGoogleRegister(userName: String!, referralCode: String): GoogleRegisterOutput\n";
export { userTypes, userQueries, userMutations };
