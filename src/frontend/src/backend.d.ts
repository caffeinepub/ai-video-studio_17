import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface PublicStats {
    totalCompleted: bigint;
    totalJobsCreated: bigint;
}
export interface VideoJob {
    id: bigint;
    status: Status;
    duration: Duration;
    thumbnailUrl?: string;
    owner: Principal;
    createdAt: Time;
    errorMessage?: string;
    updatedAt: Time;
    style: Style;
    prompt: string;
    videoUrl?: string;
}
export interface UserProfile {
    name: string;
}
export enum Duration {
    long_ = "long",
    short_ = "short",
    medium = "medium"
}
export enum Status {
    pending = "pending",
    completed = "completed",
    processing = "processing",
    failed = "failed"
}
export enum Style {
    realistic = "realistic",
    cinematic = "cinematic",
    animated = "animated",
    abstract_ = "abstract",
    cartoon = "cartoon"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createVideoJob(prompt: string, style: Style, duration: Duration): Promise<bigint>;
    deleteJob(id: bigint): Promise<void>;
    getAllJobs(): Promise<Array<VideoJob>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJobsByStatus(status: Status): Promise<Array<VideoJob>>;
    getJobsByUser(user: Principal): Promise<Array<VideoJob>>;
    getLatestJobs(limit: bigint): Promise<Array<VideoJob>>;
    getMyJobs(): Promise<Array<VideoJob>>;
    getPublicStats(): Promise<PublicStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoJob(id: bigint): Promise<VideoJob>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    simulateProgress(): Promise<void>;
    updateJobMetadata(id: bigint, prompt: string, style: Style, duration: Duration): Promise<void>;
    updateJobStatus(id: bigint, status: Status, videoUrl: string | null, thumbnailUrl: string | null, errorMessage: string | null): Promise<void>;
}
