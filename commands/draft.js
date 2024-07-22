'use strict';
const mode = "bid";
const initialMoney = 120000; // Money each team should start with
const minPlayers = 13; // Forces managers to buy a certain amount of players. To disable, set this to 1
const maxPlayers = 15;
const startPrice = 3000;
const stepPrice = 500;
const canSelfNom = false;
const selfNomPrice = 12000;
const defaultTeams = { //If you want teams set automatically, they can be placed here
    /*
        "Eastern Ruiners":"no41st",
        "Adamas":"mmrrk",
        "Creative Camp":"kitoothe",
        "Free Palatinate of Dyrwood":"separation",
    */
    /*
        "Longkou Vericelli":"drogbainshenhua",
        "Yawning Kingdra":"separation",
        "Soul Dew":"mmrrk",
        "Draco Kilometeor":"vusty",
    */
    /*
        "Dyrwood": "separation",
        "Shinx": "vusty",
        "Soul Dew": "mmrrk",
        "Xros Heart": "vulpot",
    */
    /*
        "WILDFIRE": ["Cure bball"],
        "BRILLIANT DRAGONOID": ["EDG kangri"],
        "EGAINORISOU": ["Unowndragon", "Tninking"],
        "CELESTIC ATHLETIC": ["Drogba in Shenhua", "Ash Lovers"],
        "SLOPPY DREEPY": ["will it rain", "fyfyk"],
        "DANCING KYUREM": ["Neveal", "old_zhiming"],
    */
    /*
        "Made in Heaven": ["Metallica126"],
        "Hammerlocke Spartacus": ["drogba in shenhua"],
        "Never Be Go": ["compection"],
        "Pirouette Meloetta": ["DYWY"],
    */
    /*
        "SLATEPORT TORPEDO": ["DYWY"],
        "SINJOH'S EXPLORER": ["dragonitenb", "Separation"],
        "NIMBASA ROMANCE": ["kitoothe", "gggguang"],
        "HIGAN NO HANABATAKE": ["lzaaaaa", "youke"],
        "MT.SILVER LEGEND": ["Unowndragon"],
        "HAMMERLOCKE SPARTACUS": ["Drogba in Shenhua", "nobeta"],
    */
    /*
        "Crazy Diamond": ["Slow_Dream"],
        "Moonlight Shadow": ["dragonitenb", "chengduoldsuperbro"],
        "A-Soul": ["gostop", "The Steel Shadow"],
        "Roast Magikarp": ["vusty fans", "chickwayne"],
   */
   /*
       "Platform 9¾": ["yoppie", "kitoothe"],
       "Metronome": ["IG Jackeylove", "Let’sgosixers"],
       "Sparkling Shinx": ["old_zhiming", "vusty"],
       "Half Dimension": ["chengduoldsuperbro", "The Steel Shadow"],
   */
    /*
        "TERMINUS GUARDIAN": ["akengs", "old_zhiming"],
        "S.I. MUGEN": ["Rampagewebber"],
        "MIRAGE PHANTOM": ["XPSH"],
        "ETERNAL CROWN": ["Slow_Dream"],
        "PONI FORTE": ["Drogba in Shenhua"],
        "OPELUCID CRUSADERS": ["Metallica126"],
    */
    /*
        "Team 1": ["SeaRabbit"],
        "Team 2": ["xujing691691"],
        "Team 3": ["Allen-xia"],
        "Team 4": ["Metallica126"],
    */
    /*
        "Number Guys": ["dragonitenb"],
        "Hopeful Dreamer": ["Metallica126"],
        "Angelotto": ["Aro Nova"],
        "Platform 9¾": ["yoppie"],
    */
    /*
        "SINJOH'S EXPLORER": ["Slow_Dream", "IGJackeyLove"],
        "MT.SILVER LEGEND": ["idol1900", "CurePersona"],
        "HAMMERLOCKE SPARTACUS": ["Allen-xia", "Chaos23333"],
        "SLATEPORT TORPEDO": ["hot_dogs666", "rubv"],
        "HIGAN NO HANABATAKE": ["cscl", "youke"],
        "NIMBASA ROMANCE": ["gostop", "SeaRabbit"],
    */
    /*
        "Tactical Sweep": ["IGJackeyLove", "dragonitenb"],
        "Syrup": ["Dawnmoon", "Lusteristic"],
        "Bet On We": ["YZII", "Metallica126"],
        "Desolate Land": ["gostop", "Allen-xia"],
    */
    /*
        "Precision Protocol": ["IGJackeyLove", "XPSH"],
        "Clannad": ["Allen-xia", "chickwayne"],
        "Dawn Troupe": ["baibaiats", "burstbean"],
        "Emperor Piplup": ["vusty fans3", "vusty"],
    */
    /*
        "OPELUCID CRUSADERS": ["starmind"],
        "ETERNAL CROWN": ["cscl"],
        "S.I. MUGEN": ["The Steel Shadow"],
        "MIRAGE PHANTOM": ["XPSH"],
    */
    /*
        "Port Ormos":["burstbean","searabbit"],
        "Fuck Maushold":["lusteristic"],
        "Scattered star debris":["niaosui","duguo"],
        "Ending Blitz":["Jinitaimei"],
    */
    /* 
    "Take Me Higher": ["Raiden Mei"],
    "Gracidea": ["burstbean"],
    "Fantasy Wings": ["Slow_Dream"],
    "Sidalin Beam": ["sidalin"],
    */
    /*
    "Abendregen":["musashi109"],
    "Utayuo MIRACLE":["burstbean"],
    "Fully prepared":["Mestronwest"],
    "Flaming Crusaders":["Raceding"],
    */
    /*
    "Go get some fries":["gewwge","Northumberland"],
    "glorious arrow wish":["kaifengyyds","XPSH"],
    "Diana Sweet":["Metallica126","baibaiats"],
    "Rainbow Slowbro Army":["Raceding","sleeptalking"],
    
	"NIMBASA ROMANCE": ["the steel shadow", "yoppie"],  
        "HAMMERLOCKE SPARTACUS": ["Allen-xia", "Amethyst pupil"],
        "HIGAN NO HANABATAKE": ["cscl", "vulpot"],
        "MT.SILVER LEGEND": ["metallica126", "baibaiats"],
	*/
/*
	"Dog Tired": ["gostop", "newyokobaby"],
        "Sakura Wars": ["daidaiwo", "dragonitenb"],
        "Mission Of Her Majesty": ["zhongyeernai", "searabbit"],
        "Ending Blitz": ["raceding", "kaifengyyds"],
*/
/*
"Royal Never Give Up": ["jdk knight"],
	"Metore Enforcer": ["Asou&Chihiro"],
	"Useful Copy Players": ["hybone"],
	"miku fans": ["xqiht"],
*/
/*
	"Spica": ["mliya","metallica126"],
        "Pegasian Sight": ["burstbean"],
        "fly sun": ["wya"],
        "underworld from tangshan": ["dragonitenb"],
*/
/*
        "Kingambit & Sucher Punch": ["soulking0", "Nor known to Life"],
        "Flying Frost Stepping Snow": ["Memoriies", "GDWYuudachi"],
        "Baoshan Poochyena": ["dragonitenb", "old_zhiming"],
        "Wuhan Yamper": ["yzii", "aro nova"],
*/
/*
	"Omanyte Blast": ["jinitaimei", "sidalin"],
	"Dancing Like Crane": ["zhongyeernai", "metallica126"],
	"Overdrive": ["igjackeylove", "aronova"],
	"Pantheon": ["pyernhuy", "chickwayne"],
*/
	
/*
	"OPELUCID CRUSADERS": ["metallica126","KissSheep"],
        "ETERNAL CROWN": ["dare to love xkh"],
        "S.I. MUGEN": ["searabbit","oldzhiming"],
        "MIRAGE PHANTOM": ["Greenland Shadow","XPSH"],
*/
/*
	"A Confession under the Smoke": ["cen344uu "],
        "sleeping starship": ["Sawra2.71828"],
        "hidden plum bossom in snow": ["Soul king0"],
        "kangaskloem": ["Metallica126"],
	*/
	/*
	"super shadow sneak": ["Sawra2.71828","lusteristic"],
        "Frenzy Flygon": ["dawntothedusk","rakukeika"],
        "Horizon to zero": ["metallica","nashrock"],
        "Gallop like thunder": ["soulking0","zhongyeernai"],

	"Double Fake Out": ["Raiden Mei","Metallica126"],
        "Strange Scale Shot": ["greenland shadow","swabluue"],
        "Sleepy Kitten": ["gostop","Sardonyx_Amber"],
        "Mega Kangagolem-Alola Club": ["archer927","cen344u"],
*/
/*
	"Lovely Nekomusume": ["Sawra2.71828","yiyue"],
        "phoenix flutes make music": ["zhongyeernai"],
        "Opelucid Crusaders": ["jinitaimei","metallica126"],
        "Crychic": ["indulge in dreams","cen344uu"],
*/
/*
        "Dream about South Pillar": ["Metallica126","cen344uu"],
        "Circle of Life": ["Rimarinalove","SakakibaraKotone"],
        "Magical Hajimi": ["greenland shadow","duguo"],
        "Kill Your Nine Generation Ancestors": ["xu9","Sardonyx_Amber"],
*/
        "Mt.Silver Legend": ["Metallica126","Mentalsoft"],
        "Higan no Hanabatake": ["Aro Nova","Cscl"],
        "Nimbasa Romance": ["Dare to love xkh","memoriies"],
        "Hammerlocke Spartacus": ["Tkyszl","Lusteristic"],
};
const CNNames = {
    /*
        "OPELUCID CRUSADERS": "双龙十字军",
        "ETERNAL CROWN": "无极神冠",
        "S.I. MUGEN": "南岛无限",
        "MIRAGE PHANTOM": "橘影幻灵",
    
    */
    /*
	"Port Ormos":"奥摩斯港",
	"Fuck Maushold":"乐不思鼠",
	"Scattered star debris":"散落的星骸",
	"Ending Blitz":"终焉的闪焰冲锋",
    */
    /*
    lin Beam": "慈父的光辉",
    "Gracidea": "天空花束",
    "Take Me Higher": "飞得更高",
    "Fantasy Wings": "幻想之翼",*/
    /*
    "Utayuo MIRACLE":"奇迹之歌",
    "Abendregen":"骤雨的隙间",
    "Flaming Crusaders":"双龙赤焰",
    "Fully prepared":"未雨绸缪",
    */
    /*
    "Go get some fries":"整点薯条",
    "glorious arrow wish":"光辉矢愿",
    "Diana Sweet":"嘉然家今天的饭",
    "Rainbow Slowbro Army":"彩虹呆河马军团",
    
	"NIMBASA ROMANCE": "雷文摩天轮",  
        "HAMMERLOCKE SPARTACUS": "拳关斯巴达克",
        "HIGAN NO HANABATAKE": "彼岸花海",
        "MT.SILVER LEGEND": "白银传说",
	*/
	/*
	"Dog Tired": "狗生有了点疲惫",
        "Sakura Wars": "夏日大作战",
        "Mission Of Her Majesty": "还未完成的高贵使命",
        "Ending Blitz": "终焉的闪焰冲锋",
	*/
/*
"Royal Never Give Up": "永不言弃",	
	"Metore Enforcer": "流星惩罚者",
	"Useful Copy Players": "有用的抄队玩家",
	"miku fans": "醉卧沙场",
*/
/*
	"Spica": "璀璨流星",
        "Pegasian Sight": "天马视域",
        "underworld from tangshan": "唐山黑社会",
        "fly sun": "天翊和曦",
*/
/*
        "Kingambit & Sucher Punch": "酱与突袭",
        "Flying Frost Stepping Snow": "飞霜踏雪",
        "Baoshan Poochyena": "宝山土狼犬",
        "Wuhan Yamper": "武汉来电汪",
*/
/*
        "Omanyte Blast": "皇家爆炎2.0",
        "Dancing Like Crane": "琼芳鹤舞",
        "Overdrive": "超限暴走",
        "Pantheon": "没有影子的小孩",

        "A Confession under the Smoke": "青烟下的告白",
        "sleeping starship": "眠梦星河",
        "hidden plum bossom in snow": "踏雪寻梅",
        "kangaskloem": "袋隆十字军",

	"super shadow sneak": "超级影袭",
        "Frenzy Flygon": "热砂蜻蜓",
        "Horizon to zero": "重造地平线",
        "Gallop like thunder": "星驰电掣",


	"Double Fake Out": "击掌双袭",
        "Strange Scale Shot": "神奇鳞射",
        "Sleepy Kitten": "咪咪糊糊",
        "Mega Kangagolem-Alola Club": "袋隆俱乐部",
*/
/*
	"Lovely Nekomusume": "萌混过关",
        "phoenix flutes make music": "凤箫声动",
        "Opelucid Crusaders": "双龙十字军",
        "Crychic": "春日影",
*/
/*
	"Dream about South Pillar": "南梁一梦",
        "Circle of Life": "生生不息的激荡",
        "Magical Hajimi": "神奇哈基米",
        "Kill Your Nine Generation Ancestors": "九族男孩重度依赖",
*/
        "Mt.Silver Legend": "白银传说",
        "Higan no Hanabatake": "彼岸花海",
        "Nimbasa Romance": "雷文摩天轮",
        "Hammerlocke Spartacus": "拳关斯巴达克",
};
const retains = {
/*
        "Clannad": {"chickwayne": 12000},
        "Dawn Troupe": {},
        "Precision Protocol": {},
        "Emperor Piplup": {},

*/
	/*"NIMBASA ROMANCE": {},
        "HAMMERLOCKE SPARTACUS": {"allenxia":17000},
        "HIGAN NO HANABATAKE": {"cscl":17000,"vulpot":17000},
        "MT.SILVER LEGEND": {"baibaiats":17000},
	*/
/*
        "Spica": {"metallica126": 10000},
	"Pegasian Sight": {"burstbean":10000},
        "underworld from tangshan": {},
        "fly sun": {},
*/
/*
        "Kingambit & Sucher Punch": {"Nor known to Life": 11000},
        "Flying Frost Stepping Snow": {"GDWYuudachi": 11000},
        "Baoshan Poochyena": {},
        "Wuhan Yamper": {},
*/
/*
	"Omanyte Blast": {"jinitaimei": 15000},
        "Dancing Like Crane": {"metallica126": 15000},
        "Overdrive": {"aronova": 15000},
        "Pantheon": {"chickwayne": 15000},

	"super shadow sneak": {"Sawra2.71828": 12000},
        "Frenzy Flygon": {"dawntothedusk":12000,"rakukeika":12000},
        "Horizon to zero": {"metallica":12000},
        "Gallop like thunder": {"soulking0":12000},


	"Double Fake Out": {"Metallica126": 15000},
        "Strange Scale Shot": {"greenland shadow":15000},
        "Sleepy Kitten": {"gostop":15000},
	"Mega Kangagolem-Alola Club": {},
*/
/*
	"Lovely Nekomusume": {"yiyue":12000},
        "phoenix flutes make music": {},
        "Opelucid Crusaders": {"jinitaimei":12000},
        "Crychic": {"cen344uu":12000},
*/
/*
	"Dream about South Pillar": {},
	"Circle of Life": {"SakakibaraKotone": 9500},
        "Magical Hajimi": {},
        "Kill Your Nine Generation Ancestors": {},
*/
        "Mt.Silver Legend": {"Metallica126": 18000, "Mentalsoft": 18000},
        "Higan no Hanabatake": {"cscl": 18000},
        "Nimbasa Romance": {},
        "Hammerlocke Spartacus": {},
}
const defaultTier = "ou";
const defaultGen = "g9";

const { strict } = require('assert');
const fs = require('fs');

let drafts = {}; 

class Draft {
    constructor(room) {
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
            "money": initialMoney
        };
        this.activeTeams.push(teamId);
        this.save();
    }

    loadPlayers (url) {
        Tools.httpGet(url, data => {
            if (data) {
                let lines = data.replace(/\r/g, '').split('\n');
                let categories = lines[0].split(',');
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
                            this.players[playerId][categories[j]] = parts[j];
                        }
                    }
                    delete this.players[''];
                    return Bot.say(this.room, '选手列表已录入。Playerlist succesfully loaded.');
                }
            }
            Bot.say(this.room, '无效链接或格式错误。Invalid URL or format error.');
        });
    }

    start () {
        let i = 0;
        Object.entries(retains).forEach(([teamName, teamRetains]) => {
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
            Bot.say(this.room, CNNames[this.teams[this.nomination].name] + '请提名选手。' + this.teams[this.nomination].name + 
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
        Bot.say(this.room, CNNames[nextTeam.name] + '请提名选手。' + nextTeam.name + 
                           ' are up to nominate. Bidders: ' + Object.values(nextTeam.bidders).join(', '));
    }

    runNominate (user, target) {
        if (!this.managers[user] || this.nomination !== this.managers[user]) return false;
        let targetId = toId(target);
        if (!this.players[targetId]) {
            if (this.nomedPlayers[targetId]) {
                let teamName = this.nomedPlayers[targetId].name;
                return Bot.say(this.room, '提名的选手已加入' + CNNames[teamName] + '。' + 'The user ' + target + ' has joined ' + teamName + '!');
            }
            return Bot.say(this.room, '提名的选手不在名单内。' + 'The user ' + target + ' was not found!');
        }
        let price = startPrice;
        if (this.managers[targetId]) {
            if (canSelfNom) {
                if (this.managers[targetId] === this.managers[user]) {
                    if (mode === 'bid') {
                        price = selfNomPrice;
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
            if (this.players[targetId][property] === 'X') buffer.push(property);
        }
        if (mode == "bid") {
            Bot.say(this.room, '> ' + '**' + targetName + '** 开始竞拍! ' + targetName + ' is up for bidding!');
            Bot.say(this.room, '报名分级 Tiers: ' + buffer.join(', '));
        }
        this.runBid(user, startPrice);
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
        //     Bot.say(this.room, team.name + (mode == "bid" ? ': [剩余金额Money: ' + team.money : ': [人数Strength: ' + team.players.length) + 
        //                        ' | 队长Bidders: ' + team.bidders.join(', ') + '] 队员Players: ' + team.players.join(', '));
        //     reiterations++;
        // }, 800);
        let htmlbox = '!htmlbox <table border="1" style="border-collapse:collapse"><tr><th align="center">队名 Team</th><th align="center">队长 Leaders</th><th align="center">队员 Players</th>';
        htmlbox += mode == 'bid' ? '<th align="center">余额 Money</th>' : '<th align="center">人数 Strength</th></tr>';
        for (let teamKey in this.teams) {
            let team = this.teams[teamKey];
            let bidderNames = Object.values(team.bidders);
            if (bidderNames.length > 1) {
                bidderNames[1] = '(' + bidderNames[1];
                bidderNames[bidderNames.length - 1] += ')';
            }
            htmlbox += '<tr><td align="center">' + CNNames[team.name] + ' ' + team.name + '</td><td align="center">' + bidderNames.join(', ') + '</td><td align="center">' + team.players.join(', ') + '</td>'
            htmlbox += mode == 'bid' ? '<td align="center">' + team.money + '</td>' : '<td align="center">' + team.players.length + '</td></tr>';
        }
        htmlbox += '</table>';
        Bot.say(this.room, htmlbox);
        if (!manual) this.nextNominate();
    }

    addPlayer (team, nominee, amount) {
        Bot.say(this.room, nominee + '加入' + CNNames[team.name] + '! ' + nominee + ' joined ' + team.name + '!');
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
        if (amount <= this.bid) return Bot.say(this.room, teamName + `: Bid must be at least ${stepPrice} more than ` + this.bid);
        let maxBid = team.money - (minPlayers - team.players.length - 1) * startPrice;
	    if (maxBid < 0 || maxBid > team.money) maxBid = team.money;
        if (amount > maxBid) return Bot.say(this.room, teamName + ': Bid exceeds max bid of ' + maxBid);
        if (amount % stepPrice !== 0) return Bot.say(this.room, teamName + `: Bid must be a multiple of ${stepPrice}`);
        clearTimeout(this.timer);
        if (mode == "bid") Bot.say(this.room, '> ' + teamName + ': **' + amount + '**');
        this.bid = amount;
        this.topBidder = user;
        this.timer = setTimeout(() => {
            if (mode == "bid") Bot.say(this.room, '__剩余五秒! 5 seconds remaining!__');
            this.timer = setTimeout(() => {
                this.addPlayer(team, this.nominee, amount);
                this.bid = null;
                this.nominee = null;
                this.showAll();
                this.save();
                if (team.money < startPrice) {
                    if (mode == "bid") {
                        Bot.say(this.room, CNNames[team.name] + '金额耗尽。' + team.name + ' has run out of money.');
                    } else {
                        Bot.say(this.room, CNNames[team.name] + '名额已满。' + team.name + ' is full.');
                    }
                    this.withdraw(user);
                }
                if (maxPlayers && team.players.length >= maxPlayers) {
                    Bot.say(this.room, CNNames[team.name] + '名额已满。' + team.name + ' is full.');
                    this.withdraw(user);
                }
            }, mode == "bid" ? 5000 : 0); /* second left in 1k*/
        }, mode == "bid" ? 15000 : 0);
    }

    withdraw (user) {
        let team = this.managers[user];
        if (!team) return false;
        if (!~this.activeTeams.indexOf(team)) return Bot.say(this.room, "您的队伍已退出。Your team has already withdrawn from the auction.");
        Bot.say(this.room, CNNames[this.teams[team].name] + '已退出。' + this.teams[team].name + ' have withdrawn from the auction.');
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
                else if (propertyId === 'lgpe') propertyId = 'lgpe' + defaultTier;
                else if (propertyId.length === 1 && parseInt(propertyId)) propertyId = 'g' + propertyId + defaultTier;
                else if (propertyId.length === 2 && propertyId[0] === 'g') propertyId = propertyId + defaultTier;
                else if (propertyId[0] !== 'g') propertyId = defaultGen + propertyId;
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
                if (this.players[playerId][property] !== 'X') {
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
                this.reply('已重置。Draft information erased for this room.');
                break;

            case 'init' : 
                if (drafts[room]) return this.reply('请先终止当前的选人活动。There is currently a draft in progress in this room.');
                drafts[room] = new Draft(room);
                this.reply('初始化完成。A new draft has started!');
                for (let k in defaultTeams) {
                    drafts[room].addTeam(k, defaultTeams[k]);
                }
                if (~Object.keys(drafts[room].teams)) this.reply('队长数据已录入。Default data loaded.');
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
