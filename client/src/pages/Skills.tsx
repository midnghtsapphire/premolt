import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, ShieldCheck, Download, Star } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: skills, isLoading } = trpc.skills.getAll.useQuery();

  const filteredSkills = skills?.filter(skill => 
    skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSafetyBadge = (rating: number) => {
    if (rating >= 80) return { label: "Excellent", color: "bg-accent text-accent-foreground" };
    if (rating >= 60) return { label: "Good", color: "bg-primary text-primary-foreground" };
    if (rating >= 40) return { label: "Fair", color: "bg-yellow-500 text-white" };
    return { label: "Poor", color: "bg-destructive text-destructive-foreground" };
  };

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
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-accent/10 rounded-full">
              <ShieldCheck className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-4xl font-bold">Skill Pharmacy</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse verified, safe skills for your AI agents. All skills are checked against malware databases 
              and supply chain vulnerabilities.
            </p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search skills by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Total Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{skills?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Verified Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {skills?.filter(s => s.isVerified).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {skills?.reduce((sum, s) => sum + (s.downloadCount || 0), 0).toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading skills...</p>
            </div>
          ) : filteredSkills && filteredSkills.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => {
                const safetyBadge = getSafetyBadge(skill.safetyRating || 50);
                return (
                  <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {skill.isVerified && (
                            <ShieldCheck className="h-5 w-5 text-accent" />
                          )}
                          <CardTitle className="text-lg">{skill.skillName}</CardTitle>
                        </div>
                        <Badge className={safetyBadge.color}>
                          {safetyBadge.label}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {skill.description || "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-mono">{skill.version || "1.0.0"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Safety Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-semibold">{skill.safetyRating || 50}/100</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Downloads</span>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{(skill.downloadCount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      {skill.repository && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(skill.repository || "", "_blank")}
                        >
                          View Repository
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? "No skills found matching your search" : "No skills available yet"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle>How Skill Verification Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-bold text-accent">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Supply Chain Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Every skill is checked against known malware databases and vulnerability reports
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-bold text-accent">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Code Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated static analysis checks for suspicious patterns and security vulnerabilities
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-bold text-accent">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Safety Rating</h3>
                  <p className="text-sm text-muted-foreground">
                    Skills receive a comprehensive safety score based on multiple security factors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
