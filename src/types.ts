export interface CriterionDetail {
  renkCesitliligi?: string;
  renkCesitliligiPuan?: number;
  objeSekilCesitliligi?: string;
  objeSekilCesitliligiPuan?: number;
  insanYogunlugu?: string;
  insanYogunluguPuan?: number;
  dogalElemanCesitliligi?: string;
  dogalElemanCesitliligiPuan?: number;
  yapisalElemanCesitliligi?: string;
  yapisalElemanCesitliligiPuan?: number;
  araziSekliCesitliligi?: string;
  araziSekliCesitliligiPuan?: number;
  
  yolCizgileriYogunlugu?: string;
  yolCizgileriYogunluguPuan?: number;
  yonlendirmeElemanlari?: string;
  yonlendirmeElemanlariPuan?: number;
  insanHareketYonu?: string;
  insanHareketYonuPuan?: number;
  
  dogalSinirlar?: string;
  dogalSinirlarPuan?: number;
  yapisalSinirlar?: string;
  yapisalSinirlarPuan?: number;
  renkKontrastiSinir?: string;
  renkKontrastiSinirPuan?: number;
  cizgiKontrastiYogunlugu?: string;
  cizgiKontrastiYogunluguPuan?: number;
  
  yapiAlanlari?: string;
  yapiAlanlariPuan?: number;
  yesilAlanBolgeleri?: string;
  yesilAlanBolgeleriPuan?: number;
  zeminDosemeFarkliliklari?: string;
  zeminDosemeFarkliliklariPuan?: number;
  simgeselObjeler?: string;
  simgeselObjelerPuan?: number;
  
  gorselMerkeziUnsur?: string;
  gorselMerkeziUnsurPuan?: number;
  toplanmaPotansiyeli?: string;
  toplanmaPotansiyeliPuan?: number;
  insanYogunlasmaNoktalari?: string;
  insanYogunlasmaNoktalariPuan?: number;
  
  simgeselYapilar?: string;
  simgeselYapilarPuan?: number;
  kentselMobilyalar?: string;
  kentselMobilyalarPuan?: number;
  bitkiselOgeler?: string;
  bitkiselOgelerPuan?: number;
  heykelSanat?: string;
  heykelSanatPuan?: number;
  gorselKontrastDiger?: string;
  gorselKontrastDigerPuan?: number;
  
  puan: number; // 1-5 integer
}

export interface EvaluationResult {
  gorselKarmasiklik: CriterionDetail & {
    renkCesitliligi: string;
    objeSekilCesitliligi: string;
    insanYogunlugu: string;
    dogalElemanCesitliligi: string;
    yapisalElemanCesitliligi: string;
    araziSekliCesitliligi: string;
  };
  yonDuygusu: CriterionDetail & {
    yolCizgileriYogunlugu: string;
    yonlendirmeElemanlari: string;
    insanHareketYonu: string;
  };
  sinirlar: CriterionDetail & {
    dogalSinirlar: string;
    yapisalSinirlar: string;
    renkKontrastiSinir: string;
    cizgiKontrastiYogunlugu: string;
  };
  bolgeTanimi: CriterionDetail & {
    yapiAlanlari: string;
    yesilAlanBolgeleri: string;
    zeminDosemeFarkliliklari: string;
    simgeselObjeler: string;
  };
  odakNoktasi: CriterionDetail & {
    gorselMerkeziUnsur: string;
    toplanmaPotansiyeli: string;
    insanYogunlasmaNoktalari: string;
  };
  simgeselElemanlar: CriterionDetail & {
    simgeselYapilar: string;
    kentselMobilyalar: string;
    bitkiselOgeler: string;
    heykelSanat: string;
    gorselKontrastDiger: string;
  };
  genelKarsilastirmaliDegerlendirme: string;
}

export interface AnalyzedImage {
  id: string;
  name: string;
  src: string; // base64 or object URL
  mimeType: string;
  results?: EvaluationResult;
  isAnalyzing?: boolean;
  error?: string;
}
