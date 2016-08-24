function biggie_size(order){
	return order+4;
}

function unbiggie_size(order){
	return order-4;
}

function is_biggie_size(order){
	if(order<=8 && order >=5)
	{
	return true;
	}
	else
	{
	return false;
	}
	//return order <= 8 && order >= 5;
}

function combo_price(order){
	var biggie=is_biggie_size(order)?0.5:0;
	var num_patty=order%4===0? 4: order%4;
	return biggie+num_patty*1.17;
	//return 1.17*((combo-1)%4+1)+0.5*(combo>4);
}

function empty_order(){
	return 0;
}

function add_to_order(old_order, combo)
{
	return old_order*10+combo;
}

function last_combo(order){
	return order%10;
}

function other_combos(order)
{
	//return (order-last_combo(order))/10;
	return Math.floor(order/10);
}