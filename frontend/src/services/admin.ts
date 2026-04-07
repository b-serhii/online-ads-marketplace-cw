import { http } from "./http";

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    is_email_verified: boolean;
    is_admin: boolean;
    is_blocked?: boolean;
    created_at?: string;
};

export async function getUsers() {
    const { data } = await http.get<AdminUser[]>("/admin/users");
    return data;
}

export type StatsResponse = {
    users: number;
    active: number;
    admins: number;
};

export async function adminStats() {
    const { data } = await http.get("/admin/stats");
    return data as StatsResponse;
}

export async function adminUsers() {
    const { data } = await http.get("/admin/users");
    return data as AdminUser[];
}

export async function setUserAdmin(userId: number, is_admin: boolean) {
    const { data } = await http.patch(`/admin/users/${userId}`, { is_admin });
    return data;
}

export async function setUserBlocked(userId: number, is_blocked: boolean) {
    const { data } = await http.patch(`/admin/users/${userId}`, { is_blocked });
    return data;
}

export async function deleteUser(userId: number) {
    const { data } = await http.delete(`/admin/users/${userId}`);
    return data;
}
