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
