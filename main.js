// Declare global variables
// Items
var logs = 0;
var leaves = 0;
var rawFish = 0;
var cookedFish = 0;
var brokenMusket = false;

//debug (don't touch unless you know what it does.)
var synchDebugItems = false;
var gameCompleted = false;

// Tools
var workBench = false;
var fishingRod = false;
var axe = false;
var buildingProgress = 0;

// Energy logic
var restKey;
var energyMax = 30;
var energy = energyMax - 5;
var energyReceived = 5;

// Task logic
var gatherKey;
var fishKey;
var minFishChance = 1;

// Hut Upgrades Data Object
var hutUpgrades = {bedroom: false, kitchen: false, traps: false};

//Sailboat data object
var sailboat = { dock: false, sail: false, frame: false, hull: false, fish: false };

function start() {
	// Introduction
	println("You are stranded on a tropical island with no idea how you got here. Your goal is to build a sailboat so you can leave the island. Type 'sailboat' on the beach to open the menu to build components for it.");
	println("You will use commands to interact with your surroundings and items you collect from gathering.");
	println("This is meant to be a lighthearted game that doesn't take itself too seriously.");
	println("Type 'help' at any time to get options for what you can do.");
	println("Have fun :)");
	println("Type 'q' to quit at any time.");
	println(" ");
	println(" ");

	generateKeys();

	while (!gameCompleted) {
		println(" ");
		print("You are on the beach with some trees nearby");
		if (buildingProgress === 0) {
			print(".");
		} else if (buildingProgress === 1) {
			print(" and an unsturdy shelter made of logs on the sand.");
		} else if (buildingProgress === 2) {
			print(" and a log hut with a roof made of leaves on the sand.");
		}
		print(" Type help or ? while on the beach to get a list of options for what you can do");
		var main = readLine("");

		if (main === "q" || main === "Q") {
			println("Thank you for playing! :)");
			break;
		} else if (main === "help" || main === "?") {
			println("You can type 'gather' to collect some wood, 'fish' to start fishing, 'inv' to view your inventory, 'eat' to eat cooked fish, 'rest' to gain back energy you've lost, 'cook' to cook raw fish, 'sailboat' to open the menu to build the sailboat, 'craft' to open the crafting menu, 'build' to open the build menu, 'credits' to view the game's credits, and 'q' to quit");
		} else if (main === "gather") {
			gather();
		} else if (main === "debug") {
			debugConsole();
		} else if (main === "storage" || main === "inv" || main === "stores") {
			inventory();
		} else if (main === "crafting" || main === "craft") {
			unlockCrafting();
		} else if (main === "rest") {
			rest();
		} else if (main === "build" || main === "building" || main === "upgrade" || main === "hut" || main === "hut upgrades") {
			build();
		} else if (main === "fish" || main === "fishing") {
			fishing();
		} else if (main === "sailboat" || main === "boat") {
			unlockBuildBoat();
		} else if(main === "credits") {
            credits();
            } else if(main === "eat" || main === "eat fish" || main === "eat cooked fish") {
                eat();
            } else if(main === "cook" || main === "cook fish") {
                cook();
            }
	}
}

function gather() {
	if (energy > 4) {
		println("Type '" + gatherKey + "' to attempt to gather materials from the small woods.");
		var gatherInput = readLine("");

		if (gatherInput === gatherKey) {
			var randomNum = Randomizer.nextInt(1, 6);

			if (randomNum !== 1) {
				var logsFound = Randomizer.nextInt(1, 4);

				if (axe) {
					logsFound *= 2;
					logs += logsFound;
					println("You chop down some smaller trees and cart the wood back to the beach.");
					println("You now have " + logs + " logs in your storage.");

					if (Randomizer.nextInt(1, 10) === 1) {
						leaves++;
						println("You also collect a palm leaf that was of good enough quality from one of the trees you hacked down.");
						println("You now have " + leaves + " leaves.");
					}

					if (Randomizer.nextInt(1, 1000) === 1) {
						brokenMusket = true;
						println("As you were gathering logs, you tripped over a broken musket hidden in the brush.");
						println("You decided to take it back to the beach along with your logs.");
					}
				} else {
					logs += logsFound;
					println("You gather a few logs and add them to your stores.");
					println("You now have " + logs + " logs in your storage.");
				}
				gatherSelect();
			} else {
				println("You didn't find any fallen branches to gather :(");
				gatherSelect();
			}
		} else {
			println("You forget why you went into the woods and return to the beach.");
		}
		energy -= 5;
		println("-5 energy");
		println(energy + "/" + energyMax + " energy remaining. Rest to increase it.");
        } else {
		println("Not enough energy to gather right now. Rest to gain back energy.");
	}
}

