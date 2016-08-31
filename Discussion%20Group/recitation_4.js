function make_class(number,units) {
return list(number,units);
}
var get_class_number = head;
function get_class_units(cl) {
return head(tail(cl));
}
function make_units(lecture,tutorial,lab,homework,prep) {
return list(lecture,tutorial,lab,homework,prep);
}
var get_units_lecture = head;
function get_units_tutorial(units) {
return head(tail(units));
}
function get_units_lab(units) {
return head(tail(tail(units)));
}
function get_units_homework(units) {
return head(tail(tail(tail(units))));
}
function get_units_prep(units) {
return head(tail(tail(tail(tail(units)))));
}
function get_class_total_units(cl) {
var units = get_class_units(cl);
return get_units_lecture(units) +
get_units_tutorial(units) +
get_units_lab(units) +
get_units_homework(units) +
get_units_prep(units);
}
function is_same_class(c1,c2) {
return get_class_number(c1) ===
get_class_number(c2);
}
//here we go
function empty_schedule(){
	return [];
}

function add_class(cl,schedule){
	return pair(cl, schedule);
}

function total_scheduled_units(sched){
	if(is_empty_list(sched)){
		return 0;
	else{
		return get_class_total_units(head(sched))+total_scheduled_units(tail(sched));
	}
}

function drop_class(sched, cl){
	if(is_empty_list(sched)){
		return "No such class!";
	}else if (head(sched)===cl){
		return tail(sched);
	}else{
	    return pair(head(sched),drop_class(tail(sched)));

	}
}

function credit_limit(sched, max_credits){
	if(total_scheduled_units(sched)<=max_credits){
		return sched;
	}else
	{
		return credit_limit(tail(sched),max_credit-get_class_total_units(head(sched)));
	}
}