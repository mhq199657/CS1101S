function weighted_sum(digits,weights){
	if(is_empty_list(digits)){
		return 0;
	}else{
		return head(digits)*head(weights)+weighted_sum(tail(digits),tail(weights));
	}
}

function discard_element(xs,pos){
    if(is_empty_list(xs)){
        return [];
    }else if(pos===0){
        return tail(xs);
    }else{
        return pair(head(xs),discard_element(tail(xs),pos-1));
    }
}

function id_to_matric(id){
    function hash(n){
        if(n===0){
            return "Y";
        }else if(n===1){
            return "X";
        }else if(n===2){
            return "W";
        }else if(n===3){
            return "U";
        }else if(n===4){
            return "R";
        }else if(n===5){
            return "N";
        }else if(n===6){
            return "M";
        }else if(n===7){
            return "L";
        }else if(n===8){
            return "J";
        }else if(n===9){
            return "H";
        }else if(n===10){
            return "E";
        }else if(n===11){
            return "A";
        }else{ //(n===12){
            return "B";
        }
    }
    var identifier = head(id);
    if(equal(identifier,"u")){
        var t = tail(id);
        var p = discard_element(t,2);
        var s = weighted_sum(p,list(0,1,3,1,2,7));
        var h = hash(s%13);
        return pair("U",append(t,list(h)));
    }else{//"a"
        var t1 = tail(id);
        var s1 = weighted_sum(t1,list(1,1,1,1,1,1,1));
        var h1 = hash(s1%13);
        return pair("A",append(t1,list(h1)));
    }
}
//
function CuboidObject(l,w,h,m){
	this.l =l;
	this.w =w;
	this.h =h;
	this.m =m;
}
CuboidObject.prototype.get_length = function(){
	return this.l;
};
CuboidObject.prototype.get_width = function(){
	return this.w;
};
CuboidObject.prototype.get_height = function(){
	return this.h;
};
CuboidObject.prototype.get_mass = function(){
	return this.m;
};
CuboidObject.prototype.set_length = function(n){
	this.l=n;
};
CuboidObject.prototype.set_width = function(n){
	this.w=n;
};
CuboidObject.prototype.set_height = function(n){
	this.h=n;
};
CuboidObject.prototype.set_mass = function(n){
	this.m=n;
};
CuboidObject.prototype.get_volume = function(n){
	return this.l*this.w*this.h;
};
//
function Book(t,l,w,h,m){
	CuboidObject.call(this,l,w,h,m);
	this.title = t;
}
Book.Inherits(CuboidObject);
Book.prototype.get_title = function(){
	return this.title;
};
Book.prototype.set_title = function(n) {
	this.title = n;
};

function books_total_height(lst){
	var l = map(function(b){return b.get_height();},lst);
	return accumulate(function(a,b){return a+b;},0,l);
}
function books_total_mass(lst){
	var l = map(function(b){return b.get_mass();},lst);
	return accumulate(function(a,b){return a+b;},0,l);
}
function package_length_width(lst){
	var l = map(function(b){return b.get_length();},lst);
	var max_l = accumulate(function(a,b){return Math.max(a,b);},0,l);
	var w = map(function(b){return b.get_width();},lst);
	var max_w = accumulate(function(a,b){return Math.max(a,b);},0,w);
	return pair(max_l,max_w);
}

function Package(books){
	this.books = books;
}
Package.Inherits(CuboidObject);
Package.prototype.get_books = function(){
	return this.books;
};
Package.prototype.get_length = function(){
	return head(package_length_width(this.books));
};
Package.prototype.get_width = function(){
	return tail(package_length_width(this.books));
};
Package.prototype.get_height = function(){
	return books_total_height(this.books);
};
Package.prototype.get_mass = function(){
	return books_total_mass(this.books);
};
Package.prototype.get_billable_mass = function(){
	var m1 = this.get_mass();
	var m2 = 500*this.get_length()*this.get_width()*this.get_height();
	return Math.max(m1,m2);
};

Package.prototype.get_shipping_charge = function(){
	var rounded_mass = 1+Math.floor(this.get_billable_mass());
	if(rounded_mass===1){
		return 1;
	}else if(rounded_mass===2){
		return 1.8;
	}else if(rounded_mass===3){
		return 2.4;
	}else{
		return 2.4 + 0.4*(rounded_mass-3);
	}
};

function improved_package_length_width(books){
	var ll = map(function(b){return b.get_length();},books);
	var lw = map(function(b){return b.get_width();},books);
	function zip(l1,l2){
		if(is_empty_list(l1)){
			return [];
		}else{
			var i1 = head(l1);
			var j1 = head(l2);
			return pair((i1>j1?pair(i1,j1):pair(j1,i1)),zip(tail(l1),tail(l2))); 
		}
	}
	var p = zip(ll,lw);
	var max_length = accumulate(function(p,b){return Math.max(head(p),b);},0,p);
	var max_width =  accumulate(function(p,b){return Math.max(tail(p),b);},0,p);
	return pair(max_length,max_width);
}

function Matrix(elems,num_rows,num_cols){
	this.elems = elems;
	this.num_rows = num_rows;
	this.num_cols = num_cols;
}
Matrix.prototype.get_all_elems = function(){
	return this.elems;
};
Matrix.prototype.get_elem= function(row,col){
	var myrow = list_ref(this.elems,row-1);
	return list_ref(myrow,col-1);
};
Matrix.prototype.set_elem = function(row,col,new_val){
	var myrow = list_ref(this.elems,row-1);
	function helper(col_to_go,row){
		if(col_to_go===0){
			set_head(row, new_val);
		}else{
		    //display(row);
			return helper(col_to_go-1,tail(row));
		}
	}
	helper(col-1,myrow);
};

Matrix.prototype.scale = function(k){
	var e = this.elems;
	var t = accumulate(function(a,b){return pair(map(function(x){return k*x;},a),b);},[],e);
	return new Matrix(t,this.num_rows,this.num_cols);
};
Matrix.prototype.transpose= function(){
	function zip(list_of_list){
		if(is_empty_list(list_of_list)){
			return [];
		}else if(is_empty_list(head(list_of_list))){
			return [];
		}else{
			var list_of_heads = map(head,list_of_list);
			return pair(list_of_heads,zip(map(tail,list_of_list)));
		}
	}
	return new Matrix(zip(this.elems),this.num_cols,this.num_rows);
};

Matrix.prototype.multiply = function(mat2){
    function dot_product(lst1,lst2){
    	return is_empty_list(lst1)?0: head(lst1)*head(lst2)+dot_product(tail(lst1),tail(lst2));
    }
    function get_result_r(r,c){
    	return dot_product(list_ref(this.elems,r-1),list_ref(mat2.transpose().elems,c-1));
    }
    var MAX_COL= mat2.num_cols;
    function make_r_result(r){
    	function helper(c){
    		if(c>MAX_COL){
    			return [];
    		}else{
    			return pair(get_result_r.call(this,r,c),helper.call(this,c+1));
    		}
    	}
    	return helper.call(this,1);
    }
    var MAX_ROW = this.num_rows;
    function make_result(){
    	function helper(r){
    		if(r>MAX_ROW){
    			return [];
    		}else{
    			return pair(make_r_result.call(this,r),helper.call(this,r+1));
    		}
    	}
    	return helper.call(this,1);
    }
    var rll = make_result.call(this);
    return new Matrix(rll,MAX_ROW,MAX_COL);
};