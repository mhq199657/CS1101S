//Debugging
function fact(n){
    return n===0? 1: n*fact(n-1);
}
function integer_from(n){
    return pair(n,function(){return integer_from(n+1);});
}
var integers = integer_from(0);
var cosine_series_task_5 = stream_map(function(x){
                                        if(x%2===0){
                                            return ((x/2)%2===0?1:-1)*1/fact(x);
                                        }else{
                                            return 0;
                                        }},
                                        integers);

function scale_stream(c, stream) {
    return stream_map(function(x){
                            return c * x;
                      },
                      stream);
}
//Task 1
function stream_constant(n){
    return pair(n,function(){return stream_constant(n);});
}
function mul_streams(a,b) {
    return pair(head(a) * head(b),
                function() {
                    return mul_streams(stream_tail(a), stream_tail(b));
                });
}
    function fold_stream(op,stream,init){
        return pair(init, function(){return fold_stream(op,stream_tail(stream),op(init,head(stream)));});
    }
    function gp_stream(r){
        return fold_stream(function(x,y){return x*y;},stream_constant(r),1);
    }
function approximate(x0, series) {
    // Your answer here
    return stream_tail(fold_stream(function(x,y){return x+y;},mul_streams(series,gp_stream(x0)),0));
}
//Testing
//eval_stream(approximate(Math.PI,cosine_series_task_5),15);

//Task 2
function greater_approximate(x0, stream_of_series) {
    // Your answer here
    function sum_first(n,stream){
        if(n===0){
            return 0;
        }else{
            return head(stream)+sum_first(n-1,stream_tail(stream));
        }
    }
    function sum_triangle(n,stream_of_series){
        if(n===0){
            return 0;
        }else{
            return sum_first(n,head(stream_of_series))+sum_triangle(n-1,stream_tail(stream_of_series));
        }
    }
    function fun_to_series(fun){
        var non_neg_integers = integer_from(0);
        return stream_map(fun,non_neg_integers);
    }
    return stream_tail(fun_to_series(function(n){return sum_triangle(n,stream_map(function(x){
                                                                                return mul_streams(gp_stream(x0),x);
    },stream_of_series));
    }));
}
//Testing
//var ap = pair(scale_stream(0.5,cosine_series_task_5),function(){return stream_map(function(x){return scale_stream(0.5,x);},ap);});
//eval_stream(greater_approximate(Math.PI,ap),15);
//Task 3
function interleave(stream1, stream2) {
    if(is_empty_list(stream1)){
        return stream2;
    }else{
        return pair(head(stream1),function(){return interleave(stream2,stream_tail(stream1));});

    }
}

function cartesian_product(m,n){
    if(m>n){
        return cartesian_product(1,n+1);
    }else{
        return pair(list(m,n+1-m),function(){return cartesian_product(m+1,n);});
    }
}
function negate_this_series(s){
    return stream_map(function(x){
        var h = list_ref(x,0);
        var t = list_ref(x,1);
        return list(0-h,t);},s);
}
var c = cartesian_product(1,1);
var d = negate_this_series(c);
var e = interleave(c,d);


var all_rationals = pair(0,function(){ return stream_map(function(x){
                                    var h = list_ref(x,0);
                                    var t = list_ref(x,1);
                                    return h/t;
},e);});
/*
first element is 0, then
Go from top right to bottom left for each stroke
1/1  1/2 1/3
2/1  2/2
3/1
and for each number the negative one is after the positive ones
*/
function member(x,xs){
    if(is_empty_list(xs)){
        return [];
    }else if(equal(x,head(xs))){
        return xs;
    }else{
        return member(x,tail(xs));
    }
}
function remove_duplicate(lst){
    if(is_empty_list(lst)){
        return [];
    }else{
        if(is_empty_list(member(head(lst),tail(lst)))){
            return pair(head(lst),remove_duplicate(tail(lst)));
        }else{
            return remove_duplicate(tail(lst));
        }
    }
}
//Task 4
function stream_append_pickle(xs, ys) {
    if (is_empty_list(xs)) {
        return ys();
    } else {
        return pair(head(xs),
                    function() {
                        return stream_append_pickle(stream_tail(xs),
                                                    ys);
                    });
    }
}
function generator(n){
    function helper(x,y,z){
        if(x<0){
            return [];
        }else if(y<0){
            return helper(x-1,n-x+1,0);
        }else{
            return append(list(list(x,y,z)),helper(x,y-1,z+1));
        }
    }
    var ppp = helper(n,0,0); //All x,y,z nonnegative
    var ppn = map(function(lst){return list(list_ref(lst,0),list_ref(lst,1),0-list_ref(lst,2));},ppp);//x,y nonnegative, z nonpositive
    var pnp = map(function(lst){return list(list_ref(lst,0),0-list_ref(lst,1),list_ref(lst,2));},ppp);
    var npp = map(function(lst){return list(0-list_ref(lst,0),list_ref(lst,1),list_ref(lst,2));},ppp);
    var pnn = map(function(lst){return list(list_ref(lst,0),0-list_ref(lst,1),0-list_ref(lst,2));},ppp);
    var npn = map(function(lst){return list(0-list_ref(lst,0),list_ref(lst,1),0-list_ref(lst,2));},ppp);
    var nnp = map(function(lst){return list(0-list_ref(lst,0),0-list_ref(lst,1),list_ref(lst,2));},ppp);
    var nnn = map(function(lst){return list(0-list_ref(lst,0),0-0-list_ref(lst,1),0-list_ref(lst,2));},ppp);
    var t = remove_duplicate(append(append(append(append(append(append(append(ppp,ppn),pnp),npp),pnn),npn),nnp),nnn));
    //display(t);
    return stream_append_pickle(list_to_stream(t),function(){return generator(n+1);});
}

var all_coordinates = generator(0);