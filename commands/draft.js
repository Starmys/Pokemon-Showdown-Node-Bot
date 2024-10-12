'use strict';

const assert = require('assert');
const fs = require('fs');

let drafts = {}; 

class Draft {
    constructor(room, metadata) {
        this.room = room;
        this.teams = {};
        this.players = {};
        this.nomedPlayers = {};
        this.properties = {};
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

        this.mode = metadata["mode"];
        this.initialMoney = metadata["initialMoney"];
        this.minPlayers = metadata["minPlayers"];
        this.maxPlayers = metadata["maxPlayers"];
        this.startPrice = metadata["startPrice"];
        this.stepPrice = metadata["stepPrice"];
        this.canSelfNom = metadata["canSelfNom"];
        this.selfNomPrice = metadata["selfNomPrice"];
        this.defaultTeams = metadata["defaultTeams"];
        this.CNNames = metadata["CNNames"];
        this.retains = metadata["retains"];
        this.defaultTier = metadata["defaultTier"];
        this.defaultGen = metadata["defaultGen"];

        for (let k in this.defaultTeams) {
            this.addTeam(k, this.defaultTeams[k]);
        }
    }

    addTeam (name, leaders) {
        let teamId = toId(name);
        let bidders = {};
        for (let leaderIdx in leaders) {
            let leader = leaders[leaderIdx];
            bidders[toId(leader)] = leader;
            this.managers[toId(leader)] = teamId;
        }
        this.teams[teamId] = {
            "name": name,
            "bidders": bidders,
            "players": [],
            "money": this.initialMoney
        };
        this.activeTeams.push(teamId);
        this.save();
    }

    loadPlayers (url) {
        Tools.autoGet(url, data => {
            try {
                let lines = data.trim().replace(/\r/g, '').split('\n');
                let categories = lines[0].split(',');
                for (let line of lines) {
                    assert.ok(line.split(',').length === categories.length, 'Invalid CSV format');
                }
                if (categories.length > 1) {
                    for (let j = 1; j < categories.length; j++) {
                        this.properties[toId(categories[j]).replace('gen', 'g')] = categories[j];
                    }
                    if (!categories[0]) categories[0] = 'Name';
                    for (let i = 1; i < lines.length; i++) {
                        let parts = lines[i].split(',');
                        let player = parts[0].trim();
                        let playerId = toId(player);
                        this.players[playerId] = {"name": player};
                        for (let j = 0; j < categories.length; j++) {
                            this.players[playerId][categories[j]] = !!parts[j];
                        }
                    }
                    delete this.players[''];
                    return Bot.say(this.room, '选手列表已录入。Playerlist succesfully loaded.');
                }
            } catch (error) {
                console.log(error);
                Bot.say('无效链接或格式错误。Invalid URL or format error.');
            }
        });
    }

    start () {
        let i = 0;
        Object.entries(this.retains).forEach(([teamName, teamRetains]) => {
            let team = this.teams[toId(teamName)];
            Object.entries(teamRetains).forEach(([nominee, amount]) => {
                i++;
                setTimeout(() => this.addPlayer(team, nominee, amount), 200 * i);
            });
        });
        setTimeout(() => {
            this.state = "nominate";
            this.showAll(true);
            this.nomination = Object.keys(this.teams)[0];
            Bot.say(this.room, '选人开始! The draft is up!');
            Bot.say(this.room, this.CNNames[this.teams[this.nomination].name] + '请提名选手。' + this.teams[this.nomination].name + 
                               ' are up to nominate. Bidders: ' + Object.values(this.teams[this.nomination].bidders).join(', '));
        }, 200 * (i + 1));
    }

    nextNominate (force) {//Force - force nomination to go to a NEW team (instead of repeating, like in snake)
        let teams = this.activeTeams;
        let teamIndex = teams.indexOf(this.nomination) + this.currDirr;
        if (teamIndex < 0 || teamIndex === teams.length) {
            this.currDirr = -this.currDirr;
            teamIndex = teams.indexOf(this.nomination) + (force ? this.currDirr : 0);
        }
        this.nomination = teams[teamIndex];
        let nextTeam = this.teams[this.nomination];
        this.state = "nominate";
        Bot.say(this.room, this.CNNames[nextTeam.name] + '请提名选手。' + nextTeam.name + 
                           ' are up to nominate. Bidders: ' + Object.values(nextTeam.bidders).join(', '));
    }

