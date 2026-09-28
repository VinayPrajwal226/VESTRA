import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { api } from '../api/client.ts';
import { MediaFile } from '../types/index.ts';

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMedia();
      if (res.success && res.media) {
        setMediaList(res.media);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage(null);
    try {
      const res = await api.uploadMedia(selectedFile);
      if (res.success && res.media) {
        setMediaList((prev) => [res.media, ...prev]);
        setSelectedFile(null);
        setMessage({ text: 'File successfully uploaded into atelier media vault.' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'File upload failed.', isError: true });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirm deletion of this file from the server?')) return;
    try {
      await api.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      setMessage({ text: 'File deleted from disk and archives.' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Deletion failed.', isError: true });
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E5E4] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block mb-1">
            Media & Asset Storage
          </span>
          <h1 className="text-3xl font-serif text-[#1C1917]">Atelier Media Vault</h1>
          <p className="text-xs text-[#78716C] mt-1">
            Multer-powered direct file upload, local server streaming download, and deletion.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 text-xs flex items-center justify-between ${
            message.isError
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Drop Zone Card */}
      <div className="bg-white border border-[#E7E5E4] p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-serif text-[#1C1917] flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-[#1C1917]" />
          <span>Upload File to Server</span>
        </h2>
        <p className="text-xs text-[#78716C]">
          Upload high-resolution editorial imagery, lookbook PDF sheets, or textile certifications (Max 15MB).
        </p>

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="flex-1 w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2 text-xs text-[#78716C] file:mr-3 file:py-1.5 file:px-3 file:border file:border-[#E7E5E4] file:bg-white file:text-xs file:font-semibold file:cursor-pointer"
          />

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer disabled:opacity-40"
          >
            {uploading ? 'Transmitting...' : 'Upload File'}
          </button>
        </form>
      </div>

      {/* Files Grid / Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif text-[#1C1917]">
            Server Upload Archives ({mediaList.length} files)
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-[#E7E5E4]" />
            ))}
          </div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#E7E5E4] text-xs text-[#78716C]">
            No uploaded media files found. Use the uploader above to store assets.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaList.map((file) => {
              const isImage = file.mimeType.startsWith('image/');

              return (
                <div
                  key={file.id}
                  className="bg-white border border-[#E7E5E4] overflow-hidden flex flex-col justify-between group"
                >
                  <div className="aspect-[4/3] bg-[#F5F5F3] relative overflow-hidden flex items-center justify-center">
                    {isImage ? (
                      <img
                        src={file.url}
                        alt={file.originalName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#78716C] p-4 text-center">
                        <FileText className="w-10 h-10 stroke-[1] mb-2" />
                        <span className="text-[11px] truncate max-w-[150px]">{file.originalName}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-[#1C1917] truncate block" title={file.originalName}>
                        {file.originalName}
                      </span>
                      <span className="text-[#78716C] tabular-nums shrink-0">
                        {formatSize(file.size)}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#78716C]">
                      <span>{file.mimeType}</span> · <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Actions: Download, Copy URL, Delete */}
                    <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between">
                      <button
                        onClick={() => handleCopy(file.url, file.id)}
                        className="flex items-center gap-1 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer text-[11px]"
                        title="Copy relative file URL"
                      >
                        {copiedId === file.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Download link with attachment headers */}
                        <a
                          href={api.getDownloadMediaUrl(file.id)}
                          download={file.originalName}
                          className="p-1 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                          title="Download File to Computer"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-1 text-[#78716C] hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete File from Server"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
