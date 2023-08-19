"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
var index_1 = require("graphql/index");
var uuid_1 = require("uuid");
var auth_resolver_1 = require("../../../composable/auth.resolver");
var composable_resolver_1 = require("../../../composable/composable.resolver");
var verify_token_resolver_1 = require("../../../composable/verify-token.resolver");
var utils_1 = require("./utils");
exports.userResolvers = {
    Query: {
        user: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) { return __awaiter(void 0, void 0, void 0, function () {
            var user, err_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4, context.yoga.prisma.users
                                .findUniqueOrThrow({
                                select: {
                                    userId: true,
                                    userName: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    isEmailVerified: true,
                                    isWhitelistEnabled: true,
                                    referenceCode: true,
                                    mobileNumber: true,
                                    phoneNumber: true,
                                    is2faEnabled: true,
                                    dob: true,
                                    gender: true,
                                    receiveNewsletter: true,
                                    image: true,
                                    google2faSecret: true,
                                    loginHistories: {
                                        select: {
                                            ipAddress: true,
                                            accessDevice: true,
                                            accessLocation: true,
                                            browser: true,
                                            createdAt: true,
                                        },
                                    },
                                    userAddress: {
                                        select: {
                                            addressLine1: true,
                                            addressLine2: true,
                                            City: true,
                                            State: true,
                                            Zipcode: true,
                                        },
                                    },
                                    userRole: {
                                        select: {
                                            userId: true,
                                            userRoleTypeId: true,
                                        },
                                    },
                                },
                                where: {
                                    userId: (_b = context.currentUser) === null || _b === void 0 ? void 0 : _b.userId,
                                },
                            })
                                .catch(function () {
                                return Promise.reject(new index_1.GraphQLError("User not found."));
                            })];
                    case 1:
                        user = (_c.sent());
                        return [2, user];
                    case 2:
                        err_1 = _c.sent();
                        return [2, Promise.reject(new index_1.GraphQLError(err_1.message))];
                    case 3: return [2];
                }
            });
        }); }),
        getUserMemberships: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) { return __awaiter(void 0, void 0, void 0, function () {
            var userMemberships, UserMemberships, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userMemberships = context.yoga.prisma.userMemberships;
                        return [4, userMemberships.findMany({
                                select: {
                                    membershipProgramId: true,
                                    userId: true,
                                    membershipStartDate: true,
                                    isCurrent: true,
                                    membershipEndedDate: true,
                                    membershipPrograms: {
                                        select: {
                                            programName: true,
                                            products: true,
                                        },
                                    },
                                },
                                where: { userId: context.userId },
                            })];
                    case 1:
                        UserMemberships = _b.sent();
                        return [2, UserMemberships];
                    case 2:
                        err_2 = _b.sent();
                        return [2, Promise.reject(new index_1.GraphQLError(err_2.message))];
                    case 3: return [2];
                }
            });
        }); }),
    },
    Mutation: {
        authorizeUser: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) { return __awaiter(void 0, void 0, void 0, function () {
            var userId, decodedPayload, nameSplit, user_1, userRoleType, userAgreementsTOS, userAgreementsPP, userAgreementsCP, StakingWalletType, TransactionalWalletType, TransactionalWallet, user, err_3;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 18, , 19]);
                        userId = null;
                        if (!(context === null || context === void 0 ? void 0 : context.currentUser)) return [3, 1];
                        userId = (_b = context.currentUser) === null || _b === void 0 ? void 0 : _b.userId;
                        return [3, 15];
                    case 1: return [4, (0, verify_token_resolver_1.authenticateUser)(context.authorization)];
                    case 2:
                        decodedPayload = _e.sent();
                        if (!decodedPayload) {
                            return [2, Promise.reject(new index_1.GraphQLError("Invalid Token."))];
                        }
                        nameSplit = decodedPayload.name.split(" ");
                        return [4, context.yoga.prisma.users.create({
                                data: {
                                    userId: (0, uuid_1.v4)(),
                                    firebaseUID: decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.user_id,
                                    email: decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.email,
                                    userName: decodedPayload.email.split("@")[0],
                                    firstName: (_c = nameSplit[0]) !== null && _c !== void 0 ? _c : "",
                                    lastName: (_d = nameSplit[1]) !== null && _d !== void 0 ? _d : "",
                                },
                            })];
                    case 3:
                        user_1 = _e.sent();
                        userId = user_1.userId;
                        return [4, context.yoga.prisma.userRoleType.findFirst({
                                where: {
                                    name: "User",
                                },
                            })];
                    case 4:
                        userRoleType = _e.sent();
                        return [4, context.yoga.prisma.userAgreements.findFirst({
                                where: {
                                    documentName: "Terms of Use",
                                },
                            })];
                    case 5:
                        userAgreementsTOS = _e.sent();
                        return [4, context.yoga.prisma.userAgreements.findFirst({
                                where: {
                                    documentName: "Privacy Policy",
                                },
                            })];
                    case 6:
                        userAgreementsPP = _e.sent();
                        return [4, context.yoga.prisma.userAgreements.findFirst({
                                where: {
                                    documentName: "Cookie Policy",
                                },
                            })];
                    case 7:
                        userAgreementsCP = _e.sent();
                        return [4, context.yoga.prisma.signedUserAgreements.createMany({
                                data: [
                                    {
                                        userID: user_1.userId,
                                        documentID: userAgreementsTOS.id,
                                        dateAgreed: new Date(),
                                    },
                                    {
                                        userID: user_1.userId,
                                        documentID: userAgreementsPP.id,
                                        dateAgreed: new Date(),
                                    },
                                    {
                                        userID: user_1.userId,
                                        documentID: userAgreementsCP.id,
                                        dateAgreed: new Date(),
                                    },
                                ],
                            })];
                    case 8:
                        _e.sent();
                        return [4, context.yoga.prisma.userRole.create({
                                data: {
                                    userId: user_1.userId,
                                    userRoleTypeId: userRoleType.id,
                                },
                            })];
                    case 9:
                        _e.sent();
                        return [4, context.yoga.prisma.walletTypes.findFirst({
                                where: {
                                    name: "STAKING",
                                },
                            })];
                    case 10:
                        StakingWalletType = _e.sent();
                        return [4, context.yoga.prisma.wallets.create({
                                data: {
                                    userId: user_1.userId,
                                    walletTypeId: StakingWalletType.walletTypesID,
                                    walletName: "".concat(user_1.firstName, " STAKING wallet"),
                                },
                            })];
                    case 11:
                        _e.sent();
                        return [4, context.yoga.prisma.walletTypes.findFirst({
                                where: {
                                    name: "TRANSACTIONAL",
                                },
                            })];
                    case 12:
                        TransactionalWalletType = _e.sent();
                        return [4, context.yoga.prisma.wallets.create({
                                data: {
                                    userId: user_1.userId,
                                    walletTypeId: TransactionalWalletType.walletTypesID,
                                    walletName: "".concat(user_1.firstName, " Transactional wallet"),
                                },
                            })];
                    case 13:
                        TransactionalWallet = _e.sent();
                        return [4, context.yoga.prisma.userWalletPermissions.create({
                                data: {
                                    walletID: TransactionalWallet.walletsID,
                                    walletUserPermissionsID: 1,
                                },
                            })];
                    case 14:
                        _e.sent();
                        _e.label = 15;
                    case 15: return [4, (0, utils_1.detectSuspiciousSignIn)(context, userId)];
                    case 16:
                        _e.sent();
                        return [4, context.yoga.prisma.users
                                .findUniqueOrThrow({
                                select: {
                                    userId: true,
                                    userName: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    isEmailVerified: true,
                                    isWhitelistEnabled: true,
                                    referenceCode: true,
                                    mobileNumber: true,
                                    phoneNumber: true,
                                    is2faEnabled: true,
                                    dob: true,
                                    gender: true,
                                    receiveNewsletter: true,
                                    image: true,
                                    google2faSecret: true,
                                    loginHistories: {
                                        select: {
                                            ipAddress: true,
                                            accessDevice: true,
                                            accessLocation: true,
                                            browser: true,
                                            createdAt: true,
                                        },
                                    },
                                    userAddress: {
                                        select: {
                                            addressLine1: true,
                                            addressLine2: true,
                                            City: true,
                                            State: true,
                                            Zipcode: true,
                                        },
                                    },
                                    userRole: {
                                        select: {
                                            userId: true,
                                            userRoleTypeId: true,
                                        },
                                    },
                                },
                                where: {
                                    userId: userId,
                                },
                            })
                                .catch(function () {
                                return Promise.reject(new index_1.GraphQLError("User not found."));
                            })];
                    case 17:
                        user = (_e.sent());
                        return [2, user];
                    case 18:
                        err_3 = _e.sent();
                        context.yoga.logger.error(err_3);
                        return [2, Promise.reject(new index_1.GraphQLError(err_3.message))];
                    case 19: return [2];
                }
            });
        }); }),
        getUserMembership: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) { return __awaiter(void 0, void 0, void 0, function () {
            var _b, membershipPrograms, userMemberships, userMembership, membershipProgram, err_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        _b = context.yoga.prisma, membershipPrograms = _b.membershipPrograms, userMemberships = _b.userMemberships;
                        return [4, userMemberships.findFirst({
                                select: {
                                    membershipProgramId: true,
                                    userId: true,
                                    membershipStartDate: true,
                                    isCurrent: true,
                                    membershipEndedDate: true,
                                    membershipPrograms: {
                                        select: {
                                            programName: true,
                                            products: true,
                                        },
                                    },
                                },
                                where: { userId: context.userId, isCurrent: true },
                            })];
                    case 1:
                        userMembership = _c.sent();
                        if (!!userMembership) return [3, 4];
                        return [4, membershipPrograms.findFirst({
                                where: {
                                    programName: "Basic",
                                },
                            })];
                    case 2:
                        membershipProgram = _c.sent();
                        return [4, userMemberships.create({
                                select: {
                                    membershipProgramId: true,
                                    userId: true,
                                    membershipStartDate: true,
                                    isCurrent: true,
                                    membershipEndedDate: true,
                                    membershipPrograms: {
                                        select: {
                                            programName: true,
                                            products: true,
                                        },
                                    },
                                },
                                data: {
                                    membershipProgramId: membershipProgram.membershipProgramID,
                                    userId: context.userId,
                                    membershipStartDate: new Date(),
                                    isCurrent: true,
                                    membershipEndedDate: null,
                                },
                            })];
                    case 3:
                        userMembership = _c.sent();
                        _c.label = 4;
                    case 4: return [2, userMembership];
                    case 5:
                        err_4 = _c.sent();
                        return [2, Promise.reject(new index_1.GraphQLError(err_4.message))];
                    case 6: return [2];
                }
            });
        }); }),
        sendResetPasswordEmail: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var user, link, emailService, sent, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4, context.yoga.prisma.users.findFirst({
                                where: {
                                    email: args.email,
                                },
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2, Promise.reject(new index_1.GraphQLError("Invalid User."))];
                        }
                        return [4, (0, utils_1.genResetPasswordLink)(context, user.email)];
                    case 2:
                        link = _a.sent();
                        emailService = context.yoga.clients.NOTIFIER_EMAIL_SERVICE;
                        return [4, emailService.post("/", {
                                userData: {
                                    to: user === null || user === void 0 ? void 0 : user.email,
                                    name: user.userName,
                                    link: link,
                                },
                                campaign: "resetPassword",
                            })];
                    case 3:
                        sent = (_a.sent()).data.sent;
                        if (!sent) {
                            return [2, Promise.reject(new index_1.GraphQLError("Could not generate reset password mail"))];
                        }
                        return [2, { mail: sent }];
                    case 4:
                        err_5 = _a.sent();
                        return [2, Promise.reject(new index_1.GraphQLError(err_5.message))];
                    case 5: return [2];
                }
            });
        }); }),
        sendVerificationEmailNewUser: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var user, link, sent, oobCode, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4, context.yoga.prisma.users.findFirst({
                                where: { userId: context.userId },
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2, Promise.reject(new index_1.GraphQLError("Invalid User."))];
                        }
                        return [4, (0, utils_1.genVerificationLink)(context, user.email)];
                    case 2:
                        link = _a.sent();
                        return [4, context.yoga.clients.NOTIFIER_EMAIL_SERVICE.post("/", {
                                userData: {
                                    to: user.email,
                                    name: user.userName,
                                    link: link,
                                },
                                campaign: "verification",
                            })];
                    case 3:
                        sent = (_a.sent()).data.sent;
                        if (!sent) {
                            return [2, Promise.reject(new index_1.GraphQLError("Could not generate verification mail"))];
                        }
                        oobCode = (0, utils_1.getOobCode)(link);
                        return [4, context.yoga.cache.conn.hset("EMAIL_OOBS", oobCode, user === null || user === void 0 ? void 0 : user.userId)];
                    case 4:
                        _a.sent();
                        return [2, { mail: sent }];
                    case 5:
                        err_6 = _a.sent();
                        return [2, Promise.reject(new index_1.GraphQLError(err_6.message))];
                    case 6: return [2];
                }
            });
        }); }),
        verifyEmail: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var userId, user, updatedUser, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4, context.yoga.cache.conn.hget("EMAIL_OOBS", args.oobCode)];
                    case 1:
                        userId = _a.sent();
                        return [4, context.yoga.prisma.users.findFirst({
                                where: { userId: userId },
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) return [3, 4];
                        if (user.isEmailVerified) {
                            return [2, {
                                    verified: user === null || user === void 0 ? void 0 : user.isEmailVerified,
                                    message: "Email has been validated!",
                                }];
                        }
                        return [4, context.yoga.prisma.users.update({
                                where: {
                                    userId: user === null || user === void 0 ? void 0 : user.userId,
                                },
                                data: {
                                    isEmailVerified: true,
                                },
                            })];
                    case 3:
                        updatedUser = _a.sent();
                        return [2, {
                                verified: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isEmailVerified,
                                message: "Email has been validated!",
                            }];
                    case 4: return [2, Promise.reject(new index_1.GraphQLError("Invalid User."))];
                    case 5:
                        err_7 = _a.sent();
                        return [2, Promise.reject(new index_1.GraphQLError(err_7.message))];
                    case 6: return [2];
                }
            });
        }); }),
        resendVerificationEmail: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) { return __awaiter(void 0, void 0, void 0, function () {
            var link, sent, oobCode, err_8;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        if (context.currentUser.isEmailVerified) {
                            return [2, Promise.reject(new index_1.GraphQLError("User already verified"))];
                        }
                        return [4, (0, utils_1.genVerificationLink)(context, context.currentUser.email)];
                    case 1:
                        link = _c.sent();
                        return [4, context.yoga.clients.NOTIFIER_EMAIL_SERVICE.post("/", {
                                userData: {
                                    to: context.currentUser.email,
                                    name: context.currentUser.userName,
                                    link: link,
                                },
                                campaign: "verification",
                            })];
                    case 2:
                        sent = (_c.sent()).data.sent;
                        if (!sent) {
                            return [2, Promise.reject(new index_1.GraphQLError("Could not generate verification mail"))];
                        }
                        oobCode = (0, utils_1.getOobCode)(link);
                        return [4, context.yoga.cache.conn.hset("EMAIL_OOBS", oobCode, (_b = context.currentUser) === null || _b === void 0 ? void 0 : _b.userId)];
                    case 3:
                        _c.sent();
                        return [2, { mail: sent }];
                    case 4:
                        err_8 = _c.sent();
                        return [2, Promise.reject(new index_1.GraphQLError(err_8.message))];
                    case 5: return [2];
                }
            });
        }); }),
        sendUserGoogleRegister: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var user, updatedUser, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4, context.yoga.prisma.users.findFirst({
                                where: { userId: context.currentUser.userId },
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3, 4];
                        if (user.isEmailVerified) {
                            return [2, {
                                    success: true,
                                    message: "User has been created and email validated!",
                                }];
                        }
                        return [4, context.yoga.prisma.users.update({
                                where: {
                                    userId: user === null || user === void 0 ? void 0 : user.userId,
                                },
                                data: {
                                    isEmailVerified: true,
                                    userName: (args === null || args === void 0 ? void 0 : args.userName) || null,
                                },
                            })];
                    case 2:
                        updatedUser = _a.sent();
                        return [4, context.yoga.clients.NOTIFIER_EMAIL_SERVICE.post("/", {
                                campaign: "welcome",
                                userData: {
                                    to: updatedUser.email,
                                    name: "".concat(updatedUser.userName),
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [2, {
                                success: true,
                                message: "User has been created and email validated!",
                            }];
                    case 4: return [3, 6];
                    case 5:
                        err_9 = _a.sent();
                        context.yoga.logger.error(err_9);
                        return [2, Promise.reject(new index_1.GraphQLError(err_9.message))];
                    case 6: return [2];
                }
            });
        }); }),
    },
    Subscription: {},
};
//# sourceMappingURL=users.resolvers.js.map