function pascal_triangle(row,column){
	if(column===1 ||column===row|){
		return 1;
	}else{
		return pascal_triangle(row-1,column-1)+pascal_triangle(row-1,column);
	}
}

function f(n){
	return n<3 ? n : return f(n-1)+2*f(n-2)+3*f(n-3);
}

function iter_f(n){
	function helper(index, f_n_1,f_n_2,f_n_3){
		return index>n ? f_n_1 : helper(index+1,f_n_1+2*f_n_2+3*f_n_3 ,f_n_1 ,f_n_2);
	}
	return n<3 ? n : helper(4,3,2,1);
}