function debugConsole() {
	println("A JBird swoops down and tells you it knows where to get as many logs as you want. (type the number of logs you'd like to set the amount of logs to.)");
	logs = readInt("");
	if (synchDebugItems) {
		leaves = logs;
		rawFish = logs;
		cookedFish = logs;
	}
	println("The Jbird provided the requested logs. You now have " + logs + " logs.");
}

function gatherSelect() {
	var RandomNum = Randomizer.nextInt(1, 3);
	if (RandomNum === 1) {
		gatherKey = "get some stuff";
	} else if (RandomNum === 2) {
		gatherKey = "grab some branches";
	} else if (RandomNum === 3) {
		gatherKey = "collect some wood";
	}
}

function inventory() {
	println("           Inventory");
	println(" ");
	println("       ITEMS");
	if (logs > 0) {
		println(logs + " logs");
	}
	if (leaves > 0) {
		println(leaves + " leaves");
	}
	if (rawFish > 0) {
		println(rawFish + " raw fish");
	}
if (cookedFish > 0) {
    println(cookedFish + " cooked fish");
}
if(brokenMusket) {
    println("Broken musket (collectible)");
}
	println(" ");
	println("       TOOLS:");
	if (axe) {
		println("axe");
	}
	if (fishingRod) {
		println("Fishing Rod");
	}
}

function unlockCrafting() {
	if (!workBench) {
		println("You must craft a workbench to craft items. Would you like to do so for 10 logs?");
		var craftUnlockInput = readLine("");

		if (craftUnlockInput[0] == "y" || craftUnlockInput[0] == "Y" || craftUnlockInput == "sure") {
			if (logs > 9) {
				logs -= 10;
				workBench = true;
				println("You have crafted the workbench and unlocked crafting. Congrats!");
				crafting();
			} else {
				println("You don't have enough logs to craft a workbench right now. You currently have " + logs + " and need 10. Keep gathering to earn more.");
			}
		} else {
			println("Okay, you can return here at any time to craft the workbench and unlock crafting.");
		}
	} else if (workBench) {
		crafting();
	}
}

function crafting() {
	println(" ");
	println("           Crafting");
	println("Type the name of the item to craft it.");
	println(" ");

	if (!axe) {
		println("Axe: (15 logs) allows you to chop down trees instead of gathering fallen branches off the forest floor. Also rarely gives you leaves when gathering trees.");
	} else {
		println("Already crafted an axe");
	}

	if (!fishingRod) {
		println("Fishing Rod: (30 logs) allows you to fish for food which restores energy.");
	} else {
		println("Already crafted a fishing rod.");
	}

	if (buildingProgress === 0) {
		println("Shelter: (50 logs) Gives you more energy when you rest.");
	} else if (buildingProgress === 1) {
		println("Basic hut: (100 logs, 15 leaves) unlocks building perk upgrades and gives even more energy when resting.");
	} else {
		println("Already built a basic hut. Type 'build' when you are on the beach to access the upgrades menu for it.");
	}
	if (rawFish > 0) {
		print("You can cook pieces of fish by ");
		if (buildingProgress === 0) {
			print("building a shelter, upgrading it into a basic hut, and then building a kitchen.");
		} else if (buildingProgress === 1) {
			print("upgrading your shelter into a basic hut and building a kitchen.");
		} else {
			print("building a kitchen in the build menu for your hut.");
		}
	}
	println(" ");
	println("Type 'out' to walk away from the workbench.");
	var craftInput = readLine("");

	if (craftInput === "axe" && !axe) {
		if (logs > 14) {
			logs -= 15;
			axe = true;
			println("You have crafted an axe. You will now gather more logs with your increased efficiency!");
		} else {
			println("You don't have enough logs to craft the axe. You currently have " + logs + " and need 15.");
		}
	} else if (craftInput === "fishing rod" && !fishingRod) {
		if (logs > 29) {
			logs -= 30;
			fishingRod = true;
			println("You have crafted a fishing rod and unlocked fishing. Type 'fish' on the beach to start fishing for food.");
		} else {
			println("You don't have enough logs to craft the fishing rod. You currently have " + logs + " and you need 30.");
		}
	} else if (craftInput === "shelter" && buildingProgress === 0) {
		if (logs > 49) {
			logs -= 50;
			buildingProgress++;
			energyReceived *= 2;
			println("As you finish your shelter, you step back to admire it. This will surely provide you with a cool, quiet place to rest.");
		} else {
			println("You don't have enough logs to build a shelter. You currently have " + logs + " and need 50.");
		}
	} else if (craftInput === "basic hut" && buildingProgress === 1) {
		if (logs > 89 && leaves > 9) {
			logs -= 90;
			leaves -= 10;
			buildingProgress++;
			energyReceived *= 2;
			println("As you secure the last leaf on your roof in place, you can't help but feel a sense of pride looking at your home. **Building upgrades are now unlocked! Type 'build' on the beach to access the building menu.");
		} else {
			println("You don't have enough materials. You have " + logs + " logs and need 90, and have " + leaves + " and need 10.");
		}
	}
}

