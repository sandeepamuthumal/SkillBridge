import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Link, 
  CheckCircle,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  User,
  Lightbulb
} from 'lucide-react';
import { toast } from 'react-toastify';

const SocialLinksForm = ({ initialData, onSave, isLoading }) => {
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    portfolio: ''
  });

  useEffect(() => {
    if (initialData?.socialLinks) {
      setSocialLinks({
        linkedin: initialData.socialLinks.linkedin || '',
        github: initialData.socialLinks.github || '',
        portfolio: initialData.socialLinks.portfolio || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [field]: value.trim()
    }));
  };

  const validateUrl = (url, type) => {
    if (!url) return true; // Empty URLs are allowed
    
    try {
      const urlObj = new URL(url);
      
      switch (type) {
        case 'linkedin':
          return urlObj.hostname.includes('linkedin.com');
        case 'github':
          return urlObj.hostname.includes('github.com');
        case 'portfolio':
          return true; // Any valid URL is acceptable for portfolio
        default:
          return true;
      }
    } catch {
      return false;
    }
  };

  const formatUrl = (url, type) => {
    if (!url) return '';
    
    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    return url;
  };

  const generateSuggestion = (type, value) => {
    if (!value) return '';
    
    switch (type) {
      case 'linkedin':
        if (!value.includes('linkedin.com')) {
          return `https://linkedin.com/in/${value.replace(/[^a-zA-Z0-9-]/g, '')}`;
        }
        break;
      case 'github':
        if (!value.includes('github.com')) {
          return `https://github.com/${value.replace(/[^a-zA-Z0-9-]/g, '')}`;
        }
        break;
      default:
        return value;
    }
    return value;
  };

  const handleSave = async () => {
    const errors = [];
    
    // Validate URLs
    if (socialLinks.linkedin && !validateUrl(formatUrl(socialLinks.linkedin), 'linkedin')) {
      errors.push('Invalid LinkedIn URL. Please use a valid LinkedIn profile URL.');
    }
    if (socialLinks.github && !validateUrl(formatUrl(socialLinks.github), 'github')) {
      errors.push('Invalid GitHub URL. Please use a valid GitHub profile URL.');
    }
    if (socialLinks.portfolio && !validateUrl(formatUrl(socialLinks.portfolio), 'portfolio')) {
      errors.push('Invalid portfolio URL. Please use a valid URL.');
    }

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      // Format URLs before saving
      const formattedLinks = {
        linkedin: socialLinks.linkedin ? formatUrl(socialLinks.linkedin) : '',
        github: socialLinks.github ? formatUrl(socialLinks.github) : '',
        portfolio: socialLinks.portfolio ? formatUrl(socialLinks.portfolio) : ''
      };

      await onSave({ socialLinks: formattedLinks });
      toast.success('Social links updated successfully');
    } catch (error) {
      toast.error('Failed to update social links');
    }
  };

  const testLink = (url) => {
    if (url) {
      window.open(formatUrl(url), '_blank');
    }
  };

  const getCompletionCount = () => {
    return Object.values(socialLinks).filter(link => link.trim()).length;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <Link className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              Social Links & Portfolio
              {getCompletionCount() >= 2 && <CheckCircle className="h-5 w-5 text-green-500" />}
            </CardTitle>
            <CardDescription>
              Add your professional social media profiles and portfolio website
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* LinkedIn */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            <Label htmlFor="linkedin" className="text-base font-medium">LinkedIn Profile</Label>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/yourprofile or just your username"
                value={socialLinks.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="flex-1"
              />
              {socialLinks.linkedin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testLink(socialLinks.linkedin)}
                  className="gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Test
                </Button>
              )}
            </div>
            {socialLinks.linkedin && !socialLinks.linkedin.includes('linkedin.com') && (
              <p className="text-xs text-blue-600">
                Suggestion: {generateSuggestion('linkedin', socialLinks.linkedin)}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Your LinkedIn profile helps employers learn more about your professional background
            </p>
          </div>
        </div>

        {/* GitHub */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5 text-gray-800" />
            <Label htmlFor="github" className="text-base font-medium">GitHub Profile</Label>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="github"
                placeholder="https://github.com/yourusername or just your username"
                value={socialLinks.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className="flex-1"
              />
              {socialLinks.github && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testLink(socialLinks.github)}
                  className="gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Test
                </Button>
              )}
            </div>
            {socialLinks.github && !socialLinks.github.includes('github.com') && (
              <p className="text-xs text-blue-600">
                Suggestion: {generateSuggestion('github', socialLinks.github)}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Showcase your coding projects and contributions to open source
            </p>
          </div>
        </div>

        {/* Portfolio */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            <Label htmlFor="portfolio" className="text-base font-medium">Portfolio Website</Label>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="portfolio"
                placeholder="https://yourportfolio.com"
                value={socialLinks.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                className="flex-1"
              />
              {socialLinks.portfolio && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testLink(socialLinks.portfolio)}
                  className="gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Test
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Your personal website, blog, or online portfolio
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Save Social Links
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinksForm;