import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with increased limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiClient: GoogleGenAI | null = null;
let supabaseClient: any = null;
let lastSupabaseUrl = "";
let lastSupabaseKey = "";

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please add it in the Secrets panel under Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function getSupabaseCredentials() {
  let url = process.env.SUPABASE_URL || "";
  let key = process.env.SUPABASE_ANON_KEY || "";
  
  // Remove all spaces and whitespace characters
  url = url.replace(/\s+/g, "");
  key = key.replace(/\s+/g, "");
  
  url = url.trim().replace(/^["']|["']$/g, "");
  key = key.trim().replace(/^["']|["']$/g, "");
  
  // Treat placeholder or invalid strings as unconfigured
  if (
    url === "MY_SUPABASE_URL" || 
    url === "undefined" || 
    url === "null" || 
    url === "" ||
    (!url.startsWith("http://") && !url.startsWith("https://"))
  ) {
    url = "";
  }
  
  if (
    key === "MY_SUPABASE_ANON_KEY" || 
    key === "undefined" || 
    key === "null" || 
    key === ""
  ) {
    key = "";
  }
  
  return { url, key };
}

function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials();
  
  if (!url || !key) {
    throw new Error("Supabase is not configured. Please define SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables.");
  }
  
  // Clean URL if it has /rest/v1 suffix
  const cleanUrl = url.replace(/\/rest\/v1\/?$/, "");
  
  if (!supabaseClient || cleanUrl !== lastSupabaseUrl || key !== lastSupabaseKey) {
    supabaseClient = createClient(cleanUrl, key);
    lastSupabaseUrl = cleanUrl;
    lastSupabaseKey = key;
  }
  
  return supabaseClient;
}

// API endpoint for analyzing a single image compared to history
app.post("/api/analyze", async (req: express.Request, res: express.Response) => {
  try {
    const { imageBase64, mimeType, history, imageIndex } = req.body;

    if (!imageBase64 || !mimeType) {
      res.status(400).json({ error: "Görsel verisi ve MIME türü gereklidir." });
      return;
    }

    const ai = getAiClient();

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Prepare previous history details to pass to Gemini
    let historyContext = "Daha önce değerlendirilen görsellerin geçmişi bulunmamaktadır. Bu analiz ilk görsel için yapılmaktadır.";
    if (history && history.length > 0) {
      historyContext = "Daha önce analiz edilmiş görsellerin bilgileri aşağıdadır. Karşılaştırmalı analiz yaparken bu bilgileri ve verilen puanları birebir referans al ve tutarlı puanlar ver:\n";
      history.forEach((h: any, idx: number) => {
        historyContext += `\n[Görsel ${idx + 1} - ${h.name || "İsimsiz"}]:\n`;
        historyContext += `- Görsel Karmaşıklık Puanı: ${h.results?.gorselKarmasiklik?.puan || "Yok"}\n`;
        historyContext += `- Yön Duygusu Puanı: ${h.results?.yonDuygusu?.puan || "Yok"}\n`;
        historyContext += `- Sınırlar Puanı: ${h.results?.sinirlar?.puan || "Yok"}\n`;
        historyContext += `- Bölge Tanımı Puanı: ${h.results?.bolgeTanimi?.puan || "Yok"}\n`;
        historyContext += `- Odak Noktasi Puanı: ${h.results?.odakNoktasi?.puan || "Yok"}\n`;
        historyContext += `- Simgesel Elemanlar Puanı: ${h.results?.simgeselElemanlar?.puan || "Yok"}\n`;
        historyContext += `- Genel Özet: ${h.results?.genelKarsilastirmaliDegerlendirme || "Yok"}\n`;
      });
    }

    const systemInstruction = `Sen, 10 yıldan fazla deneyime sahip profesyonel bir peyzaj mimarı ve mekansal tasarım uzmanısın.
Gönderilen fotoğrafları mekansal okunabilirlik (imageability - Kevin Lynch) kriterlerine göre nesnel, tutarlı ve karşılaştırmalı şekilde değerlendir.
Değerlendirme sürecinde mutlaka şu kurallara sıkı sıkıya uy:
1. Değerlendirmeleri yalnızca fotoğrafta fiilen görülen unsurlara göre yap. Tahmin veya varsayımda bulunma. Olmayan şeyleri var sayma.
2. Tüm puanlamaları 1 ile 5 arasında tam sayı olacak şekilde gerçekleştir. Kesinlikle ara değerler (örneğin 3.5, 4.2 vb.) kullanma.
   Puanlama ölçeği: 1 = Çok düşük, 2 = Düşük, 3 = Orta, 4 = Yüksek, 5 = Çok yüksek.
3. Her ana kriter ve her bir alt kriter için de ayrı ayrı 1 ile 5 arasında puanlar ver. Bu puanlarda çeşitlilik olmasını sağla, sürekli aynı puanları (hep 3 veya hep 4) kullanmaktan kaçın.
4. Benzer mekansal özelliklere sahip mekanlara benzer puanlar verirken, farklılık gösteren mekanlarda puan değişiklikleri oluştur.
5. Sana verilen geçmiş görsel analizlerini (puanları ve özetleri) referans alarak karşılaştırmalı bir analiz sun. Bu görselin önceki görsellere kıyasla mekansal okunabilirlik açısından nerede durduğunu açıkla.
6. Alt kriterlerin her biri için kısa, profesyonel, nesnel ve mimari birer değerlendirme cümlesi yaz, ayrıca her alt kriter için 1-5 arasında bir puan belirle.`;

    const promptText = `Lütfen bu görseli analiz et. Bu görsel serideki ${imageIndex || 1}. görseldir.
Daha önceki görsellerin analiz geçmişi şu şekildedir:
${historyContext}

Analizini aşağıdaki JSON yapısına uygun olarak gerçekleştir ve yalnızca geçerli bir JSON objesi döndür:
{
  "gorselKarmasiklik": {
    "renkCesitliligi": "Renk paleti ve ton çeşitliliğinin analizi.",
    "renkCesitliligiPuan": 4,
    "objeSekilCesitliligi": "Mekandaki form, hacim ve obje şekillerinin çeşitliliği.",
    "objeSekilCesitliligiPuan": 3,
    "insanYogunlugu": "Fotoğraftaki insan varlığı ve yoğunluğu.",
    "insanYogunluguPuan": 1,
    "dogalElemanCesitliligi": "Bitkisel öğeler, su unsurları and diğer doğal ögelerin çeşitliliği.",
    "dogalElemanCesitliligiPuan": 2,
    "yapisalElemanCesitliligi": "Döşeme, donatı, binalar gibi yapısal bileşenlerin çeşitliliği.",
    "yapisalElemanCesitliligiPuan": 4,
    "araziSekliCesitliligi": "Kot farkları, rampa, merdiven, tepe veya düzlükler gibi topografik çeşitlilik.",
    "araziSekliCesitliligiPuan": 2,
    "puan": 3
  },
  "yonDuygusu": {
    "yolCizgileriYogunlugu": "Yaya yolları, akslar ve çizgilerin belirginliği.",
    "yolCizgileriYogunluguPuan": 4,
    "yonlendirmeElemanlari": "Tabela, aydınlatma direkleri, ağaç dizileri gibi yönlendiren ögelerin varlığı.",
    "yonlendirmeElemanlariPuan": 3,
    "insanHareketYonu": "Kullanıcıların hareket edebileceği yönelim ipuçları.",
    "insanHareketYonuPuan": 4,
    "puan": 4
  },
  "sinirlar": {
    "dogalSinirlar": "Ağaç sıraları, bitki kuşakları, çalılar veya kot farkları ile oluşan sınırlar.",
    "dogalSinirlarPuan": 2,
    "yapisalSinirlar": "Duvarlar, bina cepheleri, bordürler veya çitler ile belirlenen sınırlar.",
    "yapisalSinirlarPuan": 3,
    "renkKontrastiSinir": "Farklı renklerin birleşimiyle (örn. çim ile döşeme birleşimi) oluşan görsel sınırlar.",
    "renkKontrastiSinirPuan": 4,
    "cizgiKontrastiYogunlugu": "Çizgisel kontrasta dayalı sınır yoğunluğu.",
    "cizgiKontrastiYogunluguPuan": 2,
    "puan": 2
  },
  "bolgeTanimi": {
    "yapiAlanlari": "Yapıların veya kapalı/yarı açık alanların bölgeyi tanımlama gücü.",
    "yapiAlanlariPuan": 3,
    "yesilAlanBolgeleri": "Peyzaj ve bitkilendirilmiş alanların mekansal karakteri.",
    "yesilAlanBolgeleriPuan": 4,
    "zeminDosemeFarkliliklari": "Malzeme, doku veya desen farklarıyla ayrışan zemin bölgeleri.",
    "zeminDosemeFarkliliklariPuan": 3,
    "simgeselObjeler": "Bölgenin kimliğini tanımlayan özel objeler veya donatılar.",
    "simgeselObjelerPuan": 2,
    "puan": 3
  },
  "odakNoktasi": {
    "gorselMerkeziUnsur": "İlk bakışta dikkat çeken baskın görsel veya mekansal öge.",
    "gorselMerkeziUnsurPuan": 5,
    "toplanmaPotansiyeli": "Meydan, amfi, oturma grupları gibi toplanma potansiyeli sunan alanlar.",
    "toplanmaPotansiyeliPuan": 4,
    "insanYogunlasmaNoktalari": "Mekanda insanların duraklayacağı, birikeceği odak noktaları.",
    "insanYogunlasmaNoktalariPuan": 3,
    "puan": 5
  },
  "simgeselElemanlar": {
    "simgeselYapilar": "Mekandaki ayırt edici kentsel veya mimari yapılar.",
    "simgeselYapilarPuan": 2,
    "kentselMobilyalar": "Özgün tasarımlı oturma birimleri, çöp kutuları, aydınlatmalar.",
    "kentselMobilyalarPuan": 3,
    "bitkiselOgeler": "Anıt ağaç, dikkat çeken çiçek parteri veya soliter bitki kullanımı.",
    "bitkiselOgelerPuan": 4,
    "heykelSanat": "Heykel, su gösterisi veya sanatsal enstalasyonlar.",
    "heykelSanatPuan": 1,
    "gorselKontrastDiger": "Form, renk veya ölçek farkıyla mekanda öne çıkan diğer ögeler.",
    "gorselKontrastDigerPuan": 2,
    "puan": 2
  },
  "genelKarsilastirmaliDegerlendirme": "Önceki fotoğraflarla karşılaştırmalı olarak yapılan nesnel değerlendirme, bu görselin diğerlerine göre nerede konumlandığına dair kısa mimari özet."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
        {
          text: promptText,
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "gorselKarmasiklik",
            "yonDuygusu",
            "sinirlar",
            "bolgeTanimi",
            "odakNoktasi",
            "simgeselElemanlar",
            "genelKarsilastirmaliDegerlendirme"
          ],
          properties: {
            gorselKarmasiklik: {
              type: Type.OBJECT,
              required: [
                "renkCesitliligi",
                "renkCesitliligiPuan",
                "objeSekilCesitliligi",
                "objeSekilCesitliligiPuan",
                "insanYogunlugu",
                "insanYogunluguPuan",
                "dogalElemanCesitliligi",
                "dogalElemanCesitliligiPuan",
                "yapisalElemanCesitliligi",
                "yapisalElemanCesitliligiPuan",
                "araziSekliCesitliligi",
                "araziSekliCesitliligiPuan",
                "puan"
              ],
              properties: {
                renkCesitliligi: { type: Type.STRING },
                renkCesitliligiPuan: { type: Type.INTEGER },
                objeSekilCesitliligi: { type: Type.STRING },
                objeSekilCesitliligiPuan: { type: Type.INTEGER },
                insanYogunlugu: { type: Type.STRING },
                insanYogunluguPuan: { type: Type.INTEGER },
                dogalElemanCesitliligi: { type: Type.STRING },
                dogalElemanCesitliligiPuan: { type: Type.INTEGER },
                yapisalElemanCesitliligi: { type: Type.STRING },
                yapisalElemanCesitliligiPuan: { type: Type.INTEGER },
                araziSekliCesitliligi: { type: Type.STRING },
                araziSekliCesitliligiPuan: { type: Type.INTEGER },
                puan: { type: Type.INTEGER }
              }
            },
            yonDuygusu: {
              type: Type.OBJECT,
              required: [
                "yolCizgileriYogunlugu",
                "yolCizgileriYogunluguPuan",
                "yonlendirmeElemanlari",
                "yonlendirmeElemanlariPuan",
                "insanHareketYonu",
                "insanHareketYonuPuan",
                "puan"
              ],
              properties: {
                yolCizgileriYogunlugu: { type: Type.STRING },
                yolCizgileriYogunluguPuan: { type: Type.INTEGER },
                yonlendirmeElemanlari: { type: Type.STRING },
                yonlendirmeElemanlariPuan: { type: Type.INTEGER },
                insanHareketYonu: { type: Type.STRING },
                insanHareketYonuPuan: { type: Type.INTEGER },
                puan: { type: Type.INTEGER }
              }
            },
            sinirlar: {
              type: Type.OBJECT,
              required: [
                "dogalSinirlar",
                "dogalSinirlarPuan",
                "yapisalSinirlar",
                "yapisalSinirlarPuan",
                "renkKontrastiSinir",
                "renkKontrastiSinirPuan",
                "cizgiKontrastiYogunlugu",
                "cizgiKontrastiYogunluguPuan",
                "puan"
              ],
              properties: {
                dogalSinirlar: { type: Type.STRING },
                dogalSinirlarPuan: { type: Type.INTEGER },
                yapisalSinirlar: { type: Type.STRING },
                yapisalSinirlarPuan: { type: Type.INTEGER },
                renkKontrastiSinir: { type: Type.STRING },
                renkKontrastiSinirPuan: { type: Type.INTEGER },
                cizgiKontrastiYogunlugu: { type: Type.STRING },
                cizgiKontrastiYogunluguPuan: { type: Type.INTEGER },
                puan: { type: Type.INTEGER }
              }
            },
            bolgeTanimi: {
              type: Type.OBJECT,
              required: [
                "yapiAlanlari",
                "yapiAlanlariPuan",
                "yesilAlanBolgeleri",
                "yesilAlanBolgeleriPuan",
                "zeminDosemeFarkliliklari",
                "zeminDosemeFarkliliklariPuan",
                "simgeselObjeler",
                "simgeselObjelerPuan",
                "puan"
              ],
              properties: {
                yapiAlanlari: { type: Type.STRING },
                yapiAlanlariPuan: { type: Type.INTEGER },
                yesilAlanBolgeleri: { type: Type.STRING },
                yesilAlanBolgeleriPuan: { type: Type.INTEGER },
                zeminDosemeFarkliliklari: { type: Type.STRING },
                zeminDosemeFarkliliklariPuan: { type: Type.INTEGER },
                simgeselObjeler: { type: Type.STRING },
                simgeselObjelerPuan: { type: Type.INTEGER },
                puan: { type: Type.INTEGER }
              }
            },
            odakNoktasi: {
              type: Type.OBJECT,
              required: [
                "gorselMerkeziUnsur",
                "gorselMerkeziUnsurPuan",
                "toplanmaPotansiyeli",
                "toplanmaPotansiyeliPuan",
                "insanYogunlasmaNoktalari",
                "insanYogunlasmaNoktalariPuan",
                "puan"
              ],
              properties: {
                gorselMerkeziUnsur: { type: Type.STRING },
                gorselMerkeziUnsurPuan: { type: Type.INTEGER },
                toplanmaPotansiyeli: { type: Type.STRING },
                toplanmaPotansiyeliPuan: { type: Type.INTEGER },
                insanYogunlasmaNoktalari: { type: Type.STRING },
                insanYogunlasmaNoktalariPuan: { type: Type.INTEGER },
                puan: { type: Type.INTEGER }
              }
            },
            simgeselElemanlar: {
              type: Type.OBJECT,
              required: [
                "simgeselYapilar",
                "simgeselYapilarPuan",
                "kentselMobilyalar",
                "kentselMobilyalarPuan",
                "bitkiselOgeler",
                "bitkiselOgelerPuan",
                "heykelSanat",
                "heykelSanatPuan",
                "gorselKontrastDiger",
                "gorselKontrastDigerPuan",
                "puan"
              ],
              properties: {
                simgeselYapilar: { type: Type.STRING },
                simgeselYapilarPuan: { type: Type.INTEGER },
                kentselMobilyalar: { type: Type.STRING },
                kentselMobilyalarPuan: { type: Type.INTEGER },
                bitkiselOgeler: { type: Type.STRING },
                bitkiselOgelerPuan: { type: Type.INTEGER },
                heykelSanat: { type: Type.STRING },
                heykelSanatPuan: { type: Type.INTEGER },
                gorselKontrastDiger: { type: Type.STRING },
                gorselKontrastDigerPuan: { type: Type.INTEGER },
                puan: { type: Type.INTEGER }
              }
            },
            genelKarsilastirmaliDegerlendirme: { type: Type.STRING }
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Yapay zeka analiz çıktısı üretemedi.");
    }

    const resultData = JSON.parse(textOutput.trim());
    res.json(resultData);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    const errString = String(error.message || error);
    let friendlyMessage = errString;
    
    if (
      errString.toLowerCase().includes("quota") || 
      errString.includes("429") || 
      errString.includes("RESOURCE_EXHAUSTED") || 
      errString.toLowerCase().includes("limit")
    ) {
      friendlyMessage = "Gemini API günlük veya dakikalık ücretsiz kullanım kotası sınırına ulaşıldı (Quota Exceeded / 429). Lütfen bir süre sonra tekrar deneyin ya da kendi Gemini API Anahtarınızı (GEMINI_API_KEY) tanımlayın.";
    }
    
    res.status(500).json({ error: friendlyMessage });
  }
});

// Supabase Connection Status and Verification
app.get("/api/supabase/status", async (req: express.Request, res: express.Response) => {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) {
    res.json({ configured: false, connected: false, tableExists: false });
    return;
  }
  try {
    const supabase = getSupabaseClient();
    // Test connection by querying the spatial_images table
    const { error } = await supabase.from("spatial_images").select("id").limit(1);
    if (error) {
      if (error.code === "42P01" || (error.message && (error.message.includes("relation") && error.message.includes("does not exist")))) {
        res.json({ configured: true, connected: true, tableExists: false, error: error.message });
      } else {
        res.json({ configured: true, connected: false, tableExists: false, error: error.message });
      }
    } else {
      res.json({ configured: true, connected: true, tableExists: true });
    }
  } catch (err: any) {
    res.json({ configured: true, connected: false, tableExists: false, error: err.message });
  }
});

// Fetch all images and user notes from Supabase
app.get("/api/supabase/images", async (req: express.Request, res: express.Response) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("spatial_images")
      .select("*")
      .order("order_index", { ascending: true });
      
    if (error) throw error;
    
    // Map from db format to frontend format
    const images = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      src: row.src,
      mimeType: row.mime_type,
      results: row.results || undefined
    }));
    
    const notes: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      if (row.notes) {
        notes[row.id] = row.notes;
      }
    });
    
    res.json({ images, notes });
  } catch (error: any) {
    console.error("Error fetching from Supabase:", error);
    res.status(500).json({ error: error.message });
  }
});

// Bulk upsert all images and notes to Supabase
app.post("/api/supabase/images/bulk", async (req: express.Request, res: express.Response) => {
  try {
    const { images, notes } = req.body;
    if (!Array.isArray(images)) {
      res.status(400).json({ error: "images parametresi dizi olmalıdır." });
      return;
    }
    const supabase = getSupabaseClient();
    
    const rows = images.map((img: any, idx: number) => ({
      id: img.id,
      name: img.name,
      src: img.src,
      mime_type: img.mimeType || "image/jpeg",
      results: img.results || null,
      notes: notes?.[img.id] || null,
      order_index: idx
    }));
    
    const { error } = await supabase.from("spatial_images").upsert(rows);
    if (error) throw error;
    
    res.json({ success: true, count: rows.length });
  } catch (error: any) {
    console.error("Error saving bulk to Supabase:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific image from Supabase
app.delete("/api/supabase/images/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("spatial_images").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting from Supabase:", error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static assets in production, otherwise Vite will handle it
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback for SPA routing in development
    app.get("*", (req, res, next) => {
      vite.middlewares(req, res, next);
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development Server running on http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start Vite server:", err);
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production Server running on port ${PORT}`);
  });
}