function rest() {
	if (energy <= energyMax - energyReceived) {
		println("Type " + restKey + " to take a rest and restore " + energyReceived + " energy.");
		var restInput = readLine("");
		if (restInput === restKey) {
			energy += energyReceived;
			println("You rest and gain back " + energyReceived + " energy.");
			println("You now have " + energy + "/" + energyMax + " energy.");
			restSelect();
		} else {
			println("You couldn't seem to fall asleep and kept tossing and turning.");
		}
	} else {
		println("You don't need to rest right now. You still have " + energy + " energy left.");
	}
}

function restSelect() {
	var RandomNum = Randomizer.nextInt(1, 3);
	if (RandomNum === 1) {
		restKey = "take a nap";
	} else if (RandomNum === 2) {
		restKey = "rest for now";
	} else if (RandomNum === 3) {
		restKey = "take a quick break";
	}
}

function fishing() {
	if (fishingRod) {
		if (energy > 6) {
			println("Type " + fishKey + " to cast your line into the ocean.");
			var fishInput = readLine("");
			if (fishInput === fishKey) {
				var randomNum = Randomizer.nextInt(minFishChance,100);
				if (randomNum < 25) {
					println("You didn't catch anything. :(");
				} else if (randomNum < 45) {
					println("You catch a teeny tiny fishy. After filletting it, you get only one piece of raw fish.");
					rawFish++;
					println("You now have " + rawFish + " pieces of raw fish.");
				} else if (randomNum < 65) {
					println("You catch an average sized fish. After filletting it, you collect 3 pieces of raw fish.");
					rawFish += 3;
					println("You now have " + rawFish + " pieces of raw fish.");
				} else if (randomNum < 80) {
					println("You catch a pretty decently sized fish. After filletting it, you collect 5 pieces of raw fish.");
					rawFish += 5;
					println("You now have " + rawFish + " pieces of raw fish.");
				} else if (randomNum < 90) {
					println("Nice catch! You score a nice fat fish. After filletting it, you collect 7 pieces of raw fish.");
					rawFish += 7;
					println("You now have " + rawFish + " pieces of raw fish.");
				} else if (randomNum < 95) {
					println("Great catch! After a a good fight, you manage to reel in a huge fish. After filletting it, you collect 11 pieces of raw fish.");
					rawFish += 11;
					println("You now have " + rawFish + " pieces of raw fish.");
				} else if (randomNum < 100) {
					println("Fantastic catch! You manage to land a super huge fish! After filletting it, you collect 15 pieces of raw fish.");
					rawFish += 15;
					println("You now have " + rawFish + " pieces of raw fish.");
				} else if (randomNum === 100) {
					println("Amazing catch! You reel in an honest to god shark! After you cut it up, you manage to collect 40 pieces of raw fish.");
					rawFish += 40;
					println("You now have " + rawFish + " pieces of raw fish.");
				}
				energy -= 7;
				println("-7 energy");
				println(energy + "/" + energyMax + " energy remaining. Rest to gain it back.");
				fishSelect();
			} else {
				println("Every time you attempt to cast your line it gets tangled because of your carelessness. You sigh and give up.");
			}
		} else {
			println("You don't have enough energy to fish. Try resting to restore it.");
		}
	} else {
		println("You can't fish without a fishing rod!");
	}
}

function fishSelect() {
	var randomNum = Randomizer.nextInt(1, 3);
	if (randomNum === 1) {
		fishKey = "cast line";
	} else if (randomNum === 2) {
		fishKey = "here fishy fishy";
	} else if (randomNum === 3) {
		fishKey = "cast rod";
	}
}

