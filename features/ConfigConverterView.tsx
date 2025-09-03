import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import yaml from 'js-yaml';
import { xml2json, json2xml } from 'xml-js';

type Format = 'json' | 'yaml' | 'xml';

const ConfigConverterView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromFormat, setFromFormat] = useState<Format>('json');
  const [toFormat, setToFormat] = useState<Format>('yaml');
  const { addToast } = useToasts();

  const handleConvert = () => {
    try {
      let data: any;
      // Parse input
      switch (fromFormat) {
        case 'json':
          data = JSON.parse(inputText);
          break;
        case 'yaml':
          data = yaml.load(inputText);
          break;
        case 'xml':
          data = JSON.parse(xml2json(inputText, { compact: true }));
          break;
      }

      // Generate output
      let result: string;
      switch (toFormat) {
        case 'json':
          result = JSON.stringify(data, null, 2);
          break;
        case 'yaml':
          result = yaml.dump(data);
          break;
        case 'xml':
          result = json2xml(JSON.stringify({_declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } }, ...data}), { compact: true, spaces: 2 });
          break;
      }
      setOutputText(result);
      addToast({ type: 'success', message: 'Conversion successful!' });
    } catch (error: any) {
      addToast({ type: 'error', message: `Conversion failed: ${error.message}` });
    }
  };

  return (
    <ToolPageLayout
      title="Config Converter"
      onBack={onBack}
      description="Convert between different configuration file formats."
    >
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="from-format" className="block text-sm font-medium text-gray-700">From</label>
            <select id="from-format" value={fromFormat} onChange={e => setFromFormat(e.target.value as Format)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="to-format" className="block text-sm font-medium text-gray-700">To</label>
            <select id="to-format" value={toFormat} onChange={e => setToFormat(e.target.value as Format)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700">Input</label>
            <textarea id="input-text" value={inputText} onChange={e => setInputText(e.target.value)} className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="output-text" className="block text-sm font-medium text-gray-700">Output</label>
            <textarea id="output-text" value={outputText} readOnly className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md bg-gray-50" />
          </div>
        </div>
        <button onClick={handleConvert} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Convert</button>
      </div>
    </ToolPageLayout>
  );
};

export default ConfigConverterView;
