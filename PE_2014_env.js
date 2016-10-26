//Predefined for question 2
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

//Predefined for question 3
function Matrix(elems,num_rows,num_cols){
	this.elems = elems;
	this.num_rows = num_rows;
	this.num_cols = num_cols;
}
Matrix.prototype.get_all_elems = function(){
	return this.elems;
};