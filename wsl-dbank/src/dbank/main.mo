import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Time "mo:base/Time";


actor DBank{
 stable var currentValue: Float =300;
 //NOTE: re-assignmnt := replace operator, cannot be used with orthogonal persistence (stable) for our testing, otherwise the value would always reset to that value
 //NOTE: has to be used if reset value doesn't work, then re-comment
//  currentValue := 300; 

// let id = 2345677902322;
//DEBUG: this will not work as a let is immutable
//id := 1234;

//NOTE: you can call directly a func after having dfx deploy => dfx canister call dbank topUp
//with a parameter dfx canister call dbank topUp '(100)'
// str parameter : '("Everyone")'

stable var startTime = Time.now(); //NOTE: nb of nanoseconds since 1970-01-01
// startTime := Time.now();//NOTE: has to be used if reset value doesn't work, then re-comment
// Debug.print(debug_show(startTime));

public func topUp(amount: Float) {
   currentValue += amount;
   Debug.print(debug_show(currentValue));
   //NOTE: Debug messages will show in the shell where you did: dfx start (your server)
};

public func withdraw(amount: Float) {
   currentValue -= amount;
   Debug.print(debug_show(currentValue));
};

//NOTE: query attribute added to func
//whenever you have a function that has an output, the output has to come out asynchronously.
public query func checkBalance(): async Float{
   return currentValue;
};

public func compound(){
   let currentTime = Time.now();
   let timeElapsedS = (currentTime - startTime) / 1000000000;
   currentValue:= currentValue * 1.01 ** Float.fromInt(timeElapsedS);
   startTime:= currentTime;
};

};


//NOTE: CANDID_UI
//get candid UI: dfx canister id __Candid_UI
//then: get canister id  =>  dfx canister id dbank
//final URL to use = http://127.0.0.1:8000/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai&id=rrkah-fqaaa-aaaaa-aaaaq-cai
