const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./users.sqlite');

client.on("ready", () => {
	client.user.setActivity(client.guilds.size + " servers", { type: "WATCHING"})
  // Check if the table "users" exists.
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'users';").get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE users (id TEXT PRIMARY KEY, user TEXT, guild TEXT, name INTEGER, str INTEGER, agi INTEGER, con INTEGER, int INTEGER, money INTEGER, exp INTEGER, level INTEGER, stamina INTEGER, health INTEGER, chealth INTEGER, armor INTEGER, evasion INTEGER, damage INTEGER, item1 INTEGER, item2 INTEGER, item3 INTEGER, item4 INTEGER, slot1 INTEGER, slot2 INTEGER, minlevel INTEGER, minexp INTEGER, copper INTEGER, bronze INTEGER, iron INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_users_id ON users (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  
  //Throw error exception into console
client.on('error', console.error);

 process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    client.logger.error(`Uncaught Exception Error: ${errorMsg}`);
    // Raven.captureException(err);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    client.logger.error(`Unhandled Rejection Error: ${err}`);
    client.channels.get('515226748393226271').send(err);
    Raven.captureException(err);
  });


  //Need to use a function to unify everyone of these
  client.getData = sql.prepare("SELECT * FROM users WHERE user = ? AND guild = ?");
  client.getHealth = sql.prepare("SELECT chealth FROM users WHERE user = ? AND guild = ?");
  client.getStamina = sql.prepare("SELECT stamina FROM users WHERE user = ? AND guild = ?");
  client.getGold = sql.prepare("SELECT money FROM users WHERE user = ? AND guild = ?");
  client.getLevel = sql.prepare("SELECT level FROM users WHERE user = ? AND guild = ?");
  client.setGold1 = sql.prepare("UPDATE users SET money = ?  WHERE user = ? AND guild = ?");
  client.getItem1 = sql.prepare("SELECT item1 FROM users WHERE user = ? AND guild = ?");
  client.setItem1 = sql.prepare("UPDATE users SET item1 = '1' WHERE user = ? AND guild = ?");
  client.getItem2 = sql.prepare("SELECT item2 FROM users WHERE user = ? AND guild = ?");
  client.setItem2 = sql.prepare("UPDATE users SET item2 = '1' WHERE user = ? AND guild = ?");
  client.getItem3 = sql.prepare("SELECT item3 FROM users WHERE user = ? AND guild = ?");
  client.setItem3 = sql.prepare("UPDATE users SET item3 = '1' WHERE user = ? AND guild = ?");
  client.getItem4 = sql.prepare("SELECT item4 FROM users WHERE user = ? AND guild = ?");
  client.setItem4 = sql.prepare("UPDATE users SET item4 = '1' WHERE user = ? AND guild = ?");
  client.takeItem1 = sql.prepare("UPDATE users SET item1 = '0' WHERE user = ? AND guild = ?");
  client.setData = sql.prepare("INSERT OR REPLACE INTO users (id, user, guild, name, str, agi, con, int, money, exp, level, stamina, health, chealth, armor, evasion, damage, item1, item2, item3, item4, slot1, slot2, minlevel, minexp, copper, bronze, iron) VALUES (@id, @user, @guild, @name, @str, @agi, @con, @int, @money, @exp, @level, @stamina, @health, @chealth, @armor, @evasion, @damage, @item1, @item2, @item3, @item4, @slot1, @slot2, @minlevel, @minexp, @copper, @bronze, @iron);");
 
  console.log("Database check suceeded");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
	// Creates a character if the user doesn't have an existing character
	if (command === "new") {
	const sayMessage = args.join(" ");
	let userdata = client.getData.get(message.author.id, message.guild.id);
	if (!userdata) {
		//Classes ifs
    userdata = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, name: sayMessage, str: 0, agi: 0, con: 0, money: 10, int: 0, exp: 0, level: 1, stamina: 10, health: 10, chealth: 10, armor: 10, evasion: 1, damage: 1, item1: 0, item2: 0, item3: 0, item4: 0, slot1: 0, slot2: 0, minlevel: 1, minexp: 0, copper: 0, bronze: 0, iron: 0 }
	client.setData.run(userdata);
	message.channel.send(message.author + " has made a character named " + sayMessage);
	return message.channel.send(message.author + "you have an unspent **Skill point**. Use ´!skills´ to use it");
	}else{
	return message.channel.send("You already have a character created");
	}
	}
	
	
	// Admin only command to output author's ID to console for validation purposes
	//Exceptions
	const exception0 = client.getData.get(message.author.id, message.guild.id);
	if (!exception0) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if (command === "dbcheck") {
		let view = client.getData.get(message.author.id, message.guild.id);
		//return message.channel.send(view.id);
		console.log(view);
	}
	
	}
	// Basic view commands
		//Exceptions
		const exception1 = client.getData.get(message.author.id, message.guild.id);
		if (!exception1) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
	
		if (command === "health") {
			let view = client.getHealth.get(message.author.id, message.guild.id);
			return message.channel.send("Health: " + view.chealth);
		}
		
		}
		
		//Exceptions
		const exception2 = client.getData.get(message.author.id, message.guild.id);
		if (!exception2) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
	
		if (command === "level") {
			let view = client.getLevel.get(message.author.id, message.guild.id);
			return message.channel.send("Level: " + view.level);
		}
		
		}
		
		//Exceptions
		const exception3 = client.getData.get(message.author.id, message.guild.id);
		if (!exception3) {
			return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
	
		if (command === "stamina") {
			let view = client.getStamina.get(message.author.id, message.guild.id);
			return message.channel.send("Stamina: " + view.stamina);
		}
		
		}
		
		//Class Mechanics
			
		//Exceptions
		const exception4 = client.getData.get(message.author.id, message.guild.id);
		if (!exception4) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
			
		if (command === "pickclass") {
			
		}
		
		}
		
		
		//Stats command
		
		// Test Purposes (Set db fields)
		//Exceptions
		const exception5 = client.getData.get(message.author.id, message.guild.id);
		if (!exception5) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
		
		if (command === "givei1") {
			client.setItem1.run(message.author.id, message.guild.id);
			return message.channel.send("command done");
		}
		
		}
		
		//Exceptions
		const exception6 = client.getData.get(message.author.id, message.guild.id);
		if (!exception6) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
		
		if (command === "takei1") {
			client.takeItem1.run(message.author.id, message.guild.id);
			return message.channel.send("command done");
		}
		
		}
		
		//Professions
		
		//Exceptions
		const exception24 = client.getData.get(message.author.id, message.guild.id);
		if (!exception24) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
			
			
			if (command === "mining" || command === "mine") {
				
				const fminlevel = sql.prepare("SELECT minlevel FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				var minlevel = fminlevel.minlevel;
				const fcopper = sql.prepare("SELECT copper FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				var copper = fcopper.copper;
				const fbronze = sql.prepare("SELECT bronze FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				var bronze = fbronze.bronze;
				const firon = sql.prepare("SELECT iron FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				var iron = firon.iron;
				
				function getRandomInt(min, max) {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min + 1)) + min;
				}
				
				minenames = ["copper", "bronze", "iron"];
				
				aminlvl = minlevel - 1;
				
				amount = getRandomInt(minlevel, minlevel+2);
									
				const giveItems = sql.prepare("UPDATE users SET ? = ? + ? WHERE user = ? AND guild = ?").run(minenames[aminlvl], minenames[aminlvl], amount, message.author.id, message.guild.id);
				
				message.channel.send("You have mined and collected " + amount + " of " + minenames[aminlvl]);
				
				//Give Mine Experience
				
				//Vars
				const fmexp = sql.prepare("SELECT minexp FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const mexp = fmexp.minexp;
				const currentlevel = minlevel;
				
				//Exp gain per mining
				var gexp = minlevel*2;
				//Required exp for level up
				var mlevelup = currentlevel*4;
				var lmexp = (gexp + mexp - mlevelup);
				var gainexp = (gexp + mexp);
				var pmlvl = (currentlevel + 1);
			
				//Exp and Level up
				if ((gexp + mexp) >= mlevelup) {
				
					const updatemlvl = sql.prepare("UPDATE users SET minlevel = minlevel + 1 WHERE user = ? AND guild = ?").run(message.author.id, message.guild.id);
					const updatmexp = sql.prepare("UPDATE users SET minexp = ? WHERE user = ? AND guild = ?").run(lmexp, message.author.id, message.guild.id);
					message.channel.send(message.author + " You have gained " + gexp + " points of minning experience, and you have leveled up minning to level " + pmlvl + " with a total of " + lmexp + " points of minning experience, out of " + mlevelup + " required to level up");
				
				}else if ((gexp + mexp < mlevelup)) {
					
					const updatmexp = sql.prepare("UPDATE users SET exp = ? WHERE user = ? AND guild = ?").run(gexp, message.author.id, message.guild.id);
					message.channel.send(message.author + " You have gained " + gexp + " points of minning experience, to a total of " + gainexp + " out of " + mlevelup + " required minning experience points to level up");
				
						
				//End of Exp and Level up
				}
				
				
				
		}
	}
		
		//Skills
		//User needs to pick one point per level (including default level)
		//Need to make stamina per hour and exp mechanic
		
		//Exceptions
		const exception7 = client.getData.get(message.author.id, message.guild.id);
		if (!exception7) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
		
		if (command === "skills") {
			const split = args.join(" ");
			if (split === "help") {

			    const embed = new Discord.RichEmbed()
				  .setTitle("Skills")
				  .setDescription("You can spend skill points by using their respective commands:")
				  .setAuthor(message.author.username, message.author.avatarURL)
				  .setColor(0x0000FF);
					embed.addField("Strength - This skill will increase your damage with melee weapons", "!str");
					embed.addField("Agility - This skill will increase your evasion from attacks", "!agi");
					embed.addField("Constitution - This skill will increase health", "!con");
					embed.addField("Inteligence - This skill will increase your damage with spells", "!int");
		
						return message.channel.send({embed});
			
		}else{
			
				const skill1 = sql.prepare("SELECT str FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const skill2 = sql.prepare("SELECT agi FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const skill3 = sql.prepare("SELECT con FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const skill4 = sql.prepare("SELECT int FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
					total = (skill1.str + skill2.agi + skill3.con + skill4.int);
					let level = client.getLevel.get(message.author.id, message.guild.id);
			
					if (level.level > total) {
						message.channel.send("You have an unspent skill point.");
						message.channel.send("Type `!str`, `!agi`, `!con` or `!int` to use it.");
						return message.channel.send("Type `!skills help` for detailed information about skills.");
					}else{
						message.channel.send("You don't have any skill points to spend right now. You need to level up.");
					return message.channel.send("Type `!skills help` for detailed information about skills.");
					}
			
			}
		
		}
		
		}
		
	//Skill Set - STR
	
	//Exceptions
	const exception8 = client.getData.get(message.author.id, message.guild.id);
	if (!exception8) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if (command === "str") {
		const skill1 = sql.prepare("SELECT str FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill2 = sql.prepare("SELECT agi FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill3 = sql.prepare("SELECT con FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill4 = sql.prepare("SELECT int FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
			total = (skill1.str + skill2.agi + skill3.con + skill4.int);
			let level = client.getLevel.get(message.author.id, message.guild.id);
	
			if (level.level > total) {
				const setStrength = sql.prepare("UPDATE users SET str = str + 1 WHERE user = ? AND guild = ?").run(message.author.id, message.guild.id);
				const tstr = (skill1.str + 1);
				return message.channel.send("You have leveled up your strength to a total of " + tstr);
			}else{
				return message.channel.send("You don't have any skill points to spend. You need to level up in order to get skill points.");
			}
	}
	
	}
	
	//Skill Set - AGI
	
	//Exceptions
	const exception9 = client.getData.get(message.author.id, message.guild.id);
	if (!exception9) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{

	if (command === "agi") {
		const skill1 = sql.prepare("SELECT str FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill2 = sql.prepare("SELECT agi FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill3 = sql.prepare("SELECT con FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill4 = sql.prepare("SELECT int FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
			total = (skill1.str + skill2.agi + skill3.con + skill4.int);
			let level = client.getLevel.get(message.author.id, message.guild.id);
	
			if (level.level > total) {
				const setAgility = sql.prepare("UPDATE users SET agi = agi + 1 WHERE user = ? AND guild = ?").run(message.author.id, message.guild.id);
				const tagi = (skill2.agi + 1);
				return message.channel.send("You have leveled up your agility to a total of " + tagi);
			}else{
				return message.channel.send("You don't have any skill points to spend. You need to level up in order to get skill points.");
			}
	}
	
	}
	//Skill Set - CON
	
	//Exceptions
	const exception10 = client.getData.get(message.author.id, message.guild.id);
	if (!exception10) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{

	if (command === "con") {
		const skill1 = sql.prepare("SELECT str FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill2 = sql.prepare("SELECT agi FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill3 = sql.prepare("SELECT con FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill4 = sql.prepare("SELECT int FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
			total = (skill1.str + skill2.agi + skill3.con + skill4.int);
			let level = client.getLevel.get(message.author.id, message.guild.id);
	
			if (level.level > total) {
				const setConstitution = sql.prepare("UPDATE users SET con = con + 1 WHERE user = ? AND guild = ?").run(message.author.id, message.guild.id);
				const tcon = (skill3.con + 1);
				return message.channel.send("You have leveled up your constitution to a total of " + tcon);
			}else{
				return message.channel.send("You don't have any skill points to spend. You need to level up in order to get skill points.");
			}
	}
	
	}
	
	//Skill Set - INT
	
	//Exceptions
	const exception11 = client.getData.get(message.author.id, message.guild.id);
	if (!exception11) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{

	if (command === "int") {
		const skill1 = sql.prepare("SELECT str FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill2 = sql.prepare("SELECT agi FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill3 = sql.prepare("SELECT con FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const skill4 = sql.prepare("SELECT int FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
			total = (skill1.str + skill2.agi + skill3.con + skill4.int);
			let level = client.getLevel.get(message.author.id, message.guild.id);
	
			if (level.level > total) {
				const setIntelligence = sql.prepare("UPDATE users SET int = int + 1 WHERE user = ? AND guild = ?").run(message.author.id, message.guild.id);
				const tint = (skill4.int + 1);
				return message.channel.send("You have leveled up your intelligence to a total of " + tint);
			}else{
				return message.channel.send("You don't have any skill points to spend. You need to level up in order to get skill points.");
			}
	}
	
	}
	//Set Level (Admin Command)
	
	//Exceptions
	const exception12 = client.getData.get(message.author.id, message.guild.id);
	if (!exception12) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if (command === "setlevel") {
		const setting = args.join(" ");
		const setLevel = sql.prepare("UPDATE users SET level = ? WHERE user = ? AND guild = ?").run(setting, message.author.id, message.guild.id);
		return message.channel.send("Level has been set successfully to " + setting);
		}
		
		//Tip to future self
		//Add item: shop embed add field, command on buy-item, inventory, equipped, e command, unequip
		
		
	}
	
	//Exceptions
	const exception23 = client.getData.get(message.author.id, message.guild.id);
	if (!exception23) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if (command === "setstamina") {
		const maxvalue = 10;
		const setStamina = sql.prepare("UPDATE users SET stamina = ? WHERE user = ? AND guild = ?").run(maxvalue, message.author.id, message.guild.id);
		return message.channel.send("Stamina set back to 10 on self");
		}	
	}
	
	//Shop
	
	//Exceptions
	const exception13 = client.getData.get(message.author.id, message.guild.id);
	if (!exception13) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if(command === "store") {
    // I'll leave items local for now 
    // Create the embed
    const embed = new Discord.RichEmbed()
      .setTitle("Store")
	  .setDescription("You can buy an item with the command `buy-item <name>`")
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(0x0000FF);
		embed.addField("1 Gold - One-Handed Sword", "1-4 Damage + Str");
		embed.addField("1 Gold - Leather Armor", "+1 Armor");
		embed.addField("1 Gold - Short Bow", "1-6 Damage + Agi");
		embed.addField("1 Gold - Fireball Spell", "1-6 Damage + Int (Requires 1 Intelligence)");
		
    return message.channel.send({embed});
	}
  
	}
	
	//Buying items
	
	//Exceptions
	const exception14 = client.getData.get(message.author.id, message.guild.id);
	if (!exception14) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if(command === "buy-item") {
		const itembuying = args.join(" ");
		if(itembuying == "One-Handed Sword"){
			const price = 1;
			let exist = client.getItem1.get(message.author.id, message.guild.id);
			if(exist.item1 == 0){
			let gold = client.getGold.get(message.author.id, message.guild.id);
			if(gold.money >= price){
				client.setItem1.run(message.author.id, message.guild.id);
				const bal = (gold.money - price);
				client.setGold1.run(bal, message.author.id, message.guild.id);
				return message.channel.send("You've bought the `One-Handed Sword`, and you now have " + bal + " gold left.");
			}else{
				return message.channel.send("You don't have enough gold to purchase the `One-Handed Sword`, you currently only have " + gold.money + " gold.");
			}

			}else{
				return message.channel.send("You already have this item");
			}
		}else if(itembuying == "Leather Armor"){
			const price = 1;
			let exist = client.getItem2.get(message.author.id, message.guild.id);
			if(exist.item2 == 0){
			let gold = client.getGold.get(message.author.id, message.guild.id);
			if(gold.money >= price){
				client.setItem2.run(message.author.id, message.guild.id);
				const bal = (gold.money - price);
				client.setGold1.run(bal, message.author.id, message.guild.id);
				return message.channel.send("You've bought the `Leather Armor`, and you now have " + bal + " gold left.");
			}else{
				return message.channel.send("You don't have enough gold to purchase the `Leather Armor`, you currently only have " + gold.money + " gold.");
			}

			}else{
				return message.channel.send("You already have this item");
			}
		}else if(itembuying == "Short Bow"){
			const price = 1;
			let exist = client.getItem3.get(message.author.id, message.guild.id);
			if(exist.item3 == 0){
			let gold = client.getGold.get(message.author.id, message.guild.id);
			if(gold.money >= price){
				client.setItem3.run(message.author.id, message.guild.id);
				const bal = (gold.money - price);
				client.setGold1.run(bal, message.author.id, message.guild.id);
				return message.channel.send("You've bought the `Short Bow`, and you now have " + bal + " gold left.");
			}else{
				return message.channel.send("You don't have enough gold to purchase the `Short Bow`, you currently only have " + gold.money + " gold.");
			}

			}else{
				return message.channel.send("You already have this item");
			}
			//Magic Items (Req Int)
		}else if(itembuying == "Fireball Spell"){
			const userint = sql.prepare("SELECT int FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
			const uint = userint.int;
			const price = 1;
			let exist = client.getItem4.get(message.author.id, message.guild.id);
			if(exist.item4 == 0){
			let gold = client.getGold.get(message.author.id, message.guild.id);
			if(gold.money >= price && uint >= 1){
				client.setItem4.run(message.author.id, message.guild.id);
				const bal = (gold.money - price);
				client.setGold1.run(bal, message.author.id, message.guild.id);
				return message.channel.send("You've bought the `Fireball Spell`, and you now have " + bal + " gold left.");
			}else{
				return message.channel.send("You don't have enough gold to purchase the `Fireball Spell`, you currently only have " + gold.money + " gold. Or you don't have the require Intelligence to buy it.");
			}

			}else{
				return message.channel.send("You already have this item");
			}
		}else{
		
			return message.channel.send("This item does not exist");
		
		}
			
	}
	
	}
	
	//Fight Mechanics
	
		//Exceptions
		const exception15 = client.getData.get(message.author.id, message.guild.id);
		if (!exception15) {
		return message.channel.send("You have to create a character first. Use !new to create one.");
		}else{
				
			if (command === "adventure") {

				const userhealth = sql.prepare("SELECT chealth FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const uch = userhealth.chealth;
				const useragi = sql.prepare("SELECT agi FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const uagi = useragi.agi;
				const userstr = sql.prepare("SELECT str FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const ustr = userstr.str;
				const userint = sql.prepare("SELECT int FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const uint = userint.int;
				const userlevel = sql.prepare("SELECT level FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const ulvl = userlevel.level;
				const userarmor = sql.prepare("SELECT armor FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const uarmor = userarmor.armor;
				const mlevel = (userlevel.level - 1);
				const userdamage = sql.prepare("SELECT damage FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const hit = userdamage.damage;
				const fslot1 = sql.prepare("SELECT slot1 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const slot1 = fslot1.slot1;
				const fslot2 = sql.prepare("SELECT slot2 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
				const slot2 = fslot2.slot2;
				
				//Ifs for weapons

				//Monsters List
				var mname = ["Rat", "Zombie", "Archer"];
				var mdesc = ["A sewer rat that is ridden with aids and cancer", "Your regular zombie", "He's pretty good at aiming"];
				var mimage = ["http://1.bp.blogspot.com/-evLbvBq1YaA/VLZwjpW4-hI/AAAAAAAAAng/qsoW3b1pSsk/s1600/brainrat.png", "http://3.bp.blogspot.com/-a7sAuriuD3k/VLZwm3B2FdI/AAAAAAAAAnw/is8C4Rl0O_k/s1600/yethhound.png", "http://1.bp.blogspot.com/-PuA86ECJ4u0/VLZw2JPOPiI/AAAAAAAAAoQ/ccxMGSc4w6Y/s1600/blackknight.png"];

				if (ulvl <= 0) {

					message.channel.send("You don't have a character to fight with! Use !new <name> to create one.");

				} else if (uch <= 0) {

					message.channel.send("You're unconscious, use !rest to get some health back.");

				} else {

				
					mhealth = mlevel + 6;
					
					//Avatar Part
					let embed = new Discord.RichEmbed()
						.setTitle(mname[mlevel])
						.setDescription(mdesc[mlevel])
						.setColor('0x0000FF')
						.setFooter("Commands: hit | run")
						.setThumbnail(mimage[mlevel])
						.setAuthor(message.author.username, message.author.avatarURL)
						.addField('Monster Health', mhealth)

					messageToEdit = await
					message.reply({embed});

					let filter = m => m.author.id === message.author.id;
					let collector = new Discord.MessageCollector(message.channel, filter, {
						//max: 3
					})

					collector.on('collect', function (message, collector) {
						if (message.content === 'hit') {
							
							
								function getRandomInt(min, max) {
								min = Math.ceil(min);
								max = Math.floor(max);
								return Math.floor(Math.random() * (max - min + 1)) + min;
								}
							
								earmor = 0;
								
								//Check for Armors
								if (slot1 == 2){
									earmor = 1;
								}else{
									earmor = 0;
								}
								
								//Display Health Var (Ignore)
								dch = ch;
								
								//Player Armor
								darmor = uarmor + uagi + earmor;
								
								//Monster Hit
								mhit = getRandomInt(1,20) + mlevel + 5;
								//Monster Damage
								mdamage = getRandomInt(mlevel+1, mlevel+3);
								//Monster Armor
								marmor = 5 + (mlevel * 2);
								//Declare Player Hit
								phit = 0;
								
								//Check for Weapons

								if (slot2 == 1){
									pdamage = getRandomInt(1,4) + ustr;
									phit = getRandomInt(1,20) + ustr;
								}else if (slot2 == 3){
									pdamage = getRandomInt(1,6) + uagi;
									phit = getRandomInt(1,20) + uagi;
								}else if (slot2 == 4){
									pdamage = getRandomInt(1,6) + uint;
									phit = getRandomInt(1,20) + uint;
								}else{
									pdamage = hit + ustr;
									phit = getRandomInt(1,20) + uagi;
								}
							
							
								
								const chealth = sql.prepare("SELECT chealth FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
								var ch = chealth.chealth;
								
								//Update monster's health depending on phit chance
								if (phit > marmor) {
									
									m2health = mhealth - pdamage;
									mhealth = m2health;
								
								}else{
									
									pdamage = "Miss";
									m2health = mhealth;
									mhealth = m2health;
									
								}
								
								//console.log(marmor);
								//console.log(darmor);
								//console.log(mhit);
								//console.log(mdamage);
								//console.log(phit);
								//console.log(pdamage);
								
								
								//Update user health depending on mhit chance
									if (mhit > darmor) {
										
										const updatedh = sql.prepare("UPDATE users SET chealth = chealth - ? WHERE user = ? AND guild = ?").run(mdamage, message.author.id, message.guild.id);
										dch = ch - mdamage;
									
									}else{
									
										mdamage = "Miss";
										dch = ch;
									
									}
									
									
								
								//console.log(mhit);
								
								//If you die
								if (dch <= 0) {
								
									messageToEdit.edit(
									new Discord.RichEmbed()
										.setTitle(":negative_squared_cross_mark: You have died")
										.setDescription("You've lost the fight because you ran out of health")
										.setColor('FF0A0A')
										.setFooter("Use !rest to regain health")
										//.setImage('https://www.syncrpg.com/sam/data/tokenImages/Devin_Night/allfreezippedpacks/characters-37.png')
										.setAuthor(message.author.username, message.author.avatarURL)
									)
									collector.stop();
								
								//End of if you die
								//If you win the fight
								}else if(m2health <= 0){
								
								//Vars
								const cexp = sql.prepare("SELECT exp FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
								const currentexp = cexp.exp;
								const clvl = sql.prepare("SELECT level FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
								const currentlvl = clvl.level;
								
								var exp = mlevel + 2;
								var gold = ((mlevel + 2)*20);
								//Required exp for level up
								var levelup = currentlvl*4;
								var lexp = (exp + currentexp - levelup);
								var gexp = (exp + currentexp);
								var plvl = (currentlvl + 1);
								
								//Gold
								
								const updategold = sql.prepare("UPDATE users SET money = money + ? WHERE user = ? AND guild = ?").run(gold, message.author.id, message.guild.id);
							
								//Exp and Level up
								if ((exp + currentexp) >= levelup) {
								
									const updatelvl = sql.prepare("UPDATE users SET level = level + 1 WHERE user = ? AND guild = ?").run(message.author.id, message.guild.id);
									const updatexp = sql.prepare("UPDATE users SET exp = ? WHERE user = ? AND guild = ?").run(lexp, message.author.id, message.guild.id);
									message.channel.send(message.author + " You have gained " + exp + " points of experience, and you have level up to level " + plvl + " with a total of " + lexp + " points of experience, out of " + levelup + " required to level up");
								
								}else if ((exp + currentexp < levelup)) {
									
									const updatexp = sql.prepare("UPDATE users SET exp = ? WHERE user = ? AND guild = ?").run(gexp, message.author.id, message.guild.id);
									message.channel.send(message.author + " You have gained " + exp + " points of experience, to a total of " + gexp + " out of " + levelup + " required experience points to level up");
								
										
								//End of Exp and Level up
								}
									//Message
									messageToEdit.edit(
									new Discord.RichEmbed()
										.setTitle(":white_check_mark: You won the fight")
										.setDescription("You will be rewarded with experience and gold for winning the fight")
										.setColor('FF0A0A')
										//.setImage('https://image.flaticon.com/icons/png/128/1170/1170611.png')
										.setAuthor(message.author.username, message.author.avatarURL)
										.addField('Experience Gained', exp)
										.addField('Gold Gained', gold)
										.addField('Remaining Health', dch)
									)
									collector.stop();
								
								
								//End of win the fight
								
								}else{
								
								//Regular fight
								
									
										messageToEdit.edit(
											new Discord.RichEmbed()
												.setTitle(mname[mlevel])
												.setDescription(mdesc[mlevel])
												.setColor('FF0A0A')
												.setFooter("Commands: hit | run")
												.setImage(mimage[mlevel])
												.setAuthor(message.author.username, message.author.avatarURL)
												.addField("Monster's Health", m2health, true)
												.addBlankField(true)
												.addField('Your Health', dch, true)
												.addField("Monster's Hit", mdamage, true)
												.addBlankField(true)
												.addField('Your hit', pdamage, true)

										)
										
								}
								//End of regular fight
						
						}
						//End of "hit"
						//If command is "run"
							if (message.content === 'run') {
									messageToEdit.edit(
									new Discord.RichEmbed()
										.setTitle("You have ran away from the fight")
										.setDescription("You've sucessfully ran away from the fight")
										.setColor('FF0A0A')
										.setFooter("Use !rest to regain health")
										.setImage('https://static.thenounproject.com/png/560128-200.png')
										.setAuthor(message.author.username, message.author.avatarURL)
									)
									collector.stop();
							} //End of run command
					});
				}
			}
			
		} //End of exception handling
		
		
	//Rest
	
	//Exceptions
	const exception16 = client.getData.get(message.author.id, message.guild.id);
	if (!exception16) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if (command === "rest") {
		
			const userchealth = sql.prepare("SELECT chealth FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
			const uch = userchealth.chealth;
			const userhealth = sql.prepare("SELECT health FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
			const uh = userhealth.health;
			
			if (uch >= uh) {
				return message.channel.send("You're already at full health!");
			}else{
			
				const updatedch = sql.prepare("UPDATE users SET chealth = ? WHERE user = ? AND guild = ?").run(uh, message.author.id, message.guild.id);
				return message.channel.send("You've rested and healed to full health.");
			}
	}
	
	}
		
	
	//Character Sheet
	
	const exception21 = client.getData.get(message.author.id, message.guild.id);
	if (!exception21) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if (command === "stats" || command === "char") {
		
		//Fetch DB data per char
		let csheet = client.getData.get(message.author.id, message.guild.id);
		//Catch all the important vars from db data
		const sname = csheet.name;
		const sstr = csheet.str;
		const sagi = csheet.agi;
		const scon = csheet.con;
		const sint = csheet.int;
		const sgold = csheet.money;
		const sexp = csheet.exp;
		const slvl = csheet.level;
		// const sstamina = csheet.stamina;
		const shealth = csheet.health;
		const schealth = csheet.chealth;
		const sarmor = csheet.armor;
		// const sevasion = csheet.evasion;
		// const sdamage = csheet.damage;
		// No items for now
		var sslot1 = csheet.slot1;
		var sslot2 = csheet.slot2;
		
		//Get equipped item name
		
		if (sslot1 == 2) {
			
			sslot1 = "Leather Armor";
			
		}else{
			
			sslot1 = 0;
		
		}
		
		if (sslot2 == 1) {
			
			sslot2 = "One-Handed Sword";
			
		} else if (sslot2 == 3) {
			
			sslot2 = "Short Bow";
			
		} else if (sslot2 == 4) {
			
			sslot2 = "Fireball Spell";
			
		} else {
			
			sslot2 = 0;
			
		}
		
		//Check for equipped items
		
		//Call var
		
		var dequipped;
		
		if (sslot1 !== 0 && sslot2 !== 0) {
		
			dequipped = sslot2 + " and " + sslot1 + " equipped";
		
		} else if (sslot1 !== 0 && sslot2 == 0) {
			
			dequipped = "No weapon equipped and " + sslot1;
			
		}else if (sslot1 == 0 && sslot2 !== 0) {
			
			dequipped = sslot2 + " and no armor equipped";
			
		}else if (sslot1 == 0 && sslot2 == 0) {
			
			dequipped = "Nothing equipped";
			
		}
		
		//Display embed
		
		const embed = new Discord.RichEmbed()
		.setTitle("Stats for " + sname)
		.setDescription("This looks like anal leuchemia right now, I'm aware")
		.setAuthor(message.author.username, message.author.avatarURL)
		.setColor(0x00AE86)
		.setFooter("You can check your items by using !inventory or !inv");
		embed.addField("Strength", sstr, true);
		embed.addField("Agility", sagi, true);
		embed.addBlankField();
		embed.addField("Constitution", scon, true);
		embed.addField("Intelligence", sint, true);
		embed.addBlankField();
		embed.addField("Gold", sgold);
		embed.addField("Level", slvl, true);
		embed.addField("Experience", sexp, true);
		embed.addBlankField();
		embed.addField("Health", shealth, true);
		embed.addField("Current Health", schealth, true);
		embed.addBlankField();
		embed.addField("Armor", sarmor);
		embed.addField("Equipped Items", dequipped);
		return message.channel.send({embed});
		
	}
	
	}

		
	//Inventory Display	
	
	//Exceptions
	const exception17 = client.getData.get(message.author.id, message.guild.id);
	if (!exception17) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if(command === "inventory" || command === "inv") {
    // Grab the data
	const item1 = sql.prepare("SELECT item1 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	const item2 = sql.prepare("SELECT item2 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	const item3 = sql.prepare("SELECT item3 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	const item4 = sql.prepare("SELECT item4 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	const slot1 = sql.prepare("SELECT slot1 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	const slot2 = sql.prepare("SELECT slot2 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);

    // Create the embed
	// Change embed items to variables
    const embed = new Discord.RichEmbed()
      .setTitle("Inventory")
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(0x00AE86)
	  .setFooter("Use !e <id of item / name of item> to equip an item.");
    if(item1.item1 == 1 && slot2.slot2 != 1) {
		embed.addField("One-Handed Sword", "id: 1");
    }
	if(item2.item2 == 1 && slot1.slot1 != 2){
		embed.addField("Leather Armor", "id: 2");
	}
	if(item3.item3 == 1 && slot2.slot2 != 3){
		embed.addField("Short Bow", "id: 3");
	}
	if(item4.item4 == 1 && slot2.slot2 != 4){
		embed.addField("Fireball Spell", "id: 4");
	}
	//Postpone
	if(item1.item1 + item2.item2 + item3.item3 + item4.item4 == 0){
		embed.addField("Your inventory is", "EMPTY");
	}
    return message.channel.send({embed});
  }
  
} //End of exception handling
  
  
	//Equipped Display
	
	//Exceptions
	const exception18 = client.getData.get(message.author.id, message.guild.id);
	if (!exception18) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
		if(command === "equipped") {
    // Grab the data (I wanna kill myself)
	const fslot1 = sql.prepare("SELECT slot1 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	const slot1 = fslot1.slot1;
	const fslot2 = sql.prepare("SELECT slot2 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	const slot2 = fslot2.slot2;
	//const item3 = sql.prepare("SELECT item3 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	//const item4 = sql.prepare("SELECT item4 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
	
	if (slot1 == 2) {
		shows1 = "Leather Armor";
	}else{
		shows1 = "You don't have any equipped items for this slot";
	}
	
	if (slot2 == 1) {
		shows2 = "One-Handed Sword";
	}else if (slot2 == 3) {
		shows2 = "Short Bow";
	}else if (slot2 == 4) {
		shows2 = "Fireball Spell";
	}else{
		shows2 = "You don't have any equipped items for this slot";
	}

    // Create the embed
	// Change embed items to variables
    const embed = new Discord.RichEmbed()
      .setTitle("Equipped")
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(0x00AE86)
	  .setFooter("Use !e <id of item> to equip an item. Use !inventory to see what items you can equip.");
		embed.addField("Armor:", shows1);
		embed.addField("Weapon:", shows2);
    return message.channel.send({embed});
  }
  
} //End of exception handling
  
	//Equipping Command
	
	//Exceptions
	const exception19 = client.getData.get(message.author.id, message.guild.id);
	if (!exception19) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{
	
	if (command === "e" || command === "equip") {
		const itemid = args.join(" ");
		const fslot1 = sql.prepare("SELECT slot1 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const slot1 = fslot1.slot1;
		const fitem1 = sql.prepare("SELECT item1 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const item1 = fitem1.item1;
		const fslot2 = sql.prepare("SELECT slot2 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const slot2 = fslot2.slot2;
		const fitem2 = sql.prepare("SELECT item2 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const item2 = fitem2.item2;
		const fitem3 = sql.prepare("SELECT item3 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const item3 = fitem3.item3;
		const fitem4 = sql.prepare("SELECT item4 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const item4 = fitem4.item4;
		
		if (itemid == 1 || itemid == "One-Handed Sword"){
			if (item1 == 1) {
				if (slot2 == 0) {
			const setId1 = sql.prepare("UPDATE users SET slot2 = ? WHERE user = ? AND guild = ?").run(itemid, message.author.id, message.guild.id);
			message.channel.send("You have equipped the One-Handed Sword in your Weapon slot.");
				}else{
				message.channel.send("You already have an item in this slot. Use !ue to unequipp it.");
				}
			}else{
			message.channel.send("You don't own this item. Use !store to purchase it.");
			}
	}else if (itemid == 2 || itemid == "Leather Armor"){
			if (item2 == 1) {
				if (slot1 == 0) {
			const setId2 = sql.prepare("UPDATE users SET slot1 = ? WHERE user = ? AND guild = ?").run(itemid, message.author.id, message.guild.id);
			message.channel.send("You have equipped the Leather Armor in your Armor slot.");
				}else{
				message.channel.send("You already have an item in this slot. Use !ue to unequipp it.");
				}
			}else{
			message.channel.send("You don't own this item. Use !store to purchase it.");
			}
	}else if (itemid == 3 || itemid == "Short Bow"){
			if (item3 == 1) {
				if (slot2 == 0) {
			const setId1 = sql.prepare("UPDATE users SET slot2 = ? WHERE user = ? AND guild = ?").run(itemid, message.author.id, message.guild.id);
			message.channel.send("You have equipped the Short Bow in your Weapon slot.");
				}else{
				message.channel.send("You already have an item in this slot. Use !ue to unequipp it.");
				}
			}else{
			message.channel.send("You don't own this item. Use !store to purchase it.");
			}
	}else if (itemid == 4 || itemid == "Fireball Spell"){
			if (item4 == 1) {
				if (slot2 == 0) {
			const setId1 = sql.prepare("UPDATE users SET slot2 = ? WHERE user = ? AND guild = ?").run(itemid, message.author.id, message.guild.id);
			message.channel.send("You have equipped the Fireball Spell in your Weapon slot.");
				}else{
				message.channel.send("You already have an item in this slot. Use !ue to unequipp it.");
				}
			}else{
			message.channel.send("You don't own this item. Use !store to purchase it.");
			}
	}else{
		message.channel.send("This item doesn't exist, or the id is not valid.");
	}
}

} //End of exception handling


	const exception20 = client.getData.get(message.author.id, message.guild.id);
	if (!exception20) {
	return message.channel.send("You have to create a character first. Use !new to create one.");
	}else{

	if (command === "ue" || command === "unequip") {
				
		const argument = args.join(" ");
		const fslot1 = sql.prepare("SELECT slot1 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const slot1 = fslot1.slot1;
		const fslot2 = sql.prepare("SELECT slot2 FROM users WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
		const slot2 = fslot2.slot2;
		
		//Ifs to-do
		message.channel.send("Not finished");
				
	}
	
	}

  
});



client.login(config.token);