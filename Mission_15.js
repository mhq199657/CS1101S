// Task 1
function snare_drum(note, duration) {
    /* your answer here */
    function noise(duration) {
        return make_sourcesound(function(x) {
            if (x >= duration) {
                return 0;
            } else {
                return Math.random() * 2 - 1;
            }
        }, duration);
    }
    var sound_noise=sourcesound_to_sound(noise(duration));
    return (adsr(0.005,duration>=0.5?0.495:duration-0.005,0,0))(sound_noise);
}

function bass_drum(note, duration) {
    /* your answer here */
    var n67=sine_sound(67,duration);
    var n71=sine_sound(71,duration);
    var n73=sine_sound(73,duration);
    var n79=sine_sound(79,duration);
    var n83=sine_sound(83,duration);
    var n89=sine_sound(89,duration);
    var ad_envelope=adsr(0.005,duration>=0.5?0.495:duration-0.005,0,0);
    return simultaneously(list(ad_envelope(n67),ad_envelope(n71),ad_envelope(n73),ad_envelope(n79),ad_envelope(n83),ad_envelope(n89)));
    
}

function mute(note, duration) {
    /* your answer here */
    function silence(duration){
        return make_sourcesound(function(x){
            return 0;
        },duration);
    }
    return sourcesound_to_sound(silence(duration));
}

// play(snare_drum(72, 2));
// play(bass_drum(60, 2));
// play(consecutively(list(snare_drum(72, 2), mute(0, 1), bass_drum(60, 2))));


// Task 2
function simplify_rhythm(rhythm) {
    /* your answer here */
    
    function concat_n(n,s){
        var ss=simplify_rhythm(s);
        return n===1?""+ss : ss+ concat_n(n-1,ss);
    }
    function is_rhythm_pair(r){
        return is_pair(r)&&is_number(head(r));
    }
    if(is_empty_list(rhythm)){
        return "";
    }else if(is_string(rhythm)){
        return ""+rhythm;
    }else if(is_rhythm_pair(rhythm)){
        return concat_n(head(rhythm),tail(rhythm));
    }else{
        return ""+simplify_rhythm(head(rhythm))+simplify_rhythm(tail(rhythm));
    }
}

// test
 var my_rhythm = pair(3, list(pair(2, "1201"), "13013103"));
   display(simplify_rhythm(my_rhythm)); 


// Task 3
function percussion(distance, list_of_sounds, rhythm) {
    /* your answer here */
    var l = length(string_to_list_of_numbers(rhythm));
    var lst=map(function(x){return list_ref(list_of_sounds,x);},string_to_list_of_numbers(rhythm));
    function zip(lst1,lst2){
        if(is_empty_list(lst1)){
            return [];
        }else{
            return pair(pair(head(lst1),head(lst2)),zip(tail(lst1),tail(lst2)));
        }
    }
    var ref_lst=zip(enum_list(0,l-1),lst);//num of silence
    function build_step(p){
        var num=head(p);
        var sound=tail(p);
        return consecutively(list(mute(100,distance*num),sound,mute(100,distance*(l-num))));
    }
    var final_lst=map(build_step,ref_lst);
    return simultaneously(final_lst);
}

// test
/*
 var my_mute = mute(60, 2);
   var my_snare_drum = snare_drum(70, 2);
   var my_bass_drum = bass_drum(80, 2);
   var my_bell = bell(72, 2);
   play(percussion(0.5, list(my_mute, my_snare_drum, my_bass_drum, my_bell), "1210310")); 
*/

// Task 4
function pentatonic_scale(note, number_of_notes) {
    /* your answer here */
    var lst=list(2,3,2,2,3);
    function helper(index,intermediate){
        if(index>number_of_notes){
            return reverse(intermediate);
        }else{
            return helper(index+1,pair(head(intermediate)+list_ref(lst,index%5),intermediate));
        }
    }
    return helper(2,pair(note,[]));
}
// test
/*
 var sample = pentatonic_scale(60, 10);
   play(consecutively(map(function (note) {
       return trombone(note, 0.5);
   }, sample))); 
*/


// Task 5
function play_matrix(distance, list_of_sounds) {
    /* your answer here */
    var t = distance*1000;
    play_concurrently(head(list_of_sounds));
    return setTimeout(function(){return play_matrix(distance,tail(list_of_sounds));},distance*1000);
}

function stop_matrix() {
    /* your answer here */
    clearAllTimeout();
}

 var scales = pentatonic_scale(60, 16);
   var sounds = map(function (n) { return piano(n, 1); }, scales);
   play_matrix(0.5, sounds); 