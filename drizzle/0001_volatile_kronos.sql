CREATE TABLE `agentSkills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`skillId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agentSkills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(255) NOT NULL,
	`userId` int,
	`publicKey` text,
	`soulConfig` json,
	`status` enum('pending','verified','rejected','scanning') NOT NULL DEFAULT 'pending',
	`safetyScore` int DEFAULT 0,
	`safetyHash` varchar(255),
	`verificationUrl` varchar(500),
	`affiliateLink` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_agentId_unique` UNIQUE(`agentId`)
);
--> statement-breakpoint
CREATE TABLE `malwareDatabase` (
	`id` int AUTO_INCREMENT NOT NULL,
	`malwareHash` varchar(255) NOT NULL,
	`malwareName` varchar(255),
	`description` text,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`source` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `malwareDatabase_id` PRIMARY KEY(`id`),
	CONSTRAINT `malwareDatabase_malwareHash_unique` UNIQUE(`malwareHash`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skillName` varchar(255) NOT NULL,
	`description` text,
	`version` varchar(50),
	`repository` varchar(500),
	`skillHash` varchar(255) NOT NULL,
	`isVerified` boolean NOT NULL DEFAULT false,
	`isMalicious` boolean NOT NULL DEFAULT false,
	`safetyRating` int DEFAULT 50,
	`downloadCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`),
	CONSTRAINT `skills_skillName_unique` UNIQUE(`skillName`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`scanType` varchar(100) NOT NULL,
	`result` enum('pass','fail','warning') NOT NULL,
	`details` json,
	`scanLogs` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `agentSkills` ADD CONSTRAINT `agentSkills_agentId_agents_id_fk` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agentSkills` ADD CONSTRAINT `agentSkills_skillId_skills_id_fk` FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agents` ADD CONSTRAINT `agents_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verifications` ADD CONSTRAINT `verifications_agentId_agents_id_fk` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE no action ON UPDATE no action;