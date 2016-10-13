function Food(name,nutrition,expiry_age){
	this.name= name;
	this.nutrition = nutrition;
	this.expiry_age = expiry_age;
	this.age = 0;
}
Food.prototype.get_name = function(){return this.name;};
Food.prototype.get_age = function(){return this.age;};
Food.prototype.sit_there = function(days){ this.age=this.age+days;};
Food.prototype.eat = function(){return this.age>=this.expiry_age?0:this.nutrition;};
function RipeningFood(name, nutrition, expiry_age, ripe_after){
	Food.call(this,name,nutrition,expiry_age);
	this.ripe_after=ripe_after;
}
RipeningFood.Inherits(Food);
RipeningFood.prototype.sniff_ripeness = function(){return this.age>this.ripe_after;};
RipeningFood.prototype.eat = function() {return this.sniff_ripeness()?Food.prototype.eat.call(this):0;};
var r1 = new RipeningFood("b",15,10,4);

function RefrigeratedFood(name, nutrition, expiry_age){
    Food.call(this,name, nutrition, expiry_age);
}
RefrigeratedFood.Inherits(Food);
RefrigeratedFood.prototype.sit_there = function(days){this.age=this.age+days/2;};


function ClassOfLinearFunctions(coeff){
    this.coeff = coeff;
}
ClassOfLinearFunctions.prototype.fn = function(){
    var coeff = this.coeff;
    return function(x){
        return coeff*x;
    };
};

var f1 = new ClassOfLinearFunctions(1);
(f1.fn())(5);

