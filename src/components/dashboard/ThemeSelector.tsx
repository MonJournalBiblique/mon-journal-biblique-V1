import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSiteTheme, themes, ThemeName } from "@/hooks/use-site-theme";
import { useToast } from "@/hooks/use-toast";

export function ThemeSelector() {
  const { currentTheme, setTheme } = useSiteTheme();
  const { toast } = useToast();

  const handleThemeChange = (theme: ThemeName) => {
    setTheme(theme);
    toast({
      title: "Theme Updated",
      description: "The site theme has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Site Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose a theme for your site. This will affect all pages and components.
        </p>
      </div>
      <RadioGroup
        defaultValue={currentTheme}
        onValueChange={(value) => handleThemeChange(value as ThemeName)}
        className="grid grid-cols-2 gap-4"
      >
        {(Object.keys(themes) as ThemeName[]).map((themeName) => {
          const theme = themes[themeName];
          return (
            <div key={themeName} className="relative">
              <RadioGroupItem
                value={themeName}
                id={themeName}
                className="peer sr-only"
              />
              <Label
                htmlFor={themeName}
                className="flex flex-col gap-2 rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex gap-2">
                  {[theme.primary100, theme.accent100, theme.bg100].map((color) => (
                    <div
                      key={color}
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="font-semibold capitalize">{themeName.replace(/([A-Z])/g, ' $1').trim()}</div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}