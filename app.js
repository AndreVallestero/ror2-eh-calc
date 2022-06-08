'use strict';

var CHARS = {
    'commando': {
        'armor': 0,
        'health': 110,
        'health-lvl': 33
    }, 'huntress': {
        'armor': 0,
        'health': 90,
        'health-lvl': 27
    }, 'mul-t': {
        'armor': 12,
        'health': 200,
        'health-lvl': 60
    }, 'engineer': {
        'armor': 0,
        'health': 130,
        'health-lvl': 39
    }, 'artificer': {
        'armor': 0,
        'health': 110,
        'health-lvl': 33
    }, 'mercenary': {
        'armor': 20,
        'health': 110,
        'health-lvl': 33
    }, 'rex': {
        'armor': 20,
        'health': 130,
        'health-lvl': 39
    }, 'loader': {
        'armor': 20,
        'health': 160,
        'health-lvl': 48
    }, 'acrid': {
        'armor': 20,
        'health': 160,
        'health-lvl': 48
    }, 'bandit': {
        'armor': 0,
        'health': 110,
        'health-lvl': 33
    }, 'captain': {
        'armor': 0,
        'health': 110,
        'health-lvl': 33
    }, 'heretic': {
        'armor': 0,
        'health': 440,
        'health-lvl': 132
    }, 'railgunner': {
        'armor': 0,
        'health': 110,
        'health-lvl': 33
    }, 'void-fiend': {
        'armor': 0,
        'health': 110,
        'health-lvl': 33
    }
};

var sprint;

function id_ele(id) {
    return document.getElementById(id);
}

function get_block(toughs) {
    return 1 - 1 / (0.15 * toughs + 1);
}

function get_ehm(armor) {
    return (100 + armor) / 100;
}

function get_ebh(armor, health, damage, reps, toughs, bisons, infuses, roses) {
	if (sprint) armor += roses * 30;
    health += bisons * 25 + infuses * 100;

    let ehm = get_ehm(armor);
    let eff_health = health * ehm;
	let flat_block = reps * 5;
	let hits = eff_health / Math.max(1, damage - flat_block);
    let flat_block_mit = hits * Math.min(flat_block, damage-1);
    return Math.round((eff_health + flat_block_mit) / (1 - get_block(toughs)));
}

function calculate() {
    let character = CHARS[id_ele('char-select').value];
    let level = id_ele('level').value;
    let commons = id_ele('commons').value;
    let uncommons = id_ele('uncommons').value;
    let damage = id_ele('damage').value;
    let spinel = id_ele('spinel').checked;
    let jade = id_ele('jade').checked;
    let drizzle = id_ele('drizzle').checked;
	sprint = id_ele('sprint').checked;
    
    let base_armor = character['armor'];
    let base_health = character['health'] + character['health-lvl'] * level;
    let reps = 0;
    let toughs = 0;
    let infuses = 0;
    let roses = 0;
	let bisons = 0;
    base_armor += spinel * 20 + jade * 500 + drizzle * 70;

    while (commons + uncommons) {
        let max = -1;
        let item = -1;
        if(commons) {
            max = get_ebh(base_armor, base_health, damage, reps+1, toughs, bisons, infuses, roses);
            item = 0;
            let pot_max = get_ebh(base_armor, base_health, damage, reps, toughs+1, bisons, infuses, roses);
            if(pot_max > max) {
                max = pot_max;
                item = 1;
            }
			pot_max = get_ebh(base_armor, base_health, damage, reps, toughs, bisons+1, infuses, roses);
            if(pot_max > max) {
                max = pot_max;
                item = 2;
            }
        }
        if(uncommons) {
            let pot_max = get_ebh(base_armor, base_health, damage, reps, toughs, bisons, infuses+1, roses);
            if(pot_max > max) {
                max = pot_max;
                item = 3;
            }
            pot_max = get_ebh(base_armor, base_health, damage, reps, toughs, bisons, infuses, roses+1);
            if(pot_max > max) {
                max = pot_max;
                item = 4;
            }
        }

        if (item === 0) {
            ++reps;
            --commons;
        } else if (item === 1) {
            ++toughs;
            --commons;
        } else if (item === 2) {
            ++bisons;
            --commons;
        } else if (item === 3) {
            ++infuses;
            --uncommons;
        } else if (item === 4) {
            ++roses;
            --uncommons;
        }
    }

    let next_max_c = get_ebh(base_armor, base_health, damage, reps+1, toughs, bisons, infuses, roses);
    let next_c = 'Repulsion Armor Plate';
    let next_pot_max_c = get_ebh(base_armor, base_health, damage, reps, toughs+1, bisons, infuses, roses);
    if(next_pot_max_c > next_max_c) {
        next_max_c = next_pot_max_c;
        next_c = 'Tougher Times';
    }
    let next_max_u = get_ebh(base_armor, base_health, damage, reps, toughs, bisons, infuses+1, roses);
    let next_u = 'Infusion';
    let next_pot_max_u = get_ebh(base_armor, base_health, damage, reps, toughs, bisons, infuses, roses+1);
    if(next_pot_max_u > next_max_u) {
        next_max_u = next_pot_max_u;
        next_u = 'Rose Buckler';
    }

    let armor = base_armor + roses * 30;
    let health = base_health + infuses * 100;
    let ehm = get_ehm(armor).toFixed(2);
    let eh = health * get_ehm(armor);
    let block = (get_block(toughs) * 100).toFixed(2);
	let flat_block = reps * 5;
    let ebh = get_ebh(base_armor, base_health, damage, reps, toughs, bisons, infuses, roses);
    let ebhm = (ebh/health).toFixed(2);

    id_ele("out-armor").value = armor;
    id_ele("out-health").value = health;
    id_ele("out-ehm").value = ehm;
    id_ele("out-eh").value = Math.floor(eh);
    id_ele("out-block").value = block;
    id_ele("out-flat-block").value = flat_block;
    id_ele("out-ebhm").value = ebhm;
    id_ele("out-ebh").value = Math.floor(ebh);

    id_ele("repul").value = reps;
    id_ele("tough").value = toughs;
    id_ele("bison").value = bisons;
    id_ele("infus").value = infuses;
    id_ele("rose").value = roses;

    id_ele("best-common").value = next_c;
    id_ele("best-common-ebh").value = next_max_c - ebh;
    id_ele("best-uncommon").value = next_u;
    id_ele("best-uncommon-ebh").value = next_max_u - ebh;
}