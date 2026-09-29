export type Language = 'en' | 'hi';

export const translations = {
  en: {
    appName: "JalDrishti",
    tagline: "Localized Panchayat-Level Weather Intelligence for Smart Agriculture",
    nav: {
      home: "Home",
      dashboard: "Weather Dashboard",
      panchayatDetails: "Panchayat Profile",
      advisories: "Crop Advisories",
      modelPerformance: "Model Metrics",
      dataInfo: "Data Sources",
      feedback: "Farmer Observations",
      settings: "Settings"
    },
    selectors: {
      state: "State",
      district: "District",
      block: "Block",
      panchayat: "Panchayat",
      selectState: "Select State",
      selectDistrict: "Select District",
      selectBlock: "Select Block",
      selectPanchayat: "Select Panchayat"
    },
    dashboard: {
      title: "Panchayat Weather Dashboard",
      subtitle: "Downscaled weather estimates for precision hyper-local farming.",
      currentWeather: "Current Weather",
      forecast5Day: "5-Day Localized Forecast",
      blockVsPanchayat: "Block vs. Panchayat Comparison",
      weatherMap: "Interactive Panchayat Map",
      viewDetails: "View Panchayat Details"
    },
    weather: {
      rainfall: "Rainfall",
      tempMax: "Max Temp",
      tempMin: "Min Temp",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      confidence: "Confidence",
      uncertainty: "Uncertainty"
    },
    advisories: {
      title: "Crop Advisory Centre",
      subtitle: "Customized agricultural recommendations based on hyper-local forecast models.",
      selectCrop: "Select Crop",
      recommendedAction: "Recommended Action",
      explanation: "Weather Rationale",
      severity: "Severity Level"
    },
    performance: {
      title: "Model Accuracy & Evaluation",
      subtitle: "Comparing downscaled ML model outputs with coarse block forecasts against ground observations.",
      mae: "Mean Absolute Error (MAE)",
      rmse: "Root Mean Square Error (RMSE)",
      r2: "R² Coefficient",
      baseline: "Block Forecast Baseline",
      mlModel: "JalDrishti ML Downscaling"
    },
    feedback: {
      title: "Submit Local Weather Observation",
      subtitle: "Help validate and improve downscaling algorithms with ground observations.",
      reportedRain: "Observed Rain (mm)",
      reportedTemp: "Observed Temp (°C)",
      useful: "Was the advisory useful?",
      comments: "Additional Notes / Remarks",
      submit: "Submit Observation"
    }
  },
  hi: {
    appName: "जलदृष्टि",
    tagline: "स्मार्ट कृषि के लिए पंचायत स्तर का मौसम पूर्वानुमान",
    nav: {
      home: "मुख्य पृष्ठ",
      dashboard: "मौसम डैशबोर्ड",
      panchayatDetails: "पंचायत प्रोफ़ाइल",
      advisories: "फसल परामर्श",
      modelPerformance: "मॉडल प्रदर्शन",
      dataInfo: "डेटा स्रोत",
      feedback: "किसान अवलोकन",
      settings: "सेटिंग्स"
    },
    selectors: {
      state: "राज्य",
      district: "जिला",
      block: "ब्लॉक",
      panchayat: "पंचायत",
      selectState: "राज्य चुनें",
      selectDistrict: "जिला चुनें",
      selectBlock: "ब्लॉक चुनें",
      selectPanchayat: "पंचायत चुनें"
    },
    dashboard: {
      title: "पंचायत मौसम डैशबोर्ड",
      subtitle: "सटीक स्थानीय खेती के लिए डाउनलोड किया गया मौसम पूर्वानुमान।",
      currentWeather: "वर्तमान मौसम",
      forecast5Day: "5-दिवसीय स्थानीय पूर्वानुमान",
      blockVsPanchayat: "ब्लॉक बनाम पंचायत तुलना",
      weatherMap: "इंटरैक्टिव पंचायत मानचित्र",
      viewDetails: "पंचायत विवरण देखें"
    },
    weather: {
      rainfall: "वर्षा",
      tempMax: "अधिकतम तापमान",
      tempMin: "न्यूनतम तापमान",
      humidity: "आर्द्रता",
      windSpeed: "हवा की गति",
      confidence: "विश्वास स्तर",
      uncertainty: "अनिश्चितता"
    },
    advisories: {
      title: "कृषि परामर्श केंद्र",
      subtitle: "स्थानीय मौसम पूर्वानुमान मॉडल पर आधारित फसल सिफारिशें।",
      selectCrop: "फसल चुनें",
      recommendedAction: "अनुशंसित कार्रवाई",
      explanation: "मौसम का कारण",
      severity: "गंभीरता का स्तर"
    },
    performance: {
      title: "मॉडल सटीकता और मूल्यांकन",
      subtitle: "जमीन के अवलोकनों के खिलाफ मॉडल के परिणामों की तुलना।",
      mae: "माध्य निरपेक्ष त्रुटि (MAE)",
      rmse: "वर्ग माध्य मूल त्रुटि (RMSE)",
      r2: "आर-वर्ग गुणांक (R²)",
      baseline: "ब्लॉक पूर्वानुमान बेसलाइन",
      mlModel: "जलदृष्टि एआई मॉडल"
    },
    feedback: {
      title: "स्थानीय मौसम अवलोकन दर्ज करें",
      subtitle: "स्थानीय टिप्पणियों के साथ एआई मॉडल को बेहतर बनाने में मदद करें।",
      reportedRain: "देखी गई बारिश (मिमी)",
      reportedTemp: "देखा गया तापमान (°C)",
      useful: "क्या सलाह उपयोगी थी?",
      comments: "अतिरिक्त टिप्पणियाँ",
      submit: "सबमिट करें"
    }
  }
};
