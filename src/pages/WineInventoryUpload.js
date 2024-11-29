import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Wine, DollarSign, Upload, Globe, MapPin, AlertTriangle } from 'lucide-react';
const WineInventoryUpload = () => {
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [inventoryStats, setInventoryStats] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [uploadedData, setUploadedData] = useState(null);
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
    const onDrop = useCallback(async (acceptedFiles) => {
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
        }
        catch (error) {
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
    const readExcelFile = (file) => {
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
                }
                catch (error) {
                    reject(new Error('Failed to parse Excel file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsBinaryString(file);
        });
    };
    const processWineData = (data) => {
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
    const calculateInventoryStats = (data) => {
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
    const getMostCommon = (arr) => {
        const counts = arr.reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || '';
    };
    const formatNumber = (num) => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    const handleRemove = () => {
        setUploadedData(null);
        setInventoryStats(null);
        setUploadStatus('idle');
        localStorage.removeItem('inventoryStats');
        localStorage.removeItem('uploadedData');
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6 text-white", children: "Wine Inventory Upload" }), inventoryStats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6", children: [_jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Unique Wines" }), _jsx(Wine, { className: "h-8 w-8 text-green-500" })] }), _jsx("p", { className: "text-3xl font-bold text-white", children: formatNumber(inventoryStats.uniqueWines) })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Total Bottles" }), _jsx(Wine, { className: "h-8 w-8 text-blue-500" })] }), _jsx("p", { className: "text-3xl font-bold text-white", children: formatNumber(inventoryStats.totalBottles) })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Total Inventory Value" }), _jsx(DollarSign, { className: "h-8 w-8 text-yellow-500" })] }), _jsxs("p", { className: "text-3xl font-bold text-white", children: ["$", formatNumber(inventoryStats.totalValue)] })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Unique Varietals" }), _jsx(Wine, { className: "h-8 w-8 text-purple-500" })] }), _jsx("p", { className: "text-3xl font-bold text-white", children: inventoryStats.uniqueVarietals }), _jsxs("p", { className: "text-sm text-gray-400 mt-2", children: ["Most common: ", inventoryStats.mostCommonVarietal] })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Unique Countries" }), _jsx(Globe, { className: "h-8 w-8 text-indigo-500" })] }), _jsx("p", { className: "text-3xl font-bold text-white", children: inventoryStats.uniqueCountries }), _jsxs("p", { className: "text-sm text-gray-400 mt-2", children: ["Most popular: ", inventoryStats.mostPopularCountry] })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Appellations" }), _jsx(MapPin, { className: "h-8 w-8 text-red-500" })] }), _jsx("p", { className: "text-3xl font-bold text-white", children: inventoryStats.uniqueAppellations }), _jsxs("p", { className: "text-sm text-gray-400 mt-2", children: ["Sub-appellations: ", inventoryStats.uniqueSubAppellations] })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Low Stock Alert" }), _jsx(AlertTriangle, { className: "h-8 w-8 text-orange-500" })] }), _jsx("p", { className: "text-3xl font-bold text-white", children: inventoryStats.lowStockCount }), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Wines with 3 or fewer bottles" })] })] })), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-white", children: "Upload Inventory File" }), uploadStatus !== 'success' ? (_jsxs("div", { ...getRootProps(), className: `border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-green-500' : ''}`, children: [_jsx("input", { ...getInputProps() }), _jsx(Upload, { className: "mx-auto h-12 w-12 text-gray-400 mb-4" }), isDragActive ? (_jsx("p", { className: "text-white", children: "Drop the file here..." })) : (_jsx("p", { className: "text-white", children: "Drag and drop an Excel file here, or click to select a file" })), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Supported formats: .xls, .xlsx" })] })) : (_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "mb-4 text-white", children: "File uploaded successfully!" }), _jsx("button", { onClick: handleRemove, className: "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200", children: "Remove File" })] })), uploadStatus === 'processing' && (_jsx("p", { className: "mt-4 text-yellow-500", children: "Processing file..." })), uploadStatus === 'success' && (_jsx("p", { className: "mt-4 text-green-500", children: "File processed successfully!" })), errorMessage && _jsx("p", { className: "mt-4 text-red-500", children: errorMessage })] })] }));
};
export default WineInventoryUpload;
