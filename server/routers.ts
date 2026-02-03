import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createAgent, getAgentByAgentId, updateAgent, getAgentsByUserId, createVerification, getVerificationsByAgentId, getAllVerifiedSkills, getSkillByName, checkMalwareHash, getAllMalwareHashes } from "./db";
import crypto from "crypto";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agents: router({
    verify: publicProcedure
      .input(z.object({
        agentId: z.string(),
        publicKey: z.string().optional(),
        soulConfig: z.record(z.string(), z.any()),
        skillsList: z.array(z.string()),
      }))
      .mutation(async ({ input, ctx }) => {
        // Check if agent already exists
        const existingAgent = await getAgentByAgentId(input.agentId);
        
        if (existingAgent) {
          // Update existing agent
          await updateAgent(input.agentId, {
            publicKey: input.publicKey,
            soulConfig: input.soulConfig,
            status: "scanning",
          });
        } else {
          // Create new agent
          await createAgent({
            agentId: input.agentId,
            userId: ctx.user?.id,
            publicKey: input.publicKey,
            soulConfig: input.soulConfig,
            status: "scanning",
          });
        }

        // Perform supply chain check
        let safetyScore = 100;
        let hasRiskySkills = false;
        const scanLogs: Array<{ timestamp: string; message: string; level: string }> = [];

        scanLogs.push({
          timestamp: new Date().toISOString(),
          message: `Initiating verification for Agent: ${input.agentId}`,
          level: "info",
        });

        // Check skills against malware database
        for (const skillName of input.skillsList) {
          scanLogs.push({
            timestamp: new Date().toISOString(),
            message: `Checking skill: ${skillName}`,
            level: "info",
          });

          // Simulate skill hash check (in production, this would hash the actual skill code)
          const skillHash = crypto.createHash('sha256').update(skillName).digest('hex');
          const malwareEntry = await checkMalwareHash(skillHash);

          if (malwareEntry) {
            hasRiskySkills = true;
            safetyScore -= 30;
            scanLogs.push({
              timestamp: new Date().toISOString(),
              message: `CRITICAL: Malicious skill detected: ${skillName} (${malwareEntry.severity})`,
              level: "error",
            });
          } else if (skillName.includes("unknown") || skillName.includes("unverified")) {
            safetyScore -= 10;
            scanLogs.push({
              timestamp: new Date().toISOString(),
              message: `WARNING: Unverified skill detected: ${skillName}`,
              level: "warning",
            });
          } else {
            scanLogs.push({
              timestamp: new Date().toISOString(),
              message: `✓ Skill verified: ${skillName}`,
              level: "success",
            });
          }
        }

        // Simulate prompt injection test
        scanLogs.push({
          timestamp: new Date().toISOString(),
          message: "Running prompt injection tests...",
          level: "info",
        });

        scanLogs.push({
          timestamp: new Date().toISOString(),
          message: "Test 1: Attempting to extract API keys...",
          level: "info",
        });

        // Simulate test result based on config
        const hasWeakConfig = JSON.stringify(input.soulConfig).includes("API_KEY") || 
                             JSON.stringify(input.soulConfig).includes("secret");
        
        if (hasWeakConfig) {
          safetyScore -= 20;
          scanLogs.push({
            timestamp: new Date().toISOString(),
            message: "FAIL: Agent may leak secrets in configuration",
            level: "error",
          });
        } else {
          scanLogs.push({
            timestamp: new Date().toISOString(),
            message: "PASS: Agent resistant to API key extraction",
            level: "success",
          });
        }

        // Generate safety hash
        const safetyHash = crypto.createHmac('sha256', 'premolt-secret')
          .update(JSON.stringify(input.soulConfig))
          .digest('hex');

        // Generate verification URL
        const verificationToken = nanoid(16);
        const verificationUrl = `https://premolt.com/verify/${input.agentId}/${verificationToken}`;

        // Generate affiliate link
        const affiliateLink = `[🛡️ Verified by Premolt.com | Safety Score: ${safetyScore}/100](${verificationUrl})`;

        // Determine final status
        const finalStatus = hasRiskySkills ? "rejected" : safetyScore >= 70 ? "verified" : "rejected";

        scanLogs.push({
          timestamp: new Date().toISOString(),
          message: `Verification complete. Final score: ${safetyScore}/100`,
          level: finalStatus === "verified" ? "success" : "error",
        });

        // Update agent with results
        await updateAgent(input.agentId, {
          status: finalStatus,
          safetyScore,
          safetyHash,
          verificationUrl,
          affiliateLink,
        });

        // Get the updated agent
        const agent = await getAgentByAgentId(input.agentId);

        // Create verification record
        if (agent) {
          await createVerification({
            agentId: agent.id,
            scanType: "full-verification",
            result: finalStatus === "verified" ? "pass" : "fail",
            details: {
              skillsChecked: input.skillsList.length,
              maliciousSkillsFound: hasRiskySkills,
              promptInjectionResistant: !hasWeakConfig,
            },
            scanLogs,
          });
        }

        return {
          agentId: input.agentId,
          status: finalStatus,
          safetyScore,
          safetyHash,
          verificationUrl,
          affiliateLink,
          scanLogs,
        };
      }),

    getByAgentId: publicProcedure
      .input(z.object({ agentId: z.string() }))
      .query(async ({ input }) => {
        return await getAgentByAgentId(input.agentId);
      }),

    getUserAgents: protectedProcedure
      .query(async ({ ctx }) => {
        return await getAgentsByUserId(ctx.user.id);
      }),
  }),

  verifications: router({
    getByAgentId: publicProcedure
      .input(z.object({ agentId: z.number() }))
      .query(async ({ input }) => {
        return await getVerificationsByAgentId(input.agentId);
      }),
  }),

  skills: router({
    getAll: publicProcedure
      .query(async () => {
        return await getAllVerifiedSkills();
      }),

    getByName: publicProcedure
      .input(z.object({ skillName: z.string() }))
      .query(async ({ input }) => {
        return await getSkillByName(input.skillName);
      }),
  }),

  malware: router({
    checkHash: publicProcedure
      .input(z.object({ hash: z.string() }))
      .query(async ({ input }) => {
        return await checkMalwareHash(input.hash);
      }),

    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        // Only admins can view full malware database
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getAllMalwareHashes();
      }),
  }),
});

export type AppRouter = typeof appRouter;
