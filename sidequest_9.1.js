// Task 1

var alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function caesar_encrypt(shift_length, original_message) {
    // Your program here!
    var msg=original_message.toUpperCase();
   function helper(remaining,intermediate){
       if(remaining.length===0)
       {
           return intermediate;
       }else if(alphabet.includes(remaining.charAt(0)))
       {
           return helper( remaining.substring(1,remaining.length),intermediate+alphabet.charAt((alphabet.indexOf(remaining.charAt(0))+shift_length)%26));
       }else{
           return helper( remaining.substring(1,remaining.length),intermediate+remaining.charAt(0));
       }
   }
   return helper(msg,"");
}

function caesar_decrypt(shift_length, encrypted_message) {
    // Your program here!
       function helper(remaining,intermediate){
       if(remaining.length===0)
       {
           return intermediate;
       }else if(alphabet.includes(remaining.charAt(0)))
       {
           return helper( remaining.substring(1,remaining.length),intermediate+alphabet.charAt((alphabet.indexOf(remaining.charAt(0))-shift_length+26)%26));
       }else{
           return helper( remaining.substring(1,remaining.length),intermediate+remaining.charAt(0));
       }
   }
   return helper(encrypted_message,"");
}

// Test your functions
display(caesar_encrypt(3, "the quick brown fox jumps over the lazy dog *#*$@#&amp;"));

display(caesar_decrypt(3, caesar_encrypt(3, "the quick brown fox jumps over the lazy dog")));

function mixed_encrypt(keyword, original_message) {
    // Your program here! 
    var u_keyword=keyword.toUpperCase();
    var msg=original_message.toUpperCase();
    function hash(kwd){
        function helper(remaining, intermediate){
            if(remaining.length===0){
                return intermediate;
            }else if(u_keyword.includes(remaining.charAt(0))){
                return helper(remaining.substring(1,remaining.length),intermediate);
            }else{
                return helper(remaining.substring(1,remaining.length),intermediate+remaining.charAt(0));
            }
        }
        return helper(alphabet, u_keyword);
    }
    var hash_alphabet= hash(keyword);
    function helper(remaining,intermediate){
        if(remaining.length===0){
            return intermediate;
        }else if(alphabet.includes(remaining.charAt(0))) {
            return helper(remaining.substring(1,remaining.length),  intermediate+hash_alphabet.charAt(alphabet.indexOf(remaining.charAt(0)))   );
        }else{
            return helper( remaining.substring(1,remaining.length),intermediate+remaining.charAt(0));
        }
    }
    return helper(msg,"");
}

function mixed_decrypt(keyword, encrypted_message) {
    // Your program here!
        var u_keyword=keyword.toUpperCase();
    var msg=encrypted_message.toUpperCase();
    function hash(kwd){
        function helper(remaining, intermediate){
            if(remaining.length===0){
                return intermediate;
            }else if(u_keyword.includes(remaining.charAt(0))){
                return helper(remaining.substring(1,remaining.length),intermediate);
            }else{
                return helper(remaining.substring(1,remaining.length),intermediate+remaining.charAt(0));
            }
        }
        return helper(alphabet, u_keyword);
    }
    var hash_alphabet= hash(keyword);
    function helper(remaining,intermediate){
        if(remaining.length===0){
            return intermediate;
        }else if(hash_alphabet.includes(remaining.charAt(0))) {
            return helper(remaining.substring(1,remaining.length),  intermediate+alphabet.charAt(hash_alphabet.indexOf(remaining.charAt(0)))   );
        }else{
            return helper( remaining.substring(1,remaining.length),intermediate+remaining.charAt(0));
        }
    }
    return helper(msg,"");
}
// Test your functions
display(mixed_encrypt("zebras", "flee at once. we are discovered!"));
display(mixed_decrypt("zebras", mixed_encrypt("zebras", "flee at once. we are discovered!")));


// Task 2
function zip(lst1, lst2){
    if(is_empty_list(lst1)){
        return lst1;
    }else{
        return pair(list(head(lst1),head(lst2)),zip(tail(lst1),tail(lst2)));
    }
}
//zip takes in list(a1,a2,a3,...) and list(b1,b2,b3,...) , and return list(list(a1,b1),list(a2,b2),...)
function search(target,target_value){
    if(is_empty_list(target_value)){
        return "false";
    }else if(equal(target,head(head(target_value)))){
        return head(tail(head(target_value)));
    }else{
        return search(target,tail(target_value));
    }
}
//search for a_k in zipped list and return b_k if found and false otherwise
function l_reverse(target_value){
    return map(function(lst){return list(head(tail(lst)),head(lst));},target_value);
}
function lst_to_string(lst){
    if(is_empty_list(lst)){
        return "";
    }else{
        return head(lst)+lst_to_string(tail(lst));
    }
}

//to make zipped list become list(list(b1,a1),list(b2,a2),...) so that we can use it to decrypt
function create_substitution_cipher_encrypt(func_get_charmap) {
    return function(spec,msg){//to make the format consistent with caesar and mixed...spec can be of any type
        var hash_list=func_get_charmap(spec);//This should create a zipped list...for encryption
        function encrypt_char(char){
            if(search(char,hash_list)==="false"){
                return char;
            }else{
                return search(char, hash_list);
            }
        }
        return lst_to_string(map(encrypt_char,string_to_list(msg.toUpperCase())));
    };
}
function create_substitution_cipher_decrypt(func_get_charmap){
    return function(spec,msg){//to make the format consistent with caesar and mixed...spec can be of any type
        var hash_list=func_get_charmap(spec);//This should create a zipped list...for encryption
        function decrypt_char(char){
            var inv_hash_list=l_reverse(hash_list);
            if(search(char,inv_hash_list)==="false"){
                return char;
            }else{
                return search(char, inv_hash_list);
            }
        }
        return lst_to_string(map(decrypt_char,string_to_list(msg.toUpperCase())));
    };
}





var l_alphabet=string_to_list(alphabet); 
function unit_hash(lst){
    return reverse(pair(head(lst),reverse(tail(lst))));
}
function hash(time, lst){
    return time===0 ? lst : hash(time-1, unit_hash(lst));
}
//create a list of alphabet
var s1=function(spec){//It should take in a spec, and return a zipped list according to this spec value and the type of crypt itself
    return zip(l_alphabet,hash(spec,l_alphabet));
};
var caesar_encrypt = create_substitution_cipher_encrypt(s1);
var caesar_decrypt = create_substitution_cipher_decrypt(s1);
var s2=function(spec){
     function hash(kwd){
        var u_keyword=kwd.toUpperCase();
        function helper(remaining, intermediate){
            if(remaining.length===0){
                return intermediate;
            }else if(u_keyword.includes(remaining.charAt(0))){
                return helper(remaining.substring(1,remaining.length),intermediate);
            }else{
                return helper(remaining.substring(1,remaining.length),intermediate+remaining.charAt(0));
            }
        }
        return helper(alphabet, u_keyword);
    }
    var ref_lst=string_to_list(hash(spec));
    return zip(l_alphabet,ref_lst);
};
// Alternate definitions for mixed_encrypt and mixed_decrypt

var mixed_encrypt = create_substitution_cipher_encrypt(s2);
var mixed_decrypt = create_substitution_cipher_decrypt(s2);
