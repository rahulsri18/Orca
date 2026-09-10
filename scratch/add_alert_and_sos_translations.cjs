const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/data/translations.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

const extraDicts = {
  en: {
    alert1Title: 'Cyclonic Depression "ASNA" Approaching Southwest Arabian Sea',
    alert1Summary: 'Depression centered 160km WSW of Kochi moving Northwestwards. Gale force winds and torrential squalls expected for next 36 hours. Red Alert issued for fishermen.',
    alert2Title: 'High Swell Surge (Kallakkadal) Warning along Kerala & South TN',
    alert2Summary: 'Low-frequency swell waves originating from southern Indian Ocean will cause strong coastal surges and breaking waves during high tide cycles.',
    alert3Title: 'NavIC Geofence Alert: International Maritime Boundary Line (IMBL)',
    alert4Title: 'Severe Convective Lightning Cluster Detected',
    capsizingType: 'Boat Capsizing / Flooding / Sinking',
    engineFailureType: 'Engine Breakdown / Dead in Water',
    medicalEmergencyType: 'Critical Medical Emergency',
    stormTrappedType: 'Trapped in Cyclonic Storm / Gale',
    mobType: 'Man Overboard (MOB)',
    fireCollisionType: 'Fire on Board / Collision at Sea'
  },
  hi: {
    alert1Title: 'चक्रवाती दबाव "आसना" दक्षिण-पश्चिम अरब सागर की ओर बढ़ रहा है',
    alert1Summary: 'कोच्चि से 160 किमी पश्चिम-दक्षिण-पश्चिम में केंद्रित दबाव उत्तर-पश्चिम की ओर बढ़ रहा है। अगले 36 घंटों तक तेज हवाएं और भारी बारिश की संभावना। मछुआरों के लिए रेड अलर्ट।',
    alert2Title: 'केरल और दक्षिण तमिलनाडु तट पर कल्लाक्कड़ल ऊंची लहरों की चेतावनी',
    alert2Summary: 'दक्षिणी हिंद महासागर से उठने वाली ऊंची लहरों के कारण उच्च ज्वार के समय तटीय क्षेत्रों में भारी उछाल और ऊंची लहरें उठेंगी।',
    alert3Title: 'नाविक जियोफेंस अलर्ट: अंतर्राष्ट्रीय समुद्री सीमा रेखा (IMBL)',
    alert4Title: 'गंभीर आकाशीय बिजली का खतरा देखा गया',
    capsizingType: 'नाव का पलटना / पानी भरना / डूबना',
    engineFailureType: 'इंजन खराब होना / समुद्र में फंसना',
    medicalEmergencyType: 'गंभीर चिकित्सा आपातकाल',
    stormTrappedType: 'चक्रवाती तूफान / आंधी में फंसना',
    mobType: 'नाव से व्यक्ति समुद्र में गिरना (MOB)',
    fireCollisionType: 'नाव में आग लगना / समुद्र में टक्कर'
  },
  ta: {
    alert1Title: 'தென்மேற்கு அரபிக்கடலை நோக்கி நகரும் அஸ்னா புயல் காற்றழுத்த தாழ்வு மண்டலம்',
    alert1Summary: 'கொச்சிக்கு மேற்கே 160 கி.மீ தொலைவில் மையம் கொண்டுள்ள காற்றழுத்த தாழ்வு மண்டலம் வடமேற்கு நோக்கி நகர்கிறது. மீனவர்களுக்கு சிவப்பு எச்சரிக்கை.',
    alert2Title: 'கேரளா மற்றும் தென் தமிழக கடற்கரைகளில் கள்ளக்கடல் கடல்சீற்ற எச்சரிக்கை',
    alert2Summary: 'தென் இந்தியப் பெருங்கடலில் உருவாகும் அலைகள் காரணமாக கடற்கரைகளில் கடுமையான கடல்சீற்றம் ஏற்படும்.',
    alert3Title: 'நாவிக் சர்வதேச கடல் எல்லை எச்சரிக்கை (IMBL)',
    alert4Title: 'கடுமையான இடி மின்னல் திரள் கண்டறியப்பட்டது',
    capsizingType: 'படகு கவிழ்வது / நீர் புகுதல் / மூழ்குதல்',
    engineFailureType: 'என்ஜின் பழுது / நடுக்கடலில் நிற்றல்',
    medicalEmergencyType: 'அவசர தீவிர மருத்துவ நிலை',
    stormTrappedType: 'புயல் / சூறாவளியில் சிக்குதல்',
    mobType: 'ஆள் கடலில் விழுதல் (MOB)',
    fireCollisionType: 'படகில் தீ / கடலில் மோதல்'
  },
  te: {
    alert1Title: 'నైరుతి అరేబియా సముద్రం వైపు కదులుతున్న "అస్నా" తుఫాను వాయుగుండం',
    alert1Summary: 'కొచ్చికి పశ్చిమంగా 160 కి.మీ దూరంలో కేంద్రీకృతమైన వాయుగుండం. మత్స్యకారులకు రెడ్ అలర్ట్ జారీ చేయబడింది.',
    alert2Title: 'కేరళ మరియు దక్షిణ తమిళనాడు తీరంలో కల్లాక్కడల్ భారీ అలల హెచ్చరిక',
    alert2Summary: 'దక్షిణ హిందూ మహాసముద్రం నుండి వచ్చే అలల కారణంగా తీరప్రాంతాల్లో భారీ ఆటుపోట్లు మరియు అలల తీవ్రత పెరుగుతుంది.',
    alert3Title: 'నావిక్ జియోఫెన్స్ హెచ్చరిక: అంతర్జాతీయ సముద్ర సరిహద్దు రేఖ (IMBL)',
    alert4Title: 'తీవ్రమైన ఉరుములు మెరుపులతో కూడిన వాతావరణం',
    capsizingType: 'పడవ బోల్తా పడటం / నీరు చేరడం / మునిగిపోవడం',
    engineFailureType: 'ఇంజిన్ వైఫల్యం / సముద్రంలో నిలిచిపోవడం',
    medicalEmergencyType: 'తీవ్రమైన వైద్య అత్యవసరం',
    stormTrappedType: 'తుఫాను / తీవ్ర గాలివానలో చిక్కుకోవడం',
    mobType: 'వ్యక్తి సముద్రంలో పడిపోవడం (MOB)',
    fireCollisionType: 'పడవలో మంటలు / సముద్రంలో ఢీకొనడం'
  },
  bn: {
    alert1Title: 'দক্ষিণ-পশ্চিম আরব সাগরের দিকে ধেয়ে আসছে ঘূর্ণিঝড় "আসনা"',
    alert1Summary: 'কোচি থেকে ১৬০ কিমি দূরে অবস্থিত নিম্নচাপটি উত্তর-পশ্চিম দিকে অগ্রসর হচ্ছে। জেলেদের জন্য রেড অ্যালার্ট জারি।',
    alert2Title: 'কেরল ও দক্ষিণ তামিলনাড়ু উপকূলে কাল্লাক্কাডাল উত্তাল ঢেউয়ের সতর্কতা',
    alert2Summary: 'ভারত মহাসাগরে সৃষ্ট দীর্ঘ তরঙ্গমালা জোয়ারের সময় উপকূলে তীব্র ঢেউয়ের সৃষ্টি করবে।',
    alert3Title: 'নাভিক আন্তর্জাতিক সামুদ্রিক সীমানা সতর্কতা (IMBL)',
    alert4Title: 'মারাত্মক বজ্রবিদ্যুৎ ক্লাস্টার শনাক্ত করা হয়েছে',
    capsizingType: 'নৌকা উল্টে যাওয়া / জল ঢোকা / ডুবে যাওয়া',
    engineFailureType: 'ইঞ্জিন বিকল / সমুদ্রে আটকে পড়া',
    medicalEmergencyType: 'জরুরি চিকিৎসা সংকট',
    stormTrappedType: 'ঘূর্ণিঝড় / ঝড়ে আটকে পড়া',
    mobType: 'মানুষ সমুদ্রে পড়ে যাওয়া (MOB)',
    fireCollisionType: 'নৌকায় আগুন / সমুদ্রে সংঘর্ষ'
  },
  ml: {
    alert1Title: 'തെക്കുപടിഞ്ഞാറൻ അറബിക്കടലിലേക്ക് നീങ്ങുന്ന "അസ്ന" ചുഴലിക്കാറ്റ്',
    alert1Summary: 'കൊച്ചിക്ക് പടിഞ്ഞാറ് 160 കി.മീ അകലെ രൂപംകൊണ്ട ന്യൂനമർദ്ദം വടക്കുപടിഞ്ഞാറോട്ട് നീങ്ങുന്നു. മത്സ്യത്തൊഴിലാളികൾക്ക് റെഡ് അലർട്ട്.',
    alert2Title: 'കേരള, തെക്കൻ തമിഴ്‌നാട് തീരങ്ങളിൽ കള്ളക്കടൽ പ്രതിഭാസ മുന്നറിയിപ്പ്',
    alert2Summary: 'ദക്ഷിണ ഇന്ത്യൻ മഹാസമുദ്രത്തിൽ നിന്നുള്ള ഉയർന്ന തിരമാലകൾ തീരങ്ങളിൽ ശക്തമായ വേലിയേറ്റത്തിന് കാരണമാകും.',
    alert3Title: 'നാവിക് അന്താരാഷ്ട്ര സമുദ്ര അതിർത്തി മുന്നറിയിപ്പ് (IMBL)',
    alert4Title: 'ശക്തമായ ഇടിമിന്നൽ സാന്നിധ്യം കണ്ടെത്തി',
    capsizingType: 'ബോട്ട് മറിയൽ / വെള്ളം കയറൽ / മുങ്ങൽ',
    engineFailureType: 'എഞ്ചിൻ കേടുപാടുകൾ / കടലിൽ കുടുങ്ങൽ',
    medicalEmergencyType: 'ഗുരുതരമായ മെഡിക്കൽ അടിയന്തരാവസ്ഥ',
    stormTrappedType: 'ചുഴലിക്കാറ്റിൽ / കൊടുങ്കാറ്റിൽ അകപ്പെടൽ',
    mobType: 'ആൾ കടലിൽ വീഴൽ (MOB)',
    fireCollisionType: 'ബോട്ടിൽ തീപിടുത്തം / കടലിലെ കൂട്ടിയിടി'
  }
};

['en', 'hi', 'ta', 'te', 'bn', 'ml'].forEach(lang => {
  const keysObj = extraDicts[lang];
  const entriesStr = Object.entries(keysObj)
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join('\n');

  const langDecl = `  ${lang}: {`;
  const langIdx = fileContent.indexOf(langDecl);
  if (langIdx === -1) return;
  const quickChipsIdx = fileContent.indexOf('quickChips:', langIdx);
  if (quickChipsIdx !== -1) {
    fileContent = fileContent.slice(0, quickChipsIdx) + entriesStr + '\n\n    ' + fileContent.slice(quickChipsIdx);
  }
});

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Successfully added alert and SOS translations across 6 languages!');
