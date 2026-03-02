import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type OldStyle = {
    #cinematic;
    #animated;
    #realistic;
    #cartoon;
    #abstract;
  };

  type OldDuration = {
    #short;
    #medium;
    #long;
  };

  type OldStatus = {
    #pending;
    #processing;
    #completed;
    #failed;
  };

  type OldVideoJob = {
    id : Nat;
    owner : Principal.Principal;
    prompt : Text;
    style : OldStyle;
    duration : OldDuration;
    status : OldStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    videoUrl : ?Text;
    thumbnailUrl : ?Text;
    errorMessage : ?Text;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    videoJobs : Map.Map<Nat, OldVideoJob>;
    jobCounter : Nat;
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
  };

  public type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
