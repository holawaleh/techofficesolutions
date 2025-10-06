import { useState } from "react";
import {
  Building2,
  ShoppingBag,
  Globe,
  Heart,
  Sprout,
  MoreHorizontal,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { AuthModal } from "./AuthModal";

const sectors = [
  {
    icon: Building2,
    title: "Hospitality",
    description: "Manage hotels, restaurants, and guest services efficiently",
    color: "174 60% 50%",
  },
  {
    icon: ShoppingBag,
    title: "Commerce",
    description: "Streamline retail operations and inventory management",
    color: "174 75% 68%",
  },
  {
    icon: Globe,
    title: "Tourism",
    description: "Coordinate travel packages and destination services",
    color: "174 85% 55%",
  },
  {
    icon: Heart,
    title: "Health",
    description: "Optimize healthcare facilities and patient care",
    color: "174 45% 45%",
  },
  {
    icon: Sprout,
    title: "Agriculture",
    description: "Track farming operations and supply chains",
    color: "174 55% 40%",
  },
  {
    icon: MoreHorizontal,
    title: "Others",
    description: "Customize solutions for your unique industry needs",
    color: "174 50% 35%",
  },
];

const features = [
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Control permissions with granular staff management and privilege assignment",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with encrypted data and audit trails",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description:
      "Instant synchronization across all devices and team members",
  },
];

export function LandingPage({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">TechOffice Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={() => setAuthModalOpen(true)}
                data-testid="button-signin"
              >
                Sign In
              </Button>
              <Button onClick={() => setAuthModalOpen(true)} data-testid="button-getstarted">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00674F] via-[#3EBB9E] to-[#73E6CB] animate-gradient" />
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#73E6CB] rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0A3C30] rounded-full blur-3xl animate-float animation-delay-400" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#3EBB9E] rounded-full blur-3xl animate-float animation-delay-200" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 opacity-0 animate-fade-in-scale">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm text-white font-medium">Powered by Innovation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 opacity-0 animate-fade-in-up animation-delay-200">
            Unified Platform for
            <br />
            Multi-Sector Excellence
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto opacity-0 animate-fade-in-up animation-delay-400">
            Streamline operations across Hospitality, Commerce, Tourism, Health,
            Agriculture, and more with intelligent role-based management
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center opacity-0 animate-fade-in-up animation-delay-600">
            <Button
              size="lg"
              className="bg-white text-[#00674F] hover:bg-white/90"
              onClick={() => setAuthModalOpen(true)}
              data-testid="button-hero-getstarted"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              data-testid="button-hero-learn"
            >
              Learn More
            </Button>
          </div>
          
          <p className="text-sm text-white/80 mt-6 opacity-0 animate-fade-in-up animation-delay-600">
            Trusted by 500+ Organizations Worldwide
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for diverse sectors with customizable workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => (
              <div
                key={sector.title}
                className="group p-6 rounded-lg border bg-card hover-elevate transition-all duration-200"
                data-testid={`card-sector-${sector.title.toLowerCase()}`}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `hsl(${sector.color} / 0.1)`,
                  }}
                >
                  <sector.icon
                    className="h-6 w-6"
                    style={{ color: `hsl(${sector.color})` }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{sector.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {sector.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose TechOffice Solutions?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      Personalized Dashboards
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      See only what matters to you with customizable
                      sector-specific views
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      Advanced Staff Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Superuser controls with flexible permission assignment for
                      team members
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Seamless Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with your existing tools and workflows effortlessly
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border bg-card"
                  data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <feature.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                500+
              </div>
              <div className="text-sm text-muted-foreground">
                Active Organizations
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                6
              </div>
              <div className="text-sm text-muted-foreground">
                Industry Sectors
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                50+
              </div>
              <div className="text-sm text-muted-foreground">
                Countries Worldwide
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#00674F] via-[#3EBB9E] to-[#73E6CB] animate-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join hundreds of organizations already using TechOffice Solutions
          </p>
          <Button
            size="lg"
            className="bg-white text-[#00674F] hover:bg-white/90"
            onClick={() => setAuthModalOpen(true)}
            data-testid="button-cta-getstarted"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Company</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Sectors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Hospitality</li>
                <li>Commerce</li>
                <li>Tourism</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Support</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>help@techoffice.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 TechOffice Solutions. All rights reserved.
          </div>
        </div>
      </footer>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={onAuthSuccess}
      />
    </div>
  );
}
