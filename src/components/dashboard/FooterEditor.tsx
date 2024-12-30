import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface FooterContent {
  id: string;
  about_text: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_facebook: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
}

interface FooterVisibility {
  about: boolean;
  quickLinks: boolean;
  contact: boolean;
  social: boolean;
}

export const FooterEditor = () => {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [visibility, setVisibility] = useState<FooterVisibility>({
    about: true,
    quickLinks: true,
    contact: true,
    social: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchFooterContent = async () => {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .single();

      if (!error && data) {
        setContent(data);
      }
    };

    const storedVisibility = localStorage.getItem('footerVisibility');
    if (storedVisibility) {
      setVisibility(JSON.parse(storedVisibility));
    }

    fetchFooterContent();
  }, []);

  const handleSave = async () => {
    if (!content) return;

    const { error } = await supabase
      .from('footer_content')
      .update({
        about_text: content.about_text,
        contact_email: content.contact_email,
        contact_phone: content.contact_phone,
        contact_address: content.contact_address,
        social_facebook: content.social_facebook,
        social_twitter: content.social_twitter,
        social_instagram: content.social_instagram,
        updated_at: new Date().toISOString()
      })
      .eq('id', content.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save footer content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Footer content saved successfully",
      });
    }
  };

  const toggleVisibility = (key: keyof FooterVisibility) => {
    const newVisibility = {
      ...visibility,
      [key]: !visibility[key]
    };
    setVisibility(newVisibility);
    localStorage.setItem('footerVisibility', JSON.stringify(newVisibility));
  };

  if (!content) return null;

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Section Visibility</h3>
          <div className="space-y-4">
            {Object.entries(visibility).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} Section</Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={() => toggleVisibility(key as keyof FooterVisibility)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Section</h3>
            <Textarea
              value={content.about_text}
              onChange={(e) => setContent({ ...content, about_text: e.target.value })}
              placeholder="About text"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <Input
              value={content.contact_email}
              onChange={(e) => setContent({ ...content, contact_email: e.target.value })}
              placeholder="Email"
            />
            <Input
              value={content.contact_phone}
              onChange={(e) => setContent({ ...content, contact_phone: e.target.value })}
              placeholder="Phone"
            />
            <Input
              value={content.contact_address}
              onChange={(e) => setContent({ ...content, contact_address: e.target.value })}
              placeholder="Address"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Links</h3>
            <Input
              value={content.social_facebook || ''}
              onChange={(e) => setContent({ ...content, social_facebook: e.target.value })}
              placeholder="Facebook URL"
            />
            <Input
              value={content.social_twitter || ''}
              onChange={(e) => setContent({ ...content, social_twitter: e.target.value })}
              placeholder="Twitter URL"
            />
            <Input
              value={content.social_instagram || ''}
              onChange={(e) => setContent({ ...content, social_instagram: e.target.value })}
              placeholder="Instagram URL"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Footer Content
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};