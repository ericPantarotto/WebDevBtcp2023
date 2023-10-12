import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

actor Token {
    Debug.print("Hello");
    //HACK: dfx identity get-principal
    let owner : Principal = Principal.fromText("w553n-4amfe-bjzky-rhofs-g576y-jp4m2-gjwdm-we5q2-44roy-rtrcj-qae");
    let totalSupply: Nat = 1000000000;
    let symbol : Text = "DANG";

    //HACK: non-stable type HashMap
    private stable var  balanceEntries: [(Principal, Nat)] = [];

    //class HashMap<K, V>(initCapacity : Nat, keyEq : (K, K) -> Bool, keyHash : K -> Hash.Hash)
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    if(balances.size() < 1) {
        balances.put(owner, totalSupply);
    };

    public query func balanceOf(who: Principal) : async Nat {
        let balance : Nat = switch (balances.get(who)) {
        case null 0;
        case (?result) result;
        };
        return balance;
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    public shared(msg) func payOut() : async Text {
        Debug.print(debug_show(msg));
        if (balances.get(msg.caller) ==null) {
            let amount= 10000;
            // balances.put(msg.caller, amount);
            let result : Text = await transfer(msg.caller, amount);
            return result;
        }else {
            return "Already Claimed";
        }
    };

    public shared(msg) func transfer(to: Principal, amount: Nat) : async Text {
        let fromBalance: Nat = await balanceOf(msg.caller);
        if (fromBalance > amount) {
            let newBalanceFrom  : Nat = fromBalance - amount;
            balances.put(msg.caller, newBalanceFrom);

            let toBalance : Nat = await balanceOf(to);
            let newToBalance : Nat = toBalance + amount;
            balances.put(to, newToBalance);
            return  "Success."; 
        }else {

            return  "Insufficient Funds";
        }
    };

    
  system func preupgrade() {
    balanceEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    if(balances.size() < 1) {
        balances.put(owner, totalSupply);
    };
    balanceEntries := [];
  };
}