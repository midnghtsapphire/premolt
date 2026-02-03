import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldCheck, AlertTriangle, TrendingUp, Users, Database } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();
  const { data: userAgents } = trpc.agents.getUserAgents.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: allMalware } = trpc.malware.getAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const verifiedCount = userAgents?.filter(a => a.status === "verified").length || 0;
  const rejectedCount = userAgents?.filter(a => a.status === "rejected").length || 0;
  const scanningCount = userAgents?.filter(a => a.status === "scanning").length || 0;

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
                <Button variant="ghost">Verify Agent</Button>
              </Link>
              <Link href="/skills">
                <Button variant="ghost">Skill Pharmacy</Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <span className="text-sm font-medium">{user?.name || user?.email}</span>
                {user?.role === "admin" && (
                  <Badge variant="outline" className="text-xs">Admin</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Manage your verified agents and view security insights
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Total Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userAgents?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{verifiedCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{scanningCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{rejectedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="agents" className="space-y-6">
            <TabsList>
              <TabsTrigger value="agents">My Agents</TabsTrigger>
              {user?.role === "admin" && (
                <>
                  <TabsTrigger value="admin">Admin Panel</TabsTrigger>
                  <TabsTrigger value="malware">Malware Database</TabsTrigger>
                </>
              )}
            </TabsList>

            {/* My Agents Tab */}
            <TabsContent value="agents" className="space-y-6">
              {userAgents && userAgents.length > 0 ? (
                <div className="grid gap-6">
                  {userAgents.map((agent) => (
                    <Card key={agent.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle>{agent.agentId}</CardTitle>
                            <CardDescription>
                              Created {new Date(agent.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(agent.status || "pending")}>
                            {agent.status?.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Safety Score</p>
                            <p className="text-2xl font-bold">{agent.safetyScore || 0}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="text-lg font-semibold capitalize">{agent.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="text-lg font-semibold">
                              {new Date(agent.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => setLocation(`/diagnostics/${agent.agentId}`)}
                          >
                            View Details
                          </Button>
                          {agent.status === "verified" && agent.verificationUrl && (
                            <Button
                              variant="outline"
                              onClick={() => window.open(agent.verificationUrl || "", "_blank")}
                            >
                              View Badge
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center space-y-4">
                    <ShieldCheck className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-semibold">No agents verified yet</p>
                      <p className="text-muted-foreground">
                        Start by verifying your first AI agent
                      </p>
                    </div>
                    <Link href="/verify">
                      <Button>Verify Your First Agent</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Admin Panel Tab */}
            {user?.role === "admin" && (
              <TabsContent value="admin" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Platform Users</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">--</div>
                      <p className="text-sm text-muted-foreground mt-1">Total registered users</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        <CardTitle className="text-base">Verifications Today</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">--</div>
                      <p className="text-sm text-muted-foreground mt-1">New verifications</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-base">Flagged Agents</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{rejectedCount}</div>
                      <p className="text-sm text-muted-foreground mt-1">Require review</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                    <CardDescription>
                      Manage platform settings and review flagged content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      Manage Malware Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Review Flagged Agents
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Malware Database Tab */}
            {user?.role === "admin" && (
              <TabsContent value="malware" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Malware Database</CardTitle>
                    <CardDescription>
                      Known malicious hashes and vulnerability signatures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allMalware && allMalware.length > 0 ? (
                      <div className="space-y-3">
                        {allMalware.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-start justify-between p-4 border rounded-lg"
                          >
                            <div className="space-y-1">
                              <p className="font-semibold">{entry.malwareName || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">
                                {entry.description || "No description"}
                              </p>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {entry.malwareHash}
                              </code>
                            </div>
                            <Badge
                              variant={entry.severity === "critical" ? "destructive" : "secondary"}
                            >
                              {entry.severity?.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        No malware entries in database
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
