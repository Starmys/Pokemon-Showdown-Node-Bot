'use strict';
const initialMoney = 48000; //Money each team should start with
const minPlayers = 5; //Forces managers to buy a certain amount of players. To disable, set this to 1
const defaultTeams = {//If you want teams set automatically, they can be placed here
        //Leaving UUPL teams so you can see how it is done
        /*"The Black City Burglars": "flcl",
        "Mikan Island Monsters": "teal6",
        "The Blackthorn City Battle Girls": "kinguu",
        "Route 30 Youngsters": "dodmen",
        "Slateport City Socialites": "hogg",
        "Littleroot Lindas": "shiba",
        "Dewford Town Delinquents": "fatty",
        "Pewter Porygon 2s": "Omfuga"*/
    "Dancing Dialga":"mmrrk",
    "Sky Fucker":"liko too",
    "Butterfly":"EDG kangri",
    "Handsome Penguin":"ssnoopy",
};


const fs = require('fs');

let drafts = {}; 

class Draft {
    constructor(room) {
        this.room = room;
        this.teams = {};
        this.players = {};
        this.state = "prep";
        this.managers = {};
        this.activeTeams = [];
        
        this.nomination = null;
        this.currDirr = 1;
        this.nominee = null;
        this.bid = null;
        this.topBidder = null;
        this.timer = null;
        
        this.draftlog = [];
    }
    
    addTeam (name, captain) {
        let teamId = toId(name);
        this.teams[teamId] = {
            "name": name,
            "bidders": [captain],
            "players": [],
            "money": initialMoney
        };
        this.managers[captain] = teamId;
        this.activeTeams.push(teamId);
        this.save();
    }
    
    loadPlayers (url) {
        Tools.httpGet(url, data => {
            if (!data) return Bot.say(this.room, 'Could not load data. Make sure you are using a /raw/ pastebin or hastebin link.');
            let lines = data.split('\n');
            let categories = lines[0].split(',');
            if (!categories[0]) categories[0] = 'Name';
            for (let i = 1; i < lines.length; i++) {
                let parts = lines[i].split(',');
                let player = parts[0].trim();
                let playerId = toId(player);
                this.players[playerId] = {
                    "name": player
                };
                for (let j = 0; j < categories.length; j++) {
                    this.players[playerId][categories[j]] = parts[j];
                }
            }
            Bot.say(this.room, 'Playerlist succesfully loaded.');
        });
    }
    
    start () {
        this.state = "nominate";
        this.showAll(true);
        this.nomination = Object.keys(this.teams)[0];
        Bot.say(this.room, this.teams[this.nomination].name + ' are up to nominate. Bidders: ' + this.teams[this.nomination].bidders.join(', '));
    }
    
    nextNominate (force) {//Force - force nomination to go to a NEW team (instead of repeating, like in snake)
        let teams = this.activeTeams;
        let teamIndex = teams.indexOf(this.nomination) + this.currDirr;
        if (teamIndex < 0 || teamIndex === teams.length) {
            this.currDirr = -this.currDirr;
            teamIndex = teams.indexOf(this.nomination) + (force ? this.currDirr : 0);
        }
        this.nomination = teams[teamIndex];
		this.state = "nominate";
        Bot.say(this.room, this.teams[this.nomination].name + ' are up to nominate. Bidders: ' + this.teams[this.nomination].bidders.join(', '));
    }
    
    runNominate (user, target) {
        if (!this.managers[user] || this.nomination !== this.managers[user]) return false;
        let targetId = toId(target);
        if (!this.players[targetId]) return Bot.say(this.room, 'The user ' + target + ' was not found!');
	let team = this.teams[this.managers[user]];
	if (team.money < 3000) return Bot.say(this.room, "You don't have enough money to perform this action!");
        let targetName = this.players[targetId].name;
        this.nominee = targetName;
		this.state = "start";
        Bot.say(this.room, targetName + ' is up for bidding!');
        let buffer = [];
        for (let property in this.players[targetId]) {
            if (this.players[targetId][property] === 'y') buffer.push(property);
        }
        Bot.say(this.room, 'Tiers: ' + buffer.join(' --- '));
        this.runBid(user, 3000);
    }
    
