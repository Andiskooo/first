import type { InstallationCollection, InstallationProject } from './data';

export const siteUrl = 'https://www.ecotek-ks.com';
export const heatPumpsUrl = '/categories/ngrohje-qendrore?subcategory=pompa-termike';

export function projectCopy(project: InstallationProject, collection: InstallationCollection) {
  const m = project.metadata;
  const location = m.locality ?? (collection.isLocation ? collection.label : null);
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
  const hash = [...project.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const notes = m.heating === 'underfloor'
    ? 'Sistemi përdor ngrohje nën dysheme. Temperatura e ujit dhe rregullimi i qarqeve janë elemente të rëndësishme për shpërndarjen e nxehtësisë.'
    : m.heating === 'radiators'
      ? 'Sistemi përdor radiatorë. Për këtë lloj ngrohjeje, përzgjedhja e pompës termike duhet të marrë parasysh temperaturën e kërkuar të ujit dhe karakteristikat e radiatorëve.'
      : [
        'Për të zgjedhur një sistem të përshtatshëm, sipërfaqja është vetëm një pikënisje: rëndësi kanë edhe izolimi i objektit dhe kërkesat për ngrohje.',
        'Një instalim profesional lidh përzgjedhjen e pajisjes me nevojat e objektit. Dimensionimi dhe rregullimi i sistemit ndikojnë në konsumin e energjisë.',
        'Po planifikoni ngrohjen e objektit tuaj? Ekipi ynë ju ndihmon të vlerësoni kapacitetin e nevojshëm dhe mundësitë e instalimit.',
        'Për ngrohje efikase, pompa termike duhet të përshtatet me sistemin e shpërndarjes së nxehtësisë dhe kushtet e objektit.',
      ][hash % 4];
  return {
    title: `Instalim me ${subject}${capacity}${m.refrigerant ? ` ${m.refrigerant}` : ''}${where}`,
    paragraphs: [patterns[hash % patterns.length], notes],
    alt: `Instalim ECOTEK me ${specification}${facts}`,
    badges: [m.capacityKw ? `${m.capacityKw} kW` : null, m.refrigerant,
      m.areaM2 ? `${m.areaM2} m²${m.areaPerHouse ? ' / shtëpi' : ''}` : null,
      m.units ? `${m.units} pompa termike` : null,
      m.heating === 'underfloor' ? 'Ngrohje nën dysheme' : m.heating === 'radiators' ? 'Radiatorë' : null, location]
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
  const localities = [...new Set(collection.projects.flatMap(p => p.metadata.locality ? [p.metadata.locality] : []))];
  const details = [
    capacities.length ? `Projektet e paraqitura përfshijnë kapacitete ${capacities.join(', ')} kW.` : '',
    localities.length ? `Në këtë përmbledhje gjeni edhe instalime në ${localities.join(', ')}; vendndodhja shënohet te secili projekt.` : '',
  ].filter(Boolean).join(' ');
  return {
    title: `Instalime të pompave termike në ${collection.label}`,
    intro: `Shikoni nga afër punën e ekipit ECOTEK në instalimin e pompave termike në ${collection.label}. ${details}`,
    description: `Shikoni instalimet e ECOTEK në ${collection.label}${refrigerants.length ? ` me pompa termike ${refrigerants.join(' dhe ')}` : ''}. Fotografitë, kapacitetet dhe zgjidhjet e ngrohjes për çdo projekt.`,
  };
}
