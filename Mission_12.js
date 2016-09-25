// Task 1
function noise(duration) {
    return make_sourcesound(function(x) {
        if (x >= duration) {
            return 0;
        } else {
            return Math.random() * 2 - 1;
        }
    }, duration);
}

function play_sourcesound(sourcesound) {
    /* your anwser here */
     return play(sourcesound_to_sound(sourcesound));
}

var r = noise(1);
//play_sourcesound(r);


// Task 2
function cut_sourcesound(sourcesound, duration) {
    /* your answer here */
    var original_wave=get_wave(sourcesound);//f :n->n
    var original_duration=get_duration(sourcesound);
    return make_sourcesound(function(x){
                                if(x>=duration){
                                    return 0;
                                }else{
                                    return original_wave(x);
                                }
                            },
                            duration);
}

var c = cut_sourcesound(r, 0.5);
//play_sourcesound(c);


// Task 3
function sine_sound(frequency, duration) {
    /* your answer here */
    var source_sine_wave=make_sourcesound(function(x){
                                            if(x>=duration){
                                                return 0;
                                            }else{
                                                return Math.sin(2*Math.PI*frequency*x);
                                            }
                                        },
                                        duration);
    return sourcesound_to_sound(source_sine_wave);
}

//play(sine_sound(500, 1));


// Task 4
function consecutively(list_of_sounds) {//list(a,b,c)
    function append_sound(s1,s2){
            var source_s1=sound_to_sourcesound(s1);
            var w1=get_wave(source_s1);
            var d1=get_duration(source_s1);
            var source_s2=sound_to_sourcesound(s2);
            var w2=get_wave(source_s2);
            var d2=get_duration(source_s2);
            var appended_sourcesound = make_sourcesound(function(x){
                                                            if(x<d1){
                                                                return w1(x);
                                                            }else if(x<d1+d2){
                                                                return w2(x-d1);
                                                            }else{
                                                                return 0;
                                                            }
                                                        },
                                                        d1+d2);
            return sourcesound_to_sound(appended_sourcesound);
        }
    return accumulate(append_sound,sourcesound_to_sound(make_sourcesound(function(x){return 0;},0)),list_of_sounds);
}

// Create dot, dash and pause sounds first
var dot_sound = sine_sound(500,0.1);
var dash_sound = sine_sound(500,0.2);
var pause_sound = sine_sound(0,0.1);

// Build the signal using consecutively
var s = consecutively(list(dot_sound,pause_sound,dot_sound,pause_sound,dot_sound));
var o = consecutively(list(dash_sound,pause_sound,dash_sound,pause_sound,dash_sound));
var distress_signal = consecutively(list(s,pause_sound,o,pause_sound,s));

// Play distress signal
play(distress_signal);
