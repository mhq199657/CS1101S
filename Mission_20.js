// Task 1
function make_step_stream(n) {
    function helper(m){
        if(m>n){
            return helper(1);
        }else{
            return pair(m,function(){return helper(m+1);});
        }
    }
    return helper(1);
}

//Task 2
function make_oscillating_stream(n) {
    function helper(m,dir){
        if(dir==="up"){
            if(m>n){
                return m-2<1?helper(1,"down"):helper(m-2,"down");
            }else{
                return pair(m,function(){return helper(m+1,dir);});
            }
        }else{
            if(m<1){
                return m+2>n?helper(1,"up"):helper(m+2,"up");
            }else{
                return pair(m,function(){return helper(m-1,dir);});
            }
        }
    }
    return helper(1,"up");
}

//Task 3
function make_flexible_step_stream(lst) {
    function helper(rlst){
        if(is_empty_list(rlst)){
            return helper(lst);
        }else{
            return pair(head(rlst),function(){return helper(tail(rlst));});
        }
    }
    return helper(lst);
}

function make_flexible_oscillating_stream(lst) {
    return make_flexible_step_stream(append(reverse(tail(reverse(lst))),reverse(tail(lst))));
}


//Task 4
// stream_constant(k) generates an infinite stream of k
function stream_constant(k) {
    return pair(k, function() { return stream_constant(k); });
}
// add_streams sums up two given infinite stream
function add_streams(s1, s2) {
    return pair( head(s1) + head(s2), function() {
        return add_streams( stream_tail(s1), stream_tail(s2));
    });
}

function interleave(stream1, stream2) {
    if(is_empty_list(stream1)){
        return stream2;
    }else{
        return pair(head(stream1),function(){return interleave(stream2,stream_tail(stream1));});

    }
}

//Task 5
function flexible_interleave(list_of_streams) {
    var h = head(list_of_streams);
    var t = tail(list_of_streams);
    if(is_empty_list(h)){
        return flexible_interleave(t);
    }else{
        return pair(head(h),function(){return flexible_interleave(append(t,list(stream_tail(h))));});
    }
}
function count(x,lst){
    return length(filter(function(t){return x===t;},lst));
}
function last(lst){
    return head(reverse(lst));
}
function tagged_golomb(partial){
    var n = last(partial);
    var next = list_ref(partial,n-1)===count(n,partial)?
                            append(partial,list(n+1)):
                            append(partial,list(n));
    return pair(next,function(){return tagged_golomb(next);});
}
var golomb_stream = pair(1,function(){return stream_map(last,tagged_golomb(list(1)));}); // your answer here