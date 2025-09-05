import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertVideo } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

type VideoFormat = 'mp4' | 'webm' | 'gif';

const VideoConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [outputFormat, setOutputFormat] = useState<VideoFormat>('mp4');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => convertVideo(files[0], options?.outputFormat as VideoFormat),
    successMessage: `Converted to ${outputFormat.toUpperCase()} successfully! Your download has started.`,
    errorMessage: 'Failed to convert video',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select a video file to convert.';
      }
      if (files.length > 1) {
        return 'Please select only one file.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Convert Video"
      description="Convert video files to different formats like MP4, WEBM, and GIF."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />

        <div className="flex flex-col space-y-2">
            <label htmlFor="format-select" className="font-medium text-text-primary">
                Output Format:
            </label>
            <select
                id="format-select"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as VideoFormat)}
                className="bg-secondary border border-border rounded-lg p-3 text-text-primary focus:ring-primary focus:border-primary"
            >
                <option value="mp4">MP4</option>
                <option value="webm">WEBM</option>
                <option value="gif">GIF</option>
            </select>
        </div>

        <button
          onClick={() => handleProcess({ outputFormat })}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert Video
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default VideoConvertView;
