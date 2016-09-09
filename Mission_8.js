// Task 1
function RSA_encrypt(string, public_key) {
    return map(function(int) {
                   return bigInt_to_int(RSA_transform(int_to_bigInt(int), public_key));
               }, string_to_intlist(string));
}

// (a)
function RSA_decrypt(intlist, private_key) {
    // Your program here!
    return intlist_to_string(map(function(int){
                    return bigInt_to_int(RSA_transform(int_to_bigInt(int),private_key));
                        },intlist));
    
}

// Test your newly written RSA_decryption function
 var test_public_key1 = key_pair_public(test_key_pair1);
 var test_result = RSA_encrypt("Testing RSA_decrypt...", test_public_key1);
 var test_private_key1 = key_pair_private(test_key_pair1);
 display(RSA_decrypt(test_result, test_private_key1));
// Did you get back "Testing RSA_decrypt..."?
//Yes.
// (b)
// Question: Why is this simple scheme inadequate for secure encryption?
// It is not safe enough. By enumerating and hashing the all four-char combinations (assuming only A-Z a-z 0-9 is used, the number of combinations is around 15 million), one can break the encrypted messages by referring back to all the enumerations.
// Hence, it is safer to use the standard scheme, which need to reapply the enumeration every 4 characters. The maximum possible enumeration to decode a message of length l will be around 15 million to the power of (l/4), which is exponential rather than linear.

// Task 2
// The original function definitions
function RSA_encrypt(string, key1) {
    return RSA_convert_list(string_to_intlist(string), key1);
}

function RSA_decrypt(intlist, key2) {
    return intlist_to_string(RSA_unconvert_list(intlist, key2));
}

// Your solution

function RSA_unconvert_list(intlist, key) {
    // Your program here!
    var n = int_to_bigInt(key_modulus(key));
    var bigIntList= map (int_to_bigInt, intlist);
    
    function unconvert(lst, sum){
        if(is_empty_list(lst)){
            return [];
        }else{
            var front=head(lst);
            var x = modulo(add(RSA_transform(front,key),sum),n);
            return pair(bigInt_to_int(x),unconvert(tail(lst),front));
        }
    }
    return unconvert(bigIntList, int_to_bigInt(0));
}

// Check your function by evaluating
 var test_public_key1 = key_pair_public(test_key_pair1);
 var result1 = RSA_encrypt("This is a test message.", test_public_key1);
 var test_private_key1 = key_pair_private(test_key_pair1);
 display(RSA_unconvert_list(result1, test_private_key1));
// Result: [242906196, [69006496, [213717089, [229128819, [205322725, [67875559, []]]]]]]"

// Now evaluate
 display(RSA_decrypt(result1, test_private_key1));

// Did you get back your test message?
// Result: This is a test message.