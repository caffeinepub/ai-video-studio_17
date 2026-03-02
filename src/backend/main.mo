import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // VideoJob type definition
  public type Style = {
    #cinematic;
    #animated;
    #realistic;
    #cartoon;
    #abstract;
  };

  public type Duration = {
    #short;
    #medium;
    #long;
  };

  public type Status = {
    #pending;
    #processing;
    #completed;
    #failed;
  };

  public type VideoJob = {
    id : Nat;
    owner : Principal;
    prompt : Text;
    style : Style;
    duration : Duration;
    status : Status;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    videoUrl : ?Text;
    thumbnailUrl : ?Text;
    errorMessage : ?Text;
  };

  public type UserProfile = {
    name : Text;
    // Add more fields as needed
  };

  public type PublicStats = {
    totalJobsCreated : Nat;
    totalCompleted : Nat;
  };

  module VideoJob {
    public func compareByTimestamp(job1 : VideoJob, job2 : VideoJob) : Order.Order {
      let t1 = Int.abs(job1.createdAt);
      let t2 = Int.abs(job2.createdAt);
      Nat.compare(t1, t2);
    };
  };

  // System state
  let videoJobs = Map.empty<Nat, VideoJob>();
  var jobCounter = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Create a new video job
  public shared ({ caller }) func createVideoJob(prompt : Text, style : Style, duration : Duration) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create jobs");
    };

    let id = jobCounter;
    let now = Time.now();

    let job : VideoJob = {
      id;
      owner = caller;
      prompt;
      style;
      duration;
      status = #pending;
      createdAt = now;
      updatedAt = now;
      videoUrl = null;
      thumbnailUrl = null;
      errorMessage = null;
    };

    videoJobs.add(id, job);
    jobCounter += 1;
    id;
  };

  // Get a specific job (only owner can view)
  public query ({ caller }) func getVideoJob(id : Nat) : async VideoJob {
    switch (videoJobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.owner != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only owners and admins can view jobs");
        };
        job;
      };
    };
  };

  // List all jobs for current user
  public query ({ caller }) func getMyJobs() : async [VideoJob] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list jobs");
    };

    videoJobs.values().toArray().filter(func(job) { job.owner == caller });
  };

  // Delete a job (only owner or admin)
  public shared ({ caller }) func deleteJob(id : Nat) : async () {
    switch (videoJobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.owner != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only owners and admins can delete jobs");
        };
        videoJobs.remove(id);
      };
    };
  };

  // Admin: Update job status and URLs
  public shared ({ caller }) func updateJobStatus(id : Nat, status : Status, videoUrl : ?Text, thumbnailUrl : ?Text, errorMessage : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update jobs");
    };

    switch (videoJobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        let updatedJob : VideoJob = {
          job with
          status;
          videoUrl;
          thumbnailUrl;
          errorMessage;
          updatedAt = Time.now();
        };
        videoJobs.add(id, updatedJob);
      };
    };
  };

  // Get all jobs (admin only)
  public query ({ caller }) func getAllJobs() : async [VideoJob] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all jobs");
    };
    videoJobs.values().toArray();
  };

  // Get jobs by status (admin only)
  public query ({ caller }) func getJobsByStatus(status : Status) : async [VideoJob] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter jobs by status");
    };

    videoJobs.values().toArray().filter(func(job) { job.status == status });
  };

  // Get latest jobs (PUBLIC function, no auth)
  public query func getLatestJobs(limit : Nat) : async [VideoJob] {
    let sortedJobs = videoJobs.values().toArray().sort(VideoJob.compareByTimestamp);
    let takeLimit = if (limit > sortedJobs.size()) {
      sortedJobs.size();
    } else {
      limit;
    };
    sortedJobs.sliceToArray(0, takeLimit);
  };

  // Get jobs by user (admin only)
  public query ({ caller }) func getJobsByUser(user : Principal) : async [VideoJob] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch jobs by user");
    };

    videoJobs.values().toArray().filter(func(job) { job.owner == user });
  };

  // Update job prompt and metadata (only owner or admin)
  public shared ({ caller }) func updateJobMetadata(id : Nat, prompt : Text, style : Style, duration : Duration) : async () {
    switch (videoJobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.owner != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only owners and admins can update job metadata");
        };

        let updatedJob : VideoJob = {
          job with
          prompt;
          style;
          duration;
          updatedAt = Time.now();
        };

        videoJobs.add(id, updatedJob);
      };
    };
  };

  // Public stats - no authentication required
  public query func getPublicStats() : async PublicStats {
    var totalCompleted = 0;
    for (job in videoJobs.values()) {
      if (job.status == #completed) {
        totalCompleted += 1;
      };
    };

    {
      totalJobsCreated = jobCounter;
      totalCompleted;
    };
  };

  // Simulate progress (only caller's jobs, user permission)
  public shared ({ caller }) func simulateProgress() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can simulate progress");
    };

    let currentTime = Time.now();
    let updateThreshold = 10_000_000_000; // 10 seconds in nanoseconds
    let jobsToUpdate = List.empty<Nat>();

    if (videoJobs.isEmpty()) { return () };

    for ((id, job) in videoJobs.entries()) {
      if (job.owner == caller) {
        let timeSinceUpdate = currentTime - job.updatedAt;
        if (timeSinceUpdate >= updateThreshold) {
          jobsToUpdate.add(id);
        };
      };
    };

    for (id in jobsToUpdate.values()) {
      switch (videoJobs.get(id)) {
        case (null) { () };
        case (?job) {
          let newStatus = switch (job.status) {
            case (#pending) { #processing };
            case (#processing) { #completed };
            case (_) { job.status };
          };

          let updatedJob : VideoJob = {
            job with
            status = newStatus;
            updatedAt = currentTime;
            videoUrl = if (newStatus == #completed) {
              ?("https://example.com/mockvideo.mp4");
            } else {
              null;
            };
            thumbnailUrl = if (newStatus == #completed) {
              ?("https://example.com/mockthumbnail.jpg");
            } else {
              null;
            };
          };
          videoJobs.add(id, updatedJob);
        };
      };
    };
  };
};
