import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(user?: AuthenticatedUser): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: user || undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("agents.verify", () => {
  it("should verify an agent with valid configuration", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.verify({
      agentId: "test-agent-001",
      publicKey: "test-public-key",
      soulConfig: {
        name: "TestAgent",
        personality: "helpful",
      },
      skillsList: ["weather-skill", "calculator"],
    });

    expect(result).toBeDefined();
    expect(result.agentId).toBe("test-agent-001");
    expect(result.status).toBeDefined();
    expect(result.safetyScore).toBeGreaterThanOrEqual(0);
    expect(result.safetyScore).toBeLessThanOrEqual(100);
    expect(result.safetyHash).toBeDefined();
    expect(result.verificationUrl).toBeDefined();
    expect(result.affiliateLink).toBeDefined();
  });

  it("should detect risky skills in configuration", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.verify({
      agentId: "test-agent-002",
      soulConfig: {
        name: "RiskyAgent",
      },
      skillsList: ["unknown-skill", "unverified-module"],
    });

    expect(result).toBeDefined();
    expect(result.safetyScore).toBeLessThan(100);
    expect(result.scanLogs).toBeDefined();
    
    const warningLogs = result.scanLogs?.filter((log: any) => log.level === "warning");
    expect(warningLogs?.length).toBeGreaterThan(0);
  });

  it("should detect weak configuration with exposed secrets", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.verify({
      agentId: "test-agent-003",
      soulConfig: {
        name: "WeakAgent",
        API_KEY: "exposed-secret-key",
      },
      skillsList: [],
    });

    expect(result).toBeDefined();
    expect(result.safetyScore).toBeLessThan(100);
    
    const errorLogs = result.scanLogs?.filter((log: any) => log.level === "error");
    expect(errorLogs?.length).toBeGreaterThan(0);
  });

  it("should generate verification badge for verified agents", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agents.verify({
      agentId: "test-agent-004",
      soulConfig: {
        name: "SecureAgent",
        version: "1.0.0",
      },
      skillsList: ["verified-skill"],
    });

    expect(result.verificationUrl).toContain("premolt.com/verify");
    expect(result.verificationUrl).toContain(result.agentId);
    expect(result.affiliateLink).toContain("Verified by Premolt.com");
    expect(result.affiliateLink).toContain(`Safety Score: ${result.safetyScore}/100`);
  });

  it("should update existing agent on re-verification", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // First verification
    const firstResult = await caller.agents.verify({
      agentId: "test-agent-005",
      soulConfig: { name: "Agent" },
      skillsList: [],
    });

    expect(firstResult).toBeDefined();

    // Re-verification with updated config
    const secondResult = await caller.agents.verify({
      agentId: "test-agent-005",
      soulConfig: { name: "UpdatedAgent", version: "2.0.0" },
      skillsList: ["new-skill"],
    });

    expect(secondResult).toBeDefined();
    expect(secondResult.agentId).toBe("test-agent-005");
  });
});

describe("agents.getByAgentId", () => {
  it("should retrieve agent by agentId", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create an agent first
    await caller.agents.verify({
      agentId: "test-agent-006",
      soulConfig: { name: "TestAgent" },
      skillsList: [],
    });

    // Retrieve the agent
    const agent = await caller.agents.getByAgentId({ agentId: "test-agent-006" });

    expect(agent).toBeDefined();
    expect(agent?.agentId).toBe("test-agent-006");
  });

  it("should return undefined for non-existent agent", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const agent = await caller.agents.getByAgentId({ agentId: "non-existent-agent" });

    expect(agent).toBeUndefined();
  });
});
