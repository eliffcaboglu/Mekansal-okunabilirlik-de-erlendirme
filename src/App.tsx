import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, 
  Trash2, 
  Sparkles, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Compass, 
  MapPin, 
  Activity, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  FileText,
  Layers,
  HelpCircle
} from "lucide-react";
import { SAMPLE_IMAGES } from "./sampleData";
import { AnalyzedImage, EvaluationResult, CriterionDetail } from "./types";

export default function App() {
  // State for the 12 images
  const [images, setImages] = useState<AnalyzedImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"detail" | "compare" | "guide">("detail");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Supabase Integration State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    tableExists: boolean;
    error?: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  // Check Supabase Configuration & Table existence
  const checkSupabaseStatus = async () => {
    try {
      const res = await fetch("/api/supabase/status");
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
        return data;
      }
    } catch (err) {
      console.error("Failed to check Supabase status:", err);
    }
    return null;
  };

  // Push local state to Supabase
  const forceSyncToSupabase = async (currentImages: AnalyzedImage[], currentNotes: Record<string, string>) => {
    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    try {
      const res = await fetch("/api/supabase/images/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: currentImages, notes: currentNotes }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Supabase veritabanına veri senkronizasyonu başarısız oldu.");
      }
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
      await checkSupabaseStatus();
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || "Senkronizasyon başarısız oldu.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Pull remote data from Supabase
  const pullFromSupabase = async () => {
    setIsLoading(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/supabase/images");
      if (!res.ok) throw new Error("Supabase verileri alınamadı.");
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        setImages(data.images);
        setUserNotes(data.notes || {});
        setSelectedIndex(0);
        // Update local storage
        localStorage.setItem("spatial_images", JSON.stringify(data.images));
        localStorage.setItem("spatial_notes", JSON.stringify(data.notes || {}));
      } else {
        // Supabase is empty, sync current local state to remote
        await forceSyncToSupabase(images, userNotes);
      }
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || "Supabase'den veriler çekilirken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize from LocalStorage and Supabase if active
  useEffect(() => {
    const storedImages = localStorage.getItem("spatial_images");
    const storedNotes = localStorage.getItem("spatial_notes");
    
    let loadedImages = SAMPLE_IMAGES;
    let loadedNotes: Record<string, string> = {};

    if (storedImages) {
      try {
        loadedImages = JSON.parse(storedImages);
        setImages(loadedImages);
      } catch (e) {
        setImages(SAMPLE_IMAGES);
      }
    } else {
      setImages(SAMPLE_IMAGES);
    }

    if (storedNotes) {
      try {
        loadedNotes = JSON.parse(storedNotes);
        setUserNotes(loadedNotes);
      } catch (e) {
        setUserNotes({});
      }
    }

    // Now check Supabase Status and load if possible
    const initSupabase = async () => {
      const status = await checkSupabaseStatus();
      if (status && status.configured && status.connected && status.tableExists) {
        try {
          const res = await fetch("/api/supabase/images");
          if (res.ok) {
            const data = await res.json();
            if (data.images && data.images.length > 0) {
              setImages(data.images);
              setUserNotes(data.notes || {});
              localStorage.setItem("spatial_images", JSON.stringify(data.images));
              localStorage.setItem("spatial_notes", JSON.stringify(data.notes || {}));
            } else {
              // Table is empty, seed it with current local state
              await fetch("/api/supabase/images/bulk", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ images: loadedImages, notes: loadedNotes }),
              });
            }
          }
        } catch (err) {
          console.error("Initial load from Supabase failed:", err);
        }
      }
    };
    initSupabase();
  }, []);

  // Save changes helper with automatic Supabase synchronization
  const saveToLocalStorageAndSync = async (newImages: AnalyzedImage[], newNotes?: Record<string, string>) => {
    const notesToUse = newNotes !== undefined ? newNotes : userNotes;
    localStorage.setItem("spatial_images", JSON.stringify(newImages));
    localStorage.setItem("spatial_notes", JSON.stringify(notesToUse));
    
    // Check if Supabase is active and operational
    if (supabaseStatus?.configured && supabaseStatus?.connected && supabaseStatus?.tableExists) {
      try {
        await fetch("/api/supabase/images/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ images: newImages, notes: notesToUse }),
        });
      } catch (err) {
        console.error("Background Supabase sync failed:", err);
      }
    }
  };


  const selectedImage = images[selectedIndex] || null;

  // Handle Note Edit
  const handleNoteChange = (text: string) => {
    if (!selectedImage) return;
    const updatedNotes = {
      ...userNotes,
      [selectedImage.id]: text
    };
    setUserNotes(updatedNotes);
    saveToLocalStorageAndSync(images, updatedNotes);
  };

  // Handle manual score updates (Pills clicking)
  const handleScoreChange = (criterionKey: keyof Omit<EvaluationResult, "genelKarsilastirmaliDegerlendirme">, score: number) => {
    if (!selectedImage || !selectedImage.results) return;

    const updatedImages = images.map((img, idx) => {
      if (idx === selectedIndex) {
        const results = { ...img.results } as EvaluationResult;
        results[criterionKey] = {
          ...results[criterionKey],
          puan: score
        } as any;
        return { ...img, results };
      }
      return img;
    });

    setImages(updatedImages);
    saveToLocalStorageAndSync(updatedImages);
  };

  // Handle manual sub-criterion description change
  const handleSubCriterionTextChange = (
    criterionKey: keyof Omit<EvaluationResult, "genelKarsilastirmaliDegerlendirme">,
    subKey: string,
    value: string
  ) => {
    if (!selectedImage || !selectedImage.results) return;

    const updatedImages = images.map((img, idx) => {
      if (idx === selectedIndex) {
        const results = { ...img.results } as EvaluationResult;
        results[criterionKey] = {
          ...results[criterionKey],
          [subKey]: value
        } as any;
        return { ...img, results };
      }
      return img;
    });

    setImages(updatedImages);
    saveToLocalStorageAndSync(updatedImages);
  };

  // Handle manual sub-criterion score change
  const handleSubCriterionScoreChange = (
    criterionKey: keyof Omit<EvaluationResult, "genelKarsilastirmaliDegerlendirme">,
    subKey: string,
    score: number
  ) => {
    if (!selectedImage || !selectedImage.results) return;

    const updatedImages = images.map((img, idx) => {
      if (idx === selectedIndex) {
        const results = { ...img.results } as EvaluationResult;
        results[criterionKey] = {
          ...results[criterionKey],
          [`${subKey}Puan`]: score
        } as any;
        return { ...img, results };
      }
      return img;
    });

    setImages(updatedImages);
    saveToLocalStorageAndSync(updatedImages);
  };

  // Handle general comparative text change
  const handleGeneralComparativeTextChange = (value: string) => {
    if (!selectedImage || !selectedImage.results) return;

    const updatedImages = images.map((img, idx) => {
      if (idx === selectedIndex) {
        const results = {
          ...img.results,
          genelKarsilastirmaliDegerlendirme: value
        } as EvaluationResult;
        return { ...img, results };
      }
      return img;
    });

    setImages(updatedImages);
    saveToLocalStorageAndSync(updatedImages);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, replaceIdx?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      
      const newImage: AnalyzedImage = {
        id: `uploaded-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // Strip extension
        src: base64,
        mimeType: file.type || "image/jpeg",
        results: {
          gorselKarmasiklik: {
            renkCesitliligi: "Analiz edilmedi. Puanı belirlemek için analiz butonunu kullanın veya elle düzenleyin.",
            objeSekilCesitliligi: "Analiz edilmedi.",
            insanYogunlugu: "Analiz edilmedi.",
            dogalElemanCesitliligi: "Analiz edilmedi.",
            yapisalElemanCesitliligi: "Analiz edilmedi.",
            araziSekliCesitliligi: "Analiz edilmedi.",
            puan: 3
          },
          yonDuygusu: {
            yolCizgileriYogunlugu: "Analiz edilmedi.",
            yonlendirmeElemanlari: "Analiz edilmedi.",
            insanHareketYonu: "Analiz edilmedi.",
            puan: 3
          },
          sinirlar: {
            dogalSinirlar: "Analiz edilmedi.",
            yapisalSinirlar: "Analiz edilmedi.",
            renkKontrastiSinir: "Analiz edilmedi.",
            cizgiKontrastiYogunlugu: "Analiz edilmedi.",
            puan: 3
          },
          bolgeTanimi: {
            yapiAlanlari: "Analiz edilmedi.",
            yesilAlanBolgeleri: "Analiz edilmedi.",
            zeminDosemeFarkliliklari: "Analiz edilmedi.",
            simgeselObjeler: "Analiz edilmedi.",
            puan: 3
          },
          odakNoktasi: {
            gorselMerkeziUnsur: "Analiz edilmedi.",
            toplanmaPotansiyeli: "Analiz edilmedi.",
            insanYogunlasmaNoktalari: "Analiz edilmedi.",
            puan: 3
          },
          simgeselElemanlar: {
            simgeselYapilar: "Analiz edilmedi.",
            kentselMobilyalar: "Analiz edilmedi.",
            bitkiselOgeler: "Analiz edilmedi.",
            heykelSanat: "Analiz edilmedi.",
            gorselKontrastDiger: "Analiz edilmedi.",
            puan: 3
          },
          genelKarsilastirmaliDegerlendirme: "Yeni yüklenen görsel. Önceki görsellere göre peyzaj okunabilirlik analizi bekliyor."
        }
      };

      let updatedImages = [...images];
      if (replaceIdx !== undefined && replaceIdx >= 0 && replaceIdx < images.length) {
        // Replace existing
        updatedImages[replaceIdx] = newImage;
        setImages(updatedImages);
        setSelectedIndex(replaceIdx);
      } else if (images.length < 12) {
        // Append up to 12
        updatedImages.push(newImage);
        setImages(updatedImages);
        setSelectedIndex(updatedImages.length - 1);
      } else {
        // Override the selected slot if already at 12
        updatedImages[selectedIndex] = newImage;
        setImages(updatedImages);
      }

      saveToLocalStorageAndSync(updatedImages);
    };
    reader.readAsDataURL(file);
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (replaceInputRef.current) replaceInputRef.current.value = "";
  };

  // Delete image
  const handleDeleteImage = (indexToDelete: number) => {
    if (images.length <= 1) {
      alert("En az bir görsel bulunmalıdır.");
      return;
    }
    const updatedImages = images.filter((_, idx) => idx !== indexToDelete);
    setImages(updatedImages);
    setSelectedIndex(Math.max(0, indexToDelete - 1));
    saveToLocalStorageAndSync(updatedImages);
  };

  // Run Gemini AI Analysis for current image
  const handleAnalyzeWithGemini = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // Gather previous images context (exclude current one from history)
      const previousHistory = images
        .slice(0, selectedIndex)
        .filter(img => img.results)
        .map(img => ({
          name: img.name,
          results: img.results
        }));

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: selectedImage.src,
          mimeType: selectedImage.mimeType || "image/jpeg",
          history: previousHistory,
          imageIndex: selectedIndex + 1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Sunucu hatası oluştu.");
      }

      const parsedResults = await response.json();

      // Update images state with AI results
      const updatedImages = images.map((img, idx) => {
        if (idx === selectedIndex) {
          return {
            ...img,
            results: parsedResults
          };
        }
        return img;
      });

      setImages(updatedImages);
      saveToLocalStorageAndSync(updatedImages);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Yapay zeka analizi gerçekleştirilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to original sample data
  const handleResetToSamples = () => {
    if (window.confirm("Tüm değişiklikler silinecek ve 12 adet örnek peyzaj fotoğrafı ve uzman analizleri geri yüklenecektir. Emin misiniz?")) {
      setImages(SAMPLE_IMAGES);
      setUserNotes({});
      setSelectedIndex(0);
      saveToLocalStorageAndSync(SAMPLE_IMAGES, {});
      setApiError(null);
    }
  };

  // Clear all for a fresh session
  const handleClearAll = () => {
    if (window.confirm("Bütün görselleri ve analizleri temizleyip sıfırdan kendi 12'li analizinizi başlatmak istiyor musunuz?")) {
      const freshImages: AnalyzedImage[] = [
        {
          id: "empty-1",
          name: "1. Yeni Görselinizi Ekleyin",
          src: "placeholder",
          mimeType: "image/jpeg",
          results: {
            gorselKarmasiklik: {
              renkCesitliligi: "Lütfen bir görsel yükleyin.",
              objeSekilCesitliligi: "Lütfen bir görsel yükleyin.",
              insanYogunlugu: "Lütfen bir görsel yükleyin.",
              dogalElemanCesitliligi: "Lütfen bir görsel yükleyin.",
              yapisalElemanCesitliligi: "Lütfen bir görsel yükleyin.",
              araziSekliCesitliligi: "Lütfen bir görsel yükleyin.",
              puan: 1
            },
            yonDuygusu: {
              yolCizgileriYogunlugu: "Lütfen bir görsel yükleyin.",
              yonlendirmeElemanlari: "Lütfen bir görsel yükleyin.",
              insanHareketYonu: "Lütfen bir görsel yükleyin.",
              puan: 1
            },
            sinirlar: {
              dogalSinirlar: "Lütfen bir görsel yükleyin.",
              yapisalSinirlar: "Lütfen bir görsel yükleyin.",
              renkKontrastiSinir: "Lütfen bir görsel yükleyin.",
              cizgiKontrastiYogunlugu: "Lütfen bir görsel yükleyin.",
              puan: 1
            },
            bolgeTanimi: {
              yapiAlanlari: "Lütfen bir görsel yükleyin.",
              yesilAlanBolgeleri: "Lütfen bir görsel yükleyin.",
              zeminDosemeFarkliliklari: "Lütfen bir görsel yükleyin.",
              simgeselObjeler: "Lütfen bir görsel yükleyin.",
              puan: 1
            },
            odakNoktasi: {
              gorselMerkeziUnsur: "Lütfen bir görsel yükleyin.",
              toplanmaPotansiyeli: "Lütfen bir görsel yükleyin.",
              insanYogunlasmaNoktalari: "Lütfen bir görsel yükleyin.",
              puan: 1
            },
            simgeselElemanlar: {
              simgeselYapilar: "Lütfen bir görsel yükleyin.",
              kentselMobilyalar: "Lütfen bir görsel yükleyin.",
              bitkiselOgeler: "Lütfen bir görsel yükleyin.",
              heykelSanat: "Lütfen bir görsel yükleyin.",
              gorselKontrastDiger: "Lütfen bir görsel yükleyin.",
              puan: 1
            },
            genelKarsilastirmaliDegerlendirme: "Yeni analiz serisi başlatıldı. Görsel yükleyip uzman değerlendirmelerini oluşturabilirsiniz."
          }
        }
      ];
      setImages(freshImages);
      setUserNotes({});
      setSelectedIndex(0);
      saveToLocalStorageAndSync(freshImages, {});
      setApiError(null);
    }
  };

  // Export results as JSON file download
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ images, userNotes }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mekansal_okunabilirlik_raporu_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Scoring mapping helpers
  const scoreLabels: Record<number, string> = {
    1: "Çok Düşük",
    2: "Düşük",
    3: "Orta",
    4: "Yüksek",
    5: "Çok Yüksek"
  };

  const scoreColors: Record<number, string> = {
    1: "bg-[#E6DFD3] text-[#2C2A26]",
    2: "bg-[#D8CDBC] text-[#2C2A26]",
    3: "bg-[#C2B199] text-[#FFFFFF]",
    4: "bg-[#7D8C62] text-[#FFFFFF]",
    5: "bg-[#5A6A42] text-[#FFFFFF]"
  };

  // Criteria visual metadata
  const criteriaList = [
    {
      key: "gorselKarmasiklik" as const,
      label: "1. Görsel Karmaşıklık",
      desc: "Renk, şekil, insan ve doğal/yapısal elemanların mekandaki zenginliği.",
      subs: [
        { key: "renkCesitliligi", label: "Renk Çeşitliliği" },
        { key: "objeSekilCesitliligi", label: "Obje Şekil Çeşitliliği" },
        { key: "insanYogunlugu", label: "İnsan Yoğunluğu" },
        { key: "dogalElemanCesitliligi", label: "Doğal Eleman Çeşitliliği" },
        { key: "yapisalElemanCesitliligi", label: "Yapısal Eleman Çeşitliliği" },
        { key: "araziSekliCesitliligi", label: "Arazi Şekli Çeşitliliği" }
      ]
    },
    {
      key: "yonDuygusu" as const,
      label: "2. Yön Duygusu",
      desc: "Mekanda kaybolmama gücü, akslar ve yönlendiren tasarım ögeleri.",
      subs: [
        { key: "yolCizgileriYogunlugu", label: "Yol Çizgileri Yoğunluğu" },
        { key: "yonlendirmeElemanlari", label: "Yönlendirme Elemanlarının Varlığı" },
        { key: "insanHareketYonu", label: "İnsan Hareket Yönü İpuçları" }
      ]
    },
    {
      key: "sinirlar" as const,
      label: "3. Sınırlar",
      desc: "Doğal, yapısal ve görsel tezatlar ile belirlenen mekansal sınırlar.",
      subs: [
        { key: "dogalSinirlar", label: "Doğal Sınırların Belirginliği" },
        { key: "yapisalSinirlar", label: "Yapısal Sınırların Belirginliği" },
        { key: "renkKontrastiSinir", label: "Renk Kontrastı ile Oluşan Sınırlar" },
        { key: "cizgiKontrastiYogunlugu", label: "Çizgi Kontrastı Yoğunluğu" }
      ]
    },
    {
      key: "bolgeTanimi" as const,
      label: "4. Bölge Tanımı",
      desc: "Yapısal, yeşil ve zemin döşeme değişimleriyle oluşan mekansal kimlik.",
      subs: [
        { key: "yapiAlanlari", label: "Yapı Alanlarının Gücü" },
        { key: "yesilAlanBolgeleri", label: "Yeşil Alan Bölgelerinin Karakteri" },
        { key: "zeminDosemeFarkliliklari", label: "Zemin Döşeme Farklılıkları" },
        { key: "simgeselObjeler", label: "Bölgeyi Tanımlayan Objeler" }
      ]
    },
    {
      key: "odakNoktasi" as const,
      label: "5. Odak Noktası",
      desc: "Görsel ve sosyal toplanma merkezi ile insan çekim noktaları.",
      subs: [
        { key: "gorselMerkeziUnsur", label: "Görsel Olarak Dikkat Çeken Unsur" },
        { key: "toplanmaPotansiyeli", label: "Toplanma Potansiyeli Bulunan Alanlar" },
        { key: "insanYogunlasmaNoktalari", label: "İnsanların Yoğunlaştığı Noktalar" }
      ]
    },
    {
      key: "simgeselElemanlar" as const,
      label: "6. Simgesel Elemanlar",
      desc: "Landmark etkisi oluşturan yapılar, mobilyalar, heykel ve bitkisel ögeler.",
      subs: [
        { key: "simgeselYapilar", label: "Simgesel Yapılar" },
        { key: "kentselMobilyalar", label: "Kentsel Mobilyalar" },
        { key: "bitkiselOgeler", label: "Dikkat Çeken Bitkisel Öğeler" },
        { key: "heykelSanat", label: "Heykel veya Sanat Objeleri" },
        { key: "gorselKontrastDiger", label: "Görsel Kontrast Oluşturan Tasarımlar" }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F5F0] text-[#2C2A26] font-sans antialiased">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleImageUpload(e)} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={replaceInputRef} 
        onChange={(e) => handleImageUpload(e, selectedIndex)} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header Panel */}
      <header className="h-18 px-6 flex items-center justify-between border-b border-[#D4CEBF] bg-[#F3EEE5] shadow-sm shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-[#5A6A42] flex items-center justify-center rounded-xl shadow-md transition-transform hover:scale-105 duration-200">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-[#2C2A26] flex items-center gap-2">
              Mekansal Okunabilirlik Değerlendirme Analizörü
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#5A6A42] opacity-85">
              10+ Yıl Deneyimli Kıdemli Peyzaj Mimarı Tasarım & Değerlendirme Modülü
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#EAE4D9] border border-[#D4CEBF] text-[#2C2A26] rounded-lg text-xs font-semibold transition-all shadow-sm"
            title="Analiz Raporunu İndir"
          >
            <Download className="w-4 h-4 text-[#5A6A42]" />
            <span>Raporu İndir (JSON)</span>
          </button>

          <button 
            onClick={handleResetToSamples}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold transition-all shadow-sm"
            title="Örnek 12 Görseli Geri Yükle"
          >
            <RotateCcw className="w-4 h-4 text-red-700" />
            <span>Örnekleri Yükle</span>
          </button>

          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#C47353] hover:bg-[#B26041] text-white rounded-lg text-xs font-semibold transition-all shadow-md"
            title="Yeni Boş Analiz Serisi Başlat"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Değerlendirme</span>
          </button>
        </div>
      </header>

      {/* Supabase Status Banner */}
      {supabaseStatus && (
        <div className="bg-white border-b border-[#D4CEBF] px-6 py-2.5 transition-all duration-300 shrink-0">
          {!supabaseStatus.configured ? (
            <div className="flex items-center justify-between gap-4 text-xs text-amber-950 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Supabase Bağlantısı Eksik:</strong> Uygulamayı buluta bağlamak için <code>SUPABASE_URL</code> ve <code>SUPABASE_ANON_KEY</code> ortam değişkenlerini tanımlayın. Şu anda sadece tarayıcı önbelleği (LocalStorage) aktif.
                </span>
              </div>
              <button 
                onClick={checkSupabaseStatus} 
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-[11px] transition-all border border-amber-200"
              >
                Yeniden Kontrol Et
              </button>
            </div>
          ) : !supabaseStatus.connected ? (
            <div className="flex items-center justify-between gap-4 text-xs text-red-950 bg-red-50/60 p-2.5 rounded-lg border border-red-200/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>
                  <strong>Supabase Bağlantı Hatası:</strong> Supabase veritabanına bağlanılamadı. Lütfen ortam değişkenlerini (URL ve API anahtarı) kontrol edin.
                  {supabaseStatus.error && (
                    <span className="block mt-1 font-mono text-[10px] text-red-800 bg-red-100/50 px-1.5 py-1 rounded">
                      Hata Detayı: {supabaseStatus.error}
                    </span>
                  )}
                </span>
              </div>
              <button 
                type="button"
                onClick={checkSupabaseStatus} 
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-900 font-bold rounded text-[11px] transition-all border border-red-200"
              >
                Yeniden Dene
              </button>
            </div>
          ) : !supabaseStatus.tableExists ? (
            <div className="flex flex-col gap-3 text-xs text-amber-950 bg-amber-50/60 p-3.5 rounded-lg border border-amber-200/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Supabase Bağlantısı Hazır! Ancak Tablo Eksik.</strong> Veritabanınızı kurmak için aşağıdaki SQL komutunu <strong>Supabase SQL Editor</strong> alanında çalıştırın:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={async () => {
                      await forceSyncToSupabase(images, userNotes);
                    }}
                    disabled={isSyncing}
                    className="px-3 py-1.5 bg-[#5A6A42] hover:bg-[#485535] text-white font-bold rounded text-[11px] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSyncing ? "Senkronize Ediliyor..." : "Tabloyu Seed Et / Yerel Verileri Gönder"}
                  </button>
                  <button 
                    onClick={checkSupabaseStatus} 
                    className="px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-800 font-bold rounded text-[11px] border border-zinc-200 transition-all shadow-2xs cursor-pointer"
                  >
                    Yeniden Kontrol Et
                  </button>
                </div>
              </div>
              
              <div className="relative bg-zinc-950 text-zinc-100 font-mono p-3 rounded-lg text-[10px] leading-relaxed select-all overflow-x-auto shadow-inner border border-zinc-800">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS spatial_images (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  src TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  results JSONB,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
                    alert("SQL Kodu Panoya Kopyalandı!");
                  }}
                  className="absolute right-2.5 top-2.5 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[9px] font-bold border border-zinc-700 transition-all cursor-pointer"
                >
                  Kopyala
                </button>
                <pre>{`CREATE TABLE IF NOT EXISTS spatial_images (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  src TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  results JSONB,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 text-xs text-emerald-950 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Supabase Senkronizasyonu Aktif:</strong> Projeniz bulut veritabanına bağlı. Yapılan her değişiklik otomatik olarak gerçek zamanlı senkronize ediliyor.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={pullFromSupabase}
                  disabled={isLoading}
                  className="px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-950 font-bold rounded text-[11px] border border-emerald-200 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                  title="Buluttaki verileri indirip yerel durumu günceller"
                >
                  {isLoading ? "Yükleniyor..." : "Buluttan Veri Çek (Pull)"}
                </button>
                <button 
                  onClick={() => forceSyncToSupabase(images, userNotes)}
                  disabled={isSyncing}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-[11px] transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                  title="Yerel görselleri ve notları buluta gönderir"
                >
                  {isSyncing ? "Eşitleniyor..." : syncSuccess ? "Eşitlendi! ✓" : "Buluta Veri Gönder (Push)"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - 12 Images Gallery Slot */}
        <aside className="w-64 bg-[#EAE4D9] border-r border-[#D4CEBF] flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-[#D4CEBF] bg-[#E3DAC9]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C2A26] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#5A6A42]" />
                Değerlendirme Serisi ({images.length} / 12)
              </h2>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-600">
              Mekansal okunabilirlik sırasına göre 12 adet görsel yükleyebilirsiniz. Her görsel öncekileri referans alır.
            </p>
          </div>

          {/* List of 12 slots */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {Array.from({ length: 12 }).map((_, index) => {
              const img = images[index];
              const isActive = index === selectedIndex;
              const isFilled = !!img;

              return (
                <div 
                  key={index}
                  onClick={() => isFilled && setSelectedIndex(index)}
                  className={`relative group rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-[#F8F5F0] border-2 border-[#5A6A42] shadow-sm" 
                      : isFilled 
                        ? "bg-white/60 hover:bg-white border border-[#D4CEBF] hover:shadow-sm" 
                        : "bg-[#D4CEBF]/40 border border-dashed border-[#D4CEBF] hover:bg-[#D4CEBF]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Index Indicator */}
                    <div className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      isActive 
                        ? "bg-[#5A6A42] text-white" 
                        : isFilled 
                          ? "bg-[#8A957E] text-white" 
                          : "bg-zinc-400/50 text-zinc-700"
                    }`}>
                      {index + 1}
                    </div>

                    {/* Thumbnail or Upload Button */}
                    {isFilled ? (
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        {img.src === "placeholder" ? (
                          <div className="w-10 h-10 rounded bg-[#C2B199] flex items-center justify-center shrink-0">
                            <Upload className="w-4 h-4 text-[#F8F5F0]" />
                          </div>
                        ) : (
                          <img 
                            src={img.src} 
                            alt={img.name} 
                            className="w-10 h-10 object-cover rounded shadow-inner bg-[#eee] shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#2C2A26] truncate" title={img.name}>
                            {img.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                            {img.results ? (
                              <span className="text-[#5A6A42] font-semibold flex items-center gap-0.5">
                                <CheckCircle className="w-3 h-3 inline" /> Değerlendirildi
                              </span>
                            ) : (
                              <span className="text-[#C47353] font-medium">Değerlendirme Yok</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="flex-1 py-2 px-1 text-left text-[11px] font-semibold text-zinc-600 hover:text-[#5A6A42] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Yeni Görsel Ekle</span>
                      </button>
                    )}

                    {/* Quick actions for filled slots */}
                    {isFilled && (
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white/90 p-0.5 rounded-md shadow border border-zinc-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(index);
                          }}
                          className="p-1 text-red-700 hover:bg-red-50 rounded"
                          title="Görseli Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompting instruction footer */}
          <div className="p-3 bg-[#D4CEBF]/50 border-t border-[#D4CEBF] text-[10px] leading-relaxed text-[#2C2A26] italic">
            "Mekandaki yaya akışı, nirengi noktaları ve sınır belirginliklerini önceki görseller ile karşılaştırarak tutarlı şekilde puanlayınız."
          </div>
        </aside>

        {/* Center Workspace - Main Image and comparative description */}
        <section className="flex-1 flex flex-col overflow-y-auto bg-white p-6">
          
          {/* Tabs for detail view vs Comparison overview */}
          <div className="flex border-b border-[#D4CEBF] mb-5 gap-6 shrink-0">
            <button
              onClick={() => setActiveTab("detail")}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "detail" 
                  ? "border-[#5A6A42] text-[#5A6A42]" 
                  : "border-transparent text-zinc-500 hover:text-[#2C2A26]"
              }`}
            >
              Detaylı Mekan Analizi
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "compare" 
                  ? "border-[#5A6A42] text-[#5A6A42]" 
                  : "border-transparent text-zinc-500 hover:text-[#2C2A26]"
              }`}
            >
              Matris Karşılaştırması ({images.length} Görsel)
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "guide" 
                  ? "border-[#5A6A42] text-[#5A6A42]" 
                  : "border-transparent text-zinc-500 hover:text-[#2C2A26]"
              }`}
            >
              Peyzaj Analiz Kılavuzu
            </button>
          </div>

          {activeTab === "detail" && (
            <div className="flex-1 flex flex-col space-y-6">
              
              {/* Image Preview Window */}
              {selectedImage ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Image Display Frame */}
                  <div className="lg:col-span-3 flex flex-col">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#D4CEBF] bg-zinc-100 flex flex-col justify-between group">
                      
                      {selectedImage.src === "placeholder" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#F3EEE5] text-center">
                          <Upload className="w-16 h-16 text-[#8A957E] mb-4" />
                          <h4 className="font-serif text-lg font-bold">Mekansal Görsel Eksik</h4>
                          <p className="text-xs text-zinc-600 max-w-sm mt-1 mb-4">
                            Bu analiz slotu boş. Lütfen bilgisayarınızdan analiz etmek istediğiniz bir peyzaj tasarımı veya kentsel mekan fotoğrafı yükleyin.
                          </p>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-5 py-2.5 bg-[#5A6A42] hover:bg-[#4A5736] text-white rounded-lg text-xs font-semibold shadow transition-all"
                          >
                            Bilgisayardan Seç
                          </button>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={selectedImage.src} 
                            alt={selectedImage.name} 
                            className="w-full h-full object-cover"
                          />
                          {/* Bottom Gradient overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#EAE4D9] bg-white/25 px-2.5 py-1 rounded-full backdrop-blur-xs">
                              Görsel Referans: Slot #{selectedIndex + 1}
                            </span>
                            <h3 className="font-serif text-xl font-bold mt-2.5 leading-tight">
                              {selectedImage.name}
                            </h3>
                            <p className="text-[11px] text-[#EAE4D9]/90 mt-1">
                              MIME: {selectedImage.mimeType} | Mekansal Okunabilirlik (Kevin Lynch Kriterleri)
                            </p>
                          </div>
                        </>
                      )}

                      {/* Top actions */}
                      {selectedImage.src !== "placeholder" && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => replaceInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white/95 hover:bg-white text-zinc-800 rounded-md text-[11px] font-bold shadow-md flex items-center gap-1 transition-all"
                            title="Görseli Değiştir"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Görseli Değiştir</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Image Rename Control */}
                    <div className="mt-3 flex gap-2 items-center">
                      <span className="text-xs font-bold text-zinc-600 shrink-0">Mekan İsmi:</span>
                      <input 
                        type="text"
                        value={selectedImage.name}
                        onChange={(e) => {
                          const updated = images.map((img, i) => i === selectedIndex ? { ...img, name: e.target.value } : img);
                          setImages(updated);
                          saveToLocalStorageAndSync(updated);
                        }}
                        placeholder="Örn. Kadıköy İskele Meydanı"
                        className="flex-1 bg-[#F8F5F0] hover:bg-[#EAE4D9]/30 focus:bg-white border border-[#D4CEBF] focus:border-[#5A6A42] rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Gemini AI Trigger & Expert Notes in Center Column */}
                  <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
                    
                    {/* Gemini AI Controller Block */}
                    <div className="p-4 rounded-2xl border-2 border-dashed border-[#5A6A42]/40 bg-[#F3EEE5]/50 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6A42] flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#C47353]" />
                            Gemini Yapay Zeka Uzmanı
                          </h4>
                          <span className="text-[10px] bg-[#5A6A42]/10 text-[#5A6A42] px-2 py-0.5 rounded-full font-bold">
                            Doğal Dil & Görüntü İşleme
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-[#2C2A26] mb-3">
                          Bu görseli yapay zeka mekansal analiz motoruna gönderin. Gemini, 10 yıllık peyzaj mimarı uzmanlığıyla görseli analiz eder, **puanları belirler** ve serideki **önceki {selectedIndex} görsellerle karşılaştırmalı** detaylar sunar.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {apiError && (
                          <div className="p-2.5 bg-red-50 border border-red-200 text-red-900 rounded-lg text-[11px] leading-snug flex items-start gap-1.5">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Analiz Hatası:</span> {apiError}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleAnalyzeWithGemini}
                          disabled={isLoading || selectedImage.src === "placeholder"}
                          className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${
                            isLoading 
                              ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" 
                              : selectedImage.src === "placeholder"
                                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                                : "bg-[#5A6A42] hover:bg-[#4A5736] text-white hover:shadow-md"
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Peyzaj Mimarı Analiz Yapıyor...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Gemini Uzman Analizini Çalıştır</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Personal Expert Notes Block */}
                    <div className="p-4 rounded-2xl border border-[#D4CEBF] bg-white shadow-xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2A26] flex items-center gap-1.5 mb-2">
                        <FileText className="w-4 h-4 text-[#C47353]" />
                        Kendi Uzman Notunuz (Yerel)
                      </h4>
                      <p className="text-[10px] text-zinc-500 mb-2">
                        Saha gözlemlerinizi veya bu görsele özel tasarım kararlarınızı ekleyin. Notlarınız otomatik olarak tarayıcınızda saklanır.
                      </p>
                      <textarea
                        value={userNotes[selectedImage.id] || ""}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder="Örn: Bu alanda sert zemin oranı çok yüksek, yeşil doku artırılmalı ve daha belirgin bir kentsel odak noktası tanımlanmalı..."
                        className="w-full h-24 bg-[#F8F5F0] border border-[#D4CEBF] focus:border-[#5A6A42] rounded-lg p-2.5 text-xs text-[#2C2A26] focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-[#F3EEE5] rounded-2xl border border-[#D4CEBF] text-center">
                  <AlertCircle className="w-12 h-12 text-[#C47353] mb-3" />
                  <p className="text-sm font-semibold">Seçili görsel bulunmamaktadır.</p>
                </div>
              )}

              {/* Comparative analysis with PREVIOUS image in the sequence */}
              {selectedImage && selectedImage.results && (
                <div className="bg-[#F3EEE5]/60 rounded-2xl border border-[#D4CEBF] p-5">
                  <h3 className="font-serif text-sm font-bold text-[#5A6A42] mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-[#C47353]" />
                    Seri Karşılaştırma & Sıralama Değerlendirmesi
                  </h3>
                  
                  {selectedIndex > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-1 border-r border-[#D4CEBF] pr-4 flex flex-col justify-center h-full">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Önceki Görsel Referansı</span>
                        <div className="mt-1.5 flex items-center gap-2.5">
                          {images[selectedIndex - 1]?.src !== "placeholder" ? (
                            <img 
                              src={images[selectedIndex - 1]?.src} 
                              alt="Previous" 
                              className="w-14 h-10 object-cover rounded border border-[#D4CEBF] bg-[#eee]"
                            />
                          ) : (
                            <div className="w-14 h-10 bg-zinc-200 rounded border border-[#D4CEBF]" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-[#2C2A26] truncate max-w-[100px]">
                              {images[selectedIndex - 1]?.name}
                            </p>
                            <span className="text-[10px] text-[#5A6A42] font-semibold">Slot #{selectedIndex}</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <span className="text-[10px] uppercase font-bold text-[#5A6A42]">Uzman Karşılaştırmalı Özeti (Gemini & Kendi Yorumunuz)</span>
                        <p className="text-xs leading-relaxed text-[#2C2A26] mt-1.5 italic bg-white p-3 rounded-xl border border-[#D4CEBF]/60 shadow-inner">
                          {selectedImage.results.genelKarsilastirmaliDegerlendirme || "Bu görsel için karşılaştırmalı analiz bulunmamaktadır."}
                        </p>
                        <div className="mt-2 flex gap-3 text-[10px] text-zinc-600">
                          <span>
                            <strong>Önceki Skorlar Toplamı:</strong>{" "}
                            {Object.values(images[selectedIndex - 1]?.results || {})
                              .filter(v => typeof v === 'object' && 'puan' in v)
                              .reduce((acc, curr: any) => acc + curr.puan, 0)}
                          </span>
                          <span>|</span>
                          <span>
                            <strong>Mevcut Skorlar Toplamı:</strong>{" "}
                            {Object.values(selectedImage.results || {})
                              .filter(v => typeof v === 'object' && 'puan' in v)
                              .reduce((acc, curr: any) => acc + curr.puan, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">
                      Bu serinin ilk görselidir. Bu sebeple karşılaştırılabilecek daha eski bir görsel bulunmamaktadır. Bir sonraki yükleyeceğiniz görseller bu görseli referans alacaktır.
                    </p>
                  )}
                </div>
              )}

              {/* Comprehensive sub-criteria text edits & sliders */}
              {selectedImage && selectedImage.results && (
                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#2C2A26] border-b border-[#D4CEBF] pb-2">
                    Detaylı Alt Kriter Değerlendirme Metinleri
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Aşağıda peyzaj mimarı uzmanının her alt kriter için yaptığı nesnel tespitler yer almaktadır. Kendi gözlemlerinize göre bu metinleri serbestçe değiştirebilirsiniz.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {criteriaList.map((crit) => {
                      const resVal = selectedImage.results?.[crit.key];
                      if (!resVal) return null;

                      return (
                        <div key={crit.key} className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4CEBF] flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-[#5A6A42] uppercase tracking-wider mb-2 flex justify-between items-center">
                              <span>{crit.label}</span>
                              <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-zinc-200 text-[#2C2A26] font-medium">
                                Skor: {resVal.puan} / 5
                              </span>
                            </h4>
                            <p className="text-[10px] text-zinc-500 mb-3 italic">{crit.desc}</p>
                            
                            <div className="space-y-3">
                              {crit.subs.map((sub) => {
                                const currentText = (resVal as any)[sub.key] || "";
                                const currentScore = (resVal as any)[`${sub.key}Puan`] || 3;
                                return (
                                  <div key={sub.key} className="space-y-1.5 p-2.5 rounded-lg bg-white/60 border border-[#D4CEBF]/30">
                                    <div className="flex items-center justify-between">
                                      <label className="block text-[10px] font-bold text-[#2C2A26]">{sub.label}:</label>
                                      
                                      {/* 1-5 sub-criterion score selectors */}
                                      <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-md border border-zinc-200 shadow-2xs">
                                        {[1, 2, 3, 4, 5].map((scoreNum) => {
                                          const isActive = currentScore === scoreNum;
                                          return (
                                            <button
                                              key={scoreNum}
                                              type="button"
                                              onClick={() => handleSubCriterionScoreChange(crit.key, sub.key, scoreNum)}
                                              className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center transition-all ${
                                                isActive 
                                                  ? scoreColors[scoreNum] + " ring-1 ring-[#5A6A42]" 
                                                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-500"
                                              }`}
                                              title={`${scoreNum} - ${scoreLabels[scoreNum]}`}
                                            >
                                              {scoreNum}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <textarea
                                      value={currentText}
                                      onChange={(e) => handleSubCriterionTextChange(crit.key, sub.key, e.target.value)}
                                      className="w-full bg-white border border-[#D4CEBF]/80 rounded p-1.5 text-[11px] leading-relaxed text-zinc-700 focus:outline-none focus:border-[#5A6A42] h-12 resize-none"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === "compare" && (
            <div className="space-y-6">
              <div className="bg-[#EAE4D9]/40 p-4 rounded-xl border border-[#D4CEBF] text-xs leading-relaxed text-[#2C2A26]">
                <h4 className="font-bold mb-1">Mekansal Okunabilirlik Karşılaştırma Matrisi</h4>
                Tüm serideki görsellerin 6 ana kritere göre aldıkları puanları toplu şekilde izleyin. Kevin Lynch teorisine göre yüksek puanlar o mekanın hafızada kalıcılığını ve yön bulma kolaylığını belgeler.
              </div>

              {/* Matris Table / Grid */}
              <div className="overflow-x-auto border border-[#D4CEBF] rounded-xl bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F3EEE5] text-[#2C2A26] border-b border-[#D4CEBF] font-semibold text-[10px] uppercase tracking-wider">
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3 w-20">Önizleme</th>
                      <th className="p-3 min-w-[150px]">Görsel/Mekan Adı</th>
                      <th className="p-3 text-center">Görsel Karm.</th>
                      <th className="p-3 text-center">Yön Duygusu</th>
                      <th className="p-3 text-center">Sınırlar</th>
                      <th className="p-3 text-center">Bölge Tan.</th>
                      <th className="p-3 text-center">Odak Nok.</th>
                      <th className="p-3 text-center">Simgesel El.</th>
                      <th className="p-3 text-center bg-[#5A6A42]/10 font-bold">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4CEBF]/60">
                    {images.map((img, idx) => {
                      const scores = img.results ? {
                        gorselKarmasiklik: img.results.gorselKarmasiklik.puan || 0,
                        yonDuygusu: img.results.yonDuygusu.puan || 0,
                        sinirlar: img.results.sinirlar.puan || 0,
                        bolgeTanimi: img.results.bolgeTanimi.puan || 0,
                        odakNoktasi: img.results.odakNoktasi.puan || 0,
                        simgeselElemanlar: img.results.simgeselElemanlar.puan || 0,
                      } : {
                        gorselKarmasiklik: 0,
                        yonDuygusu: 0,
                        sinirlar: 0,
                        bolgeTanimi: 0,
                        odakNoktasi: 0,
                        simgeselElemanlar: 0,
                      };

                      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

                      return (
                        <tr 
                          key={img.id}
                          className={`hover:bg-[#F8F5F0]/80 transition-colors ${
                            idx === selectedIndex ? "bg-[#F3EEE5]/50 font-medium" : ""
                          }`}
                        >
                          <td className="p-3 text-center font-bold text-zinc-500">{idx + 1}</td>
                          <td className="p-2">
                            {img.src !== "placeholder" ? (
                              <img 
                                src={img.src} 
                                alt={img.name} 
                                className="w-12 h-9 object-cover rounded shadow-xs bg-zinc-100"
                              />
                            ) : (
                              <div className="w-12 h-9 bg-zinc-200 rounded border border-dashed border-zinc-300" />
                            )}
                          </td>
                          <td className="p-3">
                            <span 
                              onClick={() => setSelectedIndex(idx)}
                              className="hover:underline cursor-pointer font-bold text-[#2C2A26] block"
                            >
                              {img.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate block max-w-[180px]">
                              {img.results ? "Analiz yapıldı" : "Analiz edilmedi"}
                            </span>
                          </td>
                          
                          {/* 6 core criterion scores */}
                          {["gorselKarmasiklik", "yonDuygusu", "sinirlar", "bolgeTanimi", "odakNoktasi", "simgeselElemanlar"].map((key) => {
                            const val = (scores as any)[key];
                            return (
                              <td key={key} className="p-3 text-center">
                                <span className={`inline-block w-6 h-6 rounded-full leading-6 font-bold text-[11px] ${
                                  val > 0 
                                    ? scoreColors[val as number] || "bg-[#EAE4D9]" 
                                    : "bg-zinc-100 text-zinc-300"
                                }`}>
                                  {val || "-"}
                                </span>
                              </td>
                            );
                          })}

                          {/* Total Column */}
                          <td className="p-3 text-center bg-[#5A6A42]/5 font-bold text-[#5A6A42] text-sm">
                            {totalScore > 0 ? totalScore : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bar comparison charts (using beautifully styled responsive SVGs for 100% React 19 safety) */}
              <div className="bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4CEBF]">
                <h3 className="font-serif text-sm font-bold text-[#2C2A26] mb-4 uppercase tracking-wider">
                  Mekansal Okunabilirlik Endeksi Karşılaştırma Grafiği
                </h3>
                <div className="space-y-3">
                  {images.map((img, idx) => {
                    if (!img.results) return null;
                    const scs = [
                      img.results.gorselKarmasiklik.puan || 0,
                      img.results.yonDuygusu.puan || 0,
                      img.results.sinirlar.puan || 0,
                      img.results.bolgeTanimi.puan || 0,
                      img.results.odakNoktasi.puan || 0,
                      img.results.simgeselElemanlar.puan || 0
                    ];
                    const sum = scs.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((sum / 30) * 100);

                    return (
                      <div key={img.id} className="flex items-center gap-4 text-xs">
                        <span className="w-6 font-bold text-zinc-500">{idx + 1}</span>
                        <span className="w-32 font-semibold truncate text-[#2C2A26]" title={img.name}>
                          {img.name}
                        </span>
                        
                        <div className="flex-1 bg-[#EAE4D9] h-5 rounded-md overflow-hidden relative shadow-inner">
                          <div 
                            className="bg-[#5A6A42] h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 15 && (
                              <span className="text-[10px] font-bold text-white leading-none">
                                {percentage}%
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="w-16 text-right font-bold text-[#5A6A42]">
                          {sum} / 30 Puan
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "guide" && (
            <div className="prose prose-stone max-w-none text-xs leading-relaxed text-zinc-700 space-y-6">
              <div className="bg-[#EAE4D9]/50 p-5 rounded-2xl border border-[#D4CEBF]">
                <h3 className="font-serif text-sm font-bold text-[#5A6A42] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="w-4.5 h-4.5" />
                  Kevin Lynch Teorisi ve Peyzaj Okunabilirliği (Imageability) Nedir?
                </h3>
                <p>
                  Mekanın okunabilirliği, kentsel veya kırsal çevrenin insanlar tarafından zihinsel olarak kolayca şemalandırılması, haritalandırılması ve akılda tutulması kapasitesidir. Kevin Lynch’in <em>"The Image of the City" (Kent İmgesi)</em> kitabında ortaya koyduğu ilkeler peyzaj mimarlığında tasarımların başarısını ölçmek için kullanılır.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-xl border border-[#D4CEBF] space-y-2">
                  <h4 className="font-bold text-xs text-[#C47353] uppercase tracking-wider">1. Görsel Karmaşıklık (Visual Complexity)</h4>
                  <p>
                    Bir mekanın ne aşırı tekdüze (sıkıcı) ne de aşırı karmaşık (kaotik) olması istenir. İdeal bir peyzaj tasarımı, renk çeşitliliği, form zenginliği ve topografik kot farkları ile görsel ilgiyi uyanık tutmalıdır.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#D4CEBF] space-y-2">
                  <h4 className="font-bold text-xs text-[#C47353] uppercase tracking-wider">2. Yön Duygusu (Wayfinding)</h4>
                  <p>
                    Kullanıcıların harita kullanmadan mekanda yönlerini bulabilmelerini sağlayan tasarım kararlarıdır. Doğrusal ağaç sıraları, ritmik aydınlatmalar ve zemin kaplamasındaki kaçış çizgileri bu algıyı en üst düzeye çıkarır.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#D4CEBF] space-y-2">
                  <h4 className="font-bold text-xs text-[#C47353] uppercase tracking-wider">3. Sınırlar (Edges)</h4>
                  <p>
                    İki farklı mekansal dokuyu veya alanı birbirinden ayıran çizgisel elemanlardır. Doğal çitler, istinat duvarları, su sınırları veya çim ile taş zemin arasındaki renk zıtlıkları belirgin sınırları tanımlar.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#D4CEBF] space-y-2">
                  <h4 className="font-bold text-xs text-[#C47353] uppercase tracking-wider">4. Bölge Tanımı (Districts)</h4>
                  <p>
                    Ziyaretçinin içine girdiğinde kendisini farklı ve tanımlı bir bölgede hissettiği alanlardır. Zemin kaplama malzemesinin değişmesi, peyzaj karakterinin (örneğin orman dokusundan gül bahçesine geçiş) değişmesiyle sağlanır.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#D4CEBF] space-y-2">
                  <h4 className="font-bold text-xs text-[#C47353] uppercase tracking-wider">5. Odak Noktası (Nodes)</h4>
                  <p>
                    Mekanın kalbi niteliğindeki toplanma, dinlenme ve duraklama noktalarıdır. Meydanlardaki fıskiyeli havuzlar, amfiler, anıtsal ağaç altları veya sosyal oturma birimleri kentsel odakları oluşturur.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#D4CEBF] space-y-2">
                  <h4 className="font-bold text-xs text-[#C47353] uppercase tracking-wider">6. Simgesel Elemanlar (Landmarks)</h4>
                  <p>
                    Mekana kimlik kazandıran ve uzaktan bile fark edilebilen nirengi noktalarıdır. Özel heykeller, ikonik yapılar, anıt ağaçlar veya sanatsal enstalasyonlar yön bulmada temel referanslardır.
                  </p>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* Right Sidebar - Dynamic Score Editor panel */}
        <aside className="w-88 bg-[#F3EEE5] border-l border-[#D4CEBF] flex flex-col overflow-hidden shrink-0">
          <div className="p-5 border-b border-[#D4CEBF] bg-[#EAE4D9]">
            <h2 className="font-serif text-lg font-bold text-[#2C2A26]">
              Uzman Puan Tablosu
            </h2>
            <p className="text-[10px] uppercase font-bold text-[#5A6A42] tracking-wider mt-0.5">
              1–5 Ölçeğinde Nesnel Puanlama
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Display overall image stats */}
            {selectedImage && selectedImage.results && (
              <div className="bg-[#5A6A42] text-white p-4 rounded-xl shadow-xs space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 block">Seçili Mekanın Toplam Skoru</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-serif font-bold">
                    {Object.values(selectedImage.results)
                      .filter(val => typeof val === "object" && "puan" in val)
                      .reduce((acc, curr: any) => acc + curr.puan, 0)}
                  </span>
                  <span className="text-xs opacity-90 font-semibold">/ 30 Maksimum Puan</span>
                </div>
                
                {/* Score Index category badge */}
                <div className="pt-2 border-t border-white/25 flex justify-between items-center text-[11px]">
                  <span>Mekan Okunabilirlik Seviyesi:</span>
                  <span className="font-bold underline">
                    {(() => {
                      const total = Object.values(selectedImage.results)
                        .filter(val => typeof val === "object" && "puan" in val)
                        .reduce((acc, curr: any) => acc + curr.puan, 0);
                      if (total >= 25) return "Çok Yüksek (Elit Mekan)";
                      if (total >= 20) return "Yüksek (Güçlü Okunabilirlik)";
                      if (total >= 15) return "Orta (Dengeli Mekan)";
                      if (total >= 10) return "Düşük (Zayıf Yönlenme)";
                      return "Çok Düşük (Karmakarışık)";
                    })()}
                  </span>
                </div>
              </div>
            )}

            {selectedImage && selectedImage.results ? (
              <div className="space-y-4">
                {criteriaList.map((crit) => {
                  const resVal = selectedImage.results?.[crit.key];
                  if (!resVal) return null;

                  return (
                    <div key={crit.key} className="bg-white p-3.5 rounded-xl border border-[#D4CEBF] shadow-xs hover:border-[#5A6A42]/50 transition-colors">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#2C2A26] tracking-tight">{crit.label}</h4>
                          <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">{crit.desc}</span>
                        </div>
                      </div>

                      {/* Score pills (Strict 1-5 selection) */}
                      <div className="flex items-center justify-between bg-[#F8F5F0] p-1.5 rounded-lg border border-[#D4CEBF]/50 mt-2">
                        <span className="text-[10px] font-bold text-[#5A6A42] uppercase pl-1">
                          {scoreLabels[resVal.puan]}
                        </span>
                        
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const scoreNum = i + 1;
                            const isSelected = resVal.puan === scoreNum;

                            return (
                              <button
                                key={scoreNum}
                                onClick={() => handleScoreChange(crit.key, scoreNum)}
                                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                                  isSelected 
                                    ? "bg-[#5A6A42] text-white scale-110 shadow-sm" 
                                    : "bg-white text-zinc-600 hover:bg-[#EAE4D9] border border-[#D4CEBF]"
                                }`}
                              >
                                {scoreNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Display a quick preview of the sub-criteria summaries */}
                      <div className="mt-3 pt-2.5 border-t border-[#D4CEBF]/40 space-y-1.5">
                        {crit.subs.slice(0, 3).map((sub) => {
                          const subText = (resVal as any)[sub.key];
                          return (
                            <div key={sub.key} className="text-[10px] leading-relaxed text-zinc-600">
                              <span className="font-semibold text-[#2C2A26]">{sub.label}:</span>{" "}
                              {subText && subText.length > 50 ? `${subText.substring(0, 50)}...` : subText || "Tespit girilmedi."}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
                <AlertCircle className="w-8 h-8 text-zinc-400 mb-2" />
                <p className="text-xs">Lütfen soldaki galeriden değerlendirilmiş bir görsel seçin.</p>
              </div>
            )}

          </div>

          <div className="p-4 bg-[#E3DAC9] border-t border-[#D4CEBF]">
            <p className="text-[10px] leading-relaxed text-[#2C2A26] font-medium text-center">
              Peyzaj ve Kentsel Tasarım Analiz Aracı v1.2<br />
              Kevin Lynch Mekansal Okunabilirlik Metodolojisi
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
