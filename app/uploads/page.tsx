'use client';

import { useState, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { IngestHeader } from '@/components/ingest/IngestHeader';
import { FileDropzone } from '@/components/ingest/FileDropzone';
import { SelectedFileCard } from '@/components/ingest/SelectedFileCard';
import { IngestStatus } from '@/components/ingest/IngestStatus';

export default function DataIngestionPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ processedRows: number } | null>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setSuccess(null);

    if (!selectedFile.name.endsWith('.csv') && selectedFile.type !== 'text/csv') {
      setError('Invalid format: File must be a valid .csv spreadsheet');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/uploads', formData);

      setSuccess({ processedRows: response.data.processedRows });
      setFile(null);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred during data ingestion.';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black selection:bg-black selection:text-white pb-36 font-sans antialiased">
      <div className="max-w-2xl mx-auto px-6 pt-12 sm:pt-20 space-y-10">
        
        <IngestHeader />

        <div className="space-y-6">
          <FileDropzone
            isDragging={isDragging}
            isUploading={isUploading}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
          />

          {file && (
            <SelectedFileCard
              file={file}
              isUploading={isUploading}
              onRemove={() => setFile(null)}
            />
          )}

          <IngestStatus
            error={error}
            success={success}
            onViewDirectory={() => router.push('/players')}
          />

          {!success && (
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full bg-black text-white py-3.5 px-6 text-xs font-mono uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-150 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xs"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>INGESTING & RE-RATING...</span>
                </>
              ) : (
                <span>PROCESS CSV DATA</span>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}