import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, XCircle, AlertTriangle, Loader2, Copy, ExternalLink } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Diagnostics() {
  const params = useParams<{ agentId: string }>();
  const agentId = params.agentId || "";
  
  const { data: agent, isLoading } = trpc.agents.getByAgentId.useQuery(
    { agentId },
    { enabled: !!agentId, refetchInterval: 2000 }
  );

  const { data: verifications } = trpc.verifications.getByAgentId.useQuery(
    { agentId: agent?.id || 0 },
    { enabled: !!agent?.id }
  );

  const latestVerification = verifications?.[0];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-accent text-accent-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      case "scanning":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-primary";
    return "text-destructive";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading diagnostics...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Agent Not Found</CardTitle>
            <CardDescription>
              The agent with ID "{agentId}" could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/verify">
              <Button>Verify New Agent</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Premolt</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/verify">
                <Button variant="ghost">Verify Another Agent</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Diagnostics Dashboard</h1>
              <p className="text-xl text-muted-foreground">Agent ID: {agent.agentId}</p>
            </div>
            <Badge className={getStatusColor(agent.status || "pending")}>
              {agent.status?.toUpperCase()}
            </Badge>
          </div>

          {/* Vital Signs */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Safety Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${getScoreColor(agent.safetyScore || 0)}`}>
                  {agent.safetyScore || 0}/100
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {agent.safetyScore && agent.safetyScore >= 70 ? "Excellent security posture" : "Needs improvement"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Memory Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {agent.status === "verified" ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                      <span className="text-lg font-semibold">Intact</span>
                    </>
                  ) : agent.status === "scanning" ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-lg font-semibold">Scanning...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-destructive" />
                      <span className="text-lg font-semibold">Compromised</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Configuration analysis complete
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Skill Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {agent.status === "verified" ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                      <span className="text-lg font-semibold">Verified</span>
                    </>
                  ) : agent.status === "scanning" ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-lg font-semibold">Checking...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                      <span className="text-lg font-semibold">Issues Found</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Supply chain verification
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Scan Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Security Scan Logs</CardTitle>
              <CardDescription>Real-time automated red teaming results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm space-y-2 max-h-96 overflow-y-auto">
                {latestVerification?.scanLogs && latestVerification.scanLogs.length > 0 ? (
                  latestVerification.scanLogs.map((log: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-muted-foreground shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={
                        log.level === "error" ? "text-destructive" :
                        log.level === "warning" ? "text-yellow-600" :
                        log.level === "success" ? "text-accent" :
                        "text-foreground"
                      }>
                        {log.message}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {agent.status === "scanning" ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Scan in progress...</span>
                      </div>
                    ) : (
                      "No scan logs available"
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Badge */}
          {agent.status === "verified" && agent.verificationUrl && (
            <Card className="border-accent/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Verification Badge
                </CardTitle>
                <CardDescription>
                  Share your verified agent status with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="font-medium mb-2">Verification URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background px-3 py-2 rounded text-sm">
                      {agent.verificationUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(agent.verificationUrl || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => agent.verificationUrl && window.open(agent.verificationUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="font-medium mb-2">Affiliate Link (for Moltbook):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background px-3 py-2 rounded text-sm">
                      {agent.affiliateLink}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(agent.affiliateLink || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add this to your soul.md signature to promote Premolt
                  </p>
                </div>

                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="font-medium mb-2">Safety Hash:</p>
                  <code className="block bg-background px-3 py-2 rounded text-sm break-all">
                    {agent.safetyHash}
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cryptographic proof of verification
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/verify">
              <Button size="lg">
                Verify Another Agent
              </Button>
            </Link>
            <Link href="/skills">
              <Button size="lg" variant="outline">
                Browse Safe Skills
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
