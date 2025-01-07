import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Wine, DollarSign, Upload, Globe, MapPin, AlertTriangle } from 'lucide-react';

interface WineData {
  barcode: string;
  vendor: string;
  item: string;
  onsite_qty: number;
  offsite_qty: number;
  cost: number;
  list_price: number;
  bin1: string;
  bin2: string;
  bin3: string;
  bin4: string;
  country: string;
  appellation: string;
  sub_appellation: string;
  category: string;
  varietal: string;
  format: string;
  vintage: string;
  item_par: number;
}

interface InventoryStats {
  uniqueWines: number;
  totalBottles: number;
  totalValue: number;
  uniqueVarietals: number;
  mostCommonVarietal: string;
  uniqueCountries: number;
  mostPopularCountry: string;
  uniqueAppellations: number;
  uniqueSubAppellations: number;
  lowStockCount: number;
}

const WineInventoryUpload: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<WineData[] | null>(null);

  useEffect(() => {
    const savedStats = localStorage.getItem('inventoryStats');
    const savedData = localStorage.getItem('uploadedData');
    if (savedStats) {
      setInventoryStats(JSON.parse(savedStats));
    }
    if (savedData) {
      setUploadedData(JSON.parse(savedData));
      setUploadStatus('success');
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length !== 1) {
      setErrorMessage('Please upload only one file.');
      return;
    }

    const file = acceptedFiles[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !['xls', 'xlsx'].includes(fileExtension)) {
      setErrorMessage('Please upload an Excel file (.xls or .xlsx)');
      return;
    }

    setUploadStatus('processing');
    setErrorMessage(null);

    try {
      const data = await readExcelFile(file);
      if (!data || data.length === 0) {
        throw new Error('No data found in the file');
      }

      const processedData = processWineData(data);
      if (processedData.length === 0) {
        throw new Error('No valid wine data found in the file');
      }

      setUploadedData(processedData);
      const stats = calculateInventoryStats(processedData);
      setInventoryStats(stats);
      setUploadStatus('success');

      localStorage.setItem('inventoryStats', JSON.stringify(stats));
      localStorage.setItem('uploadedData', JSON.stringify(processedData));
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while processing the file');
      setUploadStatus('error');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    disabled: uploadStatus === 'success'
  });

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('Failed to read file'));
            return;
          }
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const processWineData = (data: any[]): WineData[] => {
    return data
      .filter((row) => row.Barcode && row.Item)
      .map((row) => ({
        barcode: String(row.Barcode),
        vendor: String(row.Vendor || ''),
        item: String(row.Item),
        onsite_qty: Number(row['OnSite Qty']) || 0,
        offsite_qty: Number(row['OffSite Qty']) || 0,
        cost: Number(row.Cost) || 0,
        list_price: Number(row['List $']) || 0,
        bin1: String(row.Bin1 || ''),
        bin2: String(row.Bin2 || ''),
        bin3: String(row.Bin3 || ''),
        bin4: String(row.Bin4 || ''),
        country: String(row.Country || ''),
        appellation: String(row.Appellation || ''),
        sub_appellation: String(row['Sub Appellation'] || ''),
        category: String(row.Category || ''),
        varietal: String(row.Varietal || ''),
        format: String(row.Format || ''),
        vintage: String(row.Vintage || ''),
        item_par: Number(row['Item Par']) || 0,
      }));
  };

  const calculateInventoryStats = (data: WineData[]): InventoryStats => {
    const uniqueWines = new Set(data.map(wine => wine.barcode)).size;
    const totalBottles = data.reduce((sum, wine) => sum + wine.onsite_qty + wine.offsite_qty, 0);
    const totalValue = data.reduce((sum, wine) => sum + wine.cost * (wine.onsite_qty + wine.offsite_qty), 0);
    const lowStockCount = data.filter(wine => (wine.onsite_qty + wine.offsite_qty) <= 3).length;
    
    const varietals = data.map(wine => wine.varietal.toLowerCase())
      .filter(varietal => !['n.a.', 'n/a', 'na', 'n.a', 'n/a.'].includes(varietal));
    const uniqueVarietals = new Set(varietals).size;
    const mostCommonVarietal = getMostCommon(varietals);

    const countries = data.map(wine => wine.country);
    const uniqueCountries = new Set(countries).size;
    const mostPopularCountry = getMostCommon(countries);

    const appellations = data.map(wine => wine.appellation);
    const uniqueAppellations = new Set(appellations).size;

    const subAppellations = data.map(wine => wine.sub_appellation);
    const uniqueSubAppellations = new Set(subAppellations).size;

    return {
      uniqueWines,
      totalBottles,
      totalValue,
      uniqueVarietals,
      mostCommonVarietal,
      uniqueCountries,
      mostPopularCountry,
      uniqueAppellations,
      uniqueSubAppellations,
      lowStockCount,
    };
  };

  const getMostCommon = (arr: string[]): string => {
    const counts = arr.reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      [0]?.[0] || '';
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleRemove = () => {
    setUploadedData(null);
    setInventoryStats(null);
    setUploadStatus('idle');
    localStorage.removeItem('inventoryStats');
    localStorage.removeItem('uploadedData');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-white">Wine Inventory Upload</h1>

      {inventoryStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Unique Wines</h2>
              <Wine className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-white">{formatNumber(inventoryStats.uniqueWines)}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Total Bottles</h2>
              <Wine className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-white">{formatNumber(inventoryStats.totalBottles)}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Total Inventory Value</h2>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-white">${formatNumber(inventoryStats.totalValue)}</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Unique Varietals</h2>
              <Wine className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-white">{inventoryStats.uniqueVarietals}</p>
            <p className="text-sm text-gray-400 mt-2">Most common: {inventoryStats.mostCommonVarietal}</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Unique Countries</h2>
              <Globe className="h-8 w-8 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-white">{inventoryStats.uniqueCountries}</p>
            <p className="text-sm text-gray-400 mt-2">Most popular: {inventoryStats.mostPopularCountry}</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Appellations</h2>
              <MapPin className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-white">{inventoryStats.uniqueAppellations}</p>
            <p className="text-sm text-gray-400 mt-2">Sub-appellations: {inventoryStats.uniqueSubAppellations}</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Low Stock Alert</h2>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-white">{inventoryStats.lowStockCount}</p>
            <p className="text-sm text-gray-400 mt-2">Wines with 3 or fewer bottles</p>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Upload Inventory File</h2>
        {uploadStatus !== 'success' ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer ${
              isDragActive ? 'border-green-500' : ''
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-white">Drop the file here...</p>
            ) : (
              <p className="text-white">Drag and drop an Excel file here, or click to select a file</p>
            )}
            <p className="text-sm text-gray-400 mt-2">Supported formats: .xls, .xlsx</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-white">File uploaded successfully!</p>
            <button
              onClick={handleRemove}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Remove File
            </button>
          </div>
        )}
        {uploadStatus === 'processing' && (
          <p className="mt-4 text-yellow-500">Processing file...</p>
        )}
        {uploadStatus === 'success' && (
          <p className="mt-4 text-green-500">File processed successfully!</p>
        )}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default WineInventoryUpload;
