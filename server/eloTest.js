
var users = [];
var ranks= [
];

for (let i = 0; i < 1000; i++) {
    users.push({
        stats: {
            elo: Math.random() * 1000
        }
    });
}

var x = 0;
while (x<1000) {
    x++;
    for (let i = 0; i < users.length; i++) {
        var player1 = users[i];
        for (let j = 0; j < users.length; j++) {
            if(i!=j){
                var player2 = users[j];

                var whoWins = Math.round(Math.random());
                if(whoWins){
                    player1.progression = 100;
                    player2.progression = Math.random() * (100 - 50) + 50;
                }
                else{
                    player2.progression = 100;
                    player1.progression = Math.random() * (100 - 50) + 50;
                }
    
                calc(player1, player2);
            }
        }
    }
}


function calc(player1, player2){

    var progressionDifference = Math.abs(player1.progression - player2.progression);
    //console.log("Progression difference: "+progressionDifference);

    //console.log("Winner elo: "+player1.stats.elo);
    //console.log("Loser elo: "+player2.stats.elo);

    var eloDifferenceWinner = player1.stats.elo - player2.stats.elo;

    var eloCalcWinner;
    var eloCalcLoser;

    if(eloDifferenceWinner > 0){
        // Winner was advantaged

        if(eloDifferenceWinner < 1) eloDifferenceWinner = 1;

        eloCalcWinner = progressionDifference * (1/eloDifferenceWinner);
        eloCalcLoser = progressionDifference * (1/eloDifferenceWinner);
    }
    else{
        // Loser was advantaged

        if(eloDifferenceWinner < 1) eloDifferenceWinner = 1;

        eloCalcLoser = 5 * progressionDifference * (1/Math.abs(eloDifferenceWinner));
        eloCalcWinner = progressionDifference * (1/Math.abs(eloDifferenceWinner));
    }

    //console.log("Elo Calc Winner: "+ eloCalcWinner);
    //console.log("Elo Calc Loser: "+ eloCalcLoser);

    player1.stats.elo += eloCalcWinner; 
    player2.stats.elo -= eloCalcLoser; 

    if(player1.stats.elo < 1) player1.stats.elo = 1;
    if(player2.stats.elo < 1) player2.stats.elo = 1;

}

const fs = require('fs');


// Créer les ranks

// Get max
var max = 1;
for (let j = 0; j < users.length; j++) {
   if(users[j].stats.elo > max)max = users[j].stats.elo;
}
console.log(max);
// Créer ranks
var nbRanks = 5;
var r = 0;
var compartiment = Math.round(max/nbRanks);
while(r<nbRanks){
    ranks.push({
        min: (r*compartiment)+1,
        max: (r+1)*compartiment,
        count: 0
    });
    r++;
}
console.log(ranks);


// Trier en ranks
for (let j = 0; j < users.length; j++) {
    for (let i = 0; i < ranks.length; i++) {
        if(users[j].stats.elo > ranks[i].min && users[j].stats.elo <ranks[i].max){
            ranks[i].count++;
        }
    }
}

// Ecrire en csv
var toWrite = "";
for (let i = 0; i < ranks.length; i++) {
    toWrite += "Rank "+i+";"+ranks[i].count+"\n";
}


fs.writeFile("test.csv", toWrite, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
