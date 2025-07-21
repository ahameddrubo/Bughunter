// Helper function to generate UUID
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// URL validation regex
export const urlRegex = /^(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^?#]*)?\?[a-zA-Z0-9_.-]+=.*)$/;

// Function to validate and format URL
export const validateAndFormatUrl = (url: string): { isValid: boolean; formattedUrl: string; error?: string } => {
  let formattedUrl = url.trim();
  
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  if (!urlRegex.test(formattedUrl)) {
    return {
      isValid: false,
      formattedUrl,
      error: 'অনুগ্রহ করে একটি বৈধ URL দিন, যেখানে একটি স্কিম (http/https), হোস্ট এবং একটি ক্যোয়ারী প্যারামিটার আছে (যেমন: https://vuln-site.com/product.php?id=1)'
    };
  }

  return {
    isValid: true,
    formattedUrl
  };
};

// Function to get log icon based on type
export const getLogIcon = (type: string): string => {
  switch (type) {
    case 'info':
      return 'ℹ️';
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    case 'probe':
      return '🔍';
    default:
      return '📝';
  }
};

// Function to highlight malicious characters in payloads  
export const highlightPayload = (text: string): string => {
  // For now, return the text as-is. In a React component, this would be processed differently
  return text;
};

// Function to get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'VULNERABLE':
      return 'bg-error';
    case 'POTENTIAL':
      return 'bg-yellow-500';
    case 'NOT VULNERABLE':
      return 'bg-success';
    default:
      return 'bg-gray-500';
  }
};

// Function to copy text to clipboard
export const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    // You can replace this with a proper toast notification
    alert(successMessage);
  } catch (err) {
    console.error('Failed to copy: ', err);
    alert('কপি করতে সমস্যা হয়েছে');
  }
};

// Function to format timestamp in Bengali
export const formatTimestamp = (): string => {
  return new Date().toLocaleTimeString('bn-BD');
};

// Function to generate export filename
export const generateExportFilename = (scanId: string): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10);
  const timeStr = date.toLocaleTimeString('bn-BD', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(/:/g, '-');
  
  return `${scanId}-${dateStr}-${timeStr}`;
};

// Step messages for scan console
export const stepMessages = [
  "টার্গেট ভ্যালিডেশন",
  "SQL Injection প্রোব",
  "কলাম সংখ্যা নির্ণয়",
  "দুর্বল কলাম সনাক্তকরণ",
  "ডেটাবেজ নাম সংগ্রহ",
  "টেবিল এনুমেরেশন",
  "কলাম এনুমেরেশন",
  "ডেটা ডাম্পিং",
  "Cross-Site Scripting (XSS) প্রোব",
  "সাইট ডিফেস করার চেষ্টা (সিমুলেটেড)",
  "সিস্টেম তথ্য সংগ্রহ"
];

// Function to determine if a column is vulnerable (for simulation)
export const isVulnerableColumn = (dbName: string, tableName: string, colName: string): boolean => {
  return (dbName === 'web_app_db' && tableName === 'users' && (colName === 'password' || colName === 'email')) ||
         (dbName === 'users_db' && tableName === 'credentials' && colName === 'hash');
};