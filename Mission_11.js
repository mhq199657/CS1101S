
// Task 1
// Your solution

// Crack Spy's public key
var Spy_private_key = crack_rsa(Darth_public_key);

// Forge a message
var msg="Everything is not in order on the ship...";
var forged_msg_Spy_to_Darth =  encrypt_and_sign(msg, Spy_private_key, Darth_public_key);

// Test your functions
display(Spy_private_key);
display(forged_msg_Spy_to_Darth);
display(authenticate_and_decrypt(forged_msg_Spy_to_Darth,Darth_public_key, Darth_private_key)); // Did you get back the same forged message?

// Task 2
/* 
No.
Let m denote plaintext message, R be recipient public key, r be recipient private key,
    S be sender public key, s be sender private key;
    C be compress, and X(m) means apply RSA_operation/compression X on m.
It is obvious that rR(m)=m and sS(m)=m ; so rR and sS are identity operations.
The current signature algorithm calculates m->R(m)->C(R(m))->s(C(R(m))), knowing R,s;
and sends R(m) and s(C(R(m))) as message and signature.
The recipient calculates R(m)->rR(m)=m, knowing r and S.
                    and  s(C(R(m)->S(s(c(R(m))))=C(R(m)).
This allows reading of plaintext message m and comparing the claimed signatures C(R(m)).
However, we cannot first compress(sign) the message and send, because compression loses information.
            m->s(m)->R(s(m)), knowing R,s.
The result  R(s(m))->r(R(s(m)))=s(m)->Ss(m)=m, knowing r,S.
Hence, s(m) cannot be sent because S is publicly known. Therefore, R(s(m) is the only thing can be sent.
However, in this case, tehre is no way to atheticate the message with only one piece of information.

*/
// Task 3
// Remember to make use of timed()
function modified_generate_RSA_key_pair(x) {
    function pow_10(exponent){
        return exponent===0? int_to_bigInt(1) : mult(int_to_bigInt(10),pow_10(exponent-1));
    }
    var size= pow_10(x);
    var p = int_to_bigInt(choose_prime(size,size));
    var q = int_to_bigInt(choose_prime(size,size));

    // check that we haven't chosen the same prime twice
    if (equalsBigInt(p,q) === 1) {
        return modified_generate_RSA_key_pair(x);
    } else {
        var n = mult(p,q);
        return n;
    }
}
var a = modified_generate_RSA_key_pair(4);
(timed(smallest_divisor))(a);
// Your estimation here!
//50 digits: 10^39 years
//100 digits: 10^89 years