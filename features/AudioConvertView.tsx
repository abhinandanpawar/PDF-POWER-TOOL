import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertAudio } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

type AudioFormat = 'mp3' | 'wav' | 'flac' | 'ogg';

const AudioConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => convertAudio(files[0], options?.outputFormat as AudioFormat),
    successMessage: `Converted to ${outputFormat.toUpperCase()} successfully! Your download has started.`,
    errorMessage: 'Failed to convert audio',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select an audio file to convert.';
      }
      if (files.length > 1) {
        return 'Please select only one file.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Convert Audio"
      description="Convert audio files to different formats like MP3, WAV, FLAC, and OGG."
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
                onChange={(e) => setOutputFormat(e.target.value as AudioFormat)}
                className="bg-secondary border border-border rounded-lg p-3 text-text-primary focus:ring-primary focus:border-primary"
            >
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
                <option value="flac">FLAC</option>
                <option value="ogg">OGG</option>
            </select>
        </div>

        <button
          onClick={() => handleProcess({ outputFormat })}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert Audio
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default AudioConvertView;
