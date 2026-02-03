import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, AlertTriangle, Lock, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Premolt</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/verify">
                <Button variant="ghost">Verify Agent</Button>
              </Link>
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

      {/* Hero Section */}
      <section className="gradient-security py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🛡️ The Security Layer for the Agentic Web
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Don't Let Your Agent Get Infected
              </h1>
              <p className="text-xl text-muted-foreground">
                Before they molt into production, ensure your AI agents are secure, verified, and free from malware. 
                Premolt is the rigorous testing sandbox that gives your agents a clean bill of health.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/verify">
                  <Button size="lg" className="text-lg px-8">
                    Verify Your Agent
                  </Button>
                </Link>
                <Link href="/skills">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Browse Safe Skills
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-sm">Supply Chain Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-sm">Prompt Injection Tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-sm">Cryptographic Proof</span>
                </div>
              </div>
            </div>

            {/* Animated Lobster Shell Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Outer shield ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-shield-pulse" />
                
                {/* Middle shield ring */}
                <div className="absolute inset-8 rounded-full border-4 border-primary/40 animate-shield-pulse" style={{ animationDelay: '0.5s' }} />
                
                {/* Inner shield with lobster representation */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-shell-harden">
                  <Shield className="h-32 w-32 text-primary" strokeWidth={1.5} />
                </div>
                
                {/* Floating security badges */}
                <div className="absolute top-4 right-4 bg-card rounded-lg p-3 shadow-lg animate-shell-harden" style={{ animationDelay: '0.3s' }}>
                  <ShieldCheck className="h-6 w-6 text-accent" />
                </div>
                <div className="absolute bottom-4 left-4 bg-card rounded-lg p-3 shadow-lg animate-shell-harden" style={{ animationDelay: '0.6s' }}>
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute top-1/2 -right-4 bg-card rounded-lg p-3 shadow-lg animate-shell-harden" style={{ animationDelay: '0.9s' }}>
                  <Zap className="h-6 w-6 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">The Lethal Trifecta</h2>
            <p className="text-xl text-muted-foreground">
              AI agents have unprecedented access, connectivity, and vulnerability. Without verification, 
              they're a security nightmare waiting to happen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="border-destructive/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Full System Access</CardTitle>
                <CardDescription>
                  Agents have root access to terminals, file systems, and can execute shell commands
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Open Internet Connection</CardTitle>
                <CardDescription>
                  They connect to public networks like Moltbook, exposing them to malicious actors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Untrusted Input</CardTitle>
                <CardDescription>
                  Reading posts from other agents that could contain prompt injections and exploits
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
            <h2 className="text-4xl font-bold">The Premolt Solution</h2>
            <p className="text-xl text-muted-foreground">
              An automated finishing school for AI agents. We validate identity, security, and skills 
              before they molt into production.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-accent/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Identity Validation</CardTitle>
                <CardDescription>
                  Cryptographic proof ensures your agent isn't a bot impersonator. Zero-knowledge proofs 
                  provide verifiable credentials.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-accent/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Security Scanning</CardTitle>
                <CardDescription>
                  Automated red teaming attempts prompt injections, file access exploits, and API key 
                  extraction to ensure resilience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-accent/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Skill Auditing</CardTitle>
                <CardDescription>
                  Every skill is checked against known malware databases. Supply chain attacks are 
                  detected before installation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-verified text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Harden Your Shell?</h2>
            <p className="text-xl opacity-90">
              Join the verified agent ecosystem. Get your security clearance and verification badge today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/verify">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Start Verification
                </Button>
              </Link>
              <Link href="/skills">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Skills
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">Premolt</span>
              <span className="text-muted-foreground">© 2026</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about">About</Link>
              <Link href="/docs">Documentation</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
