import { useState } from "react";
import {
  Building2,
  ShoppingBag,
  Globe,
  Heart,
  Sprout,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const sectors = [
  {
    id: "hospitality",
    icon: Building2,
    title: "Hospitality",
    description: "Hotels, restaurants, guest services",
    color: "340 75% 55%",
  },
  {
    id: "commerce",
    icon: ShoppingBag,
    title: "Commerce",
    description: "Retail, inventory, sales",
    color: "142 70% 45%",
  },
  {
    id: "tourism",
    icon: Globe,
    title: "Tourism",
    description: "Travel packages, destinations",
    color: "200 85% 50%",
  },
  {
    id: "health",
    icon: Heart,
    title: "Health",
    description: "Healthcare, patient care",
    color: "155 65% 48%",
  },
  {
    id: "agriculture",
    icon: Sprout,
    title: "Agriculture",
    description: "Farming, supply chain",
    color: "85 60% 50%",
  },
  {
    id: "others",
    icon: MoreHorizontal,
    title: "Others",
    description: "Custom industry solutions",
    color: "270 50% 55%",
  },
];

export function InterestSelection({
  userId,
  onComplete,
}: {
  userId: string;
  onComplete: (interests: string[]) => void;
}) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length > 0) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/${userId}/interests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectors: selectedInterests }),
        });

        if (!response.ok) {
          throw new Error("Failed to save interests");
        }

        console.log("Selected interests saved:", selectedInterests);
        onComplete(selectedInterests);
      } catch (error) {
        console.error("Error saving interests:", error);
        toast({
          title: "Error",
          description: "Failed to save your interests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const progress = (selectedInterests.length / sectors.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Select Your Areas of Interest</h2>
          <p className="text-muted-foreground">
            Choose the sectors you want to manage (select at least one)
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {selectedInterests.length} of {sectors.length} selected
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {sectors.map((sector) => {
            const isSelected = selectedInterests.includes(sector.id);
            return (
              <button
                key={sector.id}
                onClick={() => toggleInterest(sector.id)}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover-elevate"
                }`}
                data-testid={`button-sector-${sector.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `hsl(${sector.color} / 0.1)`,
                    }}
                  >
                    <sector.icon
                      className="h-6 w-6"
                      style={{ color: `hsl(${sector.color})` }}
                    />
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleInterest(sector.id)}
                    data-testid={`checkbox-sector-${sector.id}`}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{sector.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {sector.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={selectedInterests.length === 0 || isLoading}
            data-testid="button-continue-interests"
          >
            {isLoading ? "Saving..." : "Continue to Dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