    showAll (manual) {
        let reiterations = 0;
        let teamList = Object.keys(this.teams)
        let showAllInterval = setInterval(() => {
            let team = this.teams[teamList[reiterations]];
            if (!team) { 
                clearInterval(showAllInterval);
                if (!manual) this.nextNominate();
                return;
            }
            Bot.say(this.room, team.name + ': [Money: ' + team.money + ' | Bidders: ' + team.bidders.join(', ') + '] Players: ' + team.players.join(', '));
            reiterations++;
        }, 800);
    }
    
    runBid (user, amount) {
        if (!this.managers[user]) return false;
        if (isNaN(amount)) return false;
        let team = this.teams[this.managers[user]];
        let teamName = team.name;
        if (amount <= 100) amount *= 1000;
        if (amount <= this.bid) return Bot.say(this.room, teamName + ': Bid must be at least 500 more than ' + this.bid);
        let maxBid = team.money - (minPlayers - team.players.length - 1) * 3000;
	if (maxBid < 0 || maxBid > team.money) maxBid = team.money;
        if (amount > maxBid) return Bot.say(this.room, teamName + ': Bid exceeds max bid of ' + maxBid);
        if (amount % 500 !== 0) return Bot.say(this.room, teamName + ': Bid must be a multiple of 500');
        clearTimeout(this.timer);
        Bot.say(this.room, '>' + teamName + ': **' + amount + '**');
        this.bid = amount;
        this.topBidder = user;
        this.timer = setTimeout(() => {
            Bot.say(this.room, '__8 seconds remaining!__');
            this.timer = setTimeout(() => {
                Bot.say(this.room, teamName + ' have won the bid for ' + this.nominee + '!');
                team.money -= amount;
                team.players.push(this.nominee);
                this.draftlog.push(['purchase', this.nominee, amount, teamName]);
                this.bid = null;
                delete this.players[toId(this.nominee)];
                this.nominee = null;
                this.showAll();
                this.save();
            }, 8000);
        }, 16000);
    }
    
    withdraw (user) {
        let team = this.managers[user];
        if (!team) return false;
        if (!~this.activeTeams.indexOf(team)) return Bot.say(this.room, "Your team has already withdrawn from the auction.");
        if (this.activeTeams.length < 2) return this.end();
        Bot.say(this.room, this.teams[team].name + ' have withdrawn from the auction.');
        if (this.nomination === team) this.nextNominate(true);
        this.activeTeams.splice(this.activeTeams.indexOf(team), 1);
    }
    
    constructLog () {
        let buffer = 'Draft Summary: \n';
        for (let i = 0; i < this.draftlog.length; i++) {
            let data = this.draftlog[i];
            if (data[0] === 'purchase') {
                buffer += this.draftlog[i][1] + ' purchased by ' + this.draftlog[i][3] + ' for ' + this.draftlog[i][2] + '\n';
            }
            if (data[0] === 'removal') {
                buffer += data[1] + ' was removed from the team ' + data[2] + '\n';
            }
            if (data[0] === 'addition') {
                buffer += data[1] + ' was added to the team ' + data[2] + '\n';
            }
        }
        return buffer;
    }
    
    save () {
        fs.writeFileSync('./data/draft.json', JSON.stringify(drafts));
    }
    
    end () {
        let buffer = '';
        for (let i in this.teams) {
            let team = this.teams[i];
            buffer += team.name + ': [Money: ' + team.money + ' | Bidders: ' + team.bidders.join(', ') + '] Players: ' + team.players.join(', ') + '\n';
        } 
        buffer += '\n' + this.constructLog();
        Tools.uploadToHastebin(buffer, (success, link) => {
            if (success) Bot.say(this.room, link);
            else Bot.say(this.room, 'Error connecting to hastebin.');
        });
    }
}




