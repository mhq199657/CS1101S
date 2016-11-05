//Task 1
function stream_constant(n){
	return pair(n,function(){return stream_constant(n);});
}
function regenerate_truncated_whisper(tw) {
	function differences(lst){
		if(length(lst)===1){
			return [];
		}else{
			return pair(head(tail(lst))-head(lst),differences(tail(lst)));
		}
	}
	function fold_stream(stream,init){
		return pair(init, function(){return fold_stream(stream_tail(stream),init+head(stream));});
	}
	if(length(tw)===1){
		return stream_constant(head(tw));
	}else{
		return fold_stream(regenerate_truncated_whisper(differences(tw)),head(tw));
	}
}
 display(eval_stream(regenerate_truncated_whisper(list(9, 6, -5, -18, -27)), 9));
// [9, [6, [-5, [-18, [-27, [-26, [-9, [30, [97, []]]]]]]]]]

// Task 2



	function split_stream(s1,s2){//Total stream length 1 or list(val1,val2,...)
		if(is_empty_list(s2)||!equal(head(s2),false)){
			return list(s1,s2);
		}else{
			return split_stream(stream_append(s1,list_to_stream(list(false))),stream_tail(s2));
		}
	}

	function stream_length(s){
		if(is_empty_list(s)){
			return 0;
		}else{
			return 1+stream_length(stream_tail(s));
		}
	}
	function stream_last(s){
		return stream_ref(s,stream_length(s)-1);
	}
	function interpolate_stream(s){
		if(stream_length(s)<=2){//no false in between
			return s;
		}else{
			var l = stream_length(s);
			var last = stream_last(s);
			var new_head = head(s)+(last-head(s))/(l-1);
			return pair(head(s),
					function(){return interpolate_stream(pair(new_head,function(){return stream_tail(stream_tail(s));}));}
					);
		}
	}

	function split(s){
	    var sp = split_stream(list_to_stream(list(head(s))),stream_tail(s));

	    if(is_empty_list(head(tail(sp)))){
	        return pair(stream_filter(function(x){return !equal(x,false);},head(sp)),head(tail(sp)));
	    }else{

	        return list(interpolate_stream(stream_append(head(sp),list_to_stream(list(head(head(tail(sp))))))),head(tail(sp)));
	    }
	}	
	function regenerate(known,unknown){
	    var h = is_empty_list(known)?head(unknown):head(known);
	    if(is_empty_list(unknown)){
	        var t = regenerate_truncated_whisper(stream_to_list(known));
	        return pair(h,function(){return stream_tail(t);});
	    }else{
	        var s=split(unknown);
	        var r = !is_empty_list(tail(s))?head(tail(s)):[];
	        if(is_empty_list(head(s))||is_empty_list(known)){
                var r1= pair(h, function(){return stream_tail(regenerate(stream_append(known,head(s)),r));});

	            return pair(h, function(){return stream_tail(regenerate(stream_append(known,head(s)),r));});
	        }else{
	            return pair(h,function(){return stream_tail(regenerate(stream_append(known,stream_tail(head(s))),r));});
	        }
	    }

	}
	function regenerate_corrupted_whisper(s){
	    return regenerate([],s);
	}

var corrupted_whisper = list_to_stream(list(4, false, 6, false, false, false,
 -2, false, -2.5, false, false));
 eval_stream(regenerate([],corrupted_whisper),20);


// Task 3
function to_fun(s){
	function dispatch(x){
		if(x<=0){
			return head(s);
		}else{
			return (to_fun(stream_tail(s)))(x-1);
		}
	}
	return dispatch;
}

function f_tail(f){
	return function(x){
		return f(x+1);
	};
}

function f_to_stream(f){
	return pair(f(0),function(){return f_to_stream(f_tail(f));});
}

function int(x){
	return Math.round(x);
}

function sum(f,a,b){
	var m = 0.5*(a+b);
	if(b-a<0.01){
		return (b-a)*f(int(m));
	}else{
		return sum(f,a,m)+sum(f,m,b);
	}
}

function smooth(f,r){
	function dispatch(x){
		return sum(f,(x-r),(x+r))/(2*r);
	}
	return dispatch;
}

function smooth_regenerated_whisper(s,r,i){
	if(i===0){
		return s;
	}else{
		return smooth_regenerated_whisper(f_to_stream(smooth(to_fun(s),r)),r,i-1);
	}
}
 display(eval_stream(smooth_regenerated_whisper(regenerate_truncated_whisper(list(4, 7, 2, 5, 8)), 1, 1), 10));
//[4.75, [5, [4, [5, [0, [-43, [-180, [-491, [-1080, [-2075, []]]]]]]]]]]

// display(eval_stream(smooth_regenerated_whisper(regenerate_truncated_whisper(list(4, 7, 2, 5, 8)), 1, 2), 10));
//[4.8125, [4.6875, [4.5, [3.5, [-9.5, [-66.5, [-223.5, [-560.5, [-1181.5, [-2214.5, []]]]]]]]]]]

// display(eval_stream(smooth_regenerated_whisper(regenerate_truncated_whisper(list(4, 7, 2, 5, 8)), 1.5, 2), 4));
//[4.777777777777778, [4.666666666666667, [4.666666666666667, [2.333333333333334, []]]]]