    runNominate (user, target) {
        if (!this.managers[user] || this.nomination !== this.managers[user]) return false;
        let targetId = toId(target);
        if (!this.players[targetId]) {
            if (this.nomedPlayers[targetId]) {
                let teamName = this.nomedPlayers[targetId].name;
                return Bot.say(this.room, '提名的选手已加入' + this.CNNames[teamName] + '。' + 'The user ' + target + ' has joined ' + teamName + '!');
            }
            return Bot.say(this.room, '提名的选手不在名单内。' + 'The user ' + target + ' was not found!');
        }
        let price = this.startPrice;
        if (this.managers[targetId]) {
            if (this.canSelfNom) {
                if (this.managers[targetId] === this.managers[user]) {
                    if (this.mode === 'bid') {
                        price = this.selfNomPrice;
                    }
                } else {
                    return Bot.say(this.room, '不可以提名其他队伍的队长。You cannot nominate a leader of another team.');
                }
            } else {
                return Bot.say(this.room, '不可以提名队长或队伍管理员。You cannot nominate a leader.');
            }
        }
        let targetName = this.players[targetId].name;
        this.nominee = targetName;
		this.state = "start";
        let buffer = [];
        for (let property in this.players[targetId]) {
            if (this.players[targetId][property]) buffer.push(property);
        }
        if (this.mode == "bid") {
            Bot.say(this.room, '> ' + '**' + targetName + '** 开始竞拍! ' + targetName + ' is up for bidding!');
            Bot.say(this.room, '报名分级 Tiers: ' + buffer.join(', '));
        }
        this.runBid(user, this.startPrice);
    }

    showAll (manual) {
        // let reiterations = 0;
        // let teamList = Object.keys(this.teams)
        // let showAllInterval = setInterval(() => {
        //     let team = this.teams[teamList[reiterations]];
        //     if (!team) { 
        //         clearInterval(showAllInterval);
        //         if (!manual) this.nextNominate();
        //         return;
        //     }
        //     Bot.say(this.room, team.name + (this.mode == "bid" ? ': [剩余金额Money: ' + team.money : ': [人数Strength: ' + team.players.length) + 
        //                        ' | 队长Bidders: ' + team.bidders.join(', ') + '] 队员Players: ' + team.players.join(', '));
        //     reiterations++;
        // }, 800);
        let htmlbox = '!htmlbox <table border="1" style="border-collapse:collapse"><tr><th align="center">队名 Team</th><th align="center">队长 Leaders</th><th align="center">队员 Players</th>';
        htmlbox += this.mode == 'bid' ? '<th align="center">余额 Money</th>' : '<th align="center">人数 Strength</th></tr>';
        for (let teamKey in this.teams) {
            let team = this.teams[teamKey];
            let bidderNames = Object.values(team.bidders);
            if (bidderNames.length > 1) {
                bidderNames[1] = '(' + bidderNames[1];
                bidderNames[bidderNames.length - 1] += ')';
            }
            htmlbox += '<tr><td align="center">' + this.CNNames[team.name] + ' ' + team.name + '</td><td align="center">' + bidderNames.join(', ') + '</td><td align="center">' + team.players.join(', ') + '</td>'
            htmlbox += this.mode == 'bid' ? '<td align="center">' + team.money + '</td>' : '<td align="center">' + team.players.length + '</td></tr>';
        }
        htmlbox += '</table>';
        Bot.say(this.room, htmlbox);
        if (!manual) this.nextNominate();
    }

    addPlayer (team, nominee, amount) {
        Bot.say(this.room, nominee + '加入' + this.CNNames[team.name] + '! ' + nominee + ' joined ' + team.name + '!');
        team.money -= amount;
        team.players.push(nominee);
        this.nomedPlayers[toId(nominee)] = team;
        this.draftlog.push(['purchase', nominee, amount, team.name]);
        delete this.players[toId(nominee)];
    }

