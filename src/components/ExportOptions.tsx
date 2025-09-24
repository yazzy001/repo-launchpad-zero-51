import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  Copy, 
  Mail, 
  Linkedin, 
  FileJson,
  FileSpreadsheet,
  Share2,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  name?: string;
  description?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  skills?: string[];
  projects?: Array<{ name: string; role?: string; year?: string }>;
  experience?: Array<{ company: string; position: string; duration?: string }>;
  confidence?: number;
  sourceUrl?: string;
  generatedAt?: string;
}

interface ExportOptionsProps {
  profileData: ProfileData;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ profileData }) => {
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSchemaOrgJson = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profileData.name,
      jobTitle: profileData.jobTitle,
      worksFor: profileData.company ? {
        "@type": "Organization",
        name: profileData.company
      } : undefined,
      address: profileData.location ? {
        "@type": "PostalAddress",
        addressLocality: profileData.location
      } : undefined,
      description: profileData.description,
      knowsAbout: profileData.skills,
      url: profileData.sourceUrl,
      dateCreated: profileData.generatedAt
    };
  };

  const generateLinkedInText = () => {
    let text = '';
    if (profileData.name) text += `${profileData.name}\n`;
    if (profileData.jobTitle) text += `${profileData.jobTitle}`;
    if (profileData.company) text += ` at ${profileData.company}`;
    text += '\n\n';
    
    if (profileData.description) text += `${profileData.description}\n\n`;
    
    if (profileData.skills && profileData.skills.length > 0) {
      text += `Key Skills: ${profileData.skills.join(' • ')}\n\n`;
    }
    
    if (profileData.experience && profileData.experience.length > 0) {
      text += 'Experience:\n';
      profileData.experience.forEach(exp => {
        text += `• ${exp.position} at ${exp.company}`;
        if (exp.duration) text += ` (${exp.duration})`;
        text += '\n';
      });
    }
    
    return text;
  };

  const generateEmailSignature = () => {
    let signature = '';
    if (profileData.name) signature += `${profileData.name}\n`;
    if (profileData.jobTitle) signature += `${profileData.jobTitle}\n`;
    if (profileData.company) signature += `${profileData.company}\n`;
    if (profileData.location) signature += `${profileData.location}\n`;
    
    return signature;
  };

  const handleExport = async (format: string) => {
    setExportingFormat(format);
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      switch (format) {
        case 'json':
          const jsonData = JSON.stringify(profileData, null, 2);
          downloadFile(jsonData, `profile-${profileData.name?.replace(/\s+/g, '-').toLowerCase() || 'data'}.json`, 'application/json');
          break;
          
        case 'schema':
          const schemaData = JSON.stringify(generateSchemaOrgJson(), null, 2);
          downloadFile(schemaData, `schema-org-${profileData.name?.replace(/\s+/g, '-').toLowerCase() || 'data'}.json`, 'application/json');
          break;
          
        case 'linkedin':
          await navigator.clipboard.writeText(generateLinkedInText());
          toast({
            title: "Copied to Clipboard",
            description: "LinkedIn-ready text has been copied to your clipboard.",
          });
          break;
          
        case 'email':
          await navigator.clipboard.writeText(generateEmailSignature());
          toast({
            title: "Copied to Clipboard", 
            description: "Email signature has been copied to your clipboard.",
          });
          break;
          
        case 'pdf':
          // Simulate PDF generation
          toast({
            title: "PDF Generated",
            description: "PDF resume would be generated in the full version.",
          });
          break;
          
        case 'csv':
          const csvData = convertToCSV(profileData);
          downloadFile(csvData, `profile-${profileData.name?.replace(/\s+/g, '-').toLowerCase() || 'data'}.csv`, 'text/csv');
          break;
      }
      
      toast({
        title: "Export Successful",
        description: `Profile exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the profile.",
        variant: "destructive",
      });
    } finally {
      setExportingFormat(null);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: ProfileData) => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['Name', data.name || ''],
      ['Job Title', data.jobTitle || ''],
      ['Company', data.company || ''],
      ['Location', data.location || ''],
      ['Description', data.description || ''],
      ['Skills', data.skills?.join('; ') || ''],
      ['Source URL', data.sourceUrl || ''],
      ['Generated At', data.generatedAt || ''],
      ['Confidence', data.confidence ? `${Math.round(data.confidence * 100)}%` : '']
    ];
    
    return [headers, ...rows].map(row => 
      row.map(field => `"${field?.toString().replace(/"/g, '""') || ''}"`).join(',')
    ).join('\n');
  };

  const exportOptions = [
    {
      id: 'json',
      title: 'JSON Export',
      description: 'Raw structured data',
      icon: FileJson,
      format: 'JSON',
      premium: false,
      color: 'text-blue-500'
    },
    {
      id: 'schema',
      title: 'Schema.org JSON-LD',
      description: 'SEO-optimized structured data',
      icon: FileJson,
      format: 'JSON-LD',
      premium: true,
      color: 'text-green-500'
    },
    {
      id: 'pdf',
      title: 'PDF Resume',
      description: 'Professional resume format',
      icon: FileText,
      format: 'PDF',
      premium: true,
      color: 'text-red-500'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Copy',
      description: 'Profile-ready text',
      icon: Linkedin,
      format: 'TEXT',
      premium: false,
      color: 'text-blue-600'
    },
    {
      id: 'email',
      title: 'Email Signature',
      description: 'Professional signature',
      icon: Mail,
      format: 'TEXT',
      premium: false,
      color: 'text-purple-500'
    },
    {
      id: 'csv',
      title: 'CSV Export',
      description: 'Spreadsheet format',
      icon: FileSpreadsheet,
      format: 'CSV',
      premium: false,
      color: 'text-orange-500'
    }
  ];

  return (
    <Card className="shadow-xl-premium border-0 glass-premium backdrop-blur-xl overflow-hidden">
      <CardHeader className="gradient-premium text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        
        <div className="relative z-10">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Download className="h-7 w-7" />
            Export Profile Data
          </CardTitle>
          <p className="text-white/80 mt-2">
            Export in multiple formats for different use cases
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-4">
          {exportOptions.map((option) => (
            <div key={option.id} className="group relative">
              <Button
                onClick={() => handleExport(option.id)}
                disabled={exportingFormat === option.id}
                variant="outline"
                className="w-full h-20 p-4 border-2 hover:border-primary/30 hover:bg-accent/20 transition-all duration-300 hover-lift"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10`}>
                    {exportingFormat === option.id ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <option.icon className={`h-6 w-6 ${option.color}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base">{option.title}</h3>
                      {option.premium && (
                        <Badge className="bg-gradient-to-r from-primary to-primary-hover text-white text-xs">
                          PRO
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {option.format}
                    </Badge>
                  </div>
                  
                  {exportingFormat !== option.id && (
                    <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
              </Button>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleExport('linkedin')}
              disabled={exportingFormat === 'linkedin'}
              variant="outline"
              className="h-16 border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="text-center">
                <Linkedin className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-sm font-medium">Copy for LinkedIn</div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleExport('email')}
              disabled={exportingFormat === 'email'}
              variant="outline"
              className="h-16 border-dashed border-2 hover:border-purple-300 hover:bg-purple-50"
            >
              <div className="text-center">
                <Mail className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <div className="text-sm font-medium">Email Signature</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Business Value */}
        <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-primary">Enterprise Export Features</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Schema.org structured data for SEO</li>
            <li>• Professional PDF resume generation</li>
            <li>• CRM-compatible formats</li>
            <li>• Bulk export capabilities</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};