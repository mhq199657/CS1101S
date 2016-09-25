// Task 1

// Function type: Number -> Pair(Number, Number)
// where input is between 0 - 10 inclusive, where 0 - 9 represent the digits
// and 10 represents #
function get_dtmf_frequencies(digit) {
    // your solution goes here
    var l_f=list(697,770,852);
    var h_f=list(1209,1366,1477);
    if(equal(digit,0)){
        return pair(941,1366);
    }else if(equal(digit,"#")){
        return pair(941,1477);
    }else if(equal(digit,"*")){
        return pair(941,1209);
    }else{
        var index_l=Math.floor((digit-1)/3);
        var index_h=(digit-1)%3;
        return pair(list_ref(l_f,index_l),list_ref(h_f,index_h));
    }
}

// Task 2
function create_dtmf_tone(frequency_pair) {
    // your solution goes here
    var l_sound=sine_sound(head(frequency_pair),0.5);
    var h_sound=sine_sound(tail(frequency_pair),0.5);
    return simultaneously(list(l_sound,h_sound));
}

// Task 3
function dial(list_of_digits) {
    var list_of_frequency_pairs=map(get_dtmf_frequencies,list_of_digits);
    var list_of_tones=map(create_dtmf_tone,list_of_frequency_pairs);
    function op(tone,a_applied_to_the_rest){
        return append(list(tone,silence(0.1)),a_applied_to_the_rest); 
    }
    var final_list= accumulate(op,list(silence(0)),list_of_tones);
    return consecutively(final_list);
}

// Test
// play(dial(list(6,2,3,5,8,5,7,7)));

// Task 4

function dial_all(list_of_numbers) {
    // your solution goes here
    var end=create_dtmf_tone(get_dtmf_frequencies("#"));
    var DARTH=list(1,8,0,0,5,2,1,1,9,8,0);
    var filtered_list=filter(function(x){return !equal(x,DARTH);},list_of_numbers);
    function op(number, a_applied_to_the_rest){
        return append(list(dial(number),end,silence(0.1)),a_applied_to_the_rest);
    }
    var final_dial=accumulate(op,list(silence(0)),filtered_list);
    return consecutively(final_dial);
}

// Test
 play(dial_all(
  list(
      list(1,8,0,0,5,2,1,1,9,8,0),
      list(6,2,3,5,8,5,7,7),
      list(0,0,8,6,1,3,7,7,0,9,5,0,0,6,1))
  ));