    runBid (user, amount) {
        if (!this.managers[user]) return false;
        if (isNaN(amount)) return false;
        let team = this.teams[this.managers[user]];
        let teamName = team.name;
        if (amount <= 100) amount *= 1000;
        if (amount <= this.bid) return Bot.say(this.room, teamName + `: Bid must be at least ${this.stepPrice} more than ` + this.bid);
        let maxBid = team.money - (this.minPlayers - team.players.length - 1) * this.startPrice;
	    if (maxBid < 0 || maxBid > team.money) maxBid = team.money;
        if (amount > maxBid) return Bot.say(this.room, teamName + ': Bid exceeds max bid of ' + maxBid);
        if (amount % this.stepPrice !== 0) return Bot.say(this.room, teamName + `: Bid must be a multiple of ${this.stepPrice}`);
        clearTimeout(this.timer);
        if (this.mode == "bid") Bot.say(this.room, '> ' + teamName + ': **' + amount + '**');
        this.bid = amount;
        this.topBidder = user;
        this.timer = setTimeout(() => {
            if (this.mode == "bid") Bot.say(this.room, '__剩余五秒! 5 seconds remaining!__');
            this.timer = setTimeout(() => {
                this.addPlayer(team, this.nominee, amount);
                this.bid = null;
                this.nominee = null;
                this.showAll();
                this.save();
                if (team.money < this.startPrice) {
                    if (this.mode == "bid") {
                        Bot.say(this.room, this.CNNames[team.name] + '金额耗尽。' + team.name + ' has run out of money.');
                    } else {
                        Bot.say(this.room, this.CNNames[team.name] + '名额已满。' + team.name + ' is full.');
                    }
                    this.withdraw(user);
                }
                if (this.maxPlayers && team.players.length >= this.maxPlayers) {
                    Bot.say(this.room, this.CNNames[team.name] + '名额已满。' + team.name + ' is full.');
                    this.withdraw(user);
                }
            }, this.mode == "bid" ? 5000 : 0); /* second left in 1k*/
        }, this.mode == "bid" ? 15000 : 0);
    }

