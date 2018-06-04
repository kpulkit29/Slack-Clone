import { AuthenticationResponse, AuthenticateOptions, AuthenticatePayload, BaseClient, Instance, TokenWithExpiry } from 'pusher-platform-node';
export interface AuthenticationOptions {
    userId: string;
    authPayload?: AuthenticatePayload;
}
export interface UserIdOptions {
    userId: string;
}
export interface GetRoomOptions extends UserIdOptions {
    roomId: number;
}
export interface DeleteUserOptions extends UserIdOptions {
}
export interface GetUserRoomOptions extends UserIdOptions {
}
export interface GetRoomsOptions extends UserIdOptions {
}
export interface GetUserJoinableRoomOptions extends UserIdOptions {
}
export interface GetUserRolesOptions extends UserIdOptions {
}
export interface RemoveGlobalRoleForUserOptions extends UserIdOptions {
}
export interface RemoveRoomRoleForUserOptions extends UserIdOptions {
    roomId: number;
}
export interface BasicAssignRoleToUserOptions {
    userId: string;
    roleName: string;
}
export interface AssignGlobalRoleToUserOptions extends BasicAssignRoleToUserOptions {
}
export interface AssignRoleToUserOptions extends BasicAssignRoleToUserOptions {
    roomId?: number;
}
export interface AssignRoomRoleToUserOptions extends BasicAssignRoleToUserOptions {
    roomId: number;
}
export interface DeleteRoleOptions {
    name: string;
}
export interface CreateRoleOptions {
    name: string;
    permissions: Array<string>;
}
export interface CreateScopedRoleOptions extends CreateRoleOptions {
    scope: string;
}
export interface UpdatePermissionsOptions {
    roleName: string;
    permissionsToAdd?: Array<string>;
    permissionsToRemove?: Array<string>;
}
export interface GetPermissionsOptions {
    roleName: string;
}
export interface TokenWithExpiryAt {
    token: string;
    expiresAt: number;
}
export interface Options {
    instanceLocator: string;
    key: string;
    port?: number;
    host?: string;
    client?: BaseClient;
}
export interface GeneralRequestOptions {
    method: string;
    path: string;
    jwt?: string;
    qs?: object;
}
export interface GetRoomMessagesOptions extends UserIdOptions {
    direction?: string;
    initialId?: string;
    limit?: number;
    roomId: number;
}
export interface GetRoomMessagesOptionsPayload {
    initial_id?: string;
    direction?: string;
    limit?: number;
}
export interface CreateUserOptions {
    id: string;
    name: string;
    avatarURL?: string;
    customData?: any;
}
export interface UpdateUserOptions {
    id: string;
    name?: string;
    avatarURL?: string;
    customData?: any;
}
export interface CreateRoomOptions {
    creatorId: string;
    name: string;
    isPrivate?: boolean;
    userIds?: Array<string>;
}
export interface UpdateRolePermissionsOptions {
    add_permissions?: Array<string>;
    remove_permissions?: Array<string>;
}
export interface CreateUsersOptions {
    users: Array<User>;
}
export interface GetUsersByIdsOptions {
    userIds: Array<string>;
}
export interface User {
    id: string;
    name: string;
    avatarURL?: string;
    customData?: any;
}
export default class Chatkit {
    apiInstance: Instance;
    authorizerInstance: Instance;
    instanceLocator: string;
    private tokenWithExpiry?;
    constructor(options: Options);
    authenticate(options: AuthenticationOptions): AuthenticationResponse;
    generateAccessToken(options: AuthenticateOptions): TokenWithExpiry;
    createUser(options: CreateUserOptions): Promise<any>;
    createUsers(options: CreateUsersOptions): Promise<any>;
    updateUser(options: UpdateUserOptions): Promise<any>;
    deleteUser(options: DeleteUserOptions): Promise<void>;
    getUsers(): Promise<any>;
    getUsersByIds(options: GetUsersByIdsOptions): Promise<any>;
    getRoom(options: GetRoomOptions): Promise<any>;
    getRoomMessages(options: GetRoomMessagesOptions): Promise<any>;
    getRooms(options: GetRoomsOptions): Promise<any>;
    getUserRooms(options: GetUserRoomOptions): Promise<any>;
    getUserJoinableRooms(options: GetUserJoinableRoomOptions): Promise<any>;
    createRoom(options: CreateRoomOptions): Promise<any>;
    createRoomRole(options: CreateRoleOptions): Promise<void>;
    createGlobalRole(options: CreateRoleOptions): Promise<void>;
    private createRole(options);
    deleteGlobalRole(options: DeleteRoleOptions): Promise<void>;
    deleteRoomRole(options: DeleteRoleOptions): Promise<void>;
    assignGlobalRoleToUser(options: AssignGlobalRoleToUserOptions): Promise<void>;
    assignRoomRoleToUser(options: AssignRoomRoleToUserOptions): Promise<void>;
    private assignRoleToUser(options);
    getUserRoles(options: GetUserRolesOptions): Promise<any>;
    removeGlobalRoleForUser(options: RemoveGlobalRoleForUserOptions): Promise<void>;
    removeRoomRoleForUser(options: RemoveRoomRoleForUserOptions): Promise<void>;
    getPermissionsForGlobalRole(options: GetPermissionsOptions): Promise<any>;
    getPermissionsForRoomRole(options: GetPermissionsOptions): Promise<any>;
    updatePermissionsForGlobalRole(options: UpdatePermissionsOptions): Promise<any>;
    updatePermissionsForRoomRole(options: UpdatePermissionsOptions): Promise<any>;
    getRoles(): Promise<any>;
    apiRequest(options: GeneralRequestOptions): Promise<any>;
    authorizerRequest(options: GeneralRequestOptions): Promise<any>;
    private updatePermissionsForRole(roleName, scope, permissionsToadd?, permissionsToRemove?);
    /**
     * This method manages the token for http library and pusher platform
     * communication
     */
    private getServerToken();
}
