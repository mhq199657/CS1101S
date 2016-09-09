// Task 1
// (a)
// define constructor and selectors
function signed_message(message,signature){
    return pair(message,signature);
}
var get_message=head;
var get_signature=tail;

// (b)
function encrypt_and_sign(msg, sender_private_key, recipient_public_key) {
    var encrypted_msg=RSA_encrypt(msg,recipient_public_key);
    return signed_message(encrypted_msg,head(RSA_convert_list(list(compress(encrypted_msg)),sender_private_key)));
}

// Test your function
var result2 = encrypt_and_sign("Test message from user 1 to user 2", test_private_key1, test_public_key2);
display(result2);
// Result should be
// pair(list(296342791, 45501589, 263575681, 219298391, 4609203, 331301818, 178930017, 242685109, 1345058), 254363563)

// (c)
function authenticate_and_decrypt(signed_message, sender_public_key, recipient_private_key) {
    // "Your program here!"
    var decrypted_msg=RSA_unconvert_list(get_message(signed_message),recipient_private_key);
    var authetic_sig=parseInt(compress(get_message(signed_message)));
    var this_sig=head(RSA_unconvert_list(list(get_signature(signed_message)),sender_public_key));
    if(authetic_sig===this_sig){
        return intlist_to_string(decrypted_msg);
    }else{
        return "false";
    }
}

display(authenticate_and_decrypt(result2, test_public_key1, test_private_key2));
// Result should be
// "Test message from user 1 to user 2  "
/*
// Task 2
// Your program here!*/
var mystery_signed_message=signed_message(received_mystery_message,received_mystery_signature);
var this_message=RSA_decrypt(received_mystery_message,Darth_private_key);
display("The message is: "+this_message);
function identify_sender(suspects,msg,recipient_private_key){
    if(is_empty_list(suspects)){
        return "Suspect not found!";
    }else if("false"===authenticate_and_decrypt(msg,tail(head(suspects)),recipient_private_key)){
        return identify_sender(tail(suspects),msg,recipient_private_key);
    }else{
        return head(head(suspects));
    }
}

display("The sender is "+identify_sender(suspects,mystery_signed_message,
                Darth_private_key));