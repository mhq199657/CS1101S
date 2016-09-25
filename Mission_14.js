// Task 1
function generate_list_of_note(letter_name, list_of_interval) {
    /* your answer here */
    var starting_note = letter_name_to_midi_note(letter_name);
    function helper(remaining_list,intermediate){
        if(is_empty_list(remaining_list)){
            return reverse(intermediate);
        }else{
            return helper(tail(remaining_list),pair(head(intermediate)+head(remaining_list),intermediate));
        }
    }
    return helper(list_of_interval,pair(starting_note,[]));
}

var major_scale_interval = list(2, 2, 1, 2, 2, 2, 1, -1, -2, -2, -2, -1, -2, -2);
var c_major_scale = generate_list_of_note("C4", major_scale_interval);

display(c_major_scale);

function list_to_sound(list_of_midi_note, duration) {
    var list_of_frequencies=map(midi_note_to_frequency,list_of_midi_note);
    var list_of_notes = map(function(f){return sine_sound(f,duration);},list_of_frequencies);
    return consecutively(list_of_notes);
}

 var c_major_scale_sound = list_to_sound(c_major_scale, 0.4);
// play(c_major_scale_sound);

var harmonic_minor_scale_interval = list(2, 1, 2, 2, 1, 3, 1, -1, -3, -1, -2, -2, -1, -2);

var melodic_minor_scale_interval = list(2, 1, 2, 2, 2, 2, 1, -2, -2, -1, -2, -2, -1, -2);


var c_harmonic_minor_scale = generate_list_of_note("C4",harmonic_minor_scale_interval);
 var c_harmonic_minor_scale_sound = list_to_sound(c_harmonic_minor_scale, 0.4);
// play(c_harmonic_minor_scale_sound);

var c_melodic_minor_scale = generate_list_of_note("C4",melodic_minor_scale_interval);
 var c_melodic_minor_scale_sound = list_to_sound(c_melodic_minor_scale, 0.4);
// play(c_melodic_minor_scale_sound);




// Task 2
var major_arpeggio_interval = list(4, 3, 5, 4, 3, 5);
var minor_arpeggio_interval = list(4, 2, 6, 4, 2, 6);
function generate_arpeggio(letter_name, list_of_interval) {
    return generate_list_of_note(letter_name, list_of_interval);
}

function arpeggiator_up(arpeggio, duration_each) {//arpeggio is a list of frequencies
    /* your answer here */
    function first_k(lst,k){
        if(k===1){
            return pair(head(lst),[]);
        }else{
            return pair(head(lst),first_k(tail(lst),k-1));
        }
    }
    function helper(remaining_arpeggio,intermediate){
        if(length(remaining_arpeggio)<4){
            return intermediate;
        }else{
            return helper(tail(remaining_arpeggio),append(intermediate,first_k(remaining_arpeggio,4)));
        }
    }
    var list_of_f=helper(arpeggio,[]);
    return list_to_sound(list_of_f,duration_each);

}
// test
// play(arpeggiator_up(generate_arpeggio("C4", major_arpeggio_interval), 0.1));



// Task 3
function exponential_decay(decay_time) {
    return function(t) {
        /* your answer here */
        return Math.pow(2,(-4)*t/decay_time);
    };
}

// test
 display((exponential_decay(4))(1));
// the result should be 0.5


// Task 4
function adsr(attack_time, decay_time, sustain_level, release_time) {
    return function(sound) {
        /* your solution here */
        var s_sound=sound_to_sourcesound(sound);
        var d=get_duration(s_sound);
        var w=get_wave(s_sound);
        var processed = make_sourcesound( function(x){
                                            if(x<attack_time){
                                                return x/attack_time*w(x);
                                            }else if(x< attack_time+decay_time){
                                                return (sustain_level+(1-sustain_level)*(exponential_decay(decay_time))(x-attack_time))*w(x);
                                            }else if(x<d-release_time){
                                                return sustain_level*w(x);
                                            }else if(x<d){
                                                return sustain_level*(exponential_decay(release_time))(x-d+release_time)*w(x);
                                            }else{
                                                return 0;
                                            }
                                            
        },
        d);
        return sourcesound_to_sound(processed);
    };
}

//var sample1 = (adsr(0, 0.2, 0.1, 0.5))(sine_sound(800, 1));
//var sample2 = (adsr(0.4, 0, 1, 0.8))(sine_sound(400, 2));
//var sample3 = (adsr(0.01, 0.5, 0.5, 0.5))(sine_sound(400, 2));
//var sample4 = (adsr(0.6, 0.2, 0, 0))(sine_sound(800, 1));

// play(sample4);



// Task 5
function stacking_adsr(waveform, base_frequency, duration, list_of_envelope) {
   /* your answer here */
   var n = length(list_of_envelope);
   var list_of_sound = map(function(multiple){return waveform(base_frequency*multiple,duration);} ,enum_list(1,n));
   

   function make_adsr(list_of_sound,list_of_envelope){
       if(is_empty_list(list_of_sound)){
           return [];
       }else{
           return pair((head(list_of_envelope))(head(list_of_sound)),make_adsr(tail(list_of_sound),tail(list_of_envelope)));
       }
   }
   var list_of_processed_sound=make_adsr(list_of_sound,list_of_envelope);
   return simultaneously(list_of_processed_sound);
}

 var sample_bell = stacking_adsr(square_sound, 500, 2,
                                   list(adsr(0, 1.2, 0, 0),
                                        adsr(0, 1.3236, 0, 0),
                                        adsr(0, 1.5236, 0, 0),
                                        adsr(0, 1.8142, 0, 0)));
/*
 var sample_trombone = stacking_adsr(square_sound, 250, 2,
                                    list(adsr(0.4, 0, 1, 0.2),
                                         adsr(0.6472, 1.2, 0, 0)));

 var sample_piano = stacking_adsr(triangle_sound, 250, 2,
                                    list(adsr(0, 1.03, 0, 0),
                                         adsr(0, 0.64, 0, 0),
                                         adsr(0, 0.4, 0, 0)));

 var sample_violin = stacking_adsr(sawtooth_sound, 500, 2,
                                    list(adsr(0.7, 0, 1, 0.3),
                                         adsr(0.7, 0, 1, 0.3),
                                         adsr(0.9, 0, 1, 0.3),
                                         adsr(0.9, 0, 1, 0.3)));

 var sample_cello = stacking_adsr(square_sound, 80, 2,
                                 list(adsr(0.1, 0, 1, 0.2),
                                      adsr(0.1, 0, 1, 0.3),
                                      adsr(0, 0, 0.2, 0.3)));
                                      */
play(sample_bell);