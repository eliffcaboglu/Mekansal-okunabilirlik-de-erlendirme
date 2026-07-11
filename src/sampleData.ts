import { AnalyzedImage } from "./types";

export const SAMPLE_IMAGES: AnalyzedImage[] = [
  {
    id: "img-1",
    name: "1. Kentsel Odak Meydanı ve Su Ögesi",
    src: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Koyu gri taş tonları ile su yansımalarından gelen gökyüzü mavisi ve çevredeki sınırlı yeşilin oluşturduğu dengeli kontrast.",
        objeSekilCesitliligi: "Dikdörtgen döşeme plakları, dairesel havuz çeperi ve kübik oturma birimlerinin geometrik birlikteliği.",
        insanYogunlugu: "Meydanın merkezinde ve oturma alanlarında seyrek, durağan yaya grupları gözlenmektedir.",
        dogalElemanCesitliligi: "Havuz içi su ögesi, dairesel ağaç parteri ve parter içindeki çalı katmanı.",
        yapisalElemanCesitliligi: "Doğal taş kaplama zemin, sınır elemanları, gizli aydınlatma profilleri ve minimalist beton oturma blokları.",
        araziSekliCesitliligi: "Düz bir zemin üzerinde havuz çeperindeki mikro kot farkları ve sığ basamak geçişleri.",
        puan: 3
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Geniş taş derzlerinin oluşturduğu doğrusal akslar kullanıcıyı doğrudan havuz odağına yönlendiriyor.",
        yonlendirmeElemanlari: "Aks boyunca düzenlenmiş aydınlatma direkleri ve simetrik ağaç dizilimi yönlendirici şerit görevi görüyor.",
        insanHareketYonu: "Kullanıcılar geniş düzlüklerden dairesel merkez havuzuna ve gölgelik oturma birimlerine yönelme eğilimindedir.",
        puan: 4
      },
      sinirlar: {
        dogalSinirlar: "Merkezdeki dairesel ağaç tacı, gökyüzüne doğru dikey bir yeşil tavan sınırı oluşturuyor.",
        yapisalSinirlar: "Meydanın çeperini sınırlayan alçak istinat duvarları ve çevredeki binaların dikey cepheleri.",
        renkKontrastiSinir: "Koyu gri granit döşeme ile havuzun berrak su yüzeyi arasındaki keskin renk kontrastı sınırı.",
        cizgiKontrastiYogunlugu: "Düz zemin çizgileri ile havuzun dairesel çeperinin kesişimi güçlü bir çizgisel kontrast oluşturur.",
        puan: 4
      },
      bolgeTanimi: {
        yapiAlanlari: "Arka plandaki binaların oluşturduğu yapısal fon, meydanı rüzgara karşı korunaklı ve tanımlı kılıyor.",
        yesilAlanBolgeleri: "Ağaç çevrelerinde tasarlanan dairesel bitkisel parterler mikroklimatik odacıklar tanımlıyor.",
        zeminDosemeFarkliliklari: "Granit döşemelerin yönü ve boyutları havuz çevresinde dairesel, yürüme akslarında ise çizgisel değişiyor.",
        simgeselObjeler: "Merkezi fıskiye sistemi ve büyük ölçekli monolitik beton saksılar bölgeyi tanımlayan ana objelerdir.",
        puan: 4
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Meydanın tam merkezinde konumlanan dairesel yansıma havuzu ve aktif su fıskiyesi görsel odağı domine ediyor.",
        toplanmaPotansiyeli: "Havuz çeperindeki geniş basamaklar ve oturma blokları yüksek dinlenme ve toplanma potansiyeli sunuyor.",
        insanYogunlasmaNoktalari: "Fıskiye çevresindeki gölge alanlar ve suyun serinlettiği havuz kenarları ana yoğunlaşma noktalarıdır.",
        puan: 5
      },
      simgeselElemanlar: {
        simgeselYapilar: "Havuz arkasında yükselen modernist peyzaj saçağı ve sanatsal gölgelik strüktürü.",
        kentselMobilyalar: "Yekpare döküm beton banklar ve entegre çöp kutuları yüksek tasarım dili sergiliyor.",
        bitkiselOgeler: "Merkezdeki soliter yapraklı meşe ağacı, mevsimsel renk değişimiyle güçlü bir bitkisel semboldür.",
        heykelSanat: "Su fıskiyesinin kinetik hareketi kentsel bir heykel gibi dinamizm kazandırıyor.",
        gorselKontrastDiger: "Suyun parlak dokusu ile taş döşemenin mat yüzeyi arasındaki dokusal zıtlık.",
        puan: 4
      },
      genelKarsilastirmaliDegerlendirme: "Bu görsel, serinin ilk elemanı olarak kentsel-mimari okunabilirliğin en dengeli örneğidir. Yapay ve doğal elemanlar eşit ağırlıkta paylaşılmış, merkezi odak noktası en yüksek puanı almıştır."
    }
  },
  {
    id: "img-2",
    name: "2. Rekreasyonel Gölet ve Doğal Dere Yatağı",
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Yeşilin her tonu, toprak kahverengisi ve suyun yansıttığı doğal gökyüzü renkleri ile son derece zengin bir doğal palet.",
        objeSekilCesitliligi: "Amorf kaya formları, dairesel nilüfer yaprakları ve ağaçların serbest büyüyen amorf taç yapıları.",
        insanYogunlugu: "Tamamen sakin, insan varlığı arka planda kaybolmuş, doğaya teslim bir yoğunluk düzeyi.",
        dogalElemanCesitliligi: "Sazlıklar, sucul bitkiler, herdem yeşil iğne yapraklılar ve geniş yapraklı gölge ağaçları.",
        yapisalElemanCesitliligi: "Doğal ahşap iskele ve taş patika dışında hiçbir yapısal eleman bulunmamaktadır.",
        araziSekliCesitliligi: "Gölet çanağının oluşturduğu çöküntü ve arka plandaki hafif tepelik topografya.",
        puan: 4
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Doğrusal bir yol çizgisi yoktur; yön duygusu sadece su kıyısını takip eden organik patika ile sağlanır.",
        yonlendirmeElemanlari: "Herhangi bir yönlendirme tabelası yoktur, yönlenme tamamen suyun akış yönüyle sezgisel olarak gerçekleşir.",
        insanHareketYonu: "İskele ucu suya doğru tek yönlü net bir bakış ve yönelim açısı sunmaktadır.",
        puan: 2
      },
      sinirlar: {
        dogalSinirlar: "Sık sazlık kuşağı ve dik yamaçlar gölet çeperinde geçilemez doğal sınırlar oluşturuyor.",
        yapisalSinirlar: "Sadece ahşap iskelenin bitiş çizgisi yapay bir sınır oluşturmaktadır.",
        renkKontrastiSinir: "Yeşil çim kıyısı ile koyu renkli gölet suyu arasındaki yumuşak ama belirgin geçiş.",
        cizgiKontrastiYogunlugu: "Su yüzeyinin yatay düzlüğü ile sazlıkların dikey çizgileri arasında organik kontrast.",
        puan: 3
      },
      bolgeTanimi: {
        yapiAlanlari: "Yapı alanı bulunmamakta, sadece ahşap iskele insan yapımı küçük bir müdahale olarak kalmaktadır.",
        yesilAlanBolgeleri: "Mekan tamamen aktif ve pasif yeşil alanlardan oluşmakta, baskın bir doğal karakter sergilemektedir.",
        zeminDosemeFarkliliklari: "Toprak patika, çim alan ve ahşap iskele döşemesi arasında dokusal ve malzeme farklılığı yüksektir.",
        simgeselObjeler: "Su üzerine uzanan rustik ahşap iskele, bölgenin rekreasyonel kimliğini tanımlayan ana objedir.",
        puan: 5
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Göletin geniş su aynası ve üzerindeki nilüfer toplulukları ana görsel odağı oluşturur.",
        toplanmaPotansiyeli: "Ahşap iskele, küçük grupların bir araya gelip manzarayı izleyebileceği samimi bir toplanma noktasıdır.",
        insanYogunlasmaNoktalari: "İskelenin suya en yakın uç noktası insanların durağanlaştığı temel odaktır.",
        puan: 3
      },
      simgeselElemanlar: {
        simgeselYapilar: "Simgesel bir yapı bulunmamakta, doğallık korunmaktadır.",
        kentselMobilyalar: "Geleneksel ahşap korkuluk ve kütük oturma birimleri.",
        bitkiselOgeler: "Gölet ortasında tek başına duran yaşlı salkım söğüt ağacı güçlü bir bitkisel semboldür.",
        heykelSanat: "Bulunmamaktadır.",
        gorselKontrastDiger: "Yapay ahşap platformun düz çizgisel formu ile göl kenarının amorf eğrileri arasındaki kontrast.",
        puan: 3
      },
      genelKarsilastirmaliDegerlendirme: "Görsel 1'deki sert kentsel karaktere kıyasla, tamamen doğal ve kırsal bir peyzaj karakterine sahiptir. Görsel Karmaşıklık doğal elemanlar yönünden artmış, ancak Yön Duygusu ve Yapısal Sınırlar azalmıştır."
    }
  },
  {
    id: "img-3",
    name: "3. Sık Dokulu Orman Yolu ve Işık Koridoru",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Güneş ışığından süzülen altın sarısı, yapraklardan gelen yoğun yeşil ve ağaç gövdelerinin derin kahve tonları.",
        objeSekilCesitliligi: "Yüksek dikey gövdeler, kırık dallar ve toprak üzerindeki organik döküntüler.",
        insanYogunlugu: "Tamamen ıssız, insan unsuruna dair hiçbir iz barındırmayan yabanıl karakter.",
        dogalElemanCesitliligi: "Yüksek ağaç katmanı, eğrelti otları, çalılar ve orman tabanı bitki örtüsü.",
        yapisalElemanCesitliligi: "Sıfır yapısal eleman; hiçbir döşeme, donatı veya kentsel mobilya bulunmamaktadır.",
        araziSekliCesitliligi: "Hafif eğimli, engebeli ve doğal toprak dalgalanmaları içeren bir zemin.",
        puan: 2
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Sık ağaçlar arasında kendiliğinden oluşmuş çok hafif, belirsiz bir iz dışında belirgin yol çizgisi yoktur.",
        yonlendirmeElemanlari: "Herhangi bir eleman yoktur, sadece ağaç gövdeleri arasından süzülen güneş ışığı doğal bir yön feneri gibidir.",
        insanHareketYonu: "İki yandaki sık ağaç duvarının izin verdiği dikey koridor boyunca düz bir hareket yönü mevcuttur.",
        puan: 2
      },
      sinirlar: {
        dogalSinirlar: "Her iki yanda adeta bir duvar gibi yükselen sık ağaç gövdeleri geçit vermez net bir sınır tanımlar.",
        yapisalSinirlar: "Bulunmamaktadır.",
        renkKontrastiSinir: "Işığın vurduğu aydınlık orman içi zemin ile derin gölgelik orman kuytuları arasındaki ton farkı sınırları.",
        cizgiKontrastiYogunlugu: "Ağaç gövdelerinin oluşturduğu dikey paralellikler çok yüksek çizgisel kontrast yoğunluğu sunar.",
        puan: 5
      },
      bolgeTanimi: {
        yapiAlanlari: "Bulunmamaktadır.",
        yesilAlanBolgeleri: "Bütünsel, kesintisiz ve vahşi bir yeşil alan bölgesi hakimdir.",
        zeminDosemeFarkliliklari: "Sadece yaprak ve toprak kaplı orman tabanı mevcuttur, döşeme varyasyonu yoktur.",
        simgeselObjeler: "Simgesel bir obje yoktur.",
        puan: 1
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Ağaçların arasından süzülen dramatik güneş ışığı süzmesi (ışık koridoru) tek odak noktasıdır.",
        toplanmaPotansiyeli: "Bulunmamaktadır; alan sadece transit geçiş veya izole yürüyüş karakterindedir.",
        insanYogunlasmaNoktalari: "Bulunmamaktadır.",
        puan: 1
      },
      simgeselElemanlar: {
        simgeselYapilar: "Bulunmamaktadır.",
        kentselMobilyalar: "Bulunmamaktadır.",
        bitkiselOgeler: "Devasa çam ve kayın ağaçları kendi başlarına anıtsal bitkisel öğelerdir.",
        heykelSanat: "Bulunmamaktadır.",
        gorselKontrastDiger: "Işık patlamasının oluşturduğu aşırı yüksek aydınlık-karanlık tezatlığı.",
        puan: 2
      },
      genelKarsilastirmaliDegerlendirme: "Görsel 1 ve 2'ye kıyasla yapısal ve tasarımsal müdahalenin en az olduğu görseldir. Bölge tanımı, simgesel elemanlar ve odak noktası yönünden en düşük puandadır, ancak dikey doğal sınır belirginliğinde (ağaç duvarı) zirvededir."
    }
  },
  {
    id: "img-4",
    name: "4. Minimalist Zen Bahçesi ve Taş Kompozisyonu",
    src: "https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Beyaz mırmır kumu, koyu antrasit kayalar, yeşil yosun öbekleri ve arka plandaki ahşap çıtaların doğal renkleri.",
        objeSekilCesitliligi: "Tırmıklanmış kumdaki doğrusal/dairesel dalga şekilleri ve amorf doğal taş formları.",
        insanYogunlugu: "Meditatif ve boş bir alan; insan yoğunluğu sıfır ancak zihinsel bir sükunet alanı tasarlanmış.",
        dogalElemanCesitliligi: "Yosun örtüsü, budanmış bodur çalılar ve doğal biçimlendirilmemiş kayalar.",
        yapisalElemanCesitliligi: "Ahşap veranda çizgileri, kum tırmıklama sanatı ve sınır taşları.",
        araziSekliCesitliligi: "Tamamen düzleştirilmiş bir kum havuzu içinde mikro kayalık yükseltiler.",
        puan: 3
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Kum üzerine tırmıkla çizilen paralel çizgiler güçlü ama soyut bir yön duygusu vermektedir.",
        yonlendirmeElemanlari: "Fiziksel bir yönlendirme yoktur, yön duygusu kum desenlerinin akışıyla sembolik olarak hissettirilir.",
        insanHareketYonu: "İçine girilmeyen, sadece dışarıdaki ahşap platformdan izlenen izole bir hareket sınırı vardır.",
        puan: 2
      },
      sinirlar: {
        dogalSinirlar: "Kaya gruplarının etrafını saran yeşil yosun çeperi mikro düzeyde doğal bir sınır çizer.",
        yapisalSinirlar: "Ahşap platform kenarı ve kum havuzunu çevreleyen kesme granit bordürler son derece nettir.",
        renkKontrastiSinir: "Bembeyaz kum ile koyu gri kayalar ve canlı yeşil yosunlar arasındaki keskin renk sınırı.",
        cizgiKontrastiYogunlugu: "Kum çizgileri ile ahşap verandanın doğrusal çizgileri geometrik bir düzen oluşturur.",
        puan: 5
      },
      bolgeTanimi: {
        yapiAlanlari: "Arka planda görülen geleneksel ahşap tapınak/ev cephesi bölgeyi güçlü bir şekilde tanımlar.",
        yesilAlanBolgeleri: "Kayalarla sınırlı yosun adacıkları, mikro ölçekte son derece planlı yeşil bölgelerdir.",
        zeminDosemeFarkliliklari: "Ahşap güverte döşemesi ile ince beyaz mermer kum zemin arasındaki malzeme farkı üst düzeydedir.",
        simgeselObjeler: "Belli bir felsefi düzene göre yerleştirilmiş olan üçlü kaya kompozisyonu bölgenin imzasıdır.",
        puan: 5
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Tırmıklanmış kumun tam ortasında yükselen ve adeta bir adayı andıran yosun kaplı ana kaya grubu.",
        toplanmaPotansiyeli: "Fiziksel toplanma potansiyeli düşüktür; zira alan sadece görsel ve meditatif izleme amaçlıdır.",
        insanYogunlasmaNoktalari: "İnsanların oturup bu kompozisyonu izlediği ahşap güverte kenarı.",
        puan: 3
      },
      simgeselElemanlar: {
        simgeselYapilar: "Geleneksel Japon mimarisine ait ahşap saçak ve shoji bölmeleri.",
        kentselMobilyalar: "Bulunmamaktadır, ancak ahşap zemin oturma alanı olarak işlev görmektedir.",
        bitkiselOgeler: "Kayaların dibindeki kusursuz dairesel formda kırpılmış şimşir ve yosunlar.",
        heykelSanat: "Kaya gruplarının kendisi ve kum üzerindeki dalga çizgileri peyzaj sanatı (land-art) eseri niteliğindedir.",
        gorselKontrastDiger: "Akışkan su hissi veren statik kum çizgileri ile durağan sert kayaların oluşturduğu felsefi tezatlık.",
        puan: 4
      },
      genelKarsilastirmaliDegerlendirme: "Görsel 3'teki rastgele ve vahşi orman sınırlarına karşılık, bu görselde insan eliyle oluşturulmuş en yüksek geometrik hassasiyet ve soyut sınır tasarımı gözlenmektedir. Bölge tanımı ve sınırlar yönünden çok güçlüdür."
    }
  },
  {
    id: "img-5",
    name: "5. Modern Çatı Bahçesi ve Dinamik Teraslar",
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Beton grisi, ahşap sıcaklığı, bitkilerin canlı yeşili ve gökyüzünün yansıması.",
        objeSekilCesitliligi: "Kademeli saksılar, doğrusal yürüyüş yolları ve dikey binalar.",
        insanYogunlugu: "Bireysel dinlenen ve yürüyen az sayıda şehir sakini.",
        dogalElemanCesitliligi: "Saksılarda yetiştirilen süs otları, bambular ve sarkıcı yeşillikler.",
        yapisalElemanCesitliligi: "Kompozit ahşap zemin, beton saksılar, cam korkuluklar ve çelik konstrüksiyonlar.",
        araziSekliCesitliligi: "Kademeli yükseltilmiş teraslar ve yapay kot farkları.",
        puan: 3
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Deck kaplamanın çizgisel yönü ve daralan teras aksı yönü güçlü hissettiriyor.",
        yonlendirmeElemanlari: "Yol kenarı aydınlatmaları ve düzenli yerleştirilmiş saksı hatları yönlendiriyor.",
        insanHareketYonu: "Yaya hareketi terasın ucundaki manzara noktasına doğru doğrusal olarak akıyor.",
        puan: 4
      },
      sinirlar: {
        dogalSinirlar: "Bitki kutularının oluşturduğu yeşil setler doğal bariyer işlevi görüyor.",
        yapisalSinirlar: "Şeffaf cam korkuluklar, kent manzarasını engellemeden fiziksel sınır çekiyor.",
        renkKontrastiSinir: "Ahşap zemin sıcaklığı ile gri beton elemanların oluşturduğu renk ayrımı.",
        cizgiKontrastiYogunlugu: "Korkulukların dikey çelik dikmeleri ile yatay zemin çizgilerinin kesişimi.",
        puan: 4
      },
      bolgeTanimi: {
        yapiAlanlari: "Etraftaki gökdelenlerin dikey düzlemleri çatı bahçesini çevreliyor.",
        yesilAlanBolgeleri: "Yapay saksılar içine hapsedilmiş kontrollü ve parçalı yeşil alanlar.",
        zeminDosemeFarkliliklari: "Yürüyüş yollarındaki ahşap deck ile dinlenme alanlarındaki dökme beton zemin ayrımı.",
        simgeselObjeler: "Teras ortasındaki modern heykelsi saksı tasarımı.",
        puan: 4
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Terasın ucunda yer alan ve şehri izleme imkanı sunan seyir alanı.",
        toplanmaPotansiyeli: "Ahşap basamakların oluşturduğu amfi tarzı oturma alanı.",
        insanYogunlasmaNoktalari: "Manzaraya en hakim olan cam korkuluk kenarları.",
        puan: 4
      },
      simgeselElemanlar: {
        simgeselYapilar: "Arka planda silüet oluşturan ikonik gökdelen kuleleri.",
        kentselMobilyalar: "Saksılarla entegre edilmiş özel tasarım ahşap banklar.",
        bitkiselOgeler: "Formuyla öne çıkan dikey bambu dizileri.",
        heykelSanat: "Geometrik saksıların yarattığı heykelsi mimari etki.",
        gorselKontrastDiger: "Doğal ahşap doku ile endüstriyel metal/cam bileşenlerin zıtlığı.",
        puan: 3
      },
      genelKarsilastirmaliDegerlendirme: "Görsel 1'deki zemin meydanına kıyasla, düşeyde kentsel ilişki kuran ve yapay kot farklarıyla ayrışan modern bir çatı bahçesi tipolojisidir. Sınırlar ve yön duygusu yüksektir."
    }
  },
  {
    id: "img-6",
    name: "6. Klasik Saray Bahçesi ve Simetrik Aks",
    src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Güllerin kırmızısı, şimşirlerin parlak yeşili ve saray cephesinin krem rengi taş tonları.",
        objeSekilCesitliligi: "Kusursuz budanmış konik, küresel ve dikdörtgen bitki formları.",
        insanYogunlugu: "Turistik amaçlı gezen, aks boyunca dağılmış insan figürleri.",
        dogalElemanCesitliligi: "Budanmış çit bitkileri, güller ve düzenli yerleştirilmiş servi ağaçları.",
        yapisalElemanCesitliligi: "Mermer fıskiyeler, taş merdivenler, klasik heykeller ve saray binası.",
        araziSekliCesitliligi: "Saray önündeki geniş düzlük ile yanlardaki setli teraslar.",
        puan: 4
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Merkezi ana aksın oluşturduğu kusursuz simetri ve düz yürüyüş yolları yön duygusunu en üst seviyeye taşımaktadır.",
        yonlendirmeElemanlari: "Aks boyunca sıralanan klasik heykeller ve düzenli servi ağaçları yönlendirme elemanıdır.",
        insanHareketYonu: "Kullanıcılar saray giriş kapısından bahçe merkezine doğru çizgisel hareket etmektedir.",
        puan: 5
      },
      sinirlar: {
        dogalSinirlar: "Labirent vari budanmış şimşir çitler yürüme yolları ile bitki yataklarını kesin olarak ayırır.",
        yapisalSinirlar: "Sarayın anıtsal ön cephesi ve merdiven korkulukları aşılması güç sınırlar çizer.",
        renkKontrastiSinir: "Kırmızı güller ile koyu yeşil şimşir çitlerin yan yana gelişiyle oluşan renk sınırları.",
        cizgiKontrastiYogunlugu: "Aksın tam ortasındaki dikey su fışkırması ile yatay parter çizgilerinin kesişimi.",
        puan: 5
      },
      bolgeTanimi: {
        yapiAlanlari: "Klasik saray binası alanı tüm bahçeyi kontrol eden ve tanımlayan ana odaktır.",
        yesilAlanBolgeleri: "Kusursuz geometrik şekillere sahip, içine girilemeyen 'Fransız Bahçesi' parterleri.",
        zeminDosemeFarkliliklari: "İnce kumlu mıcırlı yaya yolları ile parterlerin toprak zemini.",
        simgeselObjeler: "Aksın kesişim noktasındaki klasik mermer havuz ve fıskiye.",
        puan: 5
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Sarayın görkemli giriş kapısı ve tam önündeki büyük simetrik su havuzu.",
        toplanmaPotansiyeli: "Geniş mıcırlı akslar yüksek insan gruplarını ağırlayacak kapasitededir.",
        insanYogunlasmaNoktalari: "Havuz kenarındaki manzara noktaları ve merdiven basamakları.",
        puan: 4
      },
      simgeselElemanlar: {
        simgeselYapilar: "Tarihi saray binası ve anıtsal giriş kapısı.",
        kentselMobilyalar: "Döküm demir klasik tasarım bahçe bankları.",
        bitkiselOgeler: "Konik formda budanmış porsuklar ve dikey servi ağaçları.",
        heykelSanat: "Yunan mitolojisini tasvir eden beyaz mermer heykeller.",
        gorselKontrastDiger: "Bembeyaz mermer heykellerin yeşil bitkisel fon önündeki güçlü kontrastı.",
        puan: 5
      },
      genelKarsilastirmaliDegerlendirme: "Bu görsel, yön duygusu ve simetri kuralları açısından serideki en yüksek değere sahip tasarımdır. Rastgele ve amorf doğallıktaki Görsel 2 ve 3'ün tam zıttı bir rasyonel tasarım dilini temsil eder."
    }
  },
  {
    id: "img-7",
    name: "7. Kentsel Sanat Geçidi ve Tarihi Sokak",
    src: "https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Geleneksel tuğla kırmızısı, asılı renkli şemsiyeler ve dükkan tabelalarının neon renkleri.",
        objeSekilCesitliligi: "Sokak üzerine asılmış kubbe şeklinde şemsiyeler, tabelalar ve pencere söveleri.",
        insanYogunlugu: "Sokak boyunca hareket eden ve alışveriş yapan yoğun insan kalabalığı.",
        dogalElemanCesitliligi: "Bina pencerelerinden sarkan sarmaşıklar ve saksı çiçekleri dışında doğal unsur oldukça azdır.",
        yapisalElemanCesitliligi: "Arnavut kaldırımı taşlar, cephe kaplamaları, asılı dekorasyonlar ve sokak lambaları.",
        araziSekliCesitliligi: "Düz kentsel sokak dokusu.",
        puan: 4
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Binalar arasında sıkışmış dar sokağın oluşturduğu tekil kaçış çizgisi yön duygusunu koridor etkisiyle güçlendirir.",
        yonlendirmeElemanlari: "Asılı duran dekoratif ögeler sokağın akış yönünü gökyüzünde de tekrarlar.",
        insanHareketYonu: "İnsanlar sokağın girişinden çıkışına doğru çift yönlü doğrusal bir koridor hareketi yapar.",
        puan: 4
      },
      sinirlar: {
        dogalSinirlar: "Yok denecek kadar azdır; sadece saksı sınırları mevcuttur.",
        yapisalSinirlar: "Sokağın her iki yanında yükselen kesintisiz tarihi bina cepheleri son derece katı bir sınır çizer.",
        renkKontrastiSinir: "Zemindeki gri Arnavut kaldırımı ile binaların sıcak tuğla duvarları arasındaki sınır.",
        cizgiKontrastiYogunlugu: "Düşey bina hatları ile sokağın yatay zemin taşlarının birleşimi.",
        puan: 4
      },
      bolgeTanimi: {
        yapiAlanlari: "Tarihi yapılar sokağın kimliğini ve fiziksel varlığını tamamen tanımlamaktadır.",
        yesilAlanBolgeleri: "Sadece dekoratif amaçlı cephe saksıları bulunmaktadır.",
        zeminDosemeFarkliliklari: "Geleneksel granit arnavut kaldırımı döşeme, sokağın yayalaştırılmış karakterini belgeler.",
        simgeselObjeler: "Sokak tavanını kaplayan rengarenk şemsiye enstalasyonu sokağın en büyük ayırt edici simgesidir.",
        puan: 4
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Gökyüzünü kaplayan ve süzülen renkli şemsiye gölgeliği.",
        toplanmaPotansiyeli: "Sokak üzerindeki dükkan ve kafelerin önleri küçük duraklama ve sohbet alanları sunar.",
        insanYogunlasmaNoktalari: "En çok fotoğraf çekilen şemsiye tavanının altındaki merkezi sokak aksı.",
        puan: 4
      },
      simgeselElemanlar: {
        simgeselYapilar: "Korunmuş cepheleriyle tarihi tuğla binalar.",
        kentselMobilyalar: "Klasik sokak aydınlatma aplikleri ve ferforje sandalyeler.",
        bitkiselOgeler: "Balkonlardan sarkan pembe sardunyalar.",
        heykelSanat: "Tavana asılı duran kinetik şemsiye yerleştirmesi (enstalasyon).",
        gorselKontrastDiger: "Tarihi sokağın gri-kahve tonları ile şemsiyelerin canlı renk patlamaları arasındaki kontrast.",
        puan: 5
      },
      genelKarsilastirmaliDegerlendirme: "Bu görsel, kentsel canlılık ve insan yoğunluğu açısından serideki en aktif mekandır. Klasik bahçelerin (Görsel 6) durağan yapısına karşın, dinamik kentsel sanat entegrasyonuyla öne çıkar."
    }
  },
  {
    id: "img-8",
    name: "8. Modern Su Kenarı Gezinti Yolu",
    src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Geniş mavi su düzlüğü, açık gri beton yüzeyler, yeşil çim bantları ve çelik gri köprü detayları.",
        objeSekilCesitliligi: "Doğrusal rıhtım çizgisi, kavisli yürüyüş yolları ve ufuktaki dikey gökdelen hatları.",
        insanYogunlugu: "Koşan, bisiklete binen ve yürüyüş yapan aktif rekreasyonel kullanıcılar.",
        dogalElemanCesitliligi: "Geniş su kütlesi, çim şeritleri ve düzenli aralıklarla dikilmiş gölge ağaçları.",
        yapisalElemanCesitliligi: "Klinker tuğla döşeme, beton rıhtım duvarı, paslanmaz çelik korkuluklar ve aydınlatma elemanları.",
        araziSekliCesitliligi: "Su kenarında oluşturulmuş düz, kesintisiz rıhtım platformu.",
        puan: 3
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Su kıyısına paralel uzanan kilometrelerce uzunluktaki rıhtım hattı aşırı güçlü bir yön duygusu verir.",
        yonlendirmeElemanlari: "Düzenli aralıklarla yerleştirilmiş aydınlatma direkleri ve ağaç dizileri birer kılavuz görevi görür.",
        insanHareketYonu: "Kullanıcı hareketi su kıyısı boyunca iki yönlü yatay akış halindedir.",
        puan: 5
      },
      sinirlar: {
        dogalSinirlar: "Geniş deniz/nehir yüzeyi, rıhtım kenarında geçilemez devasa bir doğal sınır oluşturmaktadır.",
        yapisalSinirlar: "Beton rıhtım duvarı ve çelik korkuluklar su ile kara sınırını net olarak ayırır.",
        renkKontrastiSinir: "Suyun derin mavisi ile rıhtımın açık gri beton döşemesi arasındaki yüksek kontrastlı sınır çizgisi.",
        cizgiKontrastiYogunlugu: "Ufuk çizgisi ile dikey kentsel silüet arasındaki çizgi kontrastı.",
        puan: 5
      },
      bolgeTanimi: {
        yapiAlanlari: "Karşı kıyıda yükselen kentsel silüet arka planda tanımlayıcı bir fon oluşturur.",
        yesilAlanBolgeleri: "Rıhtım gerisinde uzanan doğrusal çim park şeridi.",
        zeminDosemeFarkliliklari: "Yaya yolu için kırmızı klinker tuğla, bisiklet yolu için antrasit asfalt kaplaması.",
        simgeselObjeler: "Ufukta görünen büyük asma köprü ayakları bölgenin en büyük nirengi noktasıdır.",
        puan: 4
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Suyun ortasında yükselen kentsel silüet ve devasa köprü strüktürü.",
        toplanmaPotansiyeli: "Su kenarına yerleştirilmiş geniş seyir basamakları yüksek toplanma ve dinlenme potansiyeline sahiptir.",
        insanYogunlasmaNoktalari: "Köprü manzarasının en iyi izlendiği rıhtım çıkıntıları ve köşe noktaları.",
        puan: 4
      },
      simgeselElemanlar: {
        simgeselYapilar: "Arka plandaki asma köprü ve kentsel gökdelenler.",
        kentselMobilyalar: "Modern tasarımlı, arkalıksız doğrusal beton banklar.",
        bitkiselOgeler: "Tuzlu rüzgarlara dayanıklı, düzgün taç formlu çınar ağaçları.",
        heykelSanat: "Rıhtım ucundaki kinetik bayrak direkleri.",
        gorselKontrastDiger: "Durgun ve amorf su yüzeyi ile keskin geometrik rıhtım çizgilerinin zıtlığı.",
        puan: 4
      },
      genelKarsilastirmaliDegerlendirme: "Bu görsel, su-kara ilişkisi ve doğrusal yön duygusu açısından serinin en belirgin örneğidir. Görsel 2'deki doğal göletin aksine, burada su kenarı tamamen kentsel ve disipline edilmiş bir sınır tasarımıyla ele alınmıştır."
    }
  },
  {
    id: "img-9",
    name: "9. Botanik Sera ve Biyofilik İç Mekan",
    src: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Tropik yaprakların koyu yeşillerinden açık chartreuse tonlarına, çelik konstrüksiyonun siyah-beyaz zıtlığı.",
        objeSekilCesitliligi: "Devasa palmiye yaprakları, sarmal demir merdivenler ve cam kubbe geometrisi.",
        insanYogunlugu: "Bitkiler arasında kaybolmuş, tefekkür halinde tekil ziyaretçiler.",
        dogalElemanCesitliligi: "Egzotik eğrelti otları, palmiyeler, sarılıcı tropik bitkiler ve mikro su arkları.",
        yapisalElemanCesitliligi: "Viktoryen tarzı döküm demir taşıyıcılar, sarmal merdivenler, cam paneller ve tuğla yürüyüş yolları.",
        araziSekliCesitliligi: "Sera içindeki dikey galeri boşlukları, asma yollar ve sarmal merdiven basamakları.",
        puan: 5
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Dar sera içi tuğla patikalar ve yukarı doğru yükselen sarmal merdiven dikey aksları.",
        yonlendirmeElemanlari: "Aydınlatılmış yön tabelaları ve bitki tanıtım etiketleri kısıtlı yönlenme sunar.",
        insanHareketYonu: "Hacim içi dikey sirkülasyon (asma katlara tırmanma) harekete yön verir.",
        puan: 3
      },
      sinirlar: {
        dogalSinirlar: "Yolu işgal eden büyük yapraklı tropik bitkiler yürüyüş sınırlarını daraltmaktadır.",
        yapisalSinirlar: "Serayı dış dünyadan tamamen ayıran dikey ve tonozlu cam-metal çeperler.",
        renkKontrastiSinir: "Bitkilerin yoğun yeşil kütlesi ile taşıyıcı sistemin beyaz boyalı demir çizgileri arasındaki sınır.",
        cizgiKontrastiYogunlugu: "Sera kubbesinin jeodezik çizgileri ile yaprak damarlarının çizgisel dokusu.",
        puan: 4
      },
      bolgeTanimi: {
        yapiAlanlari: "Cam sera yapısının kendisi iç mekan peyzajını tamamen saran devasa bir kabuktur.",
        yesilAlanBolgeleri: "Sınır tanımayan, her yöne taşan yoğun egzotik yeşil alan bölgeleri.",
        zeminDosemeFarkliliklari: "Nem tutucu tuğla döşeme ile asma yollardaki delikli metal ızgara zemin farkı.",
        simgeselObjeler: "Sera merkezindeki tarihi döküm demir sarmal merdiven yapısı.",
        puan: 5
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Yukarı doğru spiral çizerek yükselen ve bitki örtüsünün üzerine çıkan sarmal merdiven kulesi.",
        toplanmaPotansiyeli: "Dar geçitler nedeniyle toplanma potansiyeli düşüktür; seyir sekileriyle sınırlıdır.",
        insanYogunlasmaNoktalari: "Serayı üst kotlardan izleme imkanı sunan asma seyir platformları.",
        puan: 4
      },
      simgeselElemanlar: {
        simgeselYapilar: "Tarihi ve ikonik Viktoryen sera strüktürü.",
        kentselMobilyalar: "Klasik döküm banklar ve döküm korkuluklar.",
        bitkiselOgeler: "Sera tavanına kadar uzanan devasa muz ve palmiye ağaçları.",
        heykelSanat: "Bitki aralarına gizlenmiş klasik büstler veya su fıskiyeleri.",
        gorselKontrastDiger: "Endüstriyel demir taşıyıcılar ile vahşi tropik yaprakların oluşturduğu biyofilik kontrast.",
        puan: 5
      },
      genelKarsilastirmaliDegerlendirme: "İç mekan peyzajı (biyofilik tasarım) ve görsel karmaşıklık açısından serideki en yüksek yoğunluğa ve puana sahip görseldir. Doğal ve yapısal elemanlar iç içe geçerek eşsiz bir görsel doku oluşturur."
    }
  },
  {
    id: "img-10",
    name: "10. Symmetrical Ağaçlı Yol ve Tarihi Aks",
    src: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Ağaç yapraklarının altın sarısı mevsimsel tonları ile zemindeki kum renginin yumuşak birlikteliği.",
        objeSekilCesitliligi: "Silindirik ağaç gövdeleri ve her iki yanda mükemmel simetri oluşturan kubbe biçimli ağaç taçları.",
        insanYogunlugu: "Perspektifin derinliğinde yürüyen tek tük romantik yaya figürleri.",
        dogalElemanCesitliligi: "Sadece tek bir türden (örn. Çınar veya Ihlamur) oluşan homojen ağaç sırası.",
        yapisalElemanCesitliligi: "Zemindeki sıkıştırılmış toprak yol ve arka plandaki minimal klasik bahçe kapısı.",
        araziSekliCesitliligi: "Tamamen düzleştirilmiş, perspektif derinliği sunan yatay düzlük.",
        puan: 2
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "İki yandaki paralel ağaç sıralarının kaçış noktasına doğru daralan perspektif çizgileri olağanüstü güçlü yön duygusu üretir.",
        yonlendirmeElemanlari: "Ağaç gövdelerinin kendisi doğal kolonlar gibi kullanıcıyı ileriye doğru yürümeye zorlar.",
        insanHareketYonu: "Kullanıcılar kaçınılmaz olarak aksın sonundaki nirengi noktasına doğru doğrusal hareket eder.",
        puan: 5
      },
      sinirlar: {
        dogalSinirlar: "Ağaç gövdeleri ve üstte birleşen yaprak tavanı (yeşil tünel) mekanı yanlardan ve üstten güçlü şekilde sınırlandırır.",
        yapisalSinirlar: "Bulunmamaktadır; sınır tamamen doğal elemanlar vasıtasıyla mimari bir hassasiyetle çizilmiştir.",
        renkKontrastiSinir: "Zemindeki açık renkli toprak yol ile ağaç gövdelerinin koyu kabuk dokusu arasındaki kontrast.",
        cizgiKontrastiYogunlugu: "Gövdelerin oluşturduğu ritmik düşey çizgiler ile yolun yatay perspektif çizgileri.",
        puan: 4
      },
      bolgeTanimi: {
        yapiAlanlari: "Bulunmamaktadır, ancak yeşil tünel etkisi kapalı bir koridor hissi vermektedir.",
        yesilAlanBolgeleri: "Ağaçların oluşturduğu doğrusal ve ritmik bitkisel koridor.",
        zeminDosemeFarkliliklari: "Yol boyu homojen sıkıştırılmış toprak kaplama.",
        simgeselObjeler: "Aksın en ucundaki perspektif kaçış noktasında beliren tarihi kapı kemeri.",
        puan: 3
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Perspektifin bittiği sonsuzluk noktası (kaçış noktası) tek ve mutlak görsel odaktır.",
        toplanmaPotansiyeli: "Transit yürüyüş ve seyir amaçlıdır; durağan toplanma potansiyeli düşüktür.",
        insanYogunlasmaNoktalari: "Yolun başlangıç ve bitişindeki giriş/çıkış kapıları.",
        puan: 3
      },
      simgeselElemanlar: {
        simgeselYapilar: "Yolun sonunda yer alan anıtsal bahçe kapısı.",
        kentselMobilyalar: "Yol kenarına yerleştirilmiş ritmik klasik ahşap banklar.",
        bitkiselOgeler: "Mükemmel budanmış ve hizalanmış anıtsal gölge ağaçları dizisi.",
        heykelSanat: "Bulunmamaktadır.",
        gorselKontrastDiger: "Perspektif büzülmesinin yarattığı optik illüzyon ve derinlik hissi.",
        puan: 3
      },
      genelKarsilastirmaliDegerlendirme: "Görsel 3'teki düzensiz vahşi orman patikasının tam zıttıdır. Aynı doğal elemanlar (ağaçlar ve toprak) kullanılmasına rağmen, burada mutlak bir rasyonel düzen ve yön duygusu tasarlanmıştır."
    }
  },
  {
    id: "img-11",
    name: "11. Amfi Tiyatro ve Kentsel Rekreasyon Parkı",
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Çimlerin taze yeşili, beton basamakların açık grisi, ahşap sahne panelleri ve akşamüstü gökyüzü renkleri.",
        objeSekilCesitliligi: "Yarım daire şeklinde iç içe geçen kavisli basamaklar ve merkezdeki dairesel sahne alanı.",
        insanYogunlugu: "Basamaklara dağılmış, dinlenen, sohbet eden ve sahneyi izleyen aktif insan grupları.",
        dogalElemanCesitliligi: "Çim kaplı basamaklar, arka plandaki koruluk ve saksıdaki soliter çalılar.",
        yapisalElemanCesitliligi: "Beton oturma basamakları, ahşap sahne kaplaması, çelik korkuluklar ve aydınlatma armatürleri.",
        araziSekliCesitliligi: "Yapay olarak oluşturulmuş dik basamaklı çöküntü (amfi tiyatro çanağı).",
        puan: 4
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Konsantrik dairesel basamak çizgileri bakışları ve hareketi sahne merkezine yönlendirir.",
        yonlendirmeElemanlari: "Amfiye inen radyal merdiven aksları ve basamak içi aydınlatma şeritleri yönlendiricidir.",
        insanHareketYonu: "İnsanlar üst kotlardan basamaklar vasıtasıyla aşağıya, yani sahne odağına doğru hareket eder.",
        puan: 4
      },
      sinirlar: {
        dogalSinirlar: "Amfinin üst çeperini kapatan ağaç kuşağı rüzgarı kesen doğal bir duvar oluşturur.",
        yapisalSinirlar: "Beton oturma setleri ve amfi duvarları net, aşamalı fiziksel sınırlar çizer.",
        renkKontrastiSinir: "Gri beton rıhtlar ile yeşil çim basamak düzlükleri arasındaki ritmik renk geçişleri.",
        cizgiKontrastiYogunlugu: "Dairesel basamak eğrileri ile merdivenlerin radyal dik çizgilerinin kesişimi.",
        puan: 4
      },
      bolgeTanimi: {
        yapiAlanlari: "Amfi arkasındaki kapalı etkinlik odaları ve kontrol kulübesi.",
        yesilAlanBolgeleri: "Oturma alanlarıyla bütünleştirilmiş, basamaklı yeşil oturma şeritleri (yeşil amfi).",
        zeminDosemeFarkliliklari: "Sahnedeki ahşap döşeme, yürüyüş yollarındaki beton parke ve basamaklardaki çim zemin.",
        simgeselObjeler: "Amfinin tam merkezindeki odak noktası olan dairesel gösteri sahnesi.",
        puan: 5
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Tüm basamakların yöneldiği dairesel performans sahnesi mutlak görsel odaktır.",
        toplanmaPotansiyeli: "Yüzlerce insanı bir araya getirebilecek kapasitedeki bu amfi, serideki en yüksek toplanma potansiyeline sahip alandır.",
        insanYogunlasmaNoktalari: "Sahne önü basamakları ve amfinin en üstündeki giriş platformları.",
        puan: 5
      },
      simgeselElemanlar: {
        simgeselYapilar: "Modern mimari dille tasarlanmış açık hava amfi strüktürü.",
        kentselMobilyalar: "Basamaklara entegre edilmiş ahşap oturma yüzeyleri ve modern çöp kutuları.",
        bitkiselOgeler: "Amfi etrafını saran büyük yapraklı gölge ağaçları.",
        heykelSanat: "Sahne arkasındaki dekoratif akustik duvar panelleri sanatsal bir enstalasyon gibidir.",
        gorselKontrastDiger: "Yapay sert beton basamaklar ile üzerinde basılan yumuşak çim dokusunun zıtlığı.",
        puan: 4
      },
      genelKarsilastirmaliDegerlendirme: "Bu görsel, toplanma potansiyeli ve sosyal odak noktası kriterlerinde serideki 1 numaralı alandır. Görsel 1'deki havuz meydanına kıyasla, oturma eylemini topografik bir amfi ile çok daha güçlü şekilde çözer."
    }
  },
  {
    id: "img-12",
    name: "12. Tarihi Avlu ve Kemerli Revaklar",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80",
    mimeType: "image/jpeg",
    results: {
      gorselKarmasiklik: {
        renkCesitliligi: "Eski pişmiş toprak kiremitler, kumtaşı revak duvarları, avlu ortasındaki yeşil zeytin ağacı.",
        objeSekilCesitliligi: "Revakların oluşturduğu yarım daire kemerler, sütunlar ve dairesel avlu havuzu.",
        insanYogunlugu: "Avlu gölgesinde dinlenen tekil ziyaretçiler ve sakin bir huzur atmosferi.",
        dogalElemanCesitliligi: "Merkezi avludaki soliter zeytin ağacı ve pencerelerden sarkan sarmaşıklar.",
        yapisalElemanCesitliligi: "Taş sütunlar, kemerler, kiremit çatı, ferforje korkuluklar ve el yapımı seramik karolar.",
        araziSekliCesitliligi: "Çevreleyen revakların altında düz, iç avlunun ortasında ise hafifçe çöken dairesel havuz alanı.",
        puan: 3
      },
      yonDuygusu: {
        yolCizgileriYogunlugu: "Avluyu dört taraftan çevreleyen revak altı yürüme koridorları net doğrusal hatlar çizer.",
        yonlendirmeElemanlari: "Ritmik sıralanan taş sütunlar yürüme aksı boyunca doğal bir yön göstericidir.",
        insanHareketYonu: "Kullanıcılar sıcak saatlerde revak altındaki gölgelik yolları takip ederek avluyu turlar.",
        puan: 4
      },
      sinirlar: {
        dogalSinirlar: "Merkezdeki zeytin ağacının geniş tacı gökyüzünü kapatarak doğal gölgelik bir sınır çizer.",
        yapisalSinirlar: "Avluyu dört yönden kuşatan iki katlı kalın taş duvarlar ve kemerli revak sınırları son derece geçirimsizdir.",
        renkKontrastiSinir: "Gölgede kalan revak içi koyu tonlar ile güneş altındaki parlak avlu zemini arasındaki ışık-gölge sınırı.",
        cizgiKontrastiYogunlugu: "Kemerlerin oluşturduğu dairesel çizgiler ile sütunların dikey dik çizgilerinin kesişimi.",
        puan: 5
      },
      bolgeTanimi: {
        yapiAlanlari: "Geleneksel manastır/saray mimarisinin iç avlu yapısı bölgeyi kusursuz şekilde tanımlamaktadır.",
        yesilAlanBolgeleri: "Saksılardaki Akdeniz bitkileri ve merkezdeki küçük çim parteri.",
        zeminDosemeFarkliliklari: "Revak altındaki pürüzsüz traverten döşeme ile açık avludaki kaba taş kaplama farkı.",
        simgeselObjeler: "Avlunun tam ortasında konumlanan tarihi taş kuyu ve mermer çeşme.",
        puan: 5
      },
      odakNoktasi: {
        gorselMerkeziUnsur: "Avlunun ortasındaki asırlık zeytin ağacı ve dibindeki mermer çeşme yalağı.",
        toplanmaPotansiyeli: "Revak gölgeleri altına atılmış masalar ve sandalyeler korunaklı bir toplanma ve dinlenme potansiyeli sağlar.",
        insanYogunlasmaNoktalari: "Öğle sıcağında güneş almayan revak altı oturma alanları.",
        puan: 4
      },
      simgeselElemanlar: {
        simgeselYapilar: "Tarihi ve korunmuş revaklı avlu yapısı.",
        kentselMobilyalar: "Ferforje el yapımı sandalyeler ve taş masalar.",
        bitkiselOgeler: "Avlunun ruhunu temsil eden yaşlı Akdeniz zeytin ağacı.",
        heykelSanat: "Duvar nişlerine yerleştirilmiş klasik büstler.",
        gorselKontrastDiger: "Taş işçiliğinin kaba dokusu ile demir korkulukların ince narin çizgileri arasındaki kontrast.",
        puan: 4
      },
      genelKarsilastirmaliDegerlendirme: "Bu görsel, iç avlu tipolojisi ve yapısal korunaklılık (sınır belirginliği) açısından serideki en güçlü örnektir. Görsel 7'deki kamusal sokak hareketliliğine karşın, burası içe dönük ve sakin bir sığınak niteliğindedir."
    }
  }
];
