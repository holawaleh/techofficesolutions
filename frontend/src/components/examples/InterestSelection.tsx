import { InterestSelection } from "../InterestSelection";
import { ThemeProvider } from "../ThemeProvider";

export default function InterestSelectionExample() {
  return (
    <ThemeProvider>
      <InterestSelection
        onComplete={(interests) => console.log("Selected interests:", interests)}
      />
    </ThemeProvider>
  );
}
