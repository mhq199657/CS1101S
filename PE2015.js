function make_2D_zero_array(rows,cols){
	var a = [];
	for(var i = 0; i<rows;i++){
		a[i]=[];
		for(var j = 0; j<cols; j++){
			a[i][j]=0;
		}
	}
	return a;
}

function num_of_live_neighbours(game,n,r,c){
	var top = (r-1)<0?n-1:r-1;
	var bot = (r+1)>n-1?0:r+1;
	var left = (c-1)<0?n-1:c-1;
	var right = (c+1)>n-1?0:c+1;
	var tl = game[top][left];
	var tu = game[top][c];
	var tr = game[top][right];
	var ml = game[r][left];
	var mr = game[r][right];
	var bl = game[bot][left];
	var bm = game[bot][c];
	var br = game[bot][right];
	return tl+tu+tr+ml+mr+bl+bm+br;
}
function next_generation(game,n){
	var next = make_2D_zero_array(n,n);
	var num = 0;
	var now = 0;
	for(var i = 0; i<n ;i++){
		for(var j = 0; j<n; j++){
			num = num_of_live_neighbours(game,n,i,j);
			now = game[i][j];
			if(now === 0){
				if(num===3){
					next[i][j]=1;
				}else{;}
			}else{
				if(num===2||num===3){
					next[i][j]=1;
				}else{
					next[i][j]=0;
				}
			}
		}
	}
	return next;
}

function make_first_line(words,page_width){//List, Num
	function helper(first_line,remaining_words){
		if(is_empty_list(remaining_words)){
			return pair(first_line,[]);
		}else if(first_line.length+1+head(remaining_words).length>page_width){
			return pair(first_line,remaining_words);
		}else{
			return helper(first_line+" "+head(remaining_words),tail(remaining_words));
		}
	}
	if(is_empty_list(words)){
	    return pair("",[]);
	}else{
	    return helper(head(words),tail(words));
	}
}

function make_lines(words,page_width){
	var first_line = make_first_line(words,page_width);

	if(!equal(head(first_line),"")){
		return append(list(head(first_line)),make_lines(tail(first_line),page_width));
	}else{
		return [];
	}
}

function make_pages(lines,page_height){
	if(length(lines)<page_height){
		return lines;
	}else{
		return pair(copy_list_n_items(lines,page_height),make_pages(tail_n_times(lines,page_height),page_height));
	}
}
function is_prefix_of(sub,seq){
	if(length(sub)>length(seq)){
		return false;
	}else if(is_empty_list(sub)){
		return true;
	}else{
		var h1 = head(sub);
		var h2 = head(seq);
		if(equal(h1,h2)){
			return is_prefix_of(tail(sub),tail(seq));
		}else{
			return false;
		}
	}
}

function tail_n_times(lst,times){
	if(times===0){
		return lst;
	}else{
		return tail_n_times(tail(lst),times-1);
	}
}
function copy_list_n_items(lst,n){
	if(n===0){
		return [];
	}else{
		return pair(head(lst),copy_list_n_items(tail(lst),n-1));
	}
}

function page_format(words,page_width,page_height){
	var lines = make_lines(words,page_width);
	return make_pages(lines,page_height);
}





function sublist_replace(new_sub,old_sub,seq){
	function helper(neww,remaining){
		if(length(remaining)<length(old_sub)){
			return append(neww,remaining);
		}else{
			if(is_prefix_of(old_sub,remaining)){
				return helper(append(neww,new_sub),tail_n_times(remaining,length(old_sub)));
			}else{
				return helper(append(neww,list(head(remaining))),tail(remaining));
			}
		}
	}
	return helper([],seq);
}

function is_subseq_at(sub,seq,start_pos){
	var l = sub.length;
	function helper(index){
		if(index===l){
			return true;
		}else{
			if(sub[index]===seq[start_pos+index]){
				return helper(index+1);
			}else{
				return false;
			}
		}
	}
	if(l+start_pos>=seq.length){
		return false;
	}else{
		return helper(0);
	}
}

function subarray_replace(new_sub,old_sub,seq){

	function helper(index){
		if(index>=seq.length){
			;
		}else{
			if(is_subseq_at(old_sub,seq,index)){
				for(var i = 0; i<new_sub.length;i=i+1){
					seq[i+index]=new_sub[i];
				}
				helper(index+old_sub.length);
			}else{
				if(equal(seq[index],undefined)){
					r[index]=seq[index];
				}else{;}
							helper(index+1);
			}
		}
	}
	helper(0);
}