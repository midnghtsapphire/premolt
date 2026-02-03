import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Upload, FileText, Key, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Verify() {
  const [, setLocation] = useLocation();
  const [agentId, setAgentId] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [soulConfig, setSoulConfig] = useState("");
  const [skillsList, setSkillsList] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const verifyMutation = trpc.agents.verify.useMutation({
    onSuccess: (data: any) => {
      toast.success("Agent verification initiated!", {
        description: `Safety Score: ${data.safetyScore}/100`,
      });
      setLocation(`/diagnostics/${data.agentId}`);
    },
    onError: (error: any) => {
      toast.error("Verification failed", {
        description: error.message,
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSoulConfig(content);
      };
      reader.readAsText(uploadedFile);
      toast.success("File uploaded successfully");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agentId || !soulConfig) {
      toast.error("Please provide Agent ID and Soul Config");
      return;
    }

    const skills = skillsList.split(",").map(s => s.trim()).filter(Boolean);

    verifyMutation.mutate({
      agentId,
      publicKey,
      soulConfig: JSON.parse(soulConfig || "{}"),
      skillsList: skills,
    });
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
              <Link href="/skills">
                <Button variant="ghost">Skill Pharmacy</Button>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-block p-4 bg-primary/10 rounded-full">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Verify Your Agent</h1>
            <p className="text-xl text-muted-foreground">
              Upload your agent configuration for comprehensive security scanning and verification
            </p>
          </div>

          {/* Verification Form */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>
                Provide your agent's ID, public key, and soul configuration for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Agent ID */}
                <div className="space-y-2">
                  <Label htmlFor="agentId">Agent ID *</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="agentId"
                      placeholder="agent-12345"
                      value={agentId}
                      onChange={(e) => setAgentId(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Public Key */}
                <div className="space-y-2">
                  <Label htmlFor="publicKey">Public Key (Optional)</Label>
                  <Textarea
                    id="publicKey"
                    placeholder="-----BEGIN PUBLIC KEY-----&#10;MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...&#10;-----END PUBLIC KEY-----"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Soul Config Upload */}
                <div className="space-y-2">
                  <Label htmlFor="soulFile">Upload Soul Config (soul.md) *</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="soulFile"
                      accept=".md,.txt,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="soulFile" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        {file ? (
                          <>
                            <FileText className="h-12 w-12 text-accent" />
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">
                              Supports .md, .txt, .json files
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Manual Soul Config */}
                <div className="space-y-2">
                  <Label htmlFor="soulConfig">Or Paste Soul Config (JSON) *</Label>
                  <Textarea
                    id="soulConfig"
                    placeholder='{"name": "MyAgent", "personality": "helpful", ...}'
                    value={soulConfig}
                    onChange={(e) => setSoulConfig(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Skills List */}
                <div className="space-y-2">
                  <Label htmlFor="skillsList">Installed Skills (comma-separated)</Label>
                  <Input
                    id="skillsList"
                    placeholder="weather-skill, file-manager, web-scraper"
                    value={skillsList}
                    onChange={(e) => setSkillsList(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    List all skills your agent has installed for supply chain verification
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={verifyMutation.isPending}
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Start Verification
                      </>
                    )}
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="outline" size="lg">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supply Chain Check</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We verify all skills against known malware databases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automated red teaming tests for prompt injection vulnerabilities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Verification Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive a cryptographic proof and shareable verification URL
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