    withdraw (user) {
        let team = this.managers[user];
        if (!team) return false;
        if (!~this.activeTeams.indexOf(team)) return Bot.say(this.room, "您的队伍已退出。Your team has already withdrawn from the auction.");
        Bot.say(this.room, this.CNNames[this.teams[team].name] + '已退出。' + this.teams[team].name + ' have withdrawn from the auction.');
        this.activeTeams.splice(this.activeTeams.indexOf(team), 1);
        if (this.activeTeams.length < 1) return this.end();
        if (this.nomination === team) this.nextNominate(true);
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
            buffer += team.name + ': [Money: ' + team.money + ' | Bidders: ' + Object.values(team.bidders).join(', ') + '] Players: ' + team.players.join(', ') + '\n';
        } 
        buffer += '\n' + this.constructLog();
        /* Tools.uploadToHastebin(buffer, (success, link) => {
            if (success) Bot.say(this.room, '选人结束。The draft is over. Log: ' + link);
            else Bot.say(this.room, '无法上传记录。Error connecting to hastebin.');
        });*/
        this.save();
        Bot.say(this.room, '选人结束。The draft is over.');
        console.log(buffer);
        delete drafts[this.room];
    }

    search (tiers) {
        if (Object.keys(this.properties).length === 0) {
            Bot.say(this.room, '选手数据未录入。You cannot do this without loading player data.');
            return false;
        }
        let propertiesToMatch = {};
        tiers = tiers.split(',');
        for (let tierIdx in tiers) {
            let tier = tiers[tierIdx].trim();
            if (tier === '') continue;
            let propertyId = toId(tier);
            if (!this.properties[propertyId]) {
                propertyId = propertyId.replace('gen', 'g').replace('rb', 'rdb');
                // if (propertyId.endsWith('nd')) propertyId = propertyId.replace('nd', 'nddou');
                if (propertyId === 'vgc') propertyId = 'vgc2022';
                else if (propertyId === 'lgpe') propertyId = 'lgpe' + this.defaultTier;
                else if (propertyId.length === 1 && parseInt(propertyId)) propertyId = 'g' + propertyId + this.defaultTier;
                else if (propertyId.length === 2 && propertyId[0] === 'g') propertyId = propertyId + this.defaultTier;
                else if (propertyId[0] !== 'g') propertyId = this.defaultGen + propertyId;
            }
            let property = this.properties[propertyId];
            if (!property) {
                Bot.say(this.room, tier + '分级未找到。Tier not found.');
                return false;
            }
            propertiesToMatch[property] = true;
        }
        let availablePlayers = [];
        for (let playerId in this.players) {
            let matched = true;
            for (let property in propertiesToMatch) {
                if (!this.players[playerId][property]) {
                    matched = false;
                    break;
                }
            }
            if (matched) availablePlayers.push(this.players[playerId].name);
        }
        propertiesToMatch = Object.keys(propertiesToMatch).join(' & ');
        let htmlbox = '!htmlbox <table border="1" style="border-collapse:collapse"><tr><th align="center">' + propertiesToMatch +
                      ' 剩余选手 Available Players</th></tr><tr><td align="center">' + availablePlayers.join(', ') + '</td></tr></table>'
        Bot.say(this.room, htmlbox);
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
                this.reply('已重置。Draft metadatarmation erased for this room.');
                break;

            case 'init' : 
                if (drafts[room]) return this.reply('请先终止当前的选人活动。There is currently a draft in progress in this room.');
                if (!parts[1]) return this.reply('Usage: /draft init <url>');

                Tools.autoGet(parts[1], data => {
                    try {
                        let metadata = JSON.parse(data.trim());
                        // TODO: typeof metadata["mode"] == 'string';
                        assert.ok("mode" in metadata, "mode required");
                        assert.ok("initialMoney" in metadata, "initialMoney required");
                        assert.ok("minPlayers" in metadata, "minPlayers required");
                        assert.ok("maxPlayers" in metadata, "maxPlayers required");
                        assert.ok("startPrice" in metadata, "startPrice required");
                        assert.ok("stepPrice" in metadata, "stepPrice required");
                        assert.ok("canSelfNom" in metadata, "canSelfNom required");
                        assert.ok("selfNomPrice" in metadata, "selfNomPrice required");
                        assert.ok("defaultTeams" in metadata, "defaultTeams required");
                        assert.ok("CNNames" in metadata, "CNNames required");
                        assert.ok("retains" in metadata, "retains required");
                        assert.ok("defaultTier" in metadata, "defaultTier required");
                        assert.ok("defaultGen" in metadata, "defaultGen required");
                        drafts[room] = new Draft(room, metadata);
                        this.reply('赛事信息已录入。Meta data loaded.');
                        this.reply('初始化完成。A new draft has started!');
                    } catch (error) {
                        console.log(error);
                        this.reply('无效链接或格式错误。Invalid URL or format error.');
                    }
                });
                break;

            case 'addteam' :
                if (!drafts[room] || drafts[room].state !== 'prep') return this.reply('未初始化。There is no draft in configuration in this room.');
                let args = parts.slice(1).join(' ').split(',');
                if (!args[1]) return this.reply('Usage: /draft addteam Name, Captain');
                drafts[room].addTeam(args[0], args.slice(1));
                this.reply('The team ' + args[0] + ' was added.');
                break;
   
            case 'load' :
            case 'loadplayers' :
                if (!drafts[room] || drafts[room].state !== 'prep') return this.reply('未初始化。There is no draft in configuration in this room.');
                if (!parts[1]) return this.reply('Usage: /draft load <url>');
                drafts[room].loadPlayers(parts[1]);
                break;

            case 'start' :
                if (!drafts[room] || drafts[room].state !== 'prep') return this.reply('未初始化。There is no draft in configuration in this room.');
                if (Object.keys(drafts[room].teams).length < 2) return this.reply('选手数据未录入。You cannot start a draft with less than two teams.');
                if (!Object.keys(drafts[room].players).length > 0) return this.reply('选手数据未录入。You cannot do this without loading player data.');
                drafts[room].start();
                break;

            case 'skip' :
                if (!drafts[room] || drafts[room].state === 'prep') return false;
                if (this.timer) clearTimeout(this.timer);
                drafts[room].nextNominate();
                break;

            case 'pause' :
                if (!drafts[room] || drafts[room].state !== 'nominate') return false;
                drafts[room].state = 'pause';
                this.reply('已暂停。The draft was paused');
                break;

            case 'resume' :
                if (!drafts[room] || drafts[room].state !== 'pause') return false;
                drafts[room].state = 'nominate';
                this.reply('已恢复。The draft was resumed!');
                break;

            case 'addbidder' :
                if (!drafts[room]) return false;
                let subargs = parts.slice(1).join(' ').split(',');
                if (!subargs[1]) return this.reply('Usage: .draft addbidder Team, name');
                let teamId = toId(subargs[0]);
                if (!drafts[room].teams[teamId]) return this.reply('The team ' + subargs[0] + ' was not found.');
                drafts[room].teams[teamId].bidders[toId(subargs[1])] = subargs[1].trim();
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
                delete drafts[room].teams[teamid].bidders[userId];
                delete drafts[room].managers[userId];
                this.reply(subparts[1] + ' was removed from bidding for ' + subparts[0] + '.');
                break;

            case 'end' :
                if (!drafts[room]) return this.reply('There is no draft in this room.');
                drafts[room].end();
                break;

            /*case 'override': //YES THIS CODE IS MESSY
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
                break;*/

            case 'showall' :
            case 'display' :
                if (!drafts[room]) return false;
                drafts[room].showAll(true);
                break;

            case 'help' :
            default :
                return this.reply('Help: http://pastebin.com/rX91iTnu');
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
    /*overpay: function (arg, by, room) {
        if (!drafts[room]) return this.reply('未初始化。There is no draft in configuration in this room.');;
        this.reply('/wall OVERPAY');
    },*/

    s: 'search',
    search: function (arg, by, room) {
        if (!drafts[room]) return this.reply('未初始化。There is no draft in configuration in this room.');;
        drafts[room].search(arg);
    }
};
