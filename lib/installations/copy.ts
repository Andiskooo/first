import type { InstallationCollection, InstallationProject } from './data';

export const siteUrl = 'https://www.ecotek-ks.com';
export const heatPumpsUrl = '/pompa-termike';

export function projectCopy(project: InstallationProject, collection: InstallationCollection) {
  const m = project.metadata;
  const location = m.locality && m.locality !== collection.label
    ? `${m.locality}, ${collection.label}` : (collection.isLocation ? collection.label : null);
  const where = location ? ` në ${location}` : '';
  const capacity = m.capacityKw ? ` ${m.capacityKw} kW` : '';
  const refrigerant = m.refrigerant ? ` me gaz ftohës ${m.refrigerant}` : '';
  const area = m.areaM2 ? (m.areaPerHouse && m.houses
    ? ` për ${m.houses} shtëpi me sipërfaqe ${m.areaM2} m² secila`
    : ` për një objekt me sipërfaqe ${m.areaM2} m²`) : '';
  const subject = m.units ? `${m.units} pompa termike` : 'pompë termike';
  const specification = `${subject}${capacity}${refrigerant}`;
  const facts = `${where}${area}`;
  const patterns = [
    `Ky instalim përfshin ${specification}${facts}.`,
    `Për nevojat e ngrohjes${facts}, projekti përfshin ${specification}.`,
    `Nga puna e ekipit ECOTEK: instalim me ${specification}${facts}.`,
    `Në këtë projekt është realizuar një sistem ngrohjeje me ${specification}${facts}.`,
  ];
  const hash = [...project.sourceKey].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const notes = m.heating === 'underfloor' ? 'Sistemi përdor ngrohje nën dysheme.'
    : m.heating === 'radiators' ? 'Sistemi përdor radiatorë.' : '';
  return {
    title: project.editorial.title ?? `Instalim me ${subject}${capacity}${m.refrigerant ? ` ${m.refrigerant}` : ''}${where}${m.areaM2 ? ` – ${m.areaM2} m²${m.areaPerHouse ? ' / shtëpi' : ''}` : ''}`,
    paragraphs: project.editorial.description ?? [patterns[hash % patterns.length], notes].filter(Boolean),
    alt: `Instalim ECOTEK me ${specification}${facts}`,
    badges: [m.capacityKw ? `${m.capacityKw} kW` : null, m.refrigerant,
      m.areaM2 ? `${m.areaM2} m²${m.areaPerHouse ? ' / shtëpi' : ''}` : null,
      m.units ? `${m.units} pompa termike` : null,
      m.heating === 'underfloor' ? 'Ngrohje nën dysheme' : m.heating === 'radiators' ? 'Radiatorë' : null, project.editorial.buildingType, location]
      .filter((badge): badge is string => Boolean(badge)),
  };
}

export function collectionCopy(collection: InstallationCollection) {
  if (!collection.isLocation) return {
    title: 'Instalime të pompave termike në banesa',
    intro: 'Zgjidhje ngrohjeje me pompa termike për banesa. Për përshtatjen e sistemit me hapësirën dhe kushtet e ndërtesës, konsultohuni me ekipin ECOTEK.',
    description: 'Instalime të pompave termike për banesa nga ECOTEK. Na kontaktoni për këshillim mbi përzgjedhjen dhe instalimin e sistemit të ngrohjes.',
  };
  const capacities = [...new Set(collection.projects.flatMap(p => p.metadata.capacityKw ? [p.metadata.capacityKw] : []))].sort((a, b) => a - b);
  const refrigerants = [...new Set(collection.projects.flatMap(p => p.metadata.refrigerant ? [p.metadata.refrigerant] : []))].sort();
  const localities = [...new Set(collection.projects.flatMap(p => p.metadata.locality && p.metadata.locality !== collection.label ? [p.metadata.locality] : []))];
  const details = [
    capacities.length ? `Projektet e paraqitura përfshijnë kapacitete ${capacities.join(', ')} kW.` : '',
    localities.length ? `Në këtë përmbledhje gjeni edhe instalime në ${localities.join(', ')}; vendndodhja shënohet te secili projekt.` : '',
  ].filter(Boolean).join(' ');
  const introductions: Record<string, string> = {
    gjakove: 'Në Gjakovë, puna e ECOTEK përfshin lidhjen e pompave termike si me radiatorë, ashtu edhe me ngrohje nën dysheme. Fotografitë më poshtë dokumentojnë instalimet dhe të dhënat e objekteve përkatëse.',
    prishtine: 'Nga Dragodani te Vranjevci, këto projekte paraqesin instalime të pompave termike nga ECOTEK në Prishtinë. Hapni secilin projekt për të parë fotografinë dhe specifikimet e dokumentuara.',
    peje: 'Për Pejën dhe Vitomericën, kjo përmbledhje sjell instalime me kapacitete dhe sipërfaqe të ndryshme. Të dhënat shfaqen veçmas për secilin projekt, bashkë me fotografitë e punës së ECOTEK.',
    prizren: 'Instalimet e paraqitura në Prizren përfshijnë pompa termike me R32 dhe R290. Projektet dokumentojnë zgjidhje ngrohjeje për objekte me sipërfaqe nga 120 deri në 280 m².',
    ferizaj: 'Në Ferizaj gjeni shembuj të instalimeve me pompa termike R32 nga ECOTEK. Për çdo objekt janë ruajtur veçmas kapaciteti dhe sipërfaqja e dokumentuar, nga 100 deri në 190 m².',
    gjilan: 'Projektet e ECOTEK në Gjilan tregojnë instalime me pompa termike R32 për objekte nga 80 deri në 250 m². Fotografitë dhe të dhënat e secilit instalim mund t’i shikoni në faqet e projekteve.',
    mitrovice: 'Në Mitrovicë, portofoli i ECOTEK përfshin instalime me të dy ftohësit, R32 dhe R290. Përmbledhja më poshtë ju çon te puna konkrete dhe specifikimet e njohura për çdo projekt.',
    rahovec: 'Në Rahovec kemi dokumentuar një projekt me dy pompa termike për dy shtëpi dhe një instalim R290 me ngrohje nën dysheme. Shikoni veçmas fotografitë dhe përshkrimin e secilës zgjidhje.',
    gracanice: 'Këto instalime në Graçanicë paraqiten në një koleksion të veçantë sipas vendndodhjes së tyre. Projektet e dokumentuara përfshijnë objekte me sipërfaqe 80 dhe 100 m².',
  };
  return {
    title: `Instalime të pompave termike në ${collection.label}`,
    intro: `${introductions[collection.slug] ?? `Shikoni nga afër punën e ekipit ECOTEK në instalimin e pompave termike në ${collection.label}.`} ${details}`,
    description: `Shikoni instalimet e ECOTEK në ${collection.label}${refrigerants.length ? ` me pompa termike ${refrigerants.join(' dhe ')}` : ''}. Fotografitë, kapacitetet dhe zgjidhjet e ngrohjes për çdo projekt.`,
  };
}
