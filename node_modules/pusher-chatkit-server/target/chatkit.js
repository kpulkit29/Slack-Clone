"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pusher_platform_node_1 = require("pusher-platform-node");
var utils_1 = require("./utils");
;
;
var TOKEN_EXPIRY_LEEWAY = 30;
var Chatkit = /** @class */ (function () {
    function Chatkit(options) {
        var instanceLocator = options.instanceLocator, key = options.key, port = options.port, host = options.host, client = options.client;
        var apiInstanceOptions = ({
            locator: instanceLocator,
            key: key,
            port: port,
            host: host,
            client: client,
            serviceName: 'chatkit',
            serviceVersion: 'v1',
        });
        var authorizerInstanceOptions = ({
            locator: instanceLocator,
            key: key,
            port: port,
            host: host,
            client: client,
            serviceName: 'chatkit_authorizer',
            serviceVersion: 'v1',
        });
        this.instanceLocator = instanceLocator;
        this.apiInstance = new pusher_platform_node_1.Instance(apiInstanceOptions);
        this.authorizerInstance = new pusher_platform_node_1.Instance(authorizerInstanceOptions);
    }
    // Token generation
    Chatkit.prototype.authenticate = function (options) {
        var userId = options.userId, authPayload = options.authPayload;
        return this.apiInstance.authenticate(authPayload || { grant_type: 'client_credentials' }, { userId: userId });
    };
    // Used internally - not designed to be used externally
    Chatkit.prototype.generateAccessToken = function (options) {
        return this.apiInstance.generateAccessToken(options);
    };
    // User interactions
    Chatkit.prototype.createUser = function (options) {
        var id = options.id, name = options.name;
        return this.apiInstance.request({
            method: 'POST',
            path: "/users",
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                id: id,
                name: name,
                avatar_url: options.avatarURL,
                custom_data: options.customData,
            },
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.createUsers = function (options) {
        var users = options.users.map(function (user) {
            var id = user.id, name = user.name;
            return {
                id: id,
                name: name,
                avatar_url: user.avatarURL,
                custom_data: user.customData,
            };
        });
        return this.apiInstance.request({
            method: 'POST',
            path: "/batch_users",
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                users: users
            },
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.updateUser = function (options) {
        var jwt = this.generateAccessToken({
            su: true,
            userId: options.id,
        });
        var updatePayload = {};
        if (options.name) {
            updatePayload.name = options.name;
        }
        ;
        if (options.avatarURL) {
            updatePayload.avatar_url = options.avatarURL;
        }
        ;
        if (options.customData) {
            updatePayload.custom_data = options.customData;
        }
        ;
        return this.apiInstance.request({
            method: 'PUT',
            path: "/users/" + options.id,
            headers: {
                'Content-Type': 'application/json'
            },
            body: updatePayload,
            jwt: jwt.token,
        }).then(function () { });
    };
    Chatkit.prototype.deleteUser = function (options) {
        return this.apiInstance.request({
            method: 'DELETE',
            path: "/users/" + options.userId,
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    Chatkit.prototype.getUsers = function () {
        return this.apiInstance.request({
            method: 'GET',
            path: "/users",
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.getUsersByIds = function (options) {
        return this.apiInstance.request({
            method: 'GET',
            path: "/users_by_ids",
            qs: {
                user_ids: options.userIds.join(','),
            },
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    // Room interactions
    Chatkit.prototype.getRoom = function (options) {
        var jwt = this.generateAccessToken({
            su: true,
            userId: options.userId,
        });
        return this.apiInstance.request({
            method: 'GET',
            path: "/rooms/" + options.roomId,
            jwt: jwt.token,
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.getRoomMessages = function (options) {
        var jwt = this.generateAccessToken({
            su: true,
            userId: options.userId,
        });
        var initialId = options.initialId, optionsMinusInitialId = __rest(options, ["initialId"]);
        var qs = optionsMinusInitialId;
        if (initialId) {
            qs['initial_id'] = initialId;
        }
        return this.apiInstance.request({
            method: 'GET',
            path: "/rooms/" + options.roomId + "/messages",
            jwt: jwt.token,
            qs: qs,
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.getRooms = function (options) {
        var jwt = this.generateAccessToken({
            su: true,
            userId: options.userId,
        });
        return this.apiInstance.request({
            method: 'GET',
            path: "/rooms",
            jwt: jwt.token,
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.getUserRooms = function (options) {
        var jwt = this.generateAccessToken({
            su: true,
            userId: options.userId,
        });
        return this.apiInstance.request({
            method: 'GET',
            path: "/users/" + options.userId + "/rooms",
            jwt: jwt.token,
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.getUserJoinableRooms = function (options) {
        var jwt = this.generateAccessToken({
            su: true,
            userId: options.userId,
        });
        return this.apiInstance.request({
            method: 'GET',
            path: "/users/" + options.userId + "/rooms",
            qs: { joinable: true },
            jwt: jwt.token,
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.createRoom = function (options) {
        var jwt = this.generateAccessToken({
            su: true,
            userId: options.creatorId,
        });
        var name = options.name, isPrivate = options.isPrivate, userIds = options.userIds;
        var roomPayload = {
            name: name,
            private: isPrivate || false,
        };
        if (userIds && userIds.length !== 0) {
            roomPayload['user_ids'] = userIds;
        }
        return this.apiInstance.request({
            method: 'POST',
            path: '/rooms',
            jwt: jwt.token,
            body: roomPayload,
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    // Authorizer interactions
    Chatkit.prototype.createRoomRole = function (options) {
        return this.createRole(__assign({}, options, { scope: 'room' }));
    };
    Chatkit.prototype.createGlobalRole = function (options) {
        return this.createRole(__assign({}, options, { scope: 'global' }));
    };
    Chatkit.prototype.createRole = function (options) {
        return this.authorizerInstance.request({
            method: 'POST',
            path: "/roles",
            headers: {
                'Content-Type': 'application/json'
            },
            body: options,
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    Chatkit.prototype.deleteGlobalRole = function (options) {
        return this.authorizerInstance.request({
            method: 'DELETE',
            path: "/roles/" + options.name + "/scope/global",
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    Chatkit.prototype.deleteRoomRole = function (options) {
        return this.authorizerInstance.request({
            method: 'DELETE',
            path: "/roles/" + options.name + "/scope/room",
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    Chatkit.prototype.assignGlobalRoleToUser = function (options) {
        return this.assignRoleToUser(options);
    };
    Chatkit.prototype.assignRoomRoleToUser = function (options) {
        return this.assignRoleToUser(options);
    };
    Chatkit.prototype.assignRoleToUser = function (options) {
        return this.authorizerInstance.request({
            method: 'PUT',
            path: "/users/" + options.userId + "/roles",
            headers: {
                'Content-Type': 'application/json'
            },
            body: { name: options.roleName, room_id: options.roomId },
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    Chatkit.prototype.getUserRoles = function (options) {
        return this.authorizerInstance.request({
            method: 'GET',
            path: "/users/" + options.userId + "/roles",
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.removeGlobalRoleForUser = function (options) {
        return this.authorizerInstance.request({
            method: 'DELETE',
            path: "/users/" + options.userId + "/roles",
            headers: {
                'Content-Type': 'application/json'
            },
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    Chatkit.prototype.removeRoomRoleForUser = function (options) {
        return this.authorizerInstance.request({
            method: 'DELETE',
            path: "/users/" + options.userId + "/roles",
            headers: {
                'Content-Type': 'application/json'
            },
            qs: { room_id: options.roomId },
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    Chatkit.prototype.getPermissionsForGlobalRole = function (options) {
        return this.authorizerInstance.request({
            method: 'GET',
            path: "/roles/" + options.roleName + "/scope/global/permissions",
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.getPermissionsForRoomRole = function (options) {
        return this.authorizerInstance.request({
            method: 'GET',
            path: "/roles/" + options.roleName + "/scope/room/permissions",
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.updatePermissionsForGlobalRole = function (options) {
        return this.updatePermissionsForRole(options.roleName, 'global', options.permissionsToAdd || [], options.permissionsToRemove || []);
    };
    Chatkit.prototype.updatePermissionsForRoomRole = function (options) {
        return this.updatePermissionsForRole(options.roleName, 'room', options.permissionsToAdd || [], options.permissionsToRemove || []);
    };
    Chatkit.prototype.getRoles = function () {
        return this.authorizerInstance.request({
            method: 'GET',
            path: "/roles",
            jwt: this.getServerToken(),
        }).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    // General requests
    Chatkit.prototype.apiRequest = function (options) {
        options.jwt = options.jwt || this.getServerToken();
        return this.apiInstance.request(options);
    };
    Chatkit.prototype.authorizerRequest = function (options) {
        options.jwt = options.jwt || this.getServerToken();
        return this.authorizerInstance.request(options).then(function (res) {
            return JSON.parse(res.body);
        });
    };
    Chatkit.prototype.updatePermissionsForRole = function (roleName, scope, permissionsToadd, permissionsToRemove) {
        if (permissionsToadd === void 0) { permissionsToadd = []; }
        if (permissionsToRemove === void 0) { permissionsToRemove = []; }
        if (permissionsToadd.length === 0 && permissionsToRemove.length === 0) {
            throw new Error("Either permissionsToAdd or permissionsToRemove is required");
        }
        var body = {};
        if (permissionsToadd.length > 0) {
            body['add_permissions'] = permissionsToadd;
        }
        if (permissionsToRemove.length > 0) {
            body['remove_permissions'] = permissionsToRemove;
        }
        return this.authorizerInstance.request({
            method: 'PUT',
            path: "/roles/" + roleName + "/scope/" + scope + "/permissions",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
            jwt: this.getServerToken(),
        }).then(function () { });
    };
    /**
     * This method manages the token for http library and pusher platform
     * communication
     */
    Chatkit.prototype.getServerToken = function () {
        if (this.tokenWithExpiry && this.tokenWithExpiry.expiresAt > utils_1.getCurrentTimeInSeconds()) {
            return this.tokenWithExpiry.token;
        }
        // Otherwise generate new token and its expiration time
        var tokenWithExpiresIn = this.apiInstance.generateAccessToken({ su: true });
        this.tokenWithExpiry = {
            token: tokenWithExpiresIn.token,
            expiresAt: utils_1.getCurrentTimeInSeconds() + tokenWithExpiresIn.expires_in - TOKEN_EXPIRY_LEEWAY,
        };
        return this.tokenWithExpiry.token;
    };
    ;
    return Chatkit;
}());
exports.default = Chatkit;
;
//# sourceMappingURL=chatkit.js.map