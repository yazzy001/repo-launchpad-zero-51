import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  File,
  Trash2,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BatchJob {
  id: string;
  filename: string;
  totalUrls: number;
  processedUrls: number;
  successCount: number;
  errorCount: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  progress: number;
}

export const BatchProcessor: React.FC = () => {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload a CSV file with URLs.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    toast({
      title: "File Uploaded",
      description: `${file.name} is ready for processing.`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const startBatchProcessing = async () => {
    if (!uploadedFile) return;

    // Simulate parsing CSV to count URLs
    const mockUrlCount = Math.floor(Math.random() * 100) + 20; // 20-120 URLs

    const newJob: BatchJob = {
      id: Date.now().toString(),
      filename: uploadedFile.name,
      totalUrls: mockUrlCount,
      processedUrls: 0,
      successCount: 0,
      errorCount: 0,
      status: 'processing',
      startTime: new Date(),
      progress: 0
    };

    setJobs(prev => [newJob, ...prev]);
    setUploadedFile(null);

    // Simulate batch processing
    await simulateBatchProcessing(newJob.id);
  };

  const simulateBatchProcessing = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const updateInterval = setInterval(() => {
      setJobs(prev => prev.map(j => {
        if (j.id !== jobId) return j;

        const processed = j.processedUrls + 1;
        const progress = (processed / j.totalUrls) * 100;
        const isComplete = processed >= j.totalUrls;

        if (isComplete) {
          clearInterval(updateInterval);
          
          // Final results
          const successCount = Math.floor(j.totalUrls * (0.85 + Math.random() * 0.1)); // 85-95% success
          const errorCount = j.totalUrls - successCount;

          toast({
            title: "Batch Processing Complete",
            description: `Processed ${j.totalUrls} URLs with ${successCount} successes.`,
          });

          return {
            ...j,
            processedUrls: j.totalUrls,
            successCount,
            errorCount,
            status: 'completed' as const,
            endTime: new Date(),
            progress: 100
          };
        }

        return {
          ...j,
          processedUrls: processed,
          successCount: j.successCount + (Math.random() > 0.1 ? 1 : 0),
          errorCount: j.errorCount + (Math.random() < 0.1 ? 1 : 0),
          progress
        };
      }));
    }, 200); // Update every 200ms for smooth progress
  };

  const downloadResults = (job: BatchJob) => {
    // Generate mock CSV results
    const csvContent = [
      ['URL', 'Status', 'Name', 'Job Title', 'Company', 'Confidence'],
      ...Array.from({ length: job.totalUrls }, (_, i) => [
        `https://example.com/profile/${i + 1}`,
        Math.random() > 0.15 ? 'Success' : 'Error',
        `Person ${i + 1}`,
        'Software Engineer',
        'Tech Corp',
        Math.random() > 0.15 ? `${Math.floor(Math.random() * 30 + 70)}%` : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batch-results-${job.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Results Downloaded",
      description: "Batch processing results have been downloaded.",
    });
  };

  const removeJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const getStatusColor = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending': return 'text-muted-foreground';
      case 'processing': return 'text-primary';
      case 'completed': return 'text-success';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getProcessingTime = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return 'N/A';
    const end = endTime || new Date();
    const diff = end.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="shadow-xl-premium border-0 glass-premium backdrop-blur-xl overflow-hidden">
        <CardHeader className="gradient-premium text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
          
          <div className="relative z-10">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Users className="h-7 w-7" />
              Batch Profile Processing
            </CardTitle>
            <p className="text-white/80 mt-2">
              Upload a CSV file with URLs to process multiple profiles at once
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-primary bg-primary/10' 
                : uploadedFile 
                  ? 'border-success bg-success/10' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/20'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-4 bg-success/20 rounded-full">
                    <FileSpreadsheet className="h-8 w-8 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-success">File Ready</h3>
                  <p className="text-muted-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(uploadedFile.size / 1024).toFixed(1)} KB • CSV Format
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={startBatchProcessing}
                    className="gradient-premium hover:gradient-shift"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Processing
                  </Button>
                  <Button
                    onClick={() => setUploadedFile(null)}
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-4 bg-primary/20 rounded-full">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upload CSV File</h3>
                  <p className="text-muted-foreground">
                    Drag & drop your CSV file here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    CSV format: One URL per row, max 1000 URLs
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-2 border-primary/50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {/* Sample CSV Format */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <File className="h-4 w-4" />
              CSV Format Example:
            </h4>
            <pre className="text-sm text-muted-foreground font-mono">
{`url
https://linkedin.com/in/johndoe
https://imdb.com/name/nm1234567
https://github.com/janedoe
https://twitter.com/username`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Job Queue */}
      {jobs.length > 0 && (
        <Card className="shadow-xl-premium border-0 glass-premium backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="h-6 w-6" />
              Processing Queue
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-6 border rounded-xl hover-lift transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        job.status === 'processing' ? 'bg-primary/20' :
                        job.status === 'completed' ? 'bg-success/20' :
                        job.status === 'error' ? 'bg-destructive/20' :
                        'bg-muted/50'
                      }`}>
                        {job.status === 'processing' ? (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : job.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : job.status === 'error' ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{job.filename}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.totalUrls} URLs • {getProcessingTime(job.startTime, job.endTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                      
                      {job.status === 'completed' && (
                        <Button
                          onClick={() => downloadResults(job)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => removeJob(job.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {job.status === 'processing' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(job.progress)}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{job.processedUrls} / {job.totalUrls} processed</span>
                        <span>~{Math.ceil((job.totalUrls - job.processedUrls) / 5)} min remaining</span>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <div className="text-xl font-bold text-success">{job.successCount}</div>
                      <div className="text-xs text-muted-foreground">Successful</div>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <div className="text-xl font-bold text-destructive">{job.errorCount}</div>
                      <div className="text-xs text-muted-foreground">Errors</div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <div className="text-xl font-bold text-primary">
                        {job.successCount > 0 ? Math.round((job.successCount / Math.max(job.processedUrls, 1)) * 100) : 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rate Limiting Info */}
      <div className="p-6 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent rounded-xl border border-warning/20">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-5 w-5 text-warning" />
          <h4 className="font-semibold text-warning">Rate Limiting & Queue Management</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p>• Maximum 5 requests per second</p>
            <p>• Intelligent queue management</p>
            <p>• Automatic retry on failures</p>
          </div>
          <div>
            <p>• Progress tracking per job</p>
            <p>• Downloadable results as CSV</p>
            <p>• Support for up to 1000 URLs per batch</p>
          </div>
        </div>
      </div>
    </div>
  );
};