function build() {
	if (buildingProgress > 1) {
		println("       Hut Upgrades:");
        if(!hutUpgrades[kitchen]) {
            println("Kitchen: Allows you to cook raw fish that you catch. (80 logs, 8 leaves).");
            } else {
                println("Kitchen: Already crafted");
            }
            if (!hutUpgrades[bedroom]) {
                println("Bedroom: Gives you a great place to get a full nights rest. Doubles your max energy (150 logs, 15 leaves)");
                } else {
                    println("Bedroom: Already crafted");
                }
                if (!hutUpgrades[traps]) {
                    println("Bait traps: Automaticly catches bait for your fishing rod which means you will less often catch no fish (100 logs, 10 leaves)");
                } else {
                    println("Traps: Already crafted");
                }
                println("Type the name of a renavation you'd like to make. Type anything else to exit the build menu");
                var upgradeInput = readLine(" ");
                buildHutUpgrade(upgradeInput);
	} else {
		println("You need something more sturdy in order to justify upgrading it.");
	}
}

function buildHutUpgrade(upgrade) {
    if(upgrade === "kitchen") {
        if(logs > 79 && leaves > 7) {
            hutUpgrades[kitchen] = true;
            println("You add the kitchen to the right side of your hut. You can now type cook to cook a raw fish you've caught.");
        } else {
            println("You don't hve enough logs and/or leaves. You need 80 logs and currently have " + logs + ", and you need 8 leaves and currently have " + leaves + ".");
        }
} else if(upgrade === "bedroom") {
    if(logs > 149 && leaves > 14) {
        hutUpgrades[bedroom] = true;
        maxEnergy*=2;
        println("You finish constructing a proper bedroom on the left side of your hut. Your max energy has been doubled to " + maxEnergy);
    } else {
        println("You don't have enough logs and/or leaves. YOu need 150 logs and currently have " + logs + ", and you need 15 leaves and currently have " + leaves + ".");
    }
} else if(upgrade === "traps" || upgrade === "bait traps" || upgrade === "bate traps" || upgrade === "trap") {
    if(logs >99 && leaves > 9) {
        hutUpgrades[traps] = true;
        minFishChance = 14;
        println("You finish constructing a row of bait traps in front of your hut in the shallow waters. This should deffinitely provide enough bait for you to not have to worry about it again.");
    } else {
        println("you don't have enough logs and/or leaves. You need 100 logs and currently have " + logs + ", and you need 10 leaves and currently have " + leaves + ".");
    }
}
}

function generateKeys() {
	gatherSelect();
	restSelect();
	fishSelect();
    cookSelect();
}

function unlockBuildBoat() {
	if (!sailboat["dock"]) {
		println("You need to build a dock for your sailboat to begin constructing it. Would you like to do so for 30 logs and 15 leaves??");
		var unlockBoatInput = readLine("");

		if (unlockBoatInput[0] == "y" || unlockBoatInput[0] == "Y" || unlockBoatInput == "sure") {
			if (logs > 29 && leaves > 14) {
				logs -= 30;
				leaves -= 15;
				sailboat["dock"] = true;
				println("You have built the sailboat dock and unlocked the ability to begin constructing your ticket to freedom. Congrats!");
				buildBoat();
			} else {
				println("You don't have enough logs and/or leaves to build the dock right now. You currently have " + logs + " logs and need 30 logs. You also have " + leaves + " leaves and need 15. Keep gathering to earn more.");
			}
		} else {
			println("Okay, you can return here at any time to build the dock and unlock the ability to construct the sailboat.");
		}
	} else if (sailboat["dock"]) {
		buildBoat();
	}
}

function buildBoat() {
	println(" ");
	println("       Sailboat Ingredients");
	println(" ");
	println("To build the sailboat you still need:");
	if (!sailboat[frame]) {
		println("Frame: 75 logs");
	} else if (!sailboat[hull]) {
		println("Ship hull: 115 logs");
	}
	if (!sailboat[sail]) {
		println("Sail: 50 leaves.");
	}
	if (!sailboat[fish]) {
		println("Provisions: 50 cooked fish");
	}
	println(" ");
	println("You currently have:");
	println(" ");
	if (sailboat[frame]) {
		println("the ship's frame");
	} else if (sailboat[hull]) {
		println("The hull of the ship");
	}
	if (sailboat[sail]) {
		println("The main sail");
	}
	if (sailboat[fish]) {
		println("Provisions for the voyage");
	}
	println("Type the name of any component you still have to create to build it and add it to the ship. Type set sail once you have all components crafted and are ready to end the game.");
	var shipInput = readLine("");
	craftBoatItem(shipInput);
}

function craftBoatItem(item) {
	if (item === "frame" && !sailboat[frame]) {
		if (logs > 74) {
			sailboat[frame] = true;
			logs -= 75;
			println("You have built the frame for your sailboat.");
		} else {
			println("You don't have enough logs to build the frame for your sailboat. You need 75 but currently only have " + logs + ".");
		}
	} else if ((item === "hull" && !sailboat[hull]) || (item === "ship hull" && !sailboat[hull])) {
		if (logs > 114) {
			sailboat[hull] = true;
			logs -= 115;
			println("You finish constructing the hull of your sailboat. It's really starting to come together now!");
		} else {
			println("You don't have enough logs. You need 115 and current.y only have " + logs + ".");
		}
	} else if (item === "sail" && !sailboat[sail]) {
		if (leaves > 49) {
			sailboat[sail] = true;
			leaves -= 49;
			println("You finish weaving together a passable sail that shouldn't rip in the strong winds of the ocean.");
		} else {
			println("You don't have enough leaves to build the sail. You need 50 but only have " + leaves + ".");
		}
	} else if ((item === "provisions" && !sailboat[fish]) || (item === "fish" && !sailboat[fish])) {
		if (cookedFish > 49) {
			sailboat[fish] = true;
			cookedFish -= 50;
			println("You set asside 50 cooked fish to use on your journey to find civilization.");
		} else {
			println("You don't have enough cooked fish. You currently have " + cookedFish + " and need 50. Try building the kitchen in the hut to cook raw fish in.");
		}
	} else if (item === "set sail" || item === "setsail") {
		if (sailboat[frame] === true && sailboat[hull] === true && sailboat[sail] === true && sailboat[fish] === true) {
			println("As you untie your sailboat from the dock, you look back at your hut. You reflect on how far you've come. You've built up your inventory of items, built structures, tools, and an entire sailboat. You cut down trees, went fishing, and cooked fish. You're excited for your next chapter of your adventure but can't help but think how you'll miss this calm tropical island.");
			println("************");
			println("Congrats! You've somehow beat my game. Great job!");
			println("Game data and score:");
			inventory();
			var score = logs + leaves + rawFish;
            score+=cookedFish*2;
            if(hutUpgrades[traps]) {
                score+=100;
            }
            if(hutUpgrades[bedroom]) {
                score+=70;
            }
            if (brokenMusket) {
                score+=500;
            }
			println("Final score:" + score);
            credits();
            gameCompleted = true;
		}
	}
}

function credits() {
    println("       CREDITS:");
    println("Braille Bennett: Developer");          println("Wyatt: beta tester and ideas contributor");
    println("Jayden: ideas contributor");
    println("Michael: debugger and ideas contributor");
    println(" ");
    println("       Tools used:");
    println("ChatGPT by Open AI: gave me the original idea for the game and troubleshot my code.");
    println("Prettier: Formatted entire projects indentation and general code tidiness.");
}

function eat(){
                    if(cookedFish > 0) {
                    cookedFish-=1;
                    energy+=5;
                    println("You eat a cooked fish and your energy increases.");
                    println("+5 energy");
                    println(energy + "/" + energyMax);
                    println("You now have" + cookedFish + " cooked fish left in your stores.");
                } else {
                    println("You don't have any cooked fish to eat. Try building a kitchen in your basic hut and cooking raw fish you catch.");
                }
}
function cook() {
    if (hutUpgrades["kitchen"]) {
        if (cookedFish > 0) {
            println("Type " + cookKey + " to cook 1 raw fish.");
            var cookInput = readLine(" ");
            if (cookInput === cookKey) {
                rawFish--;
                cookedFish++;
                println("With a sizzle, you take your newly cooked fish off of your stove.");
            } else {
                println("You burn the raw fish as you get distracted from the task at hand and have to throw it out.");
                rawFish--;
            }
        } else {
            println("You don't have any raw fish to cook. Try catching one from fishing.");
        }
    } else {
        println("Build a basic hut and then build a kitchen in the hut's upgrade menu to cook raw fish.");
    }
}

function cookSelect() {
    var randomNum = Randomizer.nextInt(1, 3);
    if (randomNum === 1) {
        cookKey = "cook the fish";
    } else if (randomNum === 2) {
        cookKey = "prepare a cooked fish";
    } else if (randomNum === 3) {
        cookKey = "fuel the stove";
    }
}