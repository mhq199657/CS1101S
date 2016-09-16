// Task 1
// Your solution

// Reminder: a,b, are integers (NOT BigInt)
function solve_ax_plus_by_eq_1(a, b) {
    // Your program here!
    if(b===0){
        if(a===1){
            return pair(1,0);
        }else if(a===-1){
            return pair(-1,0);
        }else{
            return "No solutions!";
        }
    }else{
    var r=a%b;
    var q = (a-r)/b;
    var p=solve_ax_plus_by_eq_1(b,r);
    var s=head(p);
    var t=tail(p);
    return pair(t,s-q*t);
    }
}
// Test your function
display(solve_ax_plus_by_eq_1(233987973, 41111687));

// Check your answer, you should get 1
display((233987973 * -11827825) + (41111687 * 67318298));

// Check that random key pairs can be generated and used
// Your demonstration here

// Task 2
// Reminder: a,b, are integers (NOT BigInt)

function solve_ax_plus_by_eq_1(a, b) {
     // Your program here!
    if(b===0){
        if(a===1){
            return pair(1,0);
        }else if(a===-1){
            return pair(-1,0);
        }else{
            return "No solutions!";
        }
    }else{
    var r=a%b;
    var q = (a-r)/b;
    var p=solve_ax_plus_by_eq_1(b,r);
    var s=head(p);
    var t=tail(p);
    return pair(t,s-q*t);
    }
}

// Your solution

function crack_rsa(key) {
    // Your program here!
    var n = key_modulus(key);
    var e = key_exponent(key);
    var p = parseInt(smallest_divisor(int_to_bigInt(n)));
    var q = n/p;
    var m = (p-1)*(q-1);
    var d = head(solve_ax_plus_by_eq_1(e,m));
    display(list(d,e,m));
    return make_key(n,d+m);
}


// Test your function

display(crack_rsa(key_pair_public(test_key_pair1)));

display(crack_rsa(key_pair_public(test_key_pair2)));