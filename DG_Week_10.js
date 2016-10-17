var theatre_play = {
	title: "TITLE",
	number_of_spectators :10000,
	venue: "",
	number_of_actors: 10
};

var theatre_play_1= {};
theatre_play_1.title = "TITLE";
theatre_play_1.number_of_specators = 10000;
theatre_play_1.venue = "";
theatre_play_1.number_of_actors = 10;

var theatre_play_2 = {};
//DIY using square bracket notation

function Person(name){
	this.name = name;
	this.mood = "happy";
	this.introduce_self = function(){
		display("hello, my name is " + this.name + " and my mood is " + this.mood);
	};
}

function Student(name, exam_score) {
	Person.call(this, name);
	this.exam_score = exam_score;
	this.module_grade = this.exam_score < 50 ? "C" : this.exam_score <= 75 ? "B" : "A";
	this.mood = this.module_grade === "C"
				? "still happy because I can S/U this module"
				: "happy";
}
Student.Inherits(Person);

var harambe = new Student("Harambe",45);
display("Name:"+harambe.name);
display("Mood:"+harambe.mood);
display("Exam score:"+harambe.exam_score);
display("Module grade:"+harambe.module_grade);
harambe.introduce_self();
harambe.exam_score = 60;
display("Name:"+harambe.name);
display("Mood:"+harambe.mood);
display("Exam score:"+harambe.exam_score);
display("Module grade:"+harambe.module_grade);
harambe.introduce_self();

Student.prototype.update_score = function(score){
	this.exam_score = score;
	this.module_grade = this.exam_score < 50 ? "C" : this.exam_score <= 75 ? "B" : "A";
	this.mood = this.module_grade === "C"
				? "still happy because I can S/U this module"
				: "happy";
};
harambe.update_score(60);
display("Name:"+harambe.name);
display("Mood:"+harambe.mood);
display("Exam score:"+harambe.exam_score);
display("Module grade:"+harambe.module_grade);
harambe.introduce_self();

Student.introduce_self = function(){
	display("hello, my name is " + this.name + " and my mood is " + this.mood);
	display("I am also a student!");
};

harambe.introduce_self();

var flip = (function(times){
	return function(){
	    if(times%2===0){
	        times = times +1;
	        return 1;
	    }else{
	        times = times +1;
	        return 0;
	    }
	};
})(0);

function Flip(){
	this.times = 0;
}
Flip.prototype.flip = function(){
	this.times = this.times+1;
	return this.times%2;
}

var flip1 = new Flip();
var flip2 = new Flip();
flap1;
//1
flap2;
/*
function flap2() {
    [body omitted]
}*/
flap3;
//[object Object]
flap4;
/*
function flap4() {
    [body omitted]
}
*/
flap1();
//e.apply is not a function
flap2();
//0
flap3();
//e.apply is not a function
flap4();
//[object Object]
flap1;
//1
flap3();
// e.apply is not a function
flap2();
//1