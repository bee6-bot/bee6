import process from 'node:process';
import { Collection, ShardingManager } from "discord.js";

// Initialize the sharding manager
const manager = new ShardingManager('./src/bot/index.ts', { token: process.env.DISCORD_TOKEN });
const shards = new Collection<number, number>();

// Log when a shard is created
manager.on('shardCreate', shard => {
	console.log(`Launched shard ${shard.id}`);
	shards.set(shard.id, 0);
});

// Spawn the shards
void manager.spawn();
