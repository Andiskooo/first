// Blog post data types and mock data
export type BlogPost = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  fullContent: string; // Added full content parameter
  imageUrl: string;
  link: string;
  date?: string;
  accentColor?: string; // Optional color for accents
  tags?: string[]; // Added tags for categorization
};

// Mock blog data
export const blogPosts: BlogPost[] = [
  {
    id: '01',
    title: 'Si të aktivizoni funksionin e lidhjes Wi-Fi të Kondicionerëve CANDY',
    subtitle: 'Përdorimi i Aplikacionit hOn',
    content: "Lidhni kondicionerin me Wi-Fi përmes aplikacionit hOn dhe kontrolloni pajisjen tuaj nga kudo.",
    tags: ['Këshilla', 'Teknologji', 'Klimatizim'],
    fullContent: `
      ## Si të aktivizoni funksionin e lidhjes Wi-Fi
Për të filluar procesin e lidhjes:
- Mbani të shtypur butonin “LIGHT” për rreth 5 sekonda.
- Pajisja do të nisë të transmetojë sinjalin për lidhje Wi-Fi.
- Aplikacioni “hOn” do t’ju udhëzojë hap pas hapi për ta përfunduar lidhjen me sukses.
Kërkesat për Pajisjet dhe Rrjetin
Për ta përdorur këtë funksion, nevojitet një telefon i mençur dhe një ruter wireless i lidhur me internet.
Ja specifikimet minimale:

- Telefoni duhet të ketë një nga këto sisteme operative:
  - iOS 9.0 ose më i ri
  - Android 5.0 ose më i ri

- Ruteri wireless duhet të jetë funksional dhe i lidhur me internetin.
Si të Shkarkoni Aplikacionin “hOn”
Për të shkarkuar aplikacionin:
- Skanoni kodin QR të ofruar me pajisjen
- Ose kërkoni aplikacionin “hOn” në platformat përkatëse:

  - App Store (për pajisjet iPhone/iPad)
  - Google Play (për pajisjet Android)
Çfarë Përfitoni nga Aplikacioni?
Pasi të lidheni me sukses:
- Mund të kontrolloni temperaturën, ndriçimin dhe modalitetet nga çdo vend.
- Merrni njoftime nëse ndodhin gabime ose kërkohet mirëmbajtje.
- Kurseni energji duke programuar funksionimin automatik sipas nevojave tuaja.

    `,
    imageUrl: '/blog/Blog-1.jpg',
    link: '/blog/1',
    accentColor: 'red-600'
  },
  {
    id: '02',
    title: '5 Arsye Pse Kondicioneri Juaj Mban Erë?',
    subtitle: 'Arsyet dhe zgjidhjet e problemit',
    content: "Në këtë artikull do të mësoni disa arsye pse kondicioneri juaj mban këtë erë dhe si mund të zgjidhet kjo çështje.",
    tags: ['Problemet e Zakonshme', 'Mirëmbajtje', 'Klimatizim'],
    fullContent: `
      ## 5 Arsye Pse Kondicioneri Juaj Mban Erë si Çorap e Palarë
A keni vënë re erën që del nga njësia juaj e kondicionerit kohët e fundit apo që prej disa muajsh? Ajo erë e keqe që ngjan me një çorap të palarë? Duhet ta dini se kjo aromë që ndjeni nga kondicioneri nuk është normale. Dhe vetëm teknikët e specializuar mund ta zgjidhin këtë problem.

Në këtë artikull do të mësoni disa arsye pse kondicioneri juaj mban këtë erë dhe si mund të zgjidhet kjo çështje.
Filtri i Ajrit i Ndotur ose i Bllokuar
Kur në filtrin e ajrit grumbullohet lagështi ose papastërti në sasi të tepërt, fillon të zhvillohet myk brenda njësisë së kondicionerit. Nëse lagështia, papastërtitë dhe yndyra në filtër nuk pastrohen, kondicioneri juaj do të fillojë të lëshojë erë si çorap e palarë. Nëse dini ta pastroni filtrin e ajrit, mund ta bëni vetë, ose mund të thërrisni shërbimin e kondicionerit për ta bërë këtë për ju.
Tabaka e Ujit e Anuar ose e Mbushur Plotësisht
Kontrolloni nëse tabaka ku mblidhet uji është anuar, është mbushur shpejt ose është bllokuar nga papastërtitë. Ky problem mund të zgjidhet lehtësisht edhe nga vetë ju, por nëse ndodh shpesh ose ju duket e vështirë, mund të kërkoni ndihmën e një tekniku të kondicionerit.
Tubacioni i Kondensatës i Bllokuar
Tubacioni i kondensatës shkon nga spiralet e brendshme deri jashtë njësisë së kondicionerit dhe nxjerr lagështinë e krijuar nga spiralet. Kjo tubacion mund të shpëlahet nga brenda dhe të pastrohet nga jashtë, dhe lidhjet duhet të kontrollohen për probleme të tjera.
Kanale Ajri të Papastra
Akumulimi i mykut mund të formohet gjithashtu në kanalet dhe grilat e ajrit. Një ekspert HVAC mund t’i pastrojë dhe mbyllë mirë këto hapësira të ventilimit dhe të identifikojë se ku krijohet lagështia.
Probleme me Pjesët e Brendshme
Një arsye tjetër e mundshme që kondicioneri juaj mban erë si çorap e palarë është se pjesët e brendshme mund të jenë të pista ose të mbuluara me myk. Nëse njësia duket e ndotur ose masat që keni marrë nuk e kanë zgjidhur problemin e erës, thirrni një teknik për të bërë një pastrim të thellë të kondicionerit.
`,
    imageUrl: '/blog/Blog-2.png',
    link: '/blog/dirty-sock-ac',
    accentColor: 'blue-600'
  },
  {
    id: '03',
    title: 'Si janë Pompat e Nxehtësisë Më shumë se 100% Efikase?',
    subtitle: 'Teknologjia e pompës termike',
    content: "Zbuloni pse pompat termike janë zgjidhje efikase për ngrohje dhe si funksionojnë ato.",
    tags: ['Teknologji', 'Efikasitet', 'Ngrohje'],
    fullContent: `
      ## Si janë Pompat e Nxehtësisë Më shumë se 100% Efikase?
Si Funksionon një Pompë Termike
Një sistem bazë i pompës së nxehtësisë ‘monoblock’ përbëhet nga 6 komponentë: një kompresor, një valvul zgjerimi, një ventilator, një radiator i jashtëm, një shkëmbyes nxehtësie dhe radiatorë të brendshëm, të gjithë të lidhur me një tub që përmban Gaz (refrigerant), i cili është një lëng me pikë vlimi shumë të ulët.
Kur ky ftohës nxheshet apo i rritet densiteti ai ngrohet, dhe bëhet në gjendje avulli (pra gaz), dhe kur hapet ai ftohet, kthehet përsëri në lëng.
Kur pompa e nxehtësisë ndizet, kompresori fillon i pari. I penguar nga valvula e zgjerimit, kjo rrit presionin e gazit ftohës në njërën anë të sistemit. Kompresimi i këtij gazi bën që molekulat të përplasen me njëra-tjetrën dhe të ngrohen menjëherë. Imagjinoni një kanaçe deodoranti. Kur e shpërndani deodorantin, ndjeni se ftohet në dorë. Nëse do ta shtynit sërish brenda, do të nxehej.  Kjo nxehtësi transferohet nga shkëmbyesi i nxehtësisë në ujin që qarkullon në radiatorët tanë. Ndërsa uji qarkullon nëpër radiatorë, kthehet më i ftohtë, duke ftohur kështu pllakën dhe duke kondensuar gazin ftohës në lëng. Ky ftohës i kompresuar më pas kalon nëpër valvulën e zgjerimit dhe dekompresohet. Gjatë këtij procesi, bie nën temperaturën e ajrit të jashtëm. Ky lëng tani shumë i ftohtë dhe me presion të ulët kalon nëpër një radiator të jashtëm për të thithur nxehtësi nga ajri i jashtëm me ndihmën e një ventilatori. Ai ngrohet, vlohet, bëhet sërish gaz dhe kthehet te kompresori. Kjo ndihmohet nga përdorimi i nxehtësisë latente dhe ndërrimit të fazës. Çdo lëng që bëhet gaz thith energji latente (energji pa ndryshim temperature), dhe çdo gaz që kthehet në lëng lëshon këtë energji si nxehtësi pa u ftohur vetë. Kjo teori e energjisë latente është e njëjta parim që rrit efikasitetin e kaldajave kur ato ‘kondensojnë’, si dhe që përdorin bateritë e nxehtësisë me ndërrim faze. Pra, energjinë termike e marrim nga ajri i jashtëm, dhe elektriciteti që përdor pompa e nxehtësisë shërben vetëm për të lëvizur (pompuar) këtë nxehtësi nga ajri dhe për ta përqendruar në radiatorët tanë. Energjia nuk vjen nga elektriciteti, por nga ajri.

Ka edhe versione të tjera të pompave të nxehtësisë si ajër-në-ajër, nga toka ose nga uji, por të gjitha bazohen në të njëjtin parim.
Si Matet Energjia (Nxehtësia kundrejt Elektricitetit) – COP
Pra, a mund të jetë një pompë nxehtësie më shumë se 100% efikase? Çfarë po matim në të vërtetë?
Tek kaldajat me elektricitet, ne masim sa elektricitet terheq – le të themi 1kWh – dhe sa nxehtësi marrim jashtë, për shembull 0.95 kWh.
Kjo jep 95% efikasitet. Nëse bëjmë të njëjtën gjë me pompën e nxehtësisë dhe fusim 1kWh elektricitet dhe nxjerrim 5kWh nxehtësi, atëherë kemi 500% efikasitet. Ndryshe nga kaldaja elektrike, burimi i energjisë për pompën e nxehtësisë është ajri i jashtëm, jo energjia elektrike. Nëse masim vetëm energjinë e marrë nga ajri i jashtëm, kemi 100% efikasitet. Nëse përfshijmë edhe elektricitetin, efikasiteti bie në 66%-80%. Efikasiteti tregon se sa mirë shndërrohet energjia hyrëse në energji ose punë të dobishme. Është raporti ndërmjet daljes dhe hyrjes i shprehur në përqindje. Ne nuk paguajmë për ajrin e ngrohtë që e ngroh dielli, por për elektricitetin. Kjo njihet si koeficienti i performancës (COP), dhe një COP prej 5 do të thotë 500% efikasitet. 
Si Matet Efikasiteti i Pompave të Nxehtësisë
Por efikasiteti në një pikë të vetme nuk është tregues i drejtë sepse ndryshon gjatë ditës dhe vitit.

P.sh. nëse kemi COP prej 5 kur jashtë është 12°C dhe kemi nevojë për 5kW nxehtësi me 1kW fuqi elektrike, kur jashtë është 0°C, mund të na duhen 10kWh për ta ngrohur shtëpinë dhe të konsumojmë 3kWh elektricitet. COP bie në 3.3 ose 330%. Kjo sepse ‘burimi dhe marrësi’ (ajri i jashtëm dhe temperatura e radiatorit) janë më larg nga njëri-tjetri në temperaturë.Sa më larg këto temperatura, aq më shumë duhet të punojë kompresori për të krijuar një diferencë më të madhe presioni, e cila sjell diferencë më të madhe temperaturash dhe ngroh më shumë radiatorët.Këtë mund ta lehtësojmë me radiatorë më të mëdhenj ose duke përdorur kompensim moti.
Kështu që, për të përllogaritur efikasitetin real, përdorim SCOP ose SPF...
SCOP (koeficienti sezonal i performancës) është mesatarja e COP gjatë vitit; SPF është matje reale në terren. Disa mendojnë se këto nuk janë matje të drejta pasi nxehtësia më e madhe gjenerohet në dimër, kur COP është më i ulët. Por si SCOP ashtu edhe SPF janë të peshëzuara ndaj dimrit. Kjo na jep një pasqyrë të mirë për koston vjetore të pompës së nxehtësisë që para instalimit.

Si Funksionojnë Pompat e Nxehtësisë Nën 0°C
Kur jashtë është 0°C apo më ftohtë, ajri ka ende energji termike. 0°C është vetëm pika e ngrirjes së ujit.
Ka ende shumë nxehtësi në ajër. Zeroja reale është “zero absolute” = -273°C. Pra, nëse nuk jetoni në ato temperatura, ka një pompë nxehtësie që do të funksionojë për ju. Pompat tipike janë të projektuara të funksionojnë deri në -20°C dhe mund të ngrohin shtëpinë pa problem nëse janë të projektuara siç duhet. Nëse dëgjoni për probleme me pompat e nxehtësisë në të ftohtë, zakonisht janë gabime në dizajn, instalim ose konfigurim.  Edhe nëse COP bie në 2.8 në -1°C, kjo është ende 280% efikasitet. Një kaldajë moderne me kondensim mund të jetë vetëm 88% efikase në atë skenar. 
Pra, edhe pse pompat nuk janë aq efikase në dimër të thellë, ato janë ende më shumë se 3 herë më efikase se një kaldajë me gaz.
`,
    imageUrl: '/blog/Blog-3.jpg',
    link: '/blog/ac-leaking-water',
    accentColor: 'green-600'
  },
  {
    id: '04',
    title: 'Si të Zgjidhni një Pompë Nxehtësie?',
    subtitle: 'Çfarë duhet të merrni parasysh para blerjes',
    content: "Si të përcaktoni kapacitetin optimal të pompës termike për shtëpinë tuaj?",
    fullContent: `
    ## Si të Zgjidhni një Pompë Nxehtësie
Madhësia (Kapaciteti)
Një pompë nxehtësie që është shumë e vogël për nevojat tuaja do të ketë vështirësi për të mbajtur shtëpinë tuaj të rehatshme, dhe gjithashtu do të punojë më shumë orë, gjë që do ta konsumojë më shpejt. Gjithmonë sigurohuni që pompa e nxehtësisë që po mendoni të blini nuk ka të instaluar ngrohës elektrik, sepse kjo ul efikasitetin dhe e kthen në një kaldajë elektrike të zakonshme. Nga ana tjetër, një njësi më e madhe seç duhet kushton më shumë, dhe nëse nuk është model me shpejtësi të ndryshueshme (inverter), ajo do të ndizet dhe fiket më shpesh se sa duhet. Kjo ul efikasitetin, lodh komponentët dhe e bën ambientin më pak të rehatshëm.

Kapaciteti i ngrohjes së një pompe nxehtësie matet në kilovat për orë (kW/hr). Për të siguruar që pompa është me përmasën e duhur, kontraktori duhet të masë metrat katrorë të shtëpisë tuaj dhe të sugjerojë kapacitetin e përshtatshëm. Mesatarisht, një shtëpi ka nevojë për 1 kW për çdo 10 m². Nëse planifikoni të mbani një sistem rezervë ngrohjeje krahas pompës së nxehtësisë, mund të konsideroni një pompë pak më të vogël. Një kontraktor mund t'ju ndihmojë të vendosni nëse kjo ka kuptim për shtëpinë tuaj.

Nëse po kaloni nga një kaldajë elektrike ose sobë me naftë/gaz, kini parasysh se pompat e nxehtësisë kanë nevojë për kapacitet më të vogël për të ngrohur ambientin, sepse janë shumë më efikase. Për shembull, nëse shtëpia juaj ka nevojë për një kaldajë elektrike 32 kW, mund të mjaftojë një pompë nxehtësie prej vetëm 20 kW.
Lloji i Kompresorit
Kompresori është zemra e një pompe nxehtësie — standardi më i lartë është kompresori me shpejtësi të ndryshueshme (inverter). Ai është projektuar për të punuar pothuajse vazhdimisht, duke u rregulluar gradualisht për të ofruar vetëm aq ngrohje ose ftohje sa është e nevojshme për të mbajtur ambientin komod. Gjithashtu, është shumë më efektiv për të kontrolluar lagështinë e ambientit në krahasim me modelet me një shpejtësi. Kompresorët inverter jo vetëm që e bëjnë shtëpinë më të rehatshme, por janë edhe më efikasë në energji. Edhe pse mund të duket kundërintuitive, shpenzon më pak energji të lëvizësh pak nxehtësi gjatë gjithë kohës sesa shumë nxehtësi në një periudhë të shkurtër.
Performanca në Klimë të Ftohtë
Nëse jetoni në një zonë me dimra të ftohtë, duhet të zgjidhni një pompë që është e certifikuar për të funksionuar në temperaturat më të ulëta që zakonisht ndodhin në zonën tuaj, ose të keni një sistem ndihmës ngrohjeje.

Të gjitha pompat e nxehtësisë që marrin ajër nga jashtë kanë vështirësi të funksionojnë sa më shumë që ulen temperaturat; zona që mund të ngrohin bëhet më e vogël dhe efikasiteti bie. Kufiri i performancës së dobët ndryshon nga modeli në model. Disa pompa e humbasin funksionin në 0°C, të tjera punojnë deri në -25°C ose më poshtë.

Modelet që reklamohen si “për klimë të ftohtë” mund të funksionojnë në kapacitet të plotë deri në -25°C, dhe disa edhe deri në -40°F (rreth -40°C). Rruga më e mirë është të punoni me një kontraktor të kualifikuar lokal, i cili e njeh mirë klimën dhe pajisjet që funksionojnë mirë në rajonin tuaj.
Zhurma
Prodhuesit zakonisht publikojnë nivelet e zhurmës së produkteve të tyre në manualin e përdorimit dhe shpesh edhe në faqet e tyre të internetit. Ata japin vlerësime të zhurmës për temperatura të ndryshme të jashtme dhe për shpejtësi të ndryshme të ventilatorëve, të matura në decibel (dB). Sa më i vogël numri, aq më mirë, veçanërisht nëse njësia do të instalohet pranë një dritareje të dhomës së gjumit.
Besueshmëria
Sigurohuni që ta blini pompën e nxehtësisë nga një ekip serviserësh të besueshëm.
    `,
    imageUrl: '/blog/Blog-4.jpg',
    link: '/blog/extend-ac-life',
    accentColor: 'orange-600'
  },
];