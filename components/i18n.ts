"use client";

import { useLanguage } from "@/components/LanguageProvider";

// Minimal i18n for header and homepage hero
export const dict = {
  sq: {
    header: {
      produkte: "Produkte",
      kompania: "Kompania",
      blog: "Blog",
      kontakto: "Kontakto",
    },
    nav: {
      cat: {
        'ngrohje-qendrore': { title: 'Ngrohje Qendrore' },
        'klimatizim-ventilim': { title: 'Klimatizim & Ventilim' },
        sanitari: { title: 'Sanitari' },
      },
    },
    productPage: {
      notFound: {
        title: 'Produkti nuk u gjet - EcoTek',
        description: 'Na vjen keq, por produkti që kërkuat nuk mund të gjendet në EcoTek.',
      },
      relatedTitle: 'Produkte të ngjashme',
      noImage: 'Nuk ka imazh',
    },
    products: {
      'pompa-nxehtesie-vanguard': {
        description: 'Pompë termike ajër-ujë me efikasitet të lartë për ngrohje dhe ujë të ngrohtë sanitar.',
        longDescription: `
          <p>Pompa Termike EcoTek “Vanguard Comfort”</p>
          <p>Pompat Termike EcoTek Vanguard Comfort me kompresor të gazit R32 janë projektuar për të sjellë komoditet në jetën e njerëzve me ujë të nxehtë, ngrohje dhe ftohje. Karakteristikat e punës së pompës termike përfshijnë vlerësimin ERP A++, zhurmë të ulët 55 dB, kontroll inteligjent dhe shkrirje “defrost” inteligjente. Funksionon deri në -25°C EVI dhe ofron kontroll në distancë.</p>
        `,
        features: [
          'Klasa e Efikasitetit të Energjisë A++, Ngrohje dhe Ftohje',
          'Gaz R32 – Më ekologjik dhe efikas',
          'Teknologji Inverter – Kursim energjie dhe operim i qetë',
          'Temperaturë e ujit deri në 55°C',
          'Disponohet në kapacitete 12kW, 18kW, 24kW, 32kW',
          'Kontroll i avancuar dixhital',
          'Certifikime: ISO9001, CE, Etiketa e Energjisë erP, ROHS',
        ],
      },
      'pompa-nxehtesie-serene': {
        description: 'Pompë termike ajër-ujë A+++ me teknologji Inverter dhe ftohës R32.',
        longDescription: `
<p>Pompa e Ngrohjes Serene Climate R32 ka një dizajn modern dhe vlerësim A+++. Ajo përdor gazin miqësor për mjedisin R32 dhe teknologjinë inverter, duke siguruar ujë deri në 55°C me konsum të ulët energjie dhe performancë të lartë.</p>
        `,
        features: [
          'Klasa e Efikasitetit Energjetik A+++, Ngrohje dhe Ftohje',
          'Gaz ekologjik R32',
          'Teknologji Inverter për kursim energjie',
          'Temperaturë maksimale e ujit 55°C',
          'Pompë qarkullimi e integruar',
          'Enë ekspansioni e integruar',
          'Valvula sigurie të integruara',
          'Operim i qetë',
          'Kontroll inteligjent',
        ],
        details: {
          Prodhuesi: 'ECOTEK (Shembull)',
          Tipi: 'Pompë Termike Ajër-Ujë',
          Teknologjia: 'Inverter',
          Ftohësi: 'R32',
          'Klasa e Energjisë': 'A+++',
          Garancia: '4 vite',
        },
      },
      'fancoiler-kasetor': {
        description: 'Fancoiler kasetor për montim në tavan, ideal për shpërndarje uniforme të ajrit në 4 drejtime.',
        longDescription: `
<p>Fancoiler-at kasetorë janë zgjidhja diskrete dhe efikase për klimatizimin e zyrave, dyqaneve dhe hapësirave të tjera komerciale ose rezidenciale me tavane të varur. Montimi në tavan dhe shpërndarja e ajrit në 4 drejtime sigurojnë një ambient uniform dhe komod.</p>

<p>Me kapacitete të ndryshme dhe operim të qetë, fancoiler-at kasetorë ECOTEK integrohen lehtësisht në çdo dizajn interieri duke ofruar performancë të lartë.</p>
        `,
        features: [
          'Efiçiencë Energjitike në ngrohje dhe ftohje',
          'Materiale të Cilësisë së Lartë',
          'Funksionim i Heshtur',
          'Kontroll i Saktë i Temperaturës',
          'Kapacitete nga 3kW deri në 12kW',
          'Shpërndarje ajri në 4 drejtime për komfort maksimal',
          'Pompë kondensate e integruar (në shumicën e modeleve)',
          'Panel dekorativ estetik'
        ],
        details: {
          Prodhuesi: 'ECOTEK',
          Tipi: 'Fancoiler Kasetor',
          Funksioni: 'Ngrohje / Ftohje',
          Montimi: 'Në tavan të varur',
          Garancia: '2 vite',
        },
      },
      'kalldaja-mp': {
        description: 'Kalldajë elektrike me efikasitet të lartë për ngrohje.',
        longDescription: `
<p>Kalldaja Elektrike nga firma ECOTEK,</p>
<p>Me dizajn modern dhe siguri të dëshmuar, është produkti më i shitur dhe më i preferuar për të gjithë konsumatorët që kërkojnë sisteme ngrohjeje me çmim konkurrues dhe jetëgjatësi të lartë.</p>

<p>1. Mbrojtje nga Uji</p>
<p>Mbrojtje ndaj punës prej sasive të pakta ose të tepërta të ujit, me sensor presioni që ndryshon gjendjen e punës së kaldajës nëse presioni i ujit bie nën 1 bar ose ngjitet mbi 3 bar.</p>

<p>2. Mbrojtje nga Mbirryma</p>
<p>Siguresa dhe mbrojtje ndaj mbivoltazhit të integruara në sistemin elektrik të kaldajës, për parandalimin e dëmtimeve nga parregullsitë e furnizimit elektrik.</p>

<p>3. Kontaktor Silent</p>
<p>Modelet më të fundit kanë të integruar kontaktorë elektrikë që reduktojnë nivelin e zhurmës së lëshuar nga kaldaja, për një përdorim më të qetë dhe familjar.</p>

<p>4. Lidhje me WiFi</p>
<p>Me opsion të integruar për lidhje WiFi, ndezja dhe fikja e kaldajës mund të bëhet në distancë përmes aplikacionit në telefon.</p>
        `,
        features: [
          '2 Modele, Digitale dhe Manuale',
          'Pompe Qarkulluese Tisea',
          'Ekran Touchscreen me Programim Javor apo Sistem Analog',
          'Temperatura Maksimale deri në 90°C',
          'Zhurme nen 55dB',
          'Instalim i thjeshte',
          'Kapacitet nga 6kW - 27kW'
        ],
        details: {
          Prodhuesi: 'ECOTEK',
          Tipi: 'Kalldajë Originale',
          Karburanti: 'Elektrtike',
          'Klasa e Energjisë (Ngrohje)': 'A',
          Garancia: '2 vite',
        },
      },
      radiator: {
        description: 'Radiator panel çeliku me efikasitet të lartë për shpërndarje të shpejtë dhe uniforme të ngrohjes.',
        longDescription: `
<p>Radiatorët panel prej çeliku janë zgjidhja klasike dhe efikase për sistemet e ngrohjes qendrore. Ata ofrojnë shpërndarje të shpejtë dhe uniforme të nxehtësisë në të gjithë hapësirën.</p>
        `,
        features: [
          'Ngrohje e Shpejtë dhe e Barabartë falë dizajnit panel',
          'Materiale të Cilësisë së Lartë - Çelik rezistent ndaj korrozionit',
          'Efiçiencë e Lartë Energjitike - Transferim optimal i nxehtësisë',
          'Dizajn Modern dhe Elegant - Përshtatet me çdo ambient',
          'Gama e gjerë e dimensioneve dhe tipeve (Tip 11, 21, 22, 33)',
          'Instalim i lehtë'
        ],
        details: {
          Prodhuesi: 'ECOTEK/Partner (Shembull)',
          Materiali: 'Çelik',
          Lyerja: 'Bojë pluhur RAL 9016 (Shembull)',
          'Presioni maksimal': '10 bar (Shembull)',
          'Temperatura maksimale': '110°C (Shembull)',
          Garancia: '10 vite (Shembull)',
        },
      },
      'radiator-gypor': {
        description: 'Radiator alumini gypor me dizajn elegant dhe transferim të shkëlqyer të nxehtësisë.',
        longDescription: `
<p>Radiatori gypor është modeli më i njohur për banjo, duke kombinuar dizajnin elegant me efikasitetin e lartë të shpërndarjes së nxehtësisë. Struktura me gypa lejon ngrohjen e ambientit dhe tharjen e peshqirëve njëkohësisht. I ndërtuar nga materiale rezistente ndaj lagështisë, ky radiator përshtatet lehtësisht në çdo hapësirë dhe mund të funksionojë me ngrohje qendrore ose si njësi elektrike.</p>
        `,
        features: [
          'Ngrohje e Shpejtë dhe e Barabartë falë qelikut',
          'Materiale të Cilësisë së Lartë - Çelik rezistent',
          'Efiçiencë e Lartë Energjitike - Transferim i shkëlqyer termik',
          'Dizajn Modern dhe Elegant - Përshtatet me interierët bashkëkohorë',
          'Modular - Mundësi konfigurimi sipas nevojës'
        ],
        details: {
          Prodhuesi: 'ECOTEK',
          Materiali: 'Çelik',
          Lyerja: 'Bojë pluhur RAL 9016',
          'Presioni maksimal': '6 bar',
          'Temperatura maksimale': '110°C',
          Garancia: '4 vite',
        },
      },
      fancoiler: {
        description: 'Fancoiler mural me dizajn modern për ngrohje dhe ftohje efikase dhe të qetë.',
        longDescription: `
<p>Fancoiler-at muralë ECOTEK ofrojnë një zgjidhje elegante dhe efikase për klimatizimin e hapësirave rezidenciale dhe komerciale. Ata mund të përdoren si për ngrohje (në kombinim me pompa termike ose kaldaja) ashtu edhe për ftohje.</p>

<p>Dizajni modern dhe operimi i qetë i bëjnë të përshtatshëm për çdo ambient. Kontrolli i avancuar lejon rregullim të saktë të temperaturës dhe komoditetit.</p>
        `,
        features: [
          'Efiçiencë Energjitike në ngrohje dhe ftohje',
          'Materiale të Cilësisë së Lartë dhe dizajn modern',
          'Funksionim i Heshtur falë ventilatorit tangjencial',
          'Kontroll i Saktë i Temperaturës dhe shpejtësisë së ventilatorit',
          'Kapacitete nga 1.5kW deri në 5.65kW',
          'Telekomandë infra të kuqe (opsionale)',
          'Instalim i lehtë në mur'
        ],
        details: {
          Prodhuesi: 'ECOTEK (Shembull)',
          Tipi: 'Fancoiler Mural',
          Funksioni: 'Ngrohje / Ftohje',
          Kontrolli: 'Panel kontrolli i integruar / Telekomandë (opsion)',
          Garancia: '2 vite (Shembull)',
        },
      },
      'kalldaja-jp': {
        description: 'Kalldajë elektrike me efikasitet të lartë për ngrohje.',
        longDescription: `
<p>Kalldaja Elektrike nga firma ECOTEK,</p>
<p>Me dizajn modern dhe siguri të dëshmuar, është produkti më i shitur dhe më i preferuar për të gjithë konsumatorët që kërkojnë sisteme ngrohjeje me çmim konkurrues dhe jetëgjatësi të lartë.</p>

<p>1. Mbrojtje nga Uji</p>
<p>Mbrojtje ndaj punës prej sasive të pakta ose të tepërta të ujit, me sensor presioni që ndryshon gjendjen e punës së kaldajës nëse presioni i ujit bie nën 1 bar ose ngjitet mbi 3 bar.</p>

<p>2. Mbrojtje nga Mbirryma</p>
<p>Siguresa dhe mbrojtje ndaj mbivoltazhit të integruara në sistemin elektrik të kaldajës, për parandalimin e dëmtimeve nga parregullsitë e furnizimit elektrik.</p>

<p>3. Kontaktor Silent</p>
<p>Modelet më të fundit kanë të integruar kontaktorë elektrikë që reduktojnë nivelin e zhurmës së lëshuar nga kaldaja, për një përdorim më të qetë dhe familjar.</p>

<p>4. Lidhje me WiFi</p>
<p>Me opsion të integruar për lidhje WiFi, ndezja dhe fikja e kaldajës mund të bëhet në distancë përmes aplikacionit në telefon.</p>
        `,
        features: [
          '2 Modele, Digitale dhe Manuale',
          'Pompe Qarkulluese Tisea',
          'Ekran Touchscreen me Programim Javor apo Sistem Analog',
          'Temperatura Maksimale deri në 90°C',
          'Zhurme nen 55dB',
          'Instalim i thjeshte',
          'Kapacitet nga 6kW - 27kW'
        ],
        details: {
          Prodhuesi: 'ECOTEK',
          Tipi: 'Kalldajë Originale',
          Karburanti: 'Elektrtike',
          'Klasa e Energjisë (Ngrohje)': 'A',
          Garancia: '2 vite',
        },
      },
      'pompa-nxehtesie-sinceko': {
        description: 'Pompë gjeotermike ujë‑ujë A+++ me R410a – zgjidhje ekonomike për ngrohje/fTohje dhe ujë të ngrohtë.',
        longDescription: `
<p>Sinceko – Pompë gjeotermike ujë‑ujë që ofron ngrohje, ftohje dhe ujë të ngrohtë sanitar me efikasitet shumë të lartë. Kontrolleri inteligjent mbështet kurbën e ngrohjes për rehati maksimale dhe modalitetin EKO me tre mënyra pune për të ulur konsumin e energjisë.</p>
        `,
        features: [
          'Klasa e efikasitetit energjetik A+++',
          'Gaz ekologjik R410a',
          'Teknologji Inverter për funksionim efikas',
          'Temperaturë maksimale e ujit 55°C',
          'Operim i besueshëm dhe ekonomik',
          'Kontrollues i thjeshtë dhe intuitiv'
        ],
        details: {
          Prodhuesi: 'Sinceko (Shembull)',
          Tipi: 'Pompë Termike Ujë‑Ujë Split',
          Teknologjia: 'Inverter',
          Ftohësi: 'R410a',
          'Klasa e Energjisë': 'A+++',
          Garancia: '4 vite',
        },
      },
      'pompa-nxehtesie-apex': {
        description: 'Pompë termike ajër-ujë A+++ me Gaz natyral R290 dhe temperaturë të lartë ujit dalës (75°C).',
        longDescription: `
        <p>Apex Heating përfaqëson majën e teknologjisë së pompave termike, duke përdorur gazin natyral R290 (Propan) për një ndikim minimal mjedisor dhe efikasitet të jashtëzakonshëm A+++.</p>
        
        <p>Karakteristika kryesore e kësaj pompe është aftësia për të prodhuar ujë me temperaturë deri në 75°C, duke e bërë të përshtatshme për zëvendësimin e kaldajave të vjetra në sisteme me radiatorë tradicionalë, pa pasur nevojë për ndryshime në sistemin ekzistues.</p>

        <p>Përfshin komponentë hidraulikë të integruar për instalim të lehtë dhe ofron operim të besueshëm edhe në temperatura të ulëta të ambientit.</p>
        `,
        features: [
          'Klasa më e lartë e Efikasitetit Energjetik A+++',
          'Gaz natyral R290 me GWP (Potencial Ngrohje Globale) shumë të ulët',
          'Teknologji Inverter për përshtatje të fuqisë dhe kursim maksimal',
          'Temperaturë e lartë e daljes së ujit deri në 75°C, ideale për radiatorë ekzistues',
          'Pompë qarkullimi e integruar me efikasitet të lartë',
          'Enë ekspansioni e integruar',
          'Valvula sigurie dhe komponentë hidraulikë të integruar',
          'Operim shumë i qetë',
          'Kontroll inteligjent me mundësi WiFi',
          'Kapacitete: 6kW deri 18kW'
        ],
        details: {
          Prodhuesi: 'ECOTEK (Shembull)',
          Tipi: 'Pompë Termike Ajër-Ujë (Temp. Lartë)',
          Teknologjia: 'Inverter',
          Ftohësi: 'R290 (Propan)',
          'Klasa e Energjisë': 'A+++',
          Garancia: '4 vite',
        },
      },
      'pompa-nxehtesie-maxi': {
        description: 'Pompë termike ajër-ujë A++ me Gaz R410a, ideale për hapësira komerciale ose afariste.',
        longDescription: `
<p>Seria e Pumpave të Ngrohjes dhe Ftohjes Komerciale Maxi nga EcoTek duke përdorur gazin e ftohjes R410a, ofron avantazhe të shumta. R410a është miqësor për mjedisin, pa ndikim potencial në ozon, duke zvogëluar ndikimin e tij. Ai ofron vetitë termodinamike të përmirësuara, duke rezultuar në efikasitet të lartë të energjisë dhe zvogëlim të kostove operative. Mundësia e shkëlqyer e transferimit të nxehtësisë të gazit lejon performancë optimale në ngrohje dhe ftohje. Mundësia e tij për të operuar në presione më të larta lejon dizajne sistemi më kompakte.</p>
        `,
        features: [
          'Klasa e Efikasitetit Energjetik A++',
          'Gaz ekologjik R410a',
          'Teknologji Inverter DC për modulim të vazhdueshëm',
          'Temperaturë maksimale e ujit 55°C',
          'Operim i qetë si për njësinë e jashtme',
          'Kontroll inteligjent me ekran LCD dhe mundësi WiFi',
          'Mbrojtje nga ngrirja',
          'Kapacitete të ndryshme: 50kW, 100kW, 200kW, 400kW'
        ],
        details: {
          Prodhuesi: 'ECOTEK',
          Tipi: 'Pompë Termike Ajër-Ujë',
          Teknologjia: 'Inverter DC',
          Ftohësi: 'R410a',
          'Klasa e Energjisë': 'A++',
          Garancia: '4 vite',
        },
      },
      'kalldaja-og': {
        description: 'Kalldajë elektrike me efikasitet të lartë për ngrohje.',
        longDescription: `
<p>Kalldaja Elektrike nga firma ECOTEK,</p>
<p>Me dizajn modern dhe siguri të dëshmuar, është produkti më i shitur dhe më i preferuar për të gjithë konsumatorët që kërkojnë sisteme ngrohjeje me çmim konkurrues dhe jetëgjatësi të lartë.</p>

<p>1. Mbrojtje nga Uji</p>
<p>Mbrojtje ndaj punës prej sasive të pakta ose të tepërta të ujit, me sensor presioni që ndryshon gjendjen e punës së kaldajës nëse presioni i ujit bie nën 1 bar ose ngjitet mbi 3 bar.</p>

<p>2. Mbrojtje nga Mbirryma</p>
<p>Siguresa dhe mbrojtje ndaj mbivoltazhit të integruara në sistemin elektrik të kaldajës, për parandalimin e dëmtimeve nga parregullsitë e furnizimit elektrik.</p>

<p>3. Kontaktor Silent</p>
<p>Modelet më të fundit kanë të integruar kontaktorë elektrikë që reduktojnë nivelin e zhurmës së lëshuar nga kaldaja, për një përdorim më të qetë dhe familjar.</p>

<p>4. Lidhje me WiFi</p>
<p>Me opsion të integruar për lidhje WiFi, ndezja dhe fikja e kaldajës mund të bëhet në distancë përmes aplikacionit në telefon.</p>
        `,
        features: [
          '2 Modele, Digitale dhe Manuale',
          'Pompe Qarkulluese Tisea',
          'Ekran Touchscreen me Programim Javor apo Sistem Analog',
          'Temperatura Maksimale deri në 90°C',
          'Zhurme nen 55dB',
          'Instalim i thjeshte',
          'Kapacitet nga 6kW - 27kW'
        ],
        details: {
          Prodhuesi: 'ECOTEK',
          Tipi: 'Kalldajë Originale',
          Karburanti: 'Elektrtike',
          'Klasa e Energjisë (Ngrohje)': 'A',
          Garancia: '2 vite',
        },
      },
      'akumulues': {
        description: 'Akumulues uji inoksi për ngrohje qendrore dhe sisteme solare.',
        longDescription: `
<p>Akumulues Uji për Ngrohje Qendrore - Për një Temperaturë Konstante dhe Efiçiencë Maksimale
Investoni në akumuluesin tonë të ujit për ngrohje qendrore dhe siguroni një ambient të ngrohtë dhe të rehatshëm gjatë gjithë vitit. Me kapacitete prej 60 L, 100 L, dhe 200 L, akumuluesit tanë janë zgjidhja ideale për të mbajtur temperaturën konstante në sistemin tuaj të ngrohjes qendrore, qoftë për radiatorë, ngrohje dyshemeje apo fan coilers.</p>
        `,
        features: [
          'Kapacitetet 60 L, 100 L, 200 L',
          'Materiali Inoksi - Jetëgjatësi maksimale',
          'Izolim me Poliuretan me Densitet të Lartë për efiçencë energjitike',
          'Mundësi me 1 ose 2 Serpentina (solar + pompe termike)',
          'Nxems Elektrik te integruar',
          'Mbrojtje Anodike Magnezi',
          'Garanci 4 vite'
        ],
        details: {
          Prodhuesi: 'ECOTEK',
          Tipi: 'Akumulues Uji',
          'Materiali i Brendshëm': 'Inoksi',
          Izolimi: 'Poliuretan (50mm)',
          Garancia: '4 vite',
        },
      },
      
    },
    hero: {
      slide1: {
        title: "Boileri R290",
        description: "Boiler i avancuar ECOPUMP R290 me efikasitet të lartë.",
        button: "Eksploro Zgjidhjet",
      },
      slide2: {
        title: "Klima Candy A+++",
        description: "Klima Candy A+++ perfekte për verë.",
        button: "Shiko Produktet",
      },
      slide3: {
        title: "Kalldaja ECO TEK",
        description: "Kalldaja ECO TEK me efikasitet të lartë.",
        button: "Shiko Produktet",
      },
      slide4: {
        title: "Pompa ECO TEK R290",
        description: "Fuqi e Pastër, Kursim Ekstrem!",
        button: "Eksploro Zgjidhjet",
      },
      slide5: {
        title: "Shërbime Profesionale të Instalimit",
        description: "Ekipi ynë i kualifikuar siguron instalim dhe mirëmbajtje të përsosur",
        button: "Kontakto Tani",
      },
      products: {
        sectionTitle: 'Produktet Tona',
        sectionSubtitle: 'Zgjidhje të avancuara për nevojat tuaja',
        viewAll: 'Shiko të gjitha',
        viewDetails: 'Shiko Detajet',
        viewProduct: 'Shiko Produktin',
        qualityIsSaving: 'Cilësia është kursim',
        cat: {
          'ngrohje-qendrore': 'Ngrohje Qendrore',
          klimatizim: 'Klimatizim',
          solar: 'Solar',
          ventilim: 'Ventilim',
        },
        featured: {
          heatpump: {
            title: 'Pompa Termike Serene Climate – Zgjedhja më e kompletuar për shtëpinë tuaj',
            description: 'Pompa termike Serene Climate ofron ngrohje dhe ftohje të avancuar me efikasitet maksimal. E vlerësuar me klasën energjetike A+++, kjo pajisje ka të gjitha pajisjet përcjellëse të përfshira brenda njësisë – duke eliminuar nevojën për instalime shtesë apo module të jashtme. Me funksionim të qëndrueshëm edhe në temperatura ekstreme, dhe kontroll të integruar WiFi, Serene Climate është zgjidhja ideale për komoditet dhe kursim afatgjatë',
          },
          klima: {
            title: 'Kondicioneri Pura – Performancë italiane për çdo shtëpi',
            description: 'Modeli Pura nga brendi i njohur italian Candy është zgjedhja më e leverdishme për ambientin tuaj. Me efikasitet të lartë energjetik A+++/A++, funksionim të qetë dhe konsum të ulët, ky kondicioner garanton komoditet të përditshëm me kosto të arsyeshme.',
          },
          boiler: {
            title: 'Boiler EcoPump – Efikasitet i avancuar për ngrohjen e ujit në çdo shtëpi',
            description: 'Boileri EcoPump nga ECOTEK është zgjidhja më ekonomike dhe moderne për ngrohjen e ujit sanitar në kushte shtëpiake. I pajisur me një sistem të integruar me pomë termike, ai siguron ujë të ngrohtë me një konsum energjie shumë më të ulët krahasuar me boilerët klasikë me rezistencë elektrike – deri në 5 herë më pak shpenzim.',
          },
        },
      },
      video: {
        title: 'Shijoni freskinë dhe komoditetin maksimal në shtëpinë tuaj me kondicionerët e ajrit CANDY. Zgjidhja ideale për një verë pa stres.',
        cta: 'Na Kontaktoni për një Konsultë',
      },
    },
    home: {
      categories: {
        sectionTitle: 'Kategorit Tona',
        sectionSubtitle: 'Zgjidhje të specializuara për çdo nevojë të shtëpisë dhe biznesit tuaj',
        learnMore: 'Mësoni Më Shumë',
        cards: {
          'ngrohje-qendrore': {
            title: 'Ngrohje Qëndrore',
            description: 'Kompetencë dhe Efikasitet në Menaxhimin e Energjisë.',
          },
          'klimatizim-ventilim': {
            title: 'Klimatizim/Ventilim',
            description: 'Ekspertët për Freski dhe Rehati në Shtëpinë Tuaj.',
          },
          sanitari: {
            title: 'Sanitari',
            description: 'Zgjidhje sanitare dhe higjienike për shtëpinë tuaj.',
          },
          'instalim-servisim': {
            title: 'Instalim/Servisim',
            description: 'Profesionalizëm dhe siguri për ambientin tuaj.',
          },
        },
      },
      video: {
        title: 'Shijoni freskinë dhe komoditetin maksimal në shtëpinë tuaj me kondicionerët e ajrit CANDY. Zgjidhja ideale për një verë pa stres.',
        cta: 'Na Kontaktoni për një Konsultë',
      },
      blog: {
        sectionTitle: 'Artikujt dhe Informata',
        viewAll: 'Shiko artikujt',
        readMore: 'Lexo më shumë',
      },
    },
    blog: {
      posts: {
        '01': { title: 'Si të aktivizoni funksionin e lidhjes Wi-Fi të Kondicionerit CANDY', subtitle: 'Përdorimi i Aplikacionit hOn' },
        '02': { title: '5 Arsye Pse Kondicioneri Juaj Mban Erë?', subtitle: 'Arsyet dhe zgjidhjet e problemit' },
        '03': { title: 'Si janë Pompat e Nxehtësisë Më shumë se 100% Efikase?', subtitle: 'Teknologjia e pompës termike' },
        '04': { title: 'Si të Zgjidhni një Pompë Nxehtësie?', subtitle: 'Çfarë duhet të merrni parasysh para blerjes' },
        '05': { title: 'Si të Zgjidhni Kapacitetin e sakët për Kondicjoner Candy Split?', subtitle: 'Faktorët që duhen marrë parasysh për të zgjidhur njësinë e duhur' },
        '06': { title: 'Çfarë Do të Thotë me të Vërtetë Termi "BTU"?', subtitle: 'Guida e Plotë për BTU: Si të Zgjidhni Kondicionerin e Duhur' },
        '07': { title: 'Pse Instalimi Profesional i Klimës është më i rëndësishëm se Marka që zgjidhni!', subtitle: 'Kostot e fsheta nga instalimi jo profesional i klimës' },
        '08': { title: 'Si Funksionon Sistemi i Pompës Termike për Ngrohje Qëndrore dhe Ujë të Nxehtë', subtitle: 'Si një Valvul Tre-Kahëorshe Mundëson Përdorimin e Dyfishtë të Pompës Tuaj Termike' },
        '09': { title: 'Avantazhi i Vërtetë i Klimës Inteligjente - Kontroll i Plotë nga Çdo Cep i Botës', subtitle: 'Jetoni Jashtë? Kontrolloni Klimën në Kosovë sikur të ishit Aty: Zbuloni Fuqinë e Wi-Fi' },
        '10': { title: 'Cili është ndryshimi midis pompave termike monobllok dhe atyre split(dy njësi)?', subtitle: 'Cili është sistemi më i mirë për shtëpinë tuaj?' },
        '11': { title: 'Si funskjonon pastrimi i ajrit nga Klimat?', subtitle: 'A kanë të gjithë kondicionerët pastrues ajri?' },
        '12': { title: 'Dallimi mes Gazit R32 dhe R410A: Një Krahasim i Gjithanshëm?', subtitle: 'Efiçienca dhe Performanca?' },
        '13': { title: 'Si dhe Pse Kondicionerët Prodhojnë Ujë: Shpjegimi i Plotë?', subtitle: 'Mësoni pse prodhimi i ujit është shenjë e një kondicioneri efikas.' },
        '14': { title: 'Çfarë janë Fan Coil-at Horizontalë të Dyshemesë dhe si Funksionon?', subtitle: 'Mësoni më shumë për modelet e ndrryshme të paisjeve për nxehmje.' },
        '15': { title: 'Si E Bllokon Izolimi Transferimin e Nxehtësisë?', subtitle: 'Mbrojtja e Shtëpisë Tuaj.' },
      },
    },
    contact: {
      title: 'Na Kontaktoni',
      description: "Jemi këtu për t'ju ndihmuar me çdo pyetje dhe kërkesë. Mos hezitoni të na kontaktoni.",
      form: {
        sendMessageTitle: 'Dërgoni një Mesazh',
        nameLabel: 'Emri i plotë',
        namePlaceholder: 'Emri juaj i plotë',
        emailLabel: 'Email',
        emailPlaceholder: 'email@juaj.com',
        phoneLabel: 'Numri i telefonit',
        phonePlaceholder: '+383 44 123 456',
        messageLabel: 'Mesazhi',
        messagePlaceholder: 'Shkruani mesazhin tuaj këtu...',
        submit: 'Dërgo Mesazhin',
        sending: 'Duke dërguar...',
        successTitle: 'Faleminderit për mesazhin!',
        successBody: "Mesazhi juaj u dërgua me sukses. Do t'ju kontaktojmë së shpejti.",
        successAnother: 'Dërgo një mesazh tjetër',
        errorAlert: 'Ndodhi një gabim. Ju lutemi provoni përsëri.',
      },
      info: {
        title: 'Informacione Kontakti',
        addressLabel: 'Adresa',
        addressValue: 'Dah Polloshka 14, Gjakovë 50000, Kosovë',
        phoneLabel: 'Telefoni',
        phoneValue: '+383 44 914 480',
        emailLabel: 'Email',
        emailValue: 'info@ecotek-ks.com',
        hoursLabel: 'Orari i Punës',
        weekday: 'E Hënë - E Premte: 09:00 - 17:00',
        saturday: 'E Shtunë: 09:00 - 13:00',
      },
      cta: 'Na Kontaktoni',
    },
    footer: {
      about:
        'EcoTek ofron zgjidhje inovative për ngrohje qendrore, klimatizim, ventilim dhe sisteme solare për shtëpi dhe biznese.',
      quickLinksTitle: 'Lidhje të Shpejta',
      links: {
        about: 'Rreth Nesh',
        contact: 'Kontakti',
        blog: 'Blog',
      },
      contactTitle: 'Kontakto',
      newsletter: {
        title: 'Abonohu për Njoftime',
        desc: 'Merrni njoftime për produktet dhe shërbimet tona më të reja.',
        placeholder: 'Email juaj',
        subscribe: 'Abonohu',
      },
      rightsPrefix: '©',
      rightsSuffix: 'Të gjitha të drejtat e rezervuara.',
    },
    categories: {
      home: 'Kryefaqja',
      all: 'Të gjitha',
      hero: {
        'ngrohje-qendrore': {
          title: 'Ngrohje Qendrore',
          description: 'Sisteme efikase dhe të qëndrueshme për ngrohje qendrore në shtëpi dhe biznese.',
        },
        'klimatizim-ventilim': {
          title: 'Klimatizim & Ventilim',
          description: 'Komfort optimal gjatë gjithë vitit me sistemet tona të klimatizimit dhe ventilimit',
        },
        sanitari: {
          title: 'Sanitari',
          description: 'Zgjidhje sanitare dhe higjienike për shtëpinë tuaj',
        },
      },
      empty: {
        title: 'Nuk ka produkte',
        desc: 'Na vjen keq, nuk ka produkte që përputhen me këtë nënkategori.',
      },
    },
  },
  de: {
    header: {
      produkte: "Produkte",
      kompania: "Unternehmen",
      blog: "Blog",
      kontakto: "Kontakt",
      blog_desc: "Lesen Sie unsere neuesten Artikel und Tipps.",
      kontakto_desc: "Kontaktieren Sie uns bei Fragen oder Anliegen.",
    },
    products: {
      'pompa-nxehtesie-vanguard': {
        description: 'Hocheffiziente Luft-Wasser-Wärmepumpe für Heizung und Warmwasser.',
        longDescription: `
          <p>EcoTek Wärmepumpe „Vanguard Comfort“</p>
          <p>Die EcoTek Vanguard Comfort Wärmepumpen mit R32-Kompressor bieten Warmwasser, Heizung und Kühlung mit hoher Effizienz. Merkmale: ERP A++ Energiebewertung, niedriger Geräuschpegel (55 dB), Kältemittel R32, intelligente Steuerung und intelligente Abtauung. Betrieb bis -25°C (EVI) und Fernsteuerung per App.</p>
        `,
        features: [
          'Energieeffizienzklasse A++, Heizen und Kühlen',
          'R32 Kältemittel – umweltfreundlicher und effizienter',
          'Inverter-Technologie – Energiesparen und leiser Betrieb',
          'Wassertemperatur bis 55°C',
          'Verfügbar in 12kW, 18kW, 24kW, 32kW',
          'Erweiterte digitale Steuerung',
          'Zertifizierungen: ISO9001, CE, Energie-Label erP, ROHS',
        ],
      },
      'pompa-nxehtesie-serene': {
        description: 'A+++ Luft-Wasser-Wärmepumpe mit Inverter-Technologie und Kältemittel R32.',
        longDescription: `
<p>Die Serene Climate R32 Wärmepumpe verbindet modernes Design mit A+++ Effizienz. Dank umweltfreundlichem R32 und Inverter-Technologie liefert sie Wasser bis 55°C bei niedrigem Energieverbrauch und hoher Leistung.</p>
        `,
        features: [
          'Energieeffizienzklasse A+++, Heizen und Kühlen',
          'Umweltfreundliches R32 Kältemittel',
          'Inverter-Technologie für Energieeinsparung',
          'Maximale Wassertemperatur 55°C',
          'Integrierte Umwälzpumpe',
          'Integriertes Ausdehnungsgefäß',
          'Integrierte Sicherheitsventile',
          'Leiser Betrieb',
          'Intelligente Steuerung',
        ],
        details: {
          Hersteller: 'ECOTEK (Beispiel)',
          Typ: 'Luft-Wasser-Wärmepumpe',
          Technologie: 'Inverter',
          Kältemittel: 'R32',
          'Energieklasse': 'A+++',
          Garantie: '4 Jahre',
        },
      },
      'pompa-nxehtesie-sinceko': {
        description: 'A+++ Wasser‑Wasser‑Erdwärmepumpe mit R410a – wirtschaftliche Lösung für Heizen/Kühlen und Warmwasser.',
        longDescription: `
<p>Sinceko – Eine Wasser‑Wasser‑Erdwärmepumpe, die Heizen, Kühlen und Warmwasser mit sehr hoher Effizienz bietet. Die intelligente Steuerung unterstützt die Heizkurve für maximalen Komfort sowie den EKO‑Modus mit drei Betriebsarten zur Reduzierung des Energieverbrauchs.</p>
        `,
        features: [
          'Energieeffizienzklasse A+++',
          'Umweltfreundliches R410a Kältemittel',
          'Inverter‑Technologie für effizienten Betrieb',
          'Maximale Wassertemperatur 55°C',
          'Zuverlässiger und wirtschaftlicher Betrieb',
          'Einfache und intuitive Steuerung'
        ],
        details: {
          Hersteller: 'Sinceko (Beispiel)',
          Typ: 'Wasser‑Wasser‑Wärmepumpe (Split)',
          Technologie: 'Inverter',
          Kältemittel: 'R410a',
          'Energieklasse': 'A+++',
          Garantie: '4 Jahre',
        },
      },
      'pompa-nxehtesie-apex': {
        description: 'A+++ Luft‑Wasser‑Wärmepumpe mit natürlichem Kältemittel R290 und hoher Austrittwassertemperatur (75°C).',
        longDescription: `
        <p>Apex Heating repräsentiert die Spitze der Wärmepumpentechnologie und nutzt das natürliche Kältemittel R290 (Propan) für minimale Umweltbelastung und außergewöhnliche A+++ Effizienz.</p>
        
        <p>Ein Hauptmerkmal ist die Fähigkeit, Wasser mit einer Temperatur von bis zu 75°C zu liefern – ideal zum Austausch alter Kessel in bestehenden Heizkörpersystemen, ohne Änderungen am vorhandenen System.</p>

        <p>Mit integrierten Hydraulikkomponenten für eine einfache Installation und zuverlässigen Betrieb auch bei niedrigen Außentemperaturen.</p>
        `,
        features: [
          'Höchste Energieeffizienzklasse A+++',
          'Natürliches Kältemittel R290 mit sehr niedrigem GWP (Treibhauspotenzial)',
          'Inverter‑Technologie für Leistungsanpassung und maximale Einsparungen',
          'Hohe Austrittwassertemperatur bis 75°C, ideal für bestehende Heizkörper',
          'Integrierte Hocheffizienz‑Umwälzpumpe',
          'Integriertes Ausdehnungsgefäß',
          'Integrierte Sicherheitsventile und Hydraulikkomponenten',
          'Sehr leiser Betrieb',
          'Intelligente Steuerung mit WiFi‑Option',
          'Leistungsgrößen: 6kW bis 18kW'
        ],
        details: {
          Hersteller: 'ECOTEK (Beispiel)',
          Typ: 'Luft‑Wasser‑Wärmepumpe (Hochtemperatur)',
          Technologie: 'Inverter',
          Kältemittel: 'R290 (Propan)',
          'Energieklasse': 'A+++',
          Garantie: '4 Jahre',
        },
      },
      'pompa-nxehtesie-maxi': {
        description: 'A++ Luft‑Wasser‑Wärmepumpe mit R410a – ideal für gewerbliche oder kommerzielle Anwendungen.',
        longDescription: `
<p>Die kommerzielle Maxi‑Serie von EcoTek verwendet das Kältemittel R410a und bietet zahlreiche Vorteile. R410a ist ozonneutral und umweltfreundlich und ermöglicht verbesserte thermodynamische Eigenschaften, was zu hoher Energieeffizienz und niedrigeren Betriebskosten führt. Die hervorragende Wärmeübertragung sorgt für optimale Leistung beim Heizen und Kühlen. Dank höherer Betriebsdrücke sind kompaktere Systemdesigns möglich.</p>
        `,
        features: [
          'Energieeffizienzklasse A++',
          'Umweltfreundliches R410a Kältemittel',
          'DC‑Inverter‑Technologie für kontinuierliche Modulation',
          'Maximale Wassertemperatur 55°C',
          'Leiser Betrieb der Außeneinheit',
          'Intelligente Steuerung mit LCD‑Display und optionalem WiFi',
          'Frostschutz',
          'Leistungsgrößen: 50kW, 100kW, 200kW, 400kW'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Luft‑Wasser‑Wärmepumpe',
          Technologie: 'DC‑Inverter',
          Kältemittel: 'R410a',
          'Energieklasse': 'A++',
          Garantie: '4 Jahre',
        },
      },
      'kalldaja-og': {
        description: 'Elektrischer Heizkessel mit hoher Effizienz für die Raumheizung.',
        longDescription: `
<p>Elektrischer Heizkessel von ECOTEK,</p>
<p>Mit modernem Design und bewährter Sicherheit ist er das meistverkaufte und bevorzugte Produkt für alle, die ein kostengünstiges und langlebiges Heizsystem suchen.</p>

<p>1. Wasserschutz</p>
<p>Schutz bei zu geringer oder zu hoher Wassermenge. Ein Drucksensor ändert den Betriebszustand des Kessels, wenn der Wasserdruck unter 1 bar fällt oder über 3 bar steigt.</p>

<p>2. Überspannungsschutz</p>
<p>In das elektrische System integrierte Sicherungen und Überspannungsschutz verhindern Schäden durch Unregelmäßigkeiten in der Stromversorgung.</p>

<p>3. Leiser Schütz</p>
<p>Neueste Modelle integrieren elektrische Schütze, die das Geräuschniveau des Kessels reduzieren – für einen ruhigeren und komfortableren Betrieb.</p>

<p>4. WiFi‑Anbindung</p>
<p>Mit integrierter WiFi‑Option können Ein‑/Ausschalten des Kessels per Smartphone‑App aus der Ferne erfolgen.</p>
        `,
        features: [
          '2 Modelle: Digital und Manuell',
          'Tisea‑Umwälzpumpe',
          'Touchscreen mit Wochenprogrammierung oder Analogsystem',
          'Maximale Temperatur bis 90°C',
          'Geräuschpegel unter 55 dB',
          'Einfache Installation',
          'Leistungsbereich 6 kW – 27 kW'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Original‑Heizkessel',
          Brennstoff: 'Elektrisch',
          'Energieklasse (Heizung)': 'A',
          Garantie: '2 Jahre',
        },
      },
      radiator: {
        description: 'Stahl‑Paneelheizkörper mit hoher Effizienz für eine schnelle und gleichmäßige Wärmeverteilung.',
        longDescription: `
<p>Stahl‑Paneelheizkörper sind die klassische und effiziente Lösung für Zentralheizungssysteme. Sie bieten eine schnelle und gleichmäßige Wärmeverteilung im gesamten Raum.</p>
        `,
        features: [
          'Schnelle und gleichmäßige Wärme dank Paneel‑Design',
          'Hochwertige Materialien – Korrosionsbeständiger Stahl',
          'Hohe Energieeffizienz – Optimaler Wärmeübergang',
          'Modernes, elegantes Design – Passt in jedes Interieur',
          'Breite Auswahl an Größen und Typen (Typ 11, 21, 22, 33)',
          'Einfache Installation'
        ],
        details: {
          Hersteller: 'ECOTEK/Partner (Beispiel)',
          Material: 'Stahl',
          Beschichtung: 'Pulverbeschichtung RAL 9016 (Beispiel)',
          'Maximaler Druck': '10 bar (Beispiel)',
          'Maximale Temperatur': '110°C (Beispiel)',
          Garantie: '10 Jahre (Beispiel)',
        },
      },
      'radiator-gypor': {
        description: 'Röhrenheizkörper aus Aluminium mit elegantem Design und hervorragender Wärmeübertragung.',
        longDescription: `
<p>Der Röhrenheizkörper ist das beliebteste Modell für Badezimmer. Er kombiniert elegantes Design mit hoher Effizienz der Wärmeabgabe. Die Rohrstruktur ermöglicht das Beheizen des Raumes und gleichzeitiges Trocknen von Handtüchern. Gefertigt aus feuchtigkeitsbeständigen Materialien, passt er in jeden Raum und kann mit Zentralheizung oder als elektrische Einheit betrieben werden.</p>
        `,
        features: [
          'Schnelle und gleichmäßige Wärme dank Stahl',
          'Hochwertige Materialien – Robuster Stahl',
          'Hohe Energieeffizienz – Hervorragender Wärmeübergang',
          'Modernes, elegantes Design – Für moderne Innenräume',
          'Modular – Konfiguration nach Bedarf'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Material: 'Stahl',
          Beschichtung: 'Pulverbeschichtung RAL 9016',
          'Maximaler Druck': '6 bar',
          'Maximale Temperatur': '110°C',
          Garantie: '4 Jahre',
        },
      },
      fancoiler: {
        description: 'Wand‑Fancoil mit modernem Design für effizientes, leises Heizen und Kühlen.',
        longDescription: `
<p>Die wandmontierten ECOTEK Fancoils bieten eine elegante und effiziente Lösung für die Klimatisierung von Wohn‑ und Gewerberäumen. Sie können sowohl zum Heizen (in Kombination mit Wärmepumpen oder Kesseln) als auch zum Kühlen verwendet werden.</p>

<p>Modernes Design und leiser Betrieb machen sie für jede Umgebung geeignet. Die fortschrittliche Steuerung ermöglicht eine präzise Regelung von Temperatur und Komfort.</p>
        `,
        features: [
          'Energieeffizient im Heiz‑ und Kühlbetrieb',
          'Hochwertige Materialien und modernes Design',
          'Leiser Betrieb dank tangentialem Ventilator',
          'Präzise Temperatur‑ und Lüfterstufenregelung',
          'Leistungsbereich von 1,5 kW bis 5,65 kW',
          'IR‑Fernbedienung optional',
          'Einfache Wandmontage'
        ],
        details: {
          Hersteller: 'ECOTEK (Beispiel)',
          Typ: 'Wand‑Fancoil',
          Funktion: 'Heizen / Kühlen',
          Steuerung: 'Integriertes Bedienfeld / Fernbedienung (optional)',
          Garantie: '2 Jahre (Beispiel)',
        },
      },
      'fancoiler-kasetor': {
        description: 'Kassetten‑Fancoil zur Deckenmontage, ideal für gleichmäßige Luftverteilung in 4 Richtungen.',
        longDescription: `
<p>Kassetten‑Fancoils sind eine diskrete und effiziente Lösung für die Klimatisierung von Büros, Geschäften sowie anderen gewerblichen oder privaten Räumen mit abgehängten Decken. Die Deckenmontage und die Luftverteilung in 4 Richtungen sorgen für ein gleichmäßiges und komfortables Raumklima.</p>
<p>Mit verschiedenen Leistungsgrößen und leisem Betrieb fügen sich ECOTEK Kassetten‑Fancoils nahtlos in jedes Interieur ein und liefern eine hohe Leistung.</p>
        `,
        features: [
          'Energieeffizienz beim Heizen und Kühlen',
          'Hochwertige Materialien',
          'Leiser Betrieb',
          'Präzise Temperaturregelung',
          'Kapazitäten von 3 kW bis 12 kW',
          'Luftverteilung in 4 Richtungen für maximalen Komfort',
          'Integrierte Kondensatpumpe (bei den meisten Modellen)',
          'Ästhetisches Dekorpanel'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Kassetten‑Fancoil',
          Funktion: 'Heizen / Kühlen',
          Montage: 'In abgehängter Decke',
          Garantie: '2 Jahre',
        },
      },
      'kalldaja-jp': {
        description: 'Hocheffizienter elektrischer Heizkessel für die Raumheizung.',
        longDescription: `
<p>Elektrischer Heizkessel von ECOTEK,</p>
<p>Mit modernem Design und bewährter Sicherheit ist er das meistverkaufte und bevorzugte Produkt für alle, die ein kostengünstiges und langlebiges Heizsystem suchen.</p>

<p>1. Wasserschutz</p>
<p>Schutz bei zu geringer oder zu hoher Wassermenge. Ein Drucksensor ändert den Betriebszustand des Kessels, wenn der Wasserdruck unter 1 bar fällt oder über 3 bar steigt.</p>

<p>2. Überspannungsschutz</p>
<p>In das elektrische System integrierte Sicherungen und Überspannungsschutz verhindern Schäden durch Unregelmäßigkeiten in der Stromversorgung.</p>

<p>3. Leiser Schütz</p>
<p>Neueste Modelle integrieren elektrische Schütze, die das Geräuschniveau des Kessels reduzieren – für einen ruhigeren und komfortableren Betrieb.</p>

<p>4. WiFi‑Anbindung</p>
<p>Mit integrierter WiFi‑Option können Ein‑/Ausschalten des Kessels per Smartphone‑App aus der Ferne erfolgen.</p>
        `,
        features: [
          '2 Modelle: Digital und Manuell',
          'Tisea‑Umwälzpumpe',
          'Touchscreen mit Wochenprogrammierung oder Analogsystem',
          'Maximale Temperatur bis 90°C',
          'Geräuschpegel unter 55 dB',
          'Einfache Installation',
          'Leistungsbereich 6 kW – 27 kW'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Original‑Heizkessel',
          Brennstoff: 'Elektrisch',
          'Energieklasse (Heizung)': 'A',
          Garantie: '2 Jahre',
        },
      },
      'kalldaja-mp': {
        description: 'Hocheffizienter elektrischer Heizkessel für die Raumheizung.',
        longDescription: `
<p>Elektrischer Heizkessel von ECOTEK,</p>
<p>Mit modernem Design und bewährter Sicherheit ist er das meistverkaufte und bevorzugte Produkt für alle, die ein kostengünstiges und langlebiges Heizsystem suchen.</p>

<p>1. Wasserschutz</p>
<p>Schutz bei zu geringer oder zu hoher Wassermenge. Ein Drucksensor ändert den Betriebszustand des Kessels, wenn der Wasserdruck unter 1 bar fällt oder über 3 bar steigt.</p>

<p>2. Überspannungsschutz</p>
<p>In das elektrische System integrierte Sicherungen und Überspannungsschutz verhindern Schäden durch Unregelmäßigkeiten in der Stromversorgung.</p>

<p>3. Leiser Schütz</p>
<p>Neueste Modelle integrieren elektrische Schütze, die das Geräuschniveau des Kessels reduzieren – für einen ruhigeren und komfortableren Betrieb.</p>

<p>4. WiFi‑Anbindung</p>
<p>Mit integrierter WiFi‑Option können Ein‑/Ausschalten des Kessels per Smartphone‑App aus der Ferne erfolgen.</p>
        `,
        features: [
          '2 Modelle: Digital und Manuell',
          'Tisea‑Umwälzpumpe',
          'Touchscreen mit Wochenprogrammierung oder Analogsystem',
          'Maximale Temperatur bis 90°C',
          'Geräuschpegel unter 55 dB',
          'Einfache Installation',
          'Leistungsbereich 6 kW – 27 kW'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Original‑Heizkessel',
          Brennstoff: 'Elektrisch',
          'Energieklasse (Heizung)': 'A',
          Garantie: '2 Jahre',
        },
      },
      'akumulues': {
        description: 'Edelstahl‑Wasserspeicher für Zentralheizung und Solarsysteme.',
        longDescription: `
<p>Wasserspeicher für Zentralheizung – Für konstante Temperatur und maximale Effizienz. Investieren Sie in unseren Wasserspeicher für Zentralheizung und sorgen Sie das ganze Jahr über für eine warme und komfortable Umgebung. Mit Kapazitäten von 60 L, 100 L und 200 L sind unsere Speicher die ideale Lösung, um eine konstante Temperatur in Ihrem Heizsystem aufrechtzuerhalten – ob mit Heizkörpern, Fußbodenheizung oder Fancoils.</p>
        `,
        features: [
          'Kapazitäten 60 L, 100 L, 200 L',
          'Edelstahl – maximale Langlebigkeit',
          'Hochdichte PU‑Isolierung für Energieeffizienz',
          'Optional mit 1 oder 2 Wärmetauschern (Solar + Wärmepumpe)',
          'Integrierter Elektroheizer',
          'Magnesium‑Anodenschutz',
          '4 Jahre Garantie'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Wasserspeicher',
          'Innenmaterial': 'Edelstahl',
          Isolierung: 'Polyurethan (50 mm)',
          Garantie: '4 Jahre',
        },
      },
      'boiler-spiral': {
        description: 'Spiral‑Boiler für warmes Sanitärwasser mit hoher Qualität und maximaler Effizienz.',
        longDescription: `
<p>Spiral‑Boiler – Effizienz und Komfort für Warmwasser in Ihrem Zuhause.
Sorgen Sie für sauberes und kontinuierlich verfügbares Warmwasser mit unseren Spiral‑Boilern in verschiedenen Kapazitäten von 60 L, 100 L, 200 L und 300 L. Entwickelt für den Bedarf an warmem Sanitärwasser, eignen sich unsere Geräte für vielfältige Anwendungen im Haushalt und bieten hohen Komfort bei maximaler Effizienz.</p>
        `,
        features: [
          'Kapazität von 150 bis 300 Litern',
          'Edelstahl AISI 316L – maximale Langlebigkeit und Hygiene',
          'Hochdichte PU‑Isolierung – minimale Wärmeverluste',
          'Optionaler Elektroheizer für sofortige Erwärmung',
          'Magnesium‑Anodenschutz',
          '4 Jahre Garantie'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Spiral‑Boiler',
          'Innenmaterial': 'Edelstahl AISI 316L',
          Isolierung: 'Polyurethan (50 mm)',
          Garantie: '4 Jahre',
        },
      },
      'boiler-ecopump': {
        description: 'ECOPUMP‑Boiler für hocheffiziente Warmwasserbereitung.',
        longDescription: `
<p>ECOPUMP Boiler – Fortschrittliche Lösung für warmes Sanitärwasser</p>
<p>Entdecken Sie unseren fortschrittlichen Warmwasserboiler mit integrierter Wärmepumpe, verfügbar mit 200 L und 300 L Kapazität. Im Vergleich zu klassischen Elektro‑Boilern reduziert der Wärmepumpen‑Boiler den Energieverbrauch um bis zu das Vierfache und bietet damit herausragende Effizienz und deutliche Kosteneinsparungen. Durch die Nutzung der Eigenschaften des Kältemittels wird die Wassertemperatur effizient erhöht – eine leise, komfortable und wirtschaftliche Lösung für Ihr Zuhause.</p>
        `,
        features: [
          'Heizung mit Wärmepumpe, Kältemittel R290/R134a',
          '600 Watt/h Verbrauch',
          'Kapazitäten 200 L – 300 L',
          'Digitales Display mit Programmierung',
          'Hochdichte PU‑Isolierung für Energieeffizienz',
          'Integrierter Elektroheizer',
          '4 Jahre Garantie'
        ],
        details: {
          Hersteller: 'ECOTEK',
          Typ: 'Warmwasserspeicher',
          'Innenmaterial': 'Emaillierter Stahl / Edelstahl',
          Isolierung: 'Polyurethan (50–60 mm)',
          Garantie: '4 Jahre',
        },
      },
      'kondicioner-aria': {
        description: 'Split‑Klimaanlage mit hoher Effizienz und Wi‑Fi‑Steuerung.',
        longDescription: `
<p>Entdecken Sie die fortschrittliche Klimaanlage Candy Aria – ein herausragendes Produkt der bekannten italienischen Marke Candy. Diese smarte Klimaanlage ist für maximalen Komfort im Sommer wie im Winter konzipiert. Mit moderner Technologie und zahlreichen intelligenten Funktionen ist Aria die ideale Lösung für jedes Zuhause oder Büro.</p>
        `,
        features: [
          'Hersteller: Candy',
          'Energieeffizienzklasse A+++ (Kühlen) / A+++ (Heizen)',
          'Integrierte Wi‑Fi‑Steuerung über die hOn‑App',
          'Modernes und elegantes Design',
          'Leiser Betrieb',
          'Kapazitäten: 12.000 BTU, 18.000 BTU',
          'SteriClean‑Technologie 56°C'
        ],
        details: { Hersteller: 'Candy', Typ: 'Wand‑Split', Garantie: '2 Jahre (Beispiel)' },
      },
      'kondicioner-pura': {
        description: 'Split‑Klimaanlage mit breiter Leistungsspanne und Wi‑Fi‑Steuerung.',
        longDescription: `
<p>Entdecken Sie die neue Candy Pura Klimaanlage – ein innovatives Produkt der renommierten italienischen Marke Candy, entwickelt, um frische und saubere Luft in Ihr Zuhause zu bringen. Mit modernem Design und fortschrittlichen Funktionen bietet Pura das ganze Jahr über hervorragende Leistung und maximalen Komfort.</p>
        `,
        features: [
          'Hersteller: Candy',
          'Energieeffizienzklasse A+++ (Kühlen) / A++ (Heizen)',
          'Integrierte Wi‑Fi‑Steuerung über die hOn‑App',
          'Modernes und elegantes Design',
          'Leiser Betrieb',
          'Kapazitäten: 9.000, 12.000, 18.000, 24.000 BTU',
          'SteriClean‑Technologie 56°C'
        ],
        details: { Hersteller: 'Candy', Typ: 'Wand‑Split', Garantie: '4 Jahre' },
      },
    },
    hero: {
      slide1: {
        title: "Boiler R290",
        description: "Fortschrittlicher ECOPUMP R290 Boiler mit hoher Effizienz.",
        button: "Lösungen entdecken",
      },
      slide2: {
        title: "Klimaanlage Candy A+++",
        description: "Candy A+++ Klimaanlage, perfekt für den Sommer.",
        button: "Produkte ansehen",
      },
      slide3: {
        title: "Heizkessel ECO TEK",
        description: "ECO TEK Heizkessel mit hoher Effizienz.",
        button: "Produkte ansehen",
      },
      slide4: {
        title: "Wärmepumpe ECO TEK R290",
        description: "Reine Leistung, extreme Einsparung!",
        button: "Lösungen entdecken",
      },
      slide5: {
        title: "Professionelle Installationsdienste",
        description: "Unser qualifiziertes Team sorgt für perfekte Installation und Wartung",
        button: "Jetzt kontaktieren",
      },
    },
    nav: {
      cat: {
        'ngrohje-qendrore': {
          title: 'Zentralheizung',
          sub: {
            'pompa-termike': {
              title: 'Wärmepumpen',
              description: 'Wärmepumpen zum Heizen und Kühlen Ihres Zuhauses',
            },
            'kalldaja-elektrike': {
              title: 'Elektrische Kessel',
              description: 'Saubere und einfache Heizung.',
            },
            'radiator': {
              title: 'Heizkörper',
              description: 'Kontinuierliche Heizung.',
            },
            'fancoiler': {
              title: 'Gebläsekonvektoren',
              description: 'Schnelles Heizen und Kühlen.',
            },
            'akumulues': {
              title: 'ECOTEK Speicher',
              description: 'Wassertank.',
            },
          },
        },
        'klimatizim-ventilim': {
          title: 'Klimatisierung & Lüftung',
          sub: {
            'kondicioner': {
              title: 'Klimaanlage',
              description: 'Optimale Frische für Ihre Räume.',
            },
            'fancoiler': {
              title: 'Gebläsekonvektoren',
              description: 'Schnelles Kühlen und Heizen.',
            },
            'pompa-termike': {
              title: 'Wärmepumpen',
              description: 'Integrierte Kühllösung.',
            },
          },
        },
        'sanitari': {
          title: 'Sanitär',
        },
      },
    },
    productPage: {
      notFound: {
        title: 'Produkt nicht gefunden – EcoTek',
        description: 'Leider konnte das von Ihnen angeforderte Produkt bei EcoTek nicht gefunden werden.',
      },
      relatedTitle: 'Ähnliche Produkte',
      noImage: 'Kein Bild',
    },
    home: {
      categories: {
        sectionTitle: 'Unsere Kategorien',
        sectionSubtitle: 'Spezialisierte Lösungen für jeden Bedarf in Ihrem Zuhause oder Unternehmen',
        learnMore: 'Mehr Erfahren',
        cards: {
          'ngrohje-qendrore': {
            title: 'Zentralheizung',
            description: 'Kompetenz und Effizienz im Energiemanagement.',
          },
          'klimatizim-ventilim': {
            title: 'Klimatisierung/Lüftung',
            description: 'Experten für Frische und Komfort in Ihrem Zuhause.',
          },
          sanitari: {
            title: 'Sanitär',
            description: 'Sanitäre und hygienische Lösungen für Ihr Zuhause.',
          },
          'instalim-servisim': {
            title: 'Installation/Service',
            description: 'Professionalität und Sicherheit für Ihre Umgebung.',
          },
        },
      },
      products: {
        sectionTitle: 'Unsere Produkte',
        sectionSubtitle: 'Fortgeschrittene Lösungen für Ihre Bedürfnisse',
        viewAll: 'Alle ansehen',
        viewDetails: 'Details ansehen',
        viewProduct: 'Produkt ansehen',
        qualityIsSaving: 'Qualität ist Einsparung',
        cat: {
          'ngrohje-qendrore': 'Zentralheizung',
          klimatizim: 'Klimatisierung',
          solar: 'Solar',
          ventilim: 'Lüftung',
        },
        featured: {
          heatpump: {
            title: 'Wärmepumpe Serene Climate – Die vollständigste Lösung für Ihr Zuhause',
            description: 'Die Serene Climate Wärmepumpe bietet fortschrittliches Heizen und Kühlen mit maximaler Effizienz. Mit der Energieeffizienzklasse A+++ bewertet, enthält das Gerät alle erforderlichen Komponenten in der Einheit – keine zusätzlichen Installationen oder externen Module erforderlich. Mit stabilem Betrieb auch bei extremen Temperaturen und integrierter WLAN-Steuerung ist Serene Climate die ideale Lösung für Komfort und langfristige Einsparungen.',
          },
          klima: {
            title: 'Klimagerät Pura – Italienische Leistung für jedes Zuhause',
            description: 'Das Modell Pura der bekannten italienischen Marke Candy ist die wirtschaftlichste Wahl für Ihre Umgebung. Mit hoher Energieeffizienz A+++/A++, leisem Betrieb und niedrigem Verbrauch bietet dieses Klimagerät täglichen Komfort zu vernünftigen Kosten.',
          },
          boiler: {
            title: 'EcoPump Boiler – Fortschrittliche Effizienz für die Warmwasserbereitung in jedem Zuhause',
            description: 'Der EcoPump Boiler von ECOTEK ist die wirtschaftlichste und modernste Lösung für die Warmwasserbereitung im Haushalt. Ausgestattet mit einem integrierten Wärmepumpensystem liefert er warmes Wasser mit deutlich geringerem Energieverbrauch im Vergleich zu klassischen Boilern mit elektrischem Heizelement – bis zu 5-mal weniger Verbrauch.',
          },
        },
      },
      video: {
        title: 'Genießen Sie maximale Frische und Komfort in Ihrem Zuhause mit CANDY Klimageräten. Die ideale Lösung für einen stressfreien Sommer.',
        cta: 'Kontaktieren Sie uns für eine Beratung',
      },
      blog: {
        sectionTitle: 'Artikel und Informationen',
        viewAll: 'Alle Artikel ansehen',
        readMore: 'Mehr lesen',
      },
    },
    contact: {
      title: 'Kontaktieren Sie uns',
      description: 'Wir sind hier, um Ihnen bei Fragen und Anliegen zu helfen. Zögern Sie nicht, uns zu kontaktieren.',
      form: {
        sendMessageTitle: 'Nachricht senden',
        nameLabel: 'Vollständiger Name',
        namePlaceholder: 'Ihr vollständiger Name',
        emailLabel: 'E-Mail',
        emailPlaceholder: 'ihre@email.com',
        phoneLabel: 'Telefonnummer',
        phonePlaceholder: '+383 44 123 456',
        messageLabel: 'Nachricht',
        messagePlaceholder: 'Schreiben Sie hier Ihre Nachricht...',
        submit: 'Nachricht senden',
        sending: 'Wird gesendet...',
        successTitle: 'Danke für Ihre Nachricht!',
        successBody: 'Ihre Nachricht wurde erfolgreich gesendet. Wir werden Sie in Kürze kontaktieren.',
        successAnother: 'Eine weitere Nachricht senden',
        errorAlert: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      },
      info: {
        title: 'Kontaktinformationen',
        addressLabel: 'Adresse',
        addressValue: 'Dah Polloshka 14, Gjakovë 50000, Kosovo',
        phoneLabel: 'Telefon',
        phoneValue: '+383 44 914 480',
        emailLabel: 'E-Mail',
        emailValue: 'info@ecotek-ks.com',
        hoursLabel: 'Arbeitszeiten',
        weekday: 'Montag - Freitag: 09:00 - 17:00',
        saturday: 'Samstag: 09:00 - 13:00',
      },
      cta: 'Kontaktieren Sie uns',
    },
    footer: {
      about:
        'EcoTek bietet innovative Lösungen für Zentralheizung, Klimatisierung, Lüftung und Solarsysteme für Zuhause und Unternehmen.',
      quickLinksTitle: 'Schnellzugriffe',
      links: {
        about: 'Über uns',
        contact: 'Kontakt',
        blog: 'Blog',
      },
      contactTitle: 'Kontakt',
      newsletter: {
        title: 'Newsletter abonnieren',
        desc: 'Erhalten Sie Updates zu unseren neuesten Produkten und Dienstleistungen.',
        placeholder: 'Ihre E-Mail',
        subscribe: 'Abonnieren',
      },
      rightsPrefix: '©',
      rightsSuffix: 'Alle Rechte vorbehalten.',
    },
    categories: {
      home: 'Startseite',
      all: 'Alle',
      hero: {
        'ngrohje-qendrore': {
          title: 'Zentralheizung',
          description: 'Effiziente und nachhaltige Systeme für die Zentralheizung in Ihrem Zuhause und Unternehmen.',
        },
        'klimatizim-ventilim': {
          title: 'Klimatisierung & Lüftung',
          description: 'Optimaler Komfort das ganze Jahr über mit unseren Klima- und Lüftungssystemen.',
        },
        sanitari: {
          title: 'Sanitär',
          description: 'Sanitäre und hygienische Lösungen für Ihr Zuhause',
        },
      },
      empty: {
        title: 'Keine Produkte',
        desc: 'Leider gibt es keine Produkte, die dieser Unterkategorie entsprechen.',
      },
    },
    blog: {
      posts: {
        '01': { title: 'So aktivieren Sie die WLAN-Verbindung Ihres CANDY Klimageräts', subtitle: 'Verwendung der hOn App' },
        '02': { title: '5 Gründe, warum Ihr Klimagerät riecht', subtitle: 'Ursachen und Lösungen' },
        '03': { title: 'Wie können Wärmepumpen über 100% effizient sein?', subtitle: 'Technologie der Wärmepumpe' },
        '04': { title: 'Wie wählt man eine Wärmepumpe aus?', subtitle: 'Worauf vor dem Kauf zu achten ist' },
        '05': { title: 'Wie wählen Sie die richtige Kapazität für ein CANDY Split-Klimagerät?', subtitle: 'Faktoren für die richtige Auswahl' },
        '06': { title: 'Was bedeutet der Begriff "BTU" wirklich?', subtitle: 'Umfassender Leitfaden: So wählen Sie das richtige Klimagerät' },
        '07': { title: 'Warum ist die professionelle Installation wichtiger als die Marke?', subtitle: 'Versteckte Kosten durch nicht fachgerechte Installation' },
        '08': { title: 'So funktioniert ein Wärmepumpensystem für Heizung und Warmwasser', subtitle: 'Wie ein Dreiwegeventil die Doppelnutzung ermöglicht' },
        '09': { title: 'Der wahre Vorteil von Smart AC – volle Kontrolle von überall', subtitle: 'Im Ausland? Steuern Sie das Klima zu Hause – dank Wi‑Fi' },
        '10': { title: 'Monoblock vs. Split-Wärmepumpen: Was ist der Unterschied?', subtitle: 'Welches System ist besser für Ihr Zuhause?' },
        '11': { title: 'Wie reinigen Klimageräte die Luft?', subtitle: 'Haben alle Klimaanlagen Luftreiniger?' },
        '12': { title: 'Unterschied zwischen R32 und R410A: Ein umfassender Vergleich', subtitle: 'Effizienz und Leistung' },
        '13': { title: 'Warum produzieren Klimageräte Wasser? Ausführliche Erklärung', subtitle: 'Warum Wasserproduktion ein Zeichen für Effizienz ist' },
        '14': { title: 'Was sind horizontale Boden-Fancoils und wie funktionieren sie?', subtitle: 'Mehr über verschiedene Heizgeräte-Modelle' },
        '15': { title: 'Wie verhindert Dämmung den Wärmetransfer?', subtitle: 'Schutz für Ihr Zuhause' },
      },
    },
  },
  en: {
    header: {
      produkte: "Products",
      kompania: "Company",
      blog: "Blog",
      kontakto: "Contact",
      blog_desc: "Read our latest articles and tips.",
      kontakto_desc: "Contact us for any questions or requests.",
    },
    products: {
      'pompa-nxehtesie-vanguard': {
        description: 'High‑efficiency air‑to‑water heat pump for heating and domestic hot water.',
        longDescription: `
          <p>EcoTek “Vanguard Comfort” Heat Pump</p>
          <p>The EcoTek Vanguard Comfort heat pumps with R32 compressor deliver hot water, heating and cooling with high efficiency. Features include ERP A++ rating, low noise (55 dB), R32 refrigerant, smart control and intelligent defrost. Operates down to −25°C (EVI) and supports remote control via app.</p>
        `,
        features: [
          'Energy Efficiency Class A++, Heating and Cooling',
          'R32 Refrigerant – more eco‑friendly and efficient',
          'Inverter Technology – energy saving and quiet operation',
          'Water temperature up to 55°C',
          'Available in 12kW, 18kW, 24kW, 32kW',
          'Advanced digital control',
          'Certifications: ISO9001, CE, erP Energy Label, ROHS',
        ],
      },
      'pompa-nxehtesie-serene': {
        description: 'A+++ air‑to‑water heat pump with inverter technology and R32 refrigerant.',
        longDescription: `
<p>The Serene Climate R32 heat pump features modern design and A+++ efficiency. Using eco‑friendly R32 and inverter technology, it delivers water up to 55°C with low energy consumption and high performance.</p>
        `,
        features: [
          'Energy Efficiency Class A+++, Heating and Cooling',
          'Eco‑friendly R32 refrigerant',
          'Inverter technology for energy savings',
          'Maximum water temperature 55°C',
          'Integrated circulation pump',
          'Integrated expansion vessel',
          'Integrated safety valves',
          'Quiet operation',
          'Smart control',
        ],
        details: {
          Manufacturer: 'ECOTEK (Example)',
          Type: 'Air‑to‑Water Heat Pump',
          Technology: 'Inverter',
          Refrigerant: 'R32',
          'Energy Class': 'A+++',
          Warranty: '4 years',
        },
      },
      'pompa-nxehtesie-sinceko': {
        description: 'A+++ water‑to‑water geothermal heat pump with R410a—an economical solution for heating/cooling and domestic hot water.',
        longDescription: `
<p>Sinceko is a water‑to‑water geothermal heat pump that provides heating, cooling, and domestic hot water with very high efficiency. Its intelligent controller supports a heating curve for maximum comfort and an ECO mode with three operating modes to reduce energy consumption.</p>
        `,
        features: [
          'Energy Efficiency Class A+++',
          'Eco‑friendly R410a refrigerant',
          'Inverter technology for efficient operation',
          'Maximum water temperature 55°C',
          'Reliable and economical operation',
          'Simple and intuitive controller'
        ],
        details: {
          Manufacturer: 'Sinceko (Example)',
          Type: 'Water‑to‑Water Heat Pump (Split)',
          Technology: 'Inverter',
          Refrigerant: 'R410a',
          'Energy Class': 'A+++',
          Warranty: '4 years',
        },
      },
      'pompa-nxehtesie-apex': {
        description: 'A+++ air‑to‑water heat pump with natural R290 refrigerant and high outlet water temperature (75°C).',
        longDescription: `
        <p>Apex Heating represents the pinnacle of heat pump technology, using natural R290 (Propane) for minimal environmental impact and outstanding A+++ efficiency.</p>
        
        <p>A key feature is its ability to deliver water temperatures up to 75°C, making it suitable for replacing old boilers in systems with traditional radiators without modifying the existing system.</p>

        <p>It includes integrated hydraulic components for easy installation and offers reliable operation even at low ambient temperatures.</p>
        `,
        features: [
          'Top Energy Efficiency Class A+++',
          'Natural R290 refrigerant with very low GWP (Global Warming Potential)',
          'Inverter technology for power modulation and maximum savings',
          'High outlet water temperature up to 75°C, ideal for existing radiators',
          'Integrated high‑efficiency circulation pump',
          'Integrated expansion vessel',
          'Integrated safety valves and hydraulic components',
          'Very quiet operation',
          'Smart control with WiFi option',
          'Capacities: 6kW to 18kW'
        ],
        details: {
          Manufacturer: 'ECOTEK (Example)',
          Type: 'Air‑to‑Water Heat Pump (High Temp)',
          Technology: 'Inverter',
          Refrigerant: 'R290 (Propane)',
          'Energy Class': 'A+++',
          Warranty: '4 years',
        },
      },
      'pompa-nxehtesie-maxi': {
        description: 'A++ air‑to‑water heat pump with R410a, ideal for commercial or business spaces.',
        longDescription: `
<p>The EcoTek Maxi commercial heating and cooling series uses R410a refrigerant, delivering multiple advantages. R410a is ozone‑friendly with no ozone depletion potential. It offers improved thermodynamic properties for high energy efficiency and reduced operating costs. Its excellent heat transfer enables optimal heating and cooling performance, and higher operating pressures allow more compact system designs.</p>
        `,
        features: [
          'Energy Efficiency Class A++',
          'Eco‑friendly R410a refrigerant',
          'DC inverter technology for continuous modulation',
          'Maximum water temperature 55°C',
          'Quiet operation of the outdoor unit',
          'Smart control with LCD display and optional WiFi',
          'Anti‑freeze protection',
          'Capacities: 50kW, 100kW, 200kW, 400kW'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Air‑to‑Water Heat Pump',
          Technology: 'DC Inverter',
          Refrigerant: 'R410a',
          'Energy Class': 'A++',
          Warranty: '4 years',
        },
      },
      'kalldaja-og': {
        description: 'High‑efficiency electric boiler for space heating.',
        longDescription: `
<p>Electric Boiler by ECOTEK,</p>
<p>With modern design and proven safety, it is our best‑selling and most preferred product for customers seeking a cost‑effective and long‑lasting heating system.</p>

<p>1. Water Protection</p>
<p>Protection against too little or too much water. A pressure sensor changes the boiler’s operating state if water pressure falls below 1 bar or rises above 3 bar.</p>

<p>2. Over‑current/Surge Protection</p>
<p>Built‑in fuses and surge protection in the boiler’s electrical system help prevent damage from electrical supply irregularities.</p>

<p>3. Silent Contactor</p>
<p>Latest models integrate electric contactors that reduce the noise level emitted by the boiler for a quieter, home‑friendly operation.</p>

<p>4. WiFi Connectivity</p>
<p>With integrated WiFi option, the boiler can be turned on/off remotely via a smartphone app.</p>
        `,
        features: [
          '2 Models: Digital and Manual',
          'Tisea circulation pump',
          'Touchscreen with weekly programming or analog system',
          'Maximum temperature up to 90°C',
          'Noise level under 55 dB',
          'Easy installation',
          'Capacity from 6 kW – 27 kW'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Original Boiler',
          Fuel: 'Electric',
          'Energy Class (Heating)': 'A',
          Warranty: '2 years',
        },
      },
      radiator: {
        description: 'Steel panel radiator with high efficiency for fast, even heat distribution.',
        longDescription: `
<p>Steel panel radiators are the classic and efficient solution for central heating systems. They deliver quick and uniform heat distribution throughout the space.</p>
        `,
        features: [
          'Fast, even heating thanks to panel design',
          'High‑quality materials – Corrosion‑resistant steel',
          'High energy efficiency – Optimal heat transfer',
          'Modern, elegant design – Suits any interior',
          'Wide range of sizes and types (Type 11, 21, 22, 33)',
          'Easy installation'
        ],
        details: {
          Manufacturer: 'ECOTEK/Partner (Example)',
          Material: 'Steel',
          Coating: 'Powder coating RAL 9016 (Example)',
          'Max pressure': '10 bar (Example)',
          'Max temperature': '110°C (Example)',
          Warranty: '10 years (Example)',
        },
      },
      'radiator-gypor': {
        description: 'Aluminum tubular radiator with elegant design and excellent heat transfer.',
        longDescription: `
<p>The tubular radiator is the most popular model for bathrooms, combining elegant design with high heat distribution efficiency. The tube structure allows space heating and towel drying simultaneously. Built from moisture‑resistant materials, it fits easily into any space and can operate with central heating or as an electric unit.</p>
        `,
        features: [
          'Fast, even heating thanks to steel build',
          'High‑quality materials – Durable steel',
          'High energy efficiency – Excellent thermal transfer',
          'Modern, elegant design – Fits contemporary interiors',
          'Modular – Configurable to your needs'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Material: 'Steel',
          Coating: 'Powder coating RAL 9016',
          'Max pressure': '6 bar',
          'Max temperature': '110°C',
          Warranty: '4 years',
        },
      },
      fancoiler: {
        description: 'Wall‑mounted fancoil with modern design for efficient, quiet heating and cooling.',
        longDescription: `
<p>ECOTEK wall‑mounted fancoils provide an elegant, efficient solution for conditioning residential and commercial spaces. They can be used for heating (with heat pumps or boilers) and for cooling.</p>

<p>The modern design and quiet operation suit any environment. Advanced control allows precise temperature and comfort adjustments.</p>
        `,
        features: [
          'Energy‑efficient for heating and cooling',
          'High‑quality materials and modern design',
          'Quiet operation thanks to tangential fan',
          'Precise temperature and fan‑speed control',
          'Capacity from 1.5 kW to 5.65 kW',
          'IR remote control (optional)',
          'Easy wall installation'
        ],
        details: {
          Manufacturer: 'ECOTEK (Example)',
          Type: 'Wall Fancoil',
          Function: 'Heating / Cooling',
          Control: 'Integrated control panel / Remote (optional)',
          Warranty: '2 years (Example)',
        },
      },
      'fancoiler-kasetor': {
        description: 'Ceiling cassette fancoil, ideal for uniform 4‑way air distribution.',
        longDescription: `
<p>Ceiling cassette fancoils are a discreet, efficient solution for conditioning offices, shops, and other commercial or residential spaces with suspended ceilings. The ceiling installation and 4‑way air discharge ensure a uniform and comfortable environment.</p>
<p>With multiple capacity options and quiet operation, ECOTEK cassette fancoils integrate seamlessly into any interior while delivering high performance.</p>
        `,
        features: [
          'Energy‑efficient in heating and cooling',
          'High‑quality materials',
          'Quiet operation',
          'Precise temperature control',
          'Capacities from 3 kW to 12 kW',
          '4‑way air distribution for maximum comfort',
          'Integrated condensate pump (in most models)',
          'Aesthetic decorative panel'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Cassette Fancoil',
          Function: 'Heating / Cooling',
          Mounting: 'In suspended ceiling',
          Warranty: '2 years',
        },
      },
      'kalldaja-jp': {
        description: 'High‑efficiency electric boiler for space heating.',
        longDescription: `
<p>Electric Boiler by ECOTEK,</p>
<p>With modern design and proven safety, it is our best‑selling and most preferred product for customers seeking a cost‑effective and long‑lasting heating system.</p>

<p>1. Water Protection</p>
<p>Protection against too little or too much water. A pressure sensor changes the boiler’s operating state if water pressure falls below 1 bar or rises above 3 bar.</p>

<p>2. Over‑current/Surge Protection</p>
<p>Built‑in fuses and surge protection in the boiler’s electrical system help prevent damage from electrical supply irregularities.</p>

<p>3. Silent Contactor</p>
<p>Latest models integrate electric contactors that reduce the noise level emitted by the boiler for a quieter, home‑friendly operation.</p>

<p>4. WiFi Connectivity</p>
<p>With integrated WiFi option, the boiler can be turned on/off remotely via a smartphone app.</p>
        `,
        features: [
          '2 Models: Digital and Manual',
          'Tisea circulation pump',
          'Touchscreen with weekly programming or analog system',
          'Maximum temperature up to 90°C',
          'Noise level under 55 dB',
          'Easy installation',
          'Capacity from 6 kW – 27 kW'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Original Boiler',
          Fuel: 'Electric',
          'Energy Class (Heating)': 'A',
          Warranty: '2 years',
        },
      },
      'kalldaja-mp': {
        description: 'High‑efficiency electric boiler for space heating.',
        longDescription: `
<p>Electric Boiler by ECOTEK,</p>
<p>With modern design and proven safety, it is our best‑selling and most preferred product for customers seeking a cost‑effective and long‑lasting heating system.</p>

<p>1. Water Protection</p>
<p>Protection against too little or too much water. A pressure sensor changes the boiler’s operating state if water pressure falls below 1 bar or rises above 3 bar.</p>

<p>2. Over‑current/Surge Protection</p>
<p>Built‑in fuses and surge protection in the boiler’s electrical system help prevent damage from electrical supply irregularities.</p>

<p>3. Silent Contactor</p>
<p>Latest models integrate electric contactors that reduce the noise level emitted by the boiler for a quieter, home‑friendly operation.</p>

<p>4. WiFi Connectivity</p>
<p>With integrated WiFi option, the boiler can be turned on/off remotely via a smartphone app.</p>
        `,
        features: [
          '2 Models: Digital and Manual',
          'Tisea circulation pump',
          'Touchscreen with weekly programming or analog system',
          'Maximum temperature up to 90°C',
          'Noise level under 55 dB',
          'Easy installation',
          'Capacity from 6 kW – 27 kW'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Original Boiler',
          Fuel: 'Electric',
          'Energy Class (Heating)': 'A',
          Warranty: '2 years',
        },
      },
      'akumulues': {
        description: 'Stainless steel water accumulator for central heating and solar systems.',
        longDescription: `
<p>Domestic Hot Water Accumulator – For constant temperature and maximum efficiency. Invest in our central heating water accumulator and ensure a warm, comfortable environment year‑round. With capacities of 60 L, 100 L, and 200 L, our tanks are the ideal solution for maintaining a constant temperature in your heating system—whether radiators, underfloor heating, or fancoils.</p>
        `,
        features: [
          'Capacities 60 L, 100 L, 200 L',
          'Stainless steel – maximum durability',
          'High‑density PU insulation for energy efficiency',
          'Option with 1 or 2 coils (solar + heat pump)',
          'Integrated electric heater',
          'Magnesium anode protection',
          '4‑year warranty'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Water Accumulator',
          'Inner Material': 'Stainless steel',
          Insulation: 'Polyurethane (50 mm)',
          Warranty: '4 years',
        },
      },
      'boiler-spiral': {
        description: 'Spiral boiler for domestic hot water with high quality and maximum efficiency.',
        longDescription: `
<p>Spiral Boiler – Efficiency and comfort for hot water in your home.
Ensure clean, continuous hot water with our spiral boilers available in capacities of 60 L, 100 L, 200 L, and 300 L. Designed to meet your domestic hot water needs, our electric‑heater ready units suit various household uses while delivering high efficiency and comfort.</p>
        `,
        features: [
          'Capacity from 150 to 300 liters',
          'AISI 316L stainless steel – maximum durability and hygiene',
          'High‑density polyurethane insulation – minimal heat loss',
          'Optional electric heater for instant heating',
          'Magnesium anode protection',
          '4‑year warranty'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Spiral boiler',
          'Inner Material': 'Stainless steel AISI 316L',
          Insulation: 'Polyurethane (50 mm)',
          Warranty: '4 years',
        },
      },
      'boiler-ecopump': {
        description: 'ECOPUMP boiler for efficient domestic hot water.',
        longDescription: `
<p>ECOPUMP Boiler – Advanced solution for domestic hot water</p>
<p>Discover our advanced hot water boiler with an integrated heat pump, available in 200 L and 300 L capacities. Compared to classic electric‑resistance boilers, the heat‑pump boiler reduces energy consumption by up to 4×, delivering outstanding efficiency and significant savings. By leveraging refrigerant properties to raise the water temperature, it ensures efficient, quiet, and economical operation for your home.</p>
        `,
        features: [
          'Heating with heat pump, refrigerant R290/R134a',
          '600 Watt/h consumption',
          'Capacities 200 L – 300 L',
          'Digital display with programming',
          'High‑density PU insulation for energy efficiency',
          'Integrated electric heater',
          '4‑year warranty'
        ],
        details: {
          Manufacturer: 'ECOTEK',
          Type: 'Domestic hot water tank',
          'Inner Material': 'Enameled steel / Stainless steel',
          Insulation: 'Polyurethane (50–60 mm)',
          Warranty: '4 years',
        },
      },
      'kondicioner-aria': {
        description: 'High‑efficiency split AC with Wi‑Fi control.',
        longDescription: `
<p>Discover the advanced Candy Aria air conditioner from the renowned Italian brand Candy. This smart, compressor‑driven AC is designed to deliver maximum comfort in both summer and winter. With modern technology and a host of smart features, Aria is the ideal choice for any home or office.</p>
        `,
        features: [
          'Manufacturer: Candy',
          'Energy class A+++ (Cooling) / A+++ (Heating)',
          'Integrated Wi‑Fi control via hOn app',
          'Modern and elegant design',
          'Quiet operation',
          'Capacities: 12,000 BTU, 18,000 BTU',
          'SteriClean 56°C technology'
        ],
        details: { Manufacturer: 'Candy', Type: 'Wall Split', Warranty: '2 years (Example)' },
      },
      'kondicioner-pura': {
        description: 'Split AC with a wide capacity range and Wi‑Fi control.',
        longDescription: `
<p>Discover the new Candy Pura air conditioner – an innovative product from the renowned Italian brand Candy, designed to bring a breath of fresh air to your home. With modern styling and advanced features, Pura delivers excellent performance and maximum comfort all year round.</p>
        `,
        features: [
          'Manufacturer: Candy',
          'Energy efficiency A+++ (Cooling) / A++ (Heating)',
          'Integrated Wi‑Fi control via hOn app',
          'Modern and elegant design',
          'Quiet operation',
          'Capacities: 9,000 BTU, 12,000 BTU, 18,000 BTU, 24,000 BTU',
          'SteriClean 56°C technology'
        ],
        details: { Manufacturer: 'Candy', Type: 'Wall Split', Warranty: '4 years' },
      },
    },
    hero: {
      slide1: {
        title: "Boiler R290",
        description: "Advanced ECOPUMP R290 boiler with high efficiency.",
        button: "Explore Solutions",
      },
      slide2: {
        title: "Candy A+++ Air Conditioner",
        description: "Candy A+++ AC, perfect for summer.",
        button: "View Products",
      },
      slide3: {
        title: "ECO TEK Boiler",
        description: "ECO TEK boiler with high efficiency.",
        button: "View Products",
      },
      slide4: {
        title: "ECO TEK R290 Heat Pump",
        description: "Pure Power, Extreme Savings!",
        button: "Explore Solutions",
      },
      slide5: {
        title: "Professional Installation Services",
        description: "Our qualified team ensures perfect installation and maintenance",
        button: "Contact Now",
      },
    },
    nav: {
      cat: {
        'ngrohje-qendrore': {
          title: 'Central Heating',
          sub: {
            'pompa-termike': {
              title: 'Heat Pumps',
              description: 'Heat pumps for heating and cooling your home',
            },
            'kalldaja-elektrike': {
              title: 'Electric Boilers',
              description: 'Clean and simple heating.',
            },
            'radiator': {
              title: 'Radiators',
              description: 'Continuous heating.',
            },
            'fancoiler': {
              title: 'Fancoils',
              description: 'Fast heating and cooling.',
            },
            'akumulues': {
              title: 'ECOTEK Accumulator',
              description: 'Water tank.',
            },
          },
        },
        'klimatizim-ventilim': {
          title: 'Air Conditioning & Ventilation',
          sub: {
            'kondicioner': {
              title: 'Air Conditioner',
              description: 'Optimal freshness for your space.',
            },
            'fancoiler': {
              title: 'Fancoils',
              description: 'Fast cooling and heating.',
            },
            'pompa-termike': {
              title: 'Heat Pumps',
              description: 'Integrated cooling solution.',
            },
          },
        },
        'sanitari': {
          title: 'Sanitary',
        },
      },
    },
    productPage: {
      notFound: {
        title: 'Product Not Found - EcoTek',
        description: 'Sorry, the product you requested could not be found on EcoTek.',
      },
      relatedTitle: 'Related Products',
      noImage: 'No image',
    },
    home: {
      categories: {
        sectionTitle: 'Our Categories',
        sectionSubtitle: 'Specialized solutions for every need of your home and business',
        learnMore: 'Learn More',
        cards: {
          'ngrohje-qendrore': {
            title: 'Central Heating',
            description: 'Competence and efficiency in energy management.',
          },
          'klimatizim-ventilim': {
            title: 'Air Conditioning/Ventilation',
            description: 'Experts in freshness and comfort for your home.',
          },
          sanitari: {
            title: 'Sanitary',
            description: 'Sanitary and hygienic solutions for your home.',
          },
          'instalim-servisim': {
            title: 'Installation/Service',
            description: 'Professionalism and safety for your environment.',
          },
        },
      },
      products: {
        sectionTitle: 'Our Products',
        sectionSubtitle: 'Advanced solutions for your needs',
        viewAll: 'View all',
        viewDetails: 'View Details',
        viewProduct: 'View Product',
        qualityIsSaving: 'Quality is saving',
        cat: {
          'ngrohje-qendrore': 'Central Heating',
          klimatizim: 'Air Conditioning',
          solar: 'Solar',
          ventilim: 'Ventilation',
        },
        featured: {
          heatpump: {
            title: 'Serene Climate Heat Pump – The most complete choice for your home',
            description: 'The Serene Climate heat pump provides advanced heating and cooling with maximum efficiency. Rated A+++ energy class, this unit includes all necessary components within the unit—eliminating the need for extra installations or external modules. With stable operation even in extreme temperatures and integrated WiFi control, Serene Climate is the ideal solution for comfort and long-term savings.',
          },
          klima: {
            title: 'Pura Air Conditioner – Italian performance for every home',
            description: 'The Pura model from the well-known Italian brand Candy is the most economical choice for your environment. With high energy efficiency A+++/A++, quiet operation, and low consumption, this air conditioner ensures everyday comfort at a reasonable cost.',
          },
          boiler: {
            title: 'EcoPump Boiler – Advanced efficiency for hot water in every home',
            description: 'The EcoPump boiler by ECOTEK is the most economical and modern solution for domestic hot water. Equipped with an integrated heat pump system, it delivers hot water with much lower energy consumption compared to classic electric-resistance boilers—up to 5 times less.',
          },
        },
      },
      video: {
        title: 'Enjoy maximum freshness and comfort at home with CANDY air conditioners. The ideal solution for a stress-free summer.',
        cta: 'Contact us for a consultation',
      },
      blog: {
        sectionTitle: 'Articles and Information',
        viewAll: 'View all articles',
        readMore: 'Read more',
      },
    },
    contact: {
      title: 'Contact Us',
      description: 'We are here to help with any questions or requests. Do not hesitate to contact us.',
      form: {
        sendMessageTitle: 'Send a Message',
        nameLabel: 'Full Name',
        namePlaceholder: 'Your full name',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        phoneLabel: 'Phone Number',
        phonePlaceholder: '+383 44 123 456',
        messageLabel: 'Message',
        messagePlaceholder: 'Write your message here...',
        submit: 'Send Message',
        sending: 'Sending...',
        successTitle: 'Thank you for your message!',
        successBody: 'Your message has been sent successfully. We will contact you shortly.',
        successAnother: 'Send another message',
        errorAlert: 'An error occurred. Please try again.',
      },
      info: {
        title: 'Contact Information',
        addressLabel: 'Address',
        addressValue: 'Dah Polloshka 14, Gjakovë 50000, Kosovo',
        phoneLabel: 'Phone',
        phoneValue: '+383 44 914 480',
        emailLabel: 'Email',
        emailValue: 'info@ecotek-ks.com',
        hoursLabel: 'Working Hours',
        weekday: 'Monday - Friday: 09:00 - 17:00',
        saturday: 'Saturday: 09:00 - 13:00',
      },
      cta: 'Contact Us',
    },
    footer: {
      about:
        'EcoTek provides innovative solutions for central heating, air conditioning, ventilation, and solar systems for homes and businesses.',
      quickLinksTitle: 'Quick Links',
      links: {
        about: 'About Us',
        contact: 'Contact',
        blog: 'Blog',
      },
      contactTitle: 'Contact',
      newsletter: {
        title: 'Subscribe for Updates',
        desc: 'Get updates on our latest products and services.',
        placeholder: 'Your email',
        subscribe: 'Subscribe',
      },
      rightsPrefix: '©',
      rightsSuffix: 'All rights reserved.',
    },
    categories: {
      home: 'Home',
      all: 'All',
      hero: {
        'ngrohje-qendrore': {
          title: 'Central Heating',
          description: 'Efficient and sustainable systems for central heating in your home and business.',
        },
        'klimatizim-ventilim': {
          title: 'Air Conditioning & Ventilation',
          description: 'Optimal comfort all year round with our air conditioning and ventilation systems.',
        },
        sanitari: {
          title: 'Sanitary',
          description: 'Sanitary and hygienic solutions for your home.',
        },
      },
      empty: {
        title: 'No products',
        desc: 'Sorry, there are no products matching this subcategory.',
      },
    },
    blog: {
      posts: {
        '01': { title: 'How to Enable Wi‑Fi on Your CANDY Air Conditioner', subtitle: 'Using the hOn App' },
        '02': { title: '5 Reasons Your Air Conditioner Smells', subtitle: 'Causes and fixes' },
        '03': { title: 'How Are Heat Pumps Over 100% Efficient?', subtitle: 'Heat pump technology' },
        '04': { title: 'How to Choose a Heat Pump', subtitle: 'What to consider before buying' },
        '05': { title: 'Choosing the Right Capacity for a CANDY Split AC', subtitle: 'Factors to pick the right unit' },
        '06': { title: 'What Does “BTU” Really Mean?', subtitle: 'Complete guide to BTU and choosing the right AC' },
        '07': { title: 'Why Professional AC Installation Matters More Than the Brand', subtitle: 'Hidden costs of non‑professional installation' },
        '08': { title: 'How a Heat Pump System Heats Your Home and Water', subtitle: 'How a three‑way valve enables dual use' },
        '09': { title: 'The Real Advantage of Smart AC – Full Control from Anywhere', subtitle: 'Abroad? Control your climate at home via Wi‑Fi' },
        '10': { title: 'Monoblock vs Split Heat Pumps: What’s the Difference?', subtitle: 'Which system is best for your home?' },
        '11': { title: 'How Do Air Conditioners Clean the Air?', subtitle: 'Do all air conditioners have air purifiers?' },
        '12': { title: 'R32 vs R410A: A Comprehensive Comparison', subtitle: 'Efficiency and performance' },
        '13': { title: 'How and Why Air Conditioners Produce Water', subtitle: 'Why water production indicates an efficient AC' },
        '14': { title: 'What Are Horizontal Floor Fancoils and How Do They Work?', subtitle: 'Learn more about different heating units' },
        '15': { title: 'How Insulation Blocks Heat Transfer', subtitle: 'Protecting your home' },
      },
    },
  },
} as const;

export function useT() {
  const { locale } = useLanguage();
  const getByPath = (obj: unknown, path: string): unknown => {
    const parts = path.split(".");
    return parts.reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object") {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };
  return function t(path: string, fallback?: string): string {
    const fromLocale = getByPath(dict[locale as keyof typeof dict], path);
    if (typeof fromLocale === "string") return fromLocale;
    const fromSq = getByPath(dict.sq, path);
    if (typeof fromSq === "string") return fromSq;
    return fallback ?? path;
  };
}