exports.commands = {
    d: 'draft',
    draft: function (arg, by, room) {
        if (!this.isRanked('roomowner')) return false;
        if (!arg) return false;
        let parts = arg.split(' ');
        switch (parts[0]) {
            case 'reset' :
                delete drafts[room];
                this.reply('Draft information erased for this room.');
                break;
                
            case 'init' : 
                if (drafts[room]) return this.reply('There is currently a draft in progress in this room.');
                drafts[room] = new Draft(room);
                this.reply('A new draft has started!');
                for (let k in defaultTeams) {
                    drafts[room].addTeam(k, toId(defaultTeams[k]));
                }
                if (~Object.keys(drafts[room].teams)) this.reply('Default data loaded.');
                break;
            
            case 'addteam' :
                if (!drafts[room] || drafts[room].state !== 'prep') return this.reply('There is no draft in configuration in this room.');
                let args = parts.slice(1).join(' ').split(',');
                if (!args[1]) return this.reply('Usage: /draft addteam Name, Captain');
                drafts[room].addTeam(args[0], toId(args[1]));
                this.reply('The team ' + args[0] + ' was added.');
                break;
           
            case 'load' :
            case 'loadplayers' :
                if (!drafts[room] || drafts[room].state !== 'prep') return this.reply('There is no draft in configuration in this room.');
                if (!parts[1]) return this.reply('Usage: /draft load <url>');
                drafts[room].loadPlayers(parts[1]);
                break;
                
            case 'start' :
                if (!drafts[room] || drafts[room].state !== 'prep') return this.reply('There is no draft in configuration in this room.');
                if (Object.keys(drafts[room].teams).length < 2) return this.reply('You cannot start a draft with less than two teams.');
                if (!Object.keys(drafts[room].players).length > 0) return this.reply('You cannot do this without loading player data.');
                drafts[room].start();
                break;
                
            case 'skip' :
                if (!drafts[room] || drafts[room].state === 'prep') return false;
                if (this.timer) clearTimeout(this.timer);
                drafts[room].nextNominate();
                break;
                
            case 'pause' :
                if (!drafts[room] || drafts[room].state !== 'start') return false;
                drafts[room].state = 'pause';
                this.reply('The draft was paused');
                break;
                
            case 'resume' :
                if (!drafts[room] || drafts[room].state !== 'pause') return false;
                drafts[room].state = 'start';
                this.reply('The draft was resumed!');
                break;
                
            case 'addbidder' :
                if (!drafts[room]) return false;
                let subargs = parts.slice(1).join(' ').split(',');
                if (!subargs[1]) return this.reply('Usage: .draft addbidder Team, name');
                let teamId = toId(subargs[0]);
                if (!drafts[room].teams[teamId]) return this.reply('The team ' + subargs[0] + ' was not found.');
                drafts[room].teams[teamId].bidders.push(toId(subargs[1]));
                drafts[room].managers[toId(subargs[1])] = teamId;
                this.reply(subargs[1] + ' was added as a bidder for ' + subargs[0] + '.');
                break;
                
            case 'removebidder' :
                if (!drafts[room]) return false;
                let subparts = parts.slice(1).join(' ').split(',');
                if (!subparts[1]) return this.reply('Usage: .draft removebidder Team, name');
                let teamid = toId(subparts[0]);
                let userId = toId(subparts[1]);
                if (!drafts[room].teams[teamid]) return this.reply('The team ' + subparts[0] + ' was not found.');
                if (!drafts[room].managers[userId] || !drafts[room].managers[userId] === teamid) return this.reply(subparts[1] + ' is not a manager for that team.');
                drafts[room].teams[teamid].bidders.splice(drafts[room].teams[teamid].bidders.indexOf(userId), 1);
                delete drafts[room].managers[userId];
                this.reply(subparts[1] + ' was removed from bidding for ' + subparts[0] + '.');
                break;
                
            case 'end' :
                if (!drafts[room]) return this.reply('There is no draft in this room.');
                this.reply('The draft has ended!');
                drafts[room].end();
                delete drafts[room];
                break;
                
            case 'override': //YES THIS CODE IS MESSY
                if (!drafts[room] || drafts[room].state === 'prep') return false;
                if (!parts[2]) return this.reply('You are not using this command correctly. Type .draft help for help.');
                switch (toId(parts[1])) {
                        case 'money':
                            switch (toId(parts[2])) {
                                case 'give':
                                case 'add':
                                case 'remove':
                                case 'take':
                                    if (!parts[4]) return this.reply('Usage: .draft override money [add/remove] <team> <amount>');
                                    var tarTeam = toId(parts[3]);
                                    var amount = parseInt(parts[4]);
                                    if (!tarTeam || isNaN(amount) || !drafts[room].teams[tarTeam]) return this.reply("Override command not found.");
                                    if (toId(parts[2]) === 'remove' || toId(parts[2]) === 'take') amount = amount * -1;
                                    drafts[room].teams[tarTeam].money += amount;
                                    this.reply(tarTeam + ' currency was changed by ' + amount);
                                    break;
                                default :
                                    this.reply('Usage: .draft override money [add/remove] <team> <amount>');
                                    break;
                            }
                            break;
                        break;
                        case 'players':
                        case 'player':
                            var action = toId(parts[2]);
                            switch (action) {
                                case 'add':
                                    if (!parts[4]) return this.reply('Usage: .draft override players add <team> <player>');
                                    var tarTeam = toId(parts[3]);
                                    var name = parts.slice(4).join(' ');
                                    if (!drafts[room].teams[tarTeam]) return this.reply('The team: ' + tarTeam + ' was not found.');
                                    drafts[room].teams[tarTeam].players.push(name);
                                    drafts[room].draftlog.push(['addition', name, parts[3]]);
                                    this.reply(name + ' was added to team ' + tarTeam);
                                    break;
                                case 'remove':
                                    if (!parts[4]) return this.reply('Usage: .draft override players remove <team> <player>');
                                    var tarTeam = toId(parts[3]);
                                    var name = parts.slice(4).join(' ');
                                    if (!drafts[room].teams[tarTeam] || !~drafts[room].teams[tarTeam].players.indexOf(name)) return this.reply(name + ' does not seem to be on the team: ' + parts[3]);
                                    drafts[room].teams[tarTeam].players.splice(drafts[room].teams[tarTeam].players.indexOf(name), 1);
                                    drafts[room].draftlog.push(['removal', name, parts[3]]);
                                    this.reply(name + ' was removed from team ' + tarTeam);
                                    break;
                                default :
                                    this.reply('Usage: .draft override players [add/remove] <team> <player>');
                                    break;
                            }
                            break;
                        default:
                            this.reply('Override command not found. Type .draft help for help.');
                        break;
                    }
                break;
            
            case 'showall' :
            case 'display' :
                if (!drafts[room]) return false;
                drafts[room].showAll(true);
                break;
                
            case 'help' :
            default :
                return this.reply('Help: http://pastebin.com/rX91iTnu');
                break;
        }
    },
    
    b: 'bid',
    bid: function (arg, by, room) {
        if (!drafts[room] || drafts[room].state !== "start" || !drafts[room].nominee) return false;
        drafts[room].runBid(toId(by), arg);
    },
    
    nom: 'nominate',
    nominate: function (arg, by, room) {
        if (!drafts[room] || drafts[room].state !== "nominate") return false;
        drafts[room].runNominate(toId(by), arg);
    },
    
    withdraw: function (arg, by, room) {
        if (!drafts[room] || (drafts[room].state !== "start" && drafts[room].state !== "nominate")) return false;
        drafts[room].withdraw(toId(by));
    },
    
    overpay: function (arg, by, room) {
        if (!drafts[room]) return false;
        this.reply('/wall OVERPAY');
    }
};