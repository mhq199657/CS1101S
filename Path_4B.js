//Recursive step
function bunny_steps(steps) {
    if (steps < 0) {
        return 0;
    } else if (steps === 0) {
        return 1;
    } else {
        return bunny_steps(steps-1)+bunny_steps(steps-2)+bunny_steps(steps-3);
    }
}

//Order of growth: E

//Constraints
function bunny_steps(steps) { // Use this as a guide to program wet_steps
    if (steps < 0) {
        return 0;
    } else if (steps === 0) {
        return 1;
    } else {
        return bunny_steps(steps - 1) + bunny_steps(steps - 2) + bunny_steps(steps - 3);
    }
}

function wet_steps(steps, wet){
    if(steps<0 || steps===wet){
        return 0;
    }else if (steps===0){
        return 1;
    }else{
        return wet_steps(steps-1,wet)+wet_steps(steps-2,wet)+wet_steps(steps-3,wet);
    }
}

//super bunny
function super_steps(amount) {
    function cs(amount,step) {
        if (amount === 0) {
            return 1;
        } else if (amount < 0 ||step>amount ) {
            return 0;
        } else {
            return cs(amount,
                      step+1) + // Take the next coin type
                   cs(amount - step,
                      step); // Take the current coin type
        }
    }

    // Reminder: You can now jump ANY number of steps (not just 1, 2 or 3)!

  
    return cs(amount, 1);
